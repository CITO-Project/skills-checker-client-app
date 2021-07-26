import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { DataLogService } from 'src/app/services/data/data-log.service';
import { Scenario } from 'src/app/models/scenario';
import { ProgressTrackerService } from 'src/app/services/data/progress-tracker.service';
import { Category } from 'src/app/models/category';
import { Interest } from 'src/app/models/interest';
import { faBookOpen, faCalculator, faLaptop } from '@fortawesome/free-solid-svg-icons';

import { Question } from 'src/app/models/question';
import { CustomResponse } from 'src/app/models/custom-response';

import { HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';

declare let ReadSpeaker: any ;
declare let rspkr: any ;

@Component({
  selector: 'app-scenario-introduction-screen',
  templateUrl: './scenario-introduction-screen.component.html',
  styleUrls: ['./scenario-introduction-screen.component.scss']
})
export class ScenarioIntroductionScreenComponent implements OnInit {

  env = environment;
  
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

  public question: Question;
  public currentScenario = -1;
  public currentQuestion = -1;
  public progress = 50;

  public btnBack = $localize`Change Goal`;
  public btnForward = $localize`Let\'s Go!`;
  public readonly assistantAsset = 'orientation-' + environment.locale + '.svg';
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
            $localize`Great! You have set a goal of improving your skills to:`,
            this.interest.text,
            $localize`You will now have to complete 4 tasks based on this goal`
          ];
        } else {
          this.imageTexts = [$localize`Well Done!`,$localize`Task ${this.scenarioIndex} Complete!`,$localize`Click Continue to go to the next task`];
          this.btnForward = $localize`Continue`;
          this.btnBack = $localize`Previous Task`;
        }
      } else {
        commonService.goTo('interests');
      }
  }

  ngOnInit() {
      /**
       * Update local variable that controls progress indicator
       *
       * Rough calculation of progress based on the current scenario and current question
       * Aim here is to calculate a percentage (between 0 and 100).
       * There are 4 scenarios so we multiply the current scenario by 25
       * We then add a value to represent progress through the questions.
       * There are a max of 7 questions per scenario so 3 seems like a reasonable number
       *
       * Ideally the weightings used (25 and 3 respectively) should be dynamic and based on the actual number of questions used.
       */
      this.progress = ((this.scenarioIndex) * 25) /*+ (this.currentQuestion * 3)*/;


      // initialise ReadSpeaker
      ReadSpeaker.init();

      // stop play if it is already playing text from previous screen
      ReadSpeaker.q(
        function() {
          if (rspkr.ui.getActivePlayer()) {
            rspkr.ui.getActivePlayer().close();
          }
        });
  }

  ngAfterViewChecked() {
    // attach ReadSpeaker click event to buttons that have been dynamically added to page
    ReadSpeaker.q(function() {rspkr.ui.addClickEvents();});
  }

  previousScenario(): void {
    this.scenarioIndex++;
    if (this.navigationExtras.scenarioindex <= 0) {
      this.commonService.goTo('interests');
    } else {
      if (!!this.navigationExtras.loadingNext) {
        this.progressTrackerService.setQuestionIndex('end');
        this.progressTrackerService.current();
      }
      this.commonService.goTo('scenarios');
    }
  }

  startScenario(): void {
    if (!this.navigationExtras.loadingNext) {
      this.progressTrackerService.setQuestionIndex('start');
      this.progressTrackerService.current();
    }
    this.commonService.goTo('scenarios');
  }

  getReadSpeakerURL(readid: string): string {

    const baseURL = environment.readspeaker.baseurl;

    const params = new HttpParams()
                          .set( 'customerid', environment.readspeaker.id.toString() )
                          .set( 'lang', environment.readspeaker.lang )
                          .set( 'voice', environment.readspeaker.voice )
                          .set( 'readid', readid)
                          .set( 'url', encodeURIComponent(environment.api.host + '/updates/'));

    return `${baseURL}?${params.toString()}`;
  }

}
