import { Component, OnInit } from '@angular/core';

import { Interest } from 'src/app/models/interest';

import { InterestService } from 'src/app/services/api-call/interest.service';
import { DataLogService } from 'src/app/services/data/data-log.service';
import { CommonService } from 'src/app/services/common.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
import { ProgressTrackerService } from 'src/app/services/data/progress-tracker.service';


@Component({
  selector: 'app-interests-screen',
  templateUrl: './interests-screen.component.html',
  styleUrls: ['./interests-screen.component.scss']
})
export class InterestsScreenComponent implements OnInit {

  public interests: Interest[];
  public colour: string;

  private readonly INTEREST_COLOURS = ['red', 'green', 'yellow', 'blue'];

  constructor(
    private interestService: InterestService,
    private dataLogService: DataLogService,
    private commonService: CommonService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private progressTrackerService: ProgressTrackerService) { }

  ngOnInit() {
    if (!this.dataLogService.getProduct()) {
      this.commonService.goTo('');
    }
    this.colour = 'green';
    this.interestService.getInterests().subscribe( (data: Interest[]) => {
      data.forEach( (interest: Interest) => {
        interest.colour = this.INTEREST_COLOURS[interest.category % this.INTEREST_COLOURS.length];
      })
      this.interests = data;
    });
  }

  selectInterest(interest: Interest): void {
    this.dataLogService.setInterest(interest);
    if (this.dataLogService.getInterest().id === interest.id) {
      this.googleAnalyticsService.stopTimer('time_select_interest', '' + interest.id);
      this.googleAnalyticsService.addEvent('selected_interest', '' + interest.id);
      this.progressTrackerService.initializeTracker().then( () => {
        this.googleAnalyticsService.addEvent('started_test');
        this.commonService.goTo('scenario-introduction');
      });
    }
  }

  getPath(name: string): string {
    return this.commonService.getIconPath(name);
  }

}
