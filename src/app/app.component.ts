import { Component } from '@angular/core';
import { GoogleAnalyticsService } from './services/google-analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  title = 'skills-checker';

  constructor(private googleAnalyticsService: GoogleAnalyticsService) {
    googleAnalyticsService.initializeGA();
  }
}
