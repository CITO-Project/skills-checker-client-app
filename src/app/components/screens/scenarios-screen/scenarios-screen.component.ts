import { Component, OnInit } from '@angular/core';

import { Scenario } from 'src/app/models/scenario';
import { Question } from 'src/app/models/question';
import { Category } from 'src/app/models/category';
import { Answer } from 'src/app/models/answer';
import { CustomResponse } from 'src/app/models/custom-response';

import { DataLogService } from 'src/app/services/data-log.service';
import { CommonService } from 'src/app/services/common.service';
import { ProgressTrackerService } from 'src/app/services/progress-tracker.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@Component({
  selector: 'app-scenarios-screen',
  templateUrl: './scenarios-screen.component.html',
  styleUrls: ['./scenarios-screen.component.scss']
})
export class ScenariosScreenComponent implements OnInit {

  public scenario: Scenario;
  public question: Question;
  public questionAnswers: Answer[];
  public currentAnswer = -1;

  public errorMessage = '';
  public category: Category;

  public btnBack = 'default';
  public btnForward = 'default';

  public currentScenario = -1;
  public currentQuestion = -1;

  constructor(
    private dataLogService: DataLogService,
    private commonService: CommonService,
    private progressTrackerService: ProgressTrackerService,
    private googleAnalyticsService: GoogleAnalyticsService
    ) {
      if (!dataLogService.getCategory()) {
        commonService.goTo('how-to');
      }
    }

  ngOnInit() {
    this.progressTrackerService.next().subscribe((data: CustomResponse) => {
      if (data.question === undefined || data.scenario === undefined) {
        this.commonService.goTo('how-to');
      } else {
        this.updateData(data);
      }
    });
  }

  nextQuestion() {
    if (this.saveAnswer()) {
      this.googleAnalyticsService.stopTimer('time_answer_question');
      this.progressTrackerService.next(this.currentAnswer).subscribe((data: CustomResponse) => {
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

    this.btnForward = 'default';
    this.btnBack = 'default';
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
      this.showError('Please, select one of the options bellow');
      return false;
    } else {
      this.dataLogService.setAnswer(this.currentScenario, this.currentQuestion, this.currentAnswer);
      return true;
    }
  }

  previousQuestion() {
    this.progressTrackerService.previous().subscribe((data: CustomResponse) => {
      this.updateData(data);
    });
  }

  updateData(data: CustomResponse): void {
    this.currentScenario = data.scenarioIndex;
    this.currentQuestion = data.questionIndex;
    this.scenario = data.scenario;
    this.question = data.question;
    this.questionAnswers = data.question_answers;
    this.currentAnswer = data.answer;
    this.afterLoadQuestion(data);
  }

  showError(message: string): void {
    this.errorMessage = message;
  }

  processAnswer(answer: number): void {
    this.currentAnswer = answer;
  }

}
