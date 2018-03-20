import { setAppInjector } from './app-injector';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RestangularModule, Restangular } from 'ngx-restangular';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';
import { SignupComponent } from './views/signup/signup.component';

// import { LoginService } from './views/login/login.service';
import { SignupService } from './views/signup/signup.service';
import { UtilityService } from './services/utility.service';
import { ConstantsService } from './services/constants.service';
import { AuthService } from './services/auth.service';
import { AllServicesService } from './services/all-services.service';

import { CookieService } from 'ngx-cookie-service';
import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatTooltipModule,
  MatOptionModule,
  MatSelectModule,
  MatProgressSpinnerModule,
  MatFormFieldModule,
  MatTabsModule,
  MatInputModule,
  MatCheckboxModule,
  MatGridListModule
} from '@angular/material';
import { Routes, RouterModule } from '@angular/router';
import { NewPostComponent } from './views/new-post/new-post.component';
import { PostsListComponent } from './views/posts-list/posts-list.component';
import { SinglePostComponent } from './views/single-post/single-post.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { AdminComponent } from './views/admin/admin.component';

export function RestangularConfigFactory(RestangularProvider, AuthService) {
  // RestangularProvider.setBaseUrl('http://192.168.43.103:8000/'); // ahmadreza
  RestangularProvider.setBaseUrl('http://192.168.43.121:8000/'); //armin
  // RestangularProvider.setDefaultHeaders({'Access-Control-Allow-Origin': '*'});
  RestangularProvider.setDefaultHeaders({ Authorization: 'Bearer 2qSjMOXTc0bMlVqN0aAtcNrPAESpjM' });

  // RestangularProvider.addFullRequestInterceptor((element, operation, path, url, headers, params) => {
  //   let bearerToken = AuthService.accessToken;
  //   console.log(bearerToken);
  //   return {
  //     headers: Object.assign({}, headers, { Authorization: `Bearer ${bearerToken}` })
  //   };
  // });

  var refreshAccesstoken = function() {
    // Here you can make action before repeated request
    return AuthService.refreshAccessToken();
  };

  RestangularProvider.addErrorInterceptor((response, subject, responseHandler) => {
    if (response.status === 403) {
      refreshAccesstoken()
        .switchMap(refreshAccesstokenResponse => {
          // update Authorization header
          response.request.headers.set('Authorization', 'Bearer ' + refreshAccesstokenResponse);

          return response.repeatRequest(response.request);
        })
        .subscribe(res => responseHandler(res), err => subject.error(err));

      return false; // error handled
    }
    return true; // error not handled
  });
}

export const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [{ path: 'new-post', component: NewPostComponent }, { path: 'post/:id', component: SinglePostComponent }]
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'admin', component: AdminComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SignupComponent,
    NewPostComponent,
    PostsListComponent,
    SinglePostComponent,
    ForgotPasswordComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    FormsModule,
    HttpModule,
    HttpClientModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatOptionModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatTabsModule,
    MatInputModule,
    MatCheckboxModule,
    MatGridListModule,
    BrowserAnimationsModule,
    RestangularModule.forRoot([AuthService], RestangularConfigFactory),
    RouterModule.forRoot(appRoutes),
    SimpleNotificationsModule.forRoot(),
  ],
  providers: [UtilityService, ConstantsService, SignupService, AuthService, AllServicesService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(injector: Injector) {
    setAppInjector(injector);
  }
}
