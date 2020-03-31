import { Component, OnInit } from '@angular/core';

import { Interest } from 'src/app/models/interest';
import { Category } from 'src/app/models/category';

import { InterestService } from 'src/app/services/interest.service';
import { DataLogService } from 'src/app/services/data-log.service';
import { CommonService } from 'src/app/services/common.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
import { ProgressTrackerService } from 'src/app/services/progress-tracker.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-interests-screen',
  templateUrl: './interests-screen.component.html',
  styleUrls: ['./interests-screen.component.scss']
})
export class InterestsScreenComponent implements OnInit {

  public interests: Interest[];
  public colour: string;
  public category: Category;

  constructor(
    private interestService: InterestService,
    private dataLogService: DataLogService,
    private commonService: CommonService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private progressTrackerService: ProgressTrackerService) { }

  ngOnInit() {
    this.category = this.dataLogService.getCategory();
    if (this.category === null) {
      this.commonService.goTo('categories');
    } else {
      this.colour = this.category.colour;
      this.interestService.getInterests(this.category.id).subscribe( (data: Interest[]) => {
        this.interests = data;
      });
    }
  }

  selectInterest(interest: Interest): void {
    this.dataLogService.setInterest(interest);
    if (this.dataLogService.getInterest().id === interest.id) {
      this.googleAnalyticsService.stopTimer('time_select_interest', '' + interest.id);
      this.googleAnalyticsService.addEvent('selected_interest', '' + interest.id);
      this.progressTrackerService.initializeTracker().then( () => {
        console.log('then')
        this.googleAnalyticsService.addEvent('started_test');
        console.log('currentLog', this.dataLogService.getAll().questions.length, JSON.stringify(this.dataLogService.getAll().answers), JSON.stringify(this.dataLogService.getAll()), this.dataLogService.getAll())
        this.commonService.goTo('scenarios');
      });
    }
  }

  getPath(name: string): string {
    return this.commonService.getIconPath(name);
  }

}
