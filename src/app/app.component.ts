import { Component, OnInit } from '@angular/core';

import { GoogleAnalyticsService } from './services/google-analytics.service';
import { ProgressTrackerService } from './services/progress-tracker.service';
import { DataLogService } from './services/data-log.service';

import { CustomResponse } from './models/custom-response';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  title = 'skills-checker';

  constructor(
    private googleAnalyticsService: GoogleAnalyticsService,
    progressTrackerService: ProgressTrackerService,
    dataLogService: DataLogService) {
      googleAnalyticsService.initializeGA();

      window.addEventListener('beforeunload', () => {
        googleAnalyticsService.stopTimer('time_use_app');
        googleAnalyticsService.stopTimer('time_review_results');

        //#region Duplicated code in clickHeader() in scenarios-screen.component.ts
        const {scenarioIndex, questionIndex} = progressTrackerService.getResponse() as CustomResponse;
        if (!(scenarioIndex === 0 && questionIndex === 0)) {
          const interest = dataLogService.getInterest();
          const scenario = dataLogService.getScenario(scenarioIndex);
          this.googleAnalyticsService.addEvent('left_interest', '' + interest.id, scenarioIndex + 1);
          this.googleAnalyticsService.addEvent('left_scenario', '' + scenario.id, questionIndex + 1);
        }
        //#endregion
      });
  }

  ngOnInit() {
    this.googleAnalyticsService.restartTimer('time_use_app');
    this.googleAnalyticsService.addEvent('started_app');
  }
}
