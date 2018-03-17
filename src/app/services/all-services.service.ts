import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';

@Injectable()
export class AllServicesService {
  constructor(private rest: Restangular) {}

  newPost(text, anonymous) {
    return this.rest.one('post/').post('', {
      text,
      anonymous
    });
  }

  getPost(id) {
    return this.rest.one('post/' + id + '/').get('', {});
  }

  reportPost(post) {
    return this.rest.one('report/').post('', { post });
  }
  vote(post, value) {
    return this.rest.one('vote/').post('', { post, value });
  }
  deletePost(id) {
    return this.rest.one('post/' + id + '/').remove('', {});
  }

  getMe() {
    return this.rest.one('user/me/').get('', {});
  }
}
