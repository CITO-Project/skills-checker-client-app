import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { DataLogService } from 'src/app/services/data/data-log.service';
import { Scenario } from 'src/app/models/scenario';
import { ProgressTrackerService } from 'src/app/services/data/progress-tracker.service';
import { Category } from 'src/app/models/category';
import { Interest } from 'src/app/models/interest';
import { faBookOpen, faCalculator, faLaptop } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-scenario-introduction-screen',
  templateUrl: './scenario-introduction-screen.component.html',
  styleUrls: ['./scenario-introduction-screen.component.scss']
})
export class ScenarioIntroductionScreenComponent {

  faLaptop = faLaptop;
  faCalculator = faCalculator;
  faBookOpen = faBookOpen;

  private scenario: Scenario;
  private navigationExtras: any;
  private interest: Interest;
  public previousScenarioText = '';
  public scenarioText: string;
  public category: Category;
  public scenarioIndex = 0;

  public btnBack = 'Change interest';
  public btnForward = 'Let\'s Go!';
  public readonly assistantAsset = 'orientation-ie.svg';
  public imageTexts = [];

  constructor(
    public commonService: CommonService,
    private dataLogService: DataLogService,
    private progressTrackerService: ProgressTrackerService) {
      const extras = this.commonService.getExtras();
      if (extras !== undefined && extras.state !== undefined && extras.state.scenarioindex !== undefined) {
        this.scenarioIndex = +extras.state.scenarioindex;
        this.navigationExtras = extras.state;
        this.interest = dataLogService.getInterest();
        if (this.scenarioIndex <= 0) {
          this.imageTexts = [
            'Great! You have set a goal of improving your skills to:',
            this.interest.text,
            'You will now have complete 4 Skill Check scenarios based on this goal'
          ];
        } else {
          this.imageTexts = ['Well Done!',`Scenario ${this.scenarioIndex} Complete!`,'Click Continue to go to the Next Scenario'];
          this.btnForward = 'Continue SkillCheck';
          this.btnBack = 'Previous Scenario';
        }
      } else {
        commonService.goTo('interests');
      }
  }

  // ngOnInit() {
  //   this.category = this.dataLogService.getCategory();
  //   this.loadScenario(this.scenarioindex);
  // }

  // loadScenario(scenarioindex: number): void {
  //   this.scenario = this.dataLogService.getScenario(scenarioindex);
  //   this.dataLogService.loadQuestionsByCategory(
  //     scenarioindex,
  //     this.dataLogService.getCategory().id,
  //     this.scenario.interest
  //   ).subscribe();
  //   if (scenarioindex > 0) {
  //     this.previousScenarioText = this.dataLogService.getScenario(scenarioindex - 1).text;
  //   } else {
  //     this.previousScenarioText = '';
  //     this.btnBack = 'default';
  //   }
  //   this.scenarioText = this.scenario.text;
  // }

  previousScenario(): void {
    this.scenarioIndex++;
    if (this.navigationExtras.scenarioindex <= 0) {
      this.commonService.goTo('interests');
    } else {
      if (!!this.navigationExtras.loadingNext) {
        this.progressTrackerService.previous();
      }
      this.commonService.goTo('scenarios');
    }
    // if (--this.scenarioindex > -1) {
    //   this.loadScenario(this.scenarioindex);
    // }
  }

  startScenario(): void {
    if (!this.navigationExtras.loadingNext) {
      this.progressTrackerService.next();
    }
    this.commonService.goTo('scenarios');
  }

}
