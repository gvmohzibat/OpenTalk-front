import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  simpleNotificationsOptions: { position: string[]; showProgressBar: boolean; timeOut: number; clickIconToClose: boolean; animate: string; maxStack: number; preventLastDuplicates: string; };
  title = 'app';
  constructor() {
    this.simpleNotificationsOptions = {
      position: ['bottom', 'left'],
      showProgressBar: false,
      timeOut: 3000,
      clickIconToClose: true,
      animate: 'fromRight',
      maxStack: 6,
      preventLastDuplicates: 'visible'
    };
  }
}
