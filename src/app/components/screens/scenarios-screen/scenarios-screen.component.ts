import { Component, OnInit } from '@angular/core';

import { Scenario } from 'src/app/models/scenario';
import { Question } from 'src/app/models/question';
import { Category } from 'src/app/models/category';
import { CustomResponse } from 'src/app/models/custom-response';

import { DataLogService } from 'src/app/services/data/data-log.service';
import { CommonService } from 'src/app/services/common.service';
import { ProgressTrackerService } from 'src/app/services/data/progress-tracker.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@Component({
  selector: 'app-scenarios-screen',
  templateUrl: './scenarios-screen.component.html',
  styleUrls: ['./scenarios-screen.component.scss']
})
export class ScenariosScreenComponent implements OnInit {

  public scenario: Scenario;
  public question: Question;
  public currentAnswer = -1;

  public errorMessage = '';
  public category: Category;

  public btnBack = 'Tilbake';
  public btnForward = 'Neste';
  private readonly ERROR_MESSAGE_MULTIPLE = 'Please select one or more of the options below';
  private readonly ERROR_MESSAGE = 'Please select one of the options below';
  private allButtons: {
    text: string,
    icon: string,
    event: string,
    visible?: boolean,
    special?: boolean
  }[];
  public buttons;

  public currentScenario = -1;
  public currentQuestion = -1;

  private isFirstQuestionLoaded = false;

  constructor(
    private dataLogService: DataLogService,
    private commonService: CommonService,
    private progressTrackerService: ProgressTrackerService,
    private googleAnalyticsService: GoogleAnalyticsService
    ) {
      if (!dataLogService.getInterest()) {
        commonService.goTo('interests');
      }
      this.allButtons = [
        {
          text: this.btnBack,
          icon: String.fromCharCode(61700),
          visible: true,
          event: 'back'
        },
        {
          text: 'Hopp over',
          icon: String.fromCharCode(61524) + String.fromCharCode(61524),
          event: 'skip_scenario',
          special: true
        },
        {
          text: 'Gå til resultater',
          icon: String.fromCharCode(61452),
          event: 'go_results',
          special: true
        },
        {
          text: this.btnForward,
          icon: String.fromCharCode(61524),
          visible: true,
          event: 'forward'
        }
        ];
    }

  ngOnInit() {
    this.progressTrackerService.next().subscribe((data: CustomResponse) => {
      if (!data || data.question === undefined || data.scenario === undefined) {
        this.commonService.goTo('interests');
      } else {
        this.updateData(data);
      }
    });
  }

  nextQuestion(): void {
    if (this.saveAnswer()) {
      this.googleAnalyticsService.stopTimer('time_answer_question');
      const next$ = this.progressTrackerService.next(this.currentAnswer);
      if (!!next$) {
        next$.subscribe((data: CustomResponse) => {
          this.updateData(data);
        });
      }
    }
  }

  nextScenario(): void {
    const $next = this.progressTrackerService.nextScenario();
    if (!!$next) {
      $next.subscribe( (data: CustomResponse) => {
        this.updateData(data);
      });
    }
  }

  afterLoadQuestion(data: CustomResponse) {
    if (this.question.type === 'slider') {
      this.currentAnswer = 0;
    } else {
      this.currentAnswer = -1;
    }
    const savedAnswer = this.dataLogService.getAnswer(this.currentScenario, this.currentQuestion);
    if (savedAnswer !== -1) {
      this.currentAnswer = savedAnswer;
    }
    this.errorMessage = '';

    this.updateMenu(data);
    this.btnForward = 'Neste';
    if (data.isLastQuestion) {
      this.btnForward = 'See results';
    }
    if (data.isFirstQuestion) {
      this.googleAnalyticsService.restartTimer('time_answer_interest', '' + this.dataLogService.getInterest().id);
    }
    if (data.isFirstQuestionInScenario) {
      this.googleAnalyticsService.stopTimer('time_answer_scenario');
      this.googleAnalyticsService.stopCounter('count_corrected_questions_per_scenario');
      this.googleAnalyticsService.stopCounter('count_plays_per_scenario');

      this.googleAnalyticsService.restartTimer('time_answer_scenario', '' + this.scenario.id);
      this.googleAnalyticsService.restartCounter('count_corrected_questions_per_scenario', '' + this.dataLogService.getInterest().id);
      this.googleAnalyticsService.restartCounter('count_plays_per_scenario', '' + this.dataLogService.getInterest().id);
    }
    this.googleAnalyticsService.restartTimer('time_answer_question', '' + this.question.id, this.question.pedagogical_type);
  }

  saveAnswer(): boolean {
    if (this.currentAnswer < 0) {
      if (this.question.pedagogical_type === 'challenging_skill') {
        this.showError(this.ERROR_MESSAGE_MULTIPLE);
      } else {
        this.showError(this.ERROR_MESSAGE);
      }
      return false;
    } else {
      this.dataLogService.setAnswer(this.currentScenario, this.currentQuestion, this.currentAnswer);
      return true;
    }
  }

  previousQuestion() {
    if (this.isFirstQuestionLoaded) {
      this.commonService.goTo('interests');
    }
    this.progressTrackerService.previous().subscribe((data: CustomResponse) => {
      this.updateData(data);
    });
  }

  updateData(data: CustomResponse): void {
    if (!!data) {
      this.currentScenario = data.scenarioIndex;
      this.currentQuestion = data.questionIndex;
      this.scenario = data.scenario;
      this.question = data.question;
      this.currentAnswer = data.answer;
      this.isFirstQuestionLoaded = data.isFirstQuestion;
      this.afterLoadQuestion(data);
    } else {
      this.commonService.goTo('interests');
    }
  }

  showError(message: string): void {
    this.errorMessage = message;
  }

  processAnswer(answer: number): void {
    this.currentAnswer = answer;
  }

  clickHeader() {
    //#region Duplicated code in constructor() in app.component.ts
    const {scenarioIndex, questionIndex} = this.progressTrackerService.getResponse() as CustomResponse;
    if (!(scenarioIndex === 0 && questionIndex === 0)) {
      const interest = this.dataLogService.getInterest();
      const scenario = this.dataLogService.getScenario(scenarioIndex);
      this.googleAnalyticsService.addEvent('left_interest_at_level', '' + interest.id, scenarioIndex + 1);
      this.googleAnalyticsService.addEvent('left_scenario_at_question_number', '' + scenario.id, questionIndex + 1);
    }
    //#endregion
  }

  updateMenu(data: CustomResponse): void {
    if (data.scenarioIndex > 0 || data.questionIndex > 1) {
      this.allButtons.find( button => button.event === 'go_results').visible = true;
    } else {
      this.allButtons.find( button => button.event === 'go_results').visible = false;
    }
    if (data.questionIndex > 1) {
      this.allButtons.find( button => button.event === 'skip_scenario').visible = true;
    } else {
      this.allButtons.find( button => button.event === 'skip_scenario').visible = false;
    }
    this.buttons = this.allButtons.filter( button => button.visible);
  }

  onButtonsEvent(data: string): void {
    switch (data) {
      case 'back':
        this.previousQuestion();
        break;
      case 'skip_scenario':
        this.nextScenario();
        break;
      case 'go_results':
        document.getElementById('resultsModal').click();
        break;
      case 'forward':
        this.nextQuestion();
        break;
    }
  }

  goToResults(): void {
    this.commonService.goTo('results');
  }

}
