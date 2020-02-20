import { Component, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from './services/google-analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  title = 'skills-checker';

  constructor(private googleAnalyticsService: GoogleAnalyticsService) {
    googleAnalyticsService.initializeGA();

    window.addEventListener('beforeunload', () => {
      googleAnalyticsService.stopTimer('time_use_app');
      googleAnalyticsService.stopTimer('time_review_results');

    });
  }

  ngOnInit() {
    this.googleAnalyticsService.restartTimer('time_use_app');
    this.googleAnalyticsService.addEvent('started_app');
  }
}
