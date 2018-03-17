import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { UtilityService } from './utility.service';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConstantsService } from './constants.service';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class AuthService {
  _returnUrl: any;
  private _$chosenAppChange: EventEmitter<object>;
  expireDate: number;
  _expireIn: any;
  _refreshToken: any;
  _chosenAppIndex: any;
  _appsList: any;
  _username: any;
  _password: any;
  _accessToken: any;
  clientSecret: any = 'WenPPIZPG7L0AOL48OFOxmpQYlc3ebVe1X2JJynUFuYhEfKajUxrPJJ0f2PCyTjmqhQJ9xaobNr7vCNcHKaXFOjuozyvHwnvneS6ZpE1jWlSyC6stCCkKKGMDxzpvVmc';
  clientId: any = 'm3Wwq1OyC33e4YJTfMP4pHbvz0jeIv7954qf7VVl';
  AUTH_URL = 'http://192.168.43.103:8000/';
  // AUTH_URL = 'http://192.168.43.121:8000/';
  constructor(
    private _http: Http,
    private utilityService: UtilityService,
    private cookieService: CookieService,
    private router: Router,
    private constants: ConstantsService,
    private route: ActivatedRoute
  ) {
    this._$chosenAppChange = new EventEmitter<object>();
  }
  get $chosenAppChange() {
    return this._$chosenAppChange;
  }

  /* getBasicAuthHeader(additionalHeader?) {
    let headerDict = {
      Authorization: 'Basic ' + btoa(this.username + ':' + this.password)
    };
    if (additionalHeader) {
      headerDict = { ...headerDict, ...additionalHeader };
    }

    const requestOptions = {
      headers: new Headers(headerDict)
    };
    return requestOptions;
  } */
  login(username, password) {
    this.username = username;
    this.password = password;

    let url = this.AUTH_URL + 'verify-activation';
    let qBody = {
      username
    };
    // let params = this.utilityService.convertObjectToURLParams(body);
    // let qParams = new HttpParams().set('username', username);
    let resultSubject: ReplaySubject<any> = new ReplaySubject<any>();
    this._http.get(url + '?username=' + username).subscribe(
      data => {
        let ret = this.loginUser();
        resultSubject.next(ret);
      },
      error => {
        this.utilityService.error('Please activate your email', 'Your email is not activated');
        resultSubject.error(error);
      }
    );
    return resultSubject;
  }
  loginUser() {
    let url = this.AUTH_URL + 'oauth2/token/';
    // const requestOptions = this.getBasicAuthHeader();
    // console.log('requestOptions', requestOptions);

    let resultSubject: ReplaySubject<any> = new ReplaySubject<any>();
    let body = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'password',
      username: this.username,
      password: this.password
    };
    let params = this.utilityService.convertObjectToURLParams(body);
    const requestOptions = {
      headers: new Headers({
        // credentials: 'true',
        // 'scope': 'write',
        // Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    this._http.post(url, params.toString(), requestOptions).subscribe(
      response => {
        let result = response.json();
        console.log(result);
        resultSubject.next({ result });
        this.expireIn = result.expires_in;
        this.accessToken = result.access_token;
        this.refreshToken = result.refresh_token;

        this.utilityService.success('Redirecting to home', 'Login successful');
        this.router.navigate(['/']);
      },
      error => {
        resultSubject.error(error);
        this.utilityService.error('Username or Password is wrong', 'Login failed');
      }
    );
    return resultSubject;
  }
  /* chooseApp(appIndex, redirect = false) {
    this.chosenAppIndex = appIndex;

    let resultSubject: ReplaySubject<any> = new ReplaySubject<any>();

    this.getAppDetails().subscribe(
      appDetails => {
        resultSubject.next(appDetails);
      },
      error => {
        resultSubject.error(error);
      }
    );
    if (redirect) {
      resultSubject.subscribe(
        result => {
          this.router.navigateByUrl(this.returnUrl);
        },
        error => {
          this.utilityService.handleServerError(error);
        }
      );
      return;
    }
    return resultSubject;
  } */
  /* getAppDetails(): ReplaySubject<any> {
    const url = this.AUTH_URL + 'api/app/' + this.clientId;
    // console.log(this.clientId, this.chosenAppIndex);
    const requestOptions = this.getBasicAuthHeader();

    let resultSubject: ReplaySubject<any> = new ReplaySubject<any>();

    this._http.get(url, requestOptions).subscribe(
      response => {
        const result = response.json();
        if (result.client_id && result.client_secret) {
          this.clientSecret = result.client_secret;
          this.retriveAccessToken().subscribe(
            accessToken => {
              resultSubject.next(result);
            },
            error => {
              resultSubject.error(error);
            }
          );
        } else {
          resultSubject.error('Error in getting app details');
        }
      },
      error => {
        resultSubject.error(error);
      }
    );
    return resultSubject;
  } */
  retriveAccessToken() {
    let resultSubject: ReplaySubject<any> = new ReplaySubject<any>();

    const url = this.AUTH_URL + 'oauth/token';
    const requestOptions = {
      headers: new Headers({
        authorization: 'Basic ' + btoa(this.clientId + ':' + this.clientSecret),
        // credentials: 'true',
        // 'scope': 'write',
        // Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };
    // console.log(requestOptions);
    const body = {
      grant_type: 'password',
      client_id: this.clientId,
      username: this.username,
      password: this.password,
      scope: ''
    };
    let params = this.utilityService.convertObjectToURLParams(body);

    this._http.post(url, params.toString(), requestOptions).subscribe(
      response => {
        let result = response.json();
        // console.log('retrived_access_token', result);
        this.accessToken = result.access_token;
        this.refreshToken = result.refresh_token;
        this.expireIn = result.expire_in;
        resultSubject.next(this.accessToken);
      },
      error => {
        resultSubject.error(error);
      }
    );
    return resultSubject;
  }

  isLoggedIn() {
    if (this.cookieService.check('username') && this.cookieService.check('username')) {
      return true;
    }
    return false;
  }
  isAuthenticated() {
    // console.log('cookies', this.cookieService.getAll());
    if (
      this.cookieService.check('access_token') &&
      this.cookieService.check('refresh_token') &&
      this.cookieService.check('username') &&
      this.cookieService.check('password')
    ) {
      // this._router.navigate(['/login']);
      return true;
    }
    return false;
  }
  refreshAccessToken() {
    let resultSubject: ReplaySubject<any> = new ReplaySubject<any>();
    const url = this.AUTH_URL + 'oauth/token';
    const requestOptions = {
      headers: new Headers({
        authorization: 'Basic ' + btoa(this.clientId + ':' + this.clientSecret),
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };
    // console.log(requestOptions);
    const body = {
      grant_type: 'refresh_token',
      refresh_token: this.refreshToken,
      scope: ''
    };
    let params = this.utilityService.convertObjectToURLParams(body);

    this._http.post(url, params.toString(), requestOptions).subscribe(
      response => {
        let result = response.json();
        // console.log('refreshed_access_token', result);
        this.accessToken = result.access_token /* || this.accessToken */;
        this.refreshToken = result.refresh_token /* || this.refreshToken */;
        this.expireIn = result.expire_in /* || this.expireIn */;
        resultSubject.next(this.accessToken);
      },
      error => {
        resultSubject.error(error);
      }
    );
    return resultSubject;
  }
  logout() {
    this.cookieService.delete('access_token');
    this.cookieService.delete('refresh_token');
    this.cookieService.delete('username');
    this.cookieService.delete('password');
    this.router.navigate(['/login']);
  }
  handleUnexpectedError(error?) {
    this.utilityService.error('SHARED.UNEXPECTED_ERROR_DESC', 'SHARED.UNEXPECTED_ERROR');
    console.log('Unexpected_error', error);
    if (this.isLoggedIn()) {
      if (this.isAuthenticated()) {
        if (!this._chosenAppIndex) {
          this._chosenAppIndex = 0;
        }
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/login']);
    }
    this.logout();
  }
  register(username, email, password, confirmPassword, major, sid) {
    let resultSubject: ReplaySubject<any> = new ReplaySubject<any>();
    const requestOptions = {
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };
    let params = this.utilityService.convertObjectToURLParams({
      email,
      password,
      confirmPassword,
      sid,
      major
    });
    this._http.post(this.AUTH_URL + 'sign-up', params.toString(), requestOptions).subscribe(
      response => {
        let result = response.toString();
        console.log('result', response);
        resultSubject.next(result);
      },
      error => {
        resultSubject.error(error);
      }
    );
    return resultSubject;
  }
  forgot(username) {
    let resultSubject: ReplaySubject<any> = new ReplaySubject<any>();
    this._http.get(this.AUTH_URL + 'reset-password-activate?username=' + username).subscribe(
      response => {
        let result = response.toString();
        console.log('result', response);
        resultSubject.next(result);
      },
      error => {
        resultSubject.error(error);
      }
    );
    return resultSubject;
  }
  forgetP(username, password) {
    let resultSubject: ReplaySubject<any> = new ReplaySubject<any>();
    const requestOptions = {
      headers: new Headers({
        username: username,
        password: password
      })
    };
    this._http.get(this.AUTH_URL + 'reset-password', requestOptions).subscribe(
      response => {
        let result = response.toString();
        console.log('result', response);
        resultSubject.next(result);
      },
      error => {
        resultSubject.error(error);
      }
    );
    return resultSubject;
  }
  /* registerApp(formData) {
    if (!this.isLoggedIn()) this.handleUnexpectedError();
    let resultSubject: ReplaySubject<any> = new ReplaySubject<any>();
    const requestOptions = this.getBasicAuthHeader({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let params = this.utilityService.convertObjectToURLParams(formData);
    this._http.post(this.AUTH_URL + 'api/apps/add', params.toString(), requestOptions).subscribe(
      response => {
        let result = response.toString();
        resultSubject.next(result);
      },
      error => {
        resultSubject.error(error);
      }
    );
    return resultSubject;
  } */

  // setters and getters
  set expireIn(current) {
    this._expireIn = current;
    this.expireDate = new Date().getTime() + 1000 * this._expireIn;
  }
  get appName() {
    // console.log('get_app_name', this.appsList, this.chosenAppIndex);
    if (this.appsList && this.chosenAppIndex) return this.appsList[this.chosenAppIndex].name;
    // this.getAppsList();
  }
  get appId() {
    // return '59d61fc3e4b055bfe78c0fc0';
    return this.clientId;
  }

  get chosenAppIndex() {
    this._chosenAppIndex = this.cookieService.get('chosen_app_index');
    if (!this._chosenAppIndex) {
      this.handleUnexpectedError();
    }
    this._chosenAppIndex = parseInt(this._chosenAppIndex);
    return this._chosenAppIndex;
  }
  set chosenAppIndex(current) {
    this._chosenAppIndex = current;
    this.cookieService.set('chosen_app_index', this._chosenAppIndex.toString(), this.expireDate);
    this._$chosenAppChange.emit({ appId: this.appId });
  }

  get appsList() {
    this._appsList = this.cookieService.get('apps_list');
    if (!this._appsList) {
      this.handleUnexpectedError();
    }
    this._appsList = JSON.parse(this._appsList);
    return this._appsList;
  }
  set appsList(current) {
    this._appsList = current;
    this.cookieService.set('apps_list', JSON.stringify(this._appsList), this.expireDate);
  }

  get refreshToken() {
    this._refreshToken = this.cookieService.get('refresh_token');
    if (!this._refreshToken) {
      this.handleUnexpectedError();
    }
    return this._refreshToken;
  }
  set refreshToken(current) {
    this._refreshToken = current;
    this.cookieService.set('refresh_token', this._refreshToken, this.expireDate);
  }

  get accessToken() {
    this._accessToken = this.cookieService.get('access_token');
    if (!this._accessToken) {
      this.handleUnexpectedError();
    }
    return this._accessToken;
  }
  set accessToken(current) {
    this._accessToken = current;
    this.cookieService.set('access_token', this._accessToken, this.expireDate);
  }

  get username() {
    this._username = this.cookieService.get('username');
    if (!this._username) {
      this.handleUnexpectedError();
    }
    return this._username;
  }
  set username(current) {
    this._username = current;
    this.cookieService.set('username', this._username, this.expireDate);
  }

  get password() {
    this._password = this.cookieService.get('password');
    if (!this._password) {
      this.handleUnexpectedError();
    }
    return this._password;
  }
  set password(current) {
    this._password = current;
    this.cookieService.set('password', this._password, this.expireDate);
  }
  get returnUrl() {
    return this.route.snapshot.queryParams['returnUrl'] || this._returnUrl || '/';
  }
  set returnUrl(current) {
    this._returnUrl = current;
  }
}
