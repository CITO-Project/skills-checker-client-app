import { Component, OnInit } from '@angular/core';

import {NgcCookieConsentService, NgcStatusChangeEvent} from 'ngx-cookieconsent';
import { Subscription }   from 'rxjs/Subscription';

import { GoogleAnalyticsService } from './services/google-analytics.service';
import { ProgressTrackerService } from './services/data/progress-tracker.service';
import { DataLogService } from './services/data/data-log.service';

import { CustomResponse } from './models/custom-response';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  title = 'skills-checker';

  private statusChangeSubscription: Subscription;

  constructor(
    private ccService: NgcCookieConsentService,
    private googleAnalyticsService: GoogleAnalyticsService,
    progressTrackerService: ProgressTrackerService,
    dataLogService: DataLogService) {

      googleAnalyticsService.initializeGA( this.ccService.hasConsented() );

      window.addEventListener('beforeunload', () => {
        googleAnalyticsService.stopTimer('time_use_app');
        googleAnalyticsService.stopTimer('time_review_results');

        //#region Duplicated code in clickHeader() in scenarios-screen.component.ts
        const {scenarioIndex, questionIndex} = progressTrackerService.getResponse() as CustomResponse;
        if (!(scenarioIndex === 0 && questionIndex === 0)) {
          const interest = dataLogService.getInterest();
          const scenario = dataLogService.getScenario(scenarioIndex);
          this.googleAnalyticsService.addEvent('left_interest_at_level', '' + interest.id, scenarioIndex + 1);
          this.googleAnalyticsService.addEvent('left_scenario_at_question_number', '' + scenario.id, questionIndex + 1);
        }
        //#endregion
      });
  }

  ngOnInit() {

    this.statusChangeSubscription = this.ccService.statusChange$.subscribe(
      (event: NgcStatusChangeEvent) => {
        // you can use this.ccService.getConfig() to do stuff...

        if(event.status === "allow" ) {
          this.googleAnalyticsService.enableTracking();
        }
        if(event.status === "deny" ) {
          this.googleAnalyticsService.disableTracking();
        }
      });

    // let cc = window as any;

    // cc.cookieconsent.initialise(
    //   {
    //     "type": "opt-in",
    //     "theme": "classic",
    //     content: {
    //       href: './cookie-policy'
    //     },
    //     palette:{
    //      popup: {background: "#1d8a8a"},
    //      button: {background: "#62ffaa"},
    //     },
    //     revokable:true,
    //     onStatusChange: function(status) {
    //       console.log( status );
    //      console.log(this.hasConsented() ?
    //       'enable cookies' : 'disable cookies');
    //     }, 
    //     law: {
    //      regionalLaw: false,
    //     },
    //     location: true,
    //    }
    // )

    this.googleAnalyticsService.restartTimer('time_use_app');
    this.googleAnalyticsService.addEvent('started_app');
  }

  ngOnDestroy() {
    this.statusChangeSubscription.unsubscribe();
  }
}