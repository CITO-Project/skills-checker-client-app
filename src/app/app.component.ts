import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonService } from './services/common.service';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  title = 'skills-checker';

  constructor(public router: Router, private commonService: CommonService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', commonService.getGATrackID(),
          {
            page_path: event.urlAfterRedirects
          }
        );
        }
      }
    );
  }
}
