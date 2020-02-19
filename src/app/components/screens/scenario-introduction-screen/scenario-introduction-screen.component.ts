import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { DataLogService } from 'src/app/services/data-log.service';
import { Scenario } from 'src/app/models/scenario';
import { ProgressTrackerService } from 'src/app/services/progress-tracker.service';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-scenario-introduction-screen',
  templateUrl: './scenario-introduction-screen.component.html',
  styleUrls: ['./scenario-introduction-screen.component.scss']
})
export class ScenarioIntroductionScreenComponent implements OnInit {

  private scenario: Scenario;
  private scenarioindex: number;
  public previousScenarioText = '';
  public scenarioText: string;
  public category: Category;

  public btnBack = 'default';
  public btnForward = 'default';

  constructor(
    private commonService: CommonService,
    private dataLogService: DataLogService,
    private progressTrackerService: ProgressTrackerService) {
      const extras = this.commonService.getExtras();
      if (extras !== undefined && extras.state !== undefined && extras.state.scenarioindex !== undefined) {
        this.scenarioindex = +extras.state.scenarioindex;
      } else {
        commonService.goTo('how-to');
      }
  }

  ngOnInit() {
    this.category = this.dataLogService.getCategory();
    this.loadScenario(this.scenarioindex);
  }

  loadScenario(scenarioindex: number): void {
    this.scenario = this.dataLogService.getScenario(scenarioindex);
    this.dataLogService.loadQuestions(
      scenarioindex,
      this.dataLogService.getCategory().id,
      this.scenario.interest
    ).subscribe();
    if (scenarioindex > 0) {
      this.previousScenarioText = this.dataLogService.getScenario(scenarioindex - 1).text;
    } else {
      this.previousScenarioText = '';
      this.btnBack = 'default';
    }
    this.scenarioText = this.scenario.text;
  }

  previousScenario(): void {
    if (--this.scenarioindex > -1) {
      this.loadScenario(this.scenarioindex);
    }
    this.progressTrackerService.previousScenario();
  }

  startScenario(): void {
    this.commonService.goTo('scenarios', { scenario : this.scenario });
  }

}
