import { Component, OnInit } from '@angular/core';

import { CommonService } from 'src/app/services/common.service';
import { DataLogService } from 'src/app/services/data-log.service';
import { ProgressTrackerService } from 'src/app/services/progress-tracker.service';
import { Category } from 'src/app/models/category';
import { Interest } from 'src/app/models/interest';

@Component({
  selector: 'app-how-to-screen',
  templateUrl: './how-to-screen.component.html',
  styleUrls: ['./how-to-screen.component.scss']
})
export class HowToScreenComponent implements OnInit {

  public selectedInterest: string;
  public category: Category;

  constructor(
    private commonService: CommonService,
    private dataLogService: DataLogService,
    private progressTrackerService: ProgressTrackerService) { }

  ngOnInit() {
    this.category = this.dataLogService.getCategory();
    this.retrieveInterest();
    this.progressTrackerService.initializeTracker();
  }

  btnClick() {
    this.progressTrackerService.nextScenario();
  }

  retrieveInterest() {
    // DELETE static interest and category. from interest-screen too
    this.dataLogService.setInterest({
      id: 3,
      product: 1,
      category: 1,
      name: 'static_interest',
      text: 'Static interest. Change afterwards'
    });
    this.dataLogService.setCategory({
      id: 1,
      product: 1,
      name: 'personal',
      text: 'Personal',
      colour: 'green',
      resource: 'person-laptop.svg'
    });
    // DELETE
    const interest = this.dataLogService.getInterest();
    if (!interest) {
      this.commonService.goTo('interests');
    } else {
      this.selectedInterest = interest.text;
    }
  }

}
