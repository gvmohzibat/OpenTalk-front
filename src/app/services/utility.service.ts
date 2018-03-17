import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NotificationsService } from 'angular2-notifications';

@Injectable()
export class UtilityService {
  constructor(private titleService: Title, private notificationService: NotificationsService) {}
  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  /* notify(type, content, title?, override?) {
    title = title ? title : 'SHARED.MESSAGE';
    this.notificationService.create(title, content, type, override);
  } */
  handleServerError(error, title?, content?, override?) {
    title = title ? title : 'Error';
    content = content ? content : 'Error in server';
    this.notificationService.error(title, content, override);
    console.error('Server error', error);
  }
  error(content, title?, override?) {
    title = title ? title : 'Error';
    this.notificationService.error(title, content, override);
  }
  success(content, title?, override?) {
    title = title ? title : 'Successful';
    this.notificationService.success(title, content, override);
  }
  convertObjectToURLParams(obj) {
    let params = new URLSearchParams();
    for (let key in obj) {
      params.set(key, obj[key]);
    }
    return params;
  }
}
