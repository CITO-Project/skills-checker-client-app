import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { DataLogService } from './data-log.service';
import { Category } from '../models/category';
import { Interest } from '../models/interest';

@Injectable({
  providedIn: 'root'
})
export class ProgressTrackerService {

  private scenario: number;

  constructor(private commonService: CommonService, private dataLogService: DataLogService) { }

  initializeTracker(): void {
    const category = this.dataLogService.getCategory();
    const interest = this.dataLogService.getInterest();
    this.dataLogService.resetInterest();
    this.loadScenarios(category, interest);
  }

  loadScenarios(category: Category, interest: Interest): void {
    if (category === null) {
      this.commonService.goTo('categories');
    } else if (interest === null) {
      this.commonService.goTo('interests');
    } else {
      this.dataLogService.loadScenarios(category.id, interest.id).subscribe( () => {
        this.scenario = -1;
      });
    }
  }

  nextScenario(): void {
    this.scenario++;
    if (this.scenario >= this.dataLogService.getScenarioCount()) {
      this.commonService.goTo('results');
    } else {
      this.commonService.goTo('scenario-introduction', {scenarioindex: this.scenario});
    }
  }

  previousScenario(): void {
    this.scenario--;
    if (this.scenario < 0) {
      this.commonService.goTo('how-to');
    } else {
      this.commonService.goTo('scenario-introduction', {scenarioindex: this.scenario});
    }
  }

  getScenarioIndex(): number {
    return this.scenario;
  }

}
