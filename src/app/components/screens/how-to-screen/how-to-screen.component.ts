import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Category } from 'src/app/models/category';

import { CommonService } from 'src/app/services/common.service';
import { DataLogService } from 'src/app/services/data-log.service';
import { ProgressTrackerService } from 'src/app/services/progress-tracker.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@Component({
  selector: 'app-how-to-screen',
  templateUrl: './how-to-screen.component.html',
  styleUrls: ['./how-to-screen.component.scss']
})
export class HowToScreenComponent implements OnInit {

  public selectedInterest: string;
  public category: Category;

  public scenariosReady = false;

  constructor(
    private commonService: CommonService,
    private dataLogService: DataLogService,
    private progressTrackerService: ProgressTrackerService,
    private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.category = this.dataLogService.getCategory();
    this.retrieveInterest();
    this.progressTrackerService.initializeTracker().subscribe( (data: Observable<void>) => {
      data.subscribe( () => {
        this.scenariosReady = true;
      });
    });
  }

  btnClick() {
    this.googleAnalyticsService.addEvent('started_test');
    this.commonService.goTo('scenarios');
  }

  retrieveInterest() {
    const interest = this.dataLogService.getInterest();
    if (!interest) {
      this.commonService.goTo('interests');
    } else {
      this.selectedInterest = interest.text;
    }
  }

}
