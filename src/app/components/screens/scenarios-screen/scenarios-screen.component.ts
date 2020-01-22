import { Component, OnInit } from '@angular/core';

import { Scenario } from 'src/app/models/scenario';
import { Question } from 'src/app/models/question';

import { DataLogService } from 'src/app/services/data-log.service';
import { QuestionService } from 'src/app/services/question.service';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { ProgressTrackerService } from 'src/app/services/progress-tracker.service';

@Component({
  selector: 'app-scenarios-screen',
  templateUrl: './scenarios-screen.component.html',
  styleUrls: ['./scenarios-screen.component.scss']
})
export class ScenariosScreenComponent implements OnInit {

  public scenario: Scenario;
  public question: Question;
  public errorMessage = '';

  public btnBack = 'default';
  public btnForward = 'default';

  public currentScenario = -1;
  public currentQuestion = -1;

  public currentAnswer = -1;

  constructor(
    private dataLogService: DataLogService,
    private questionService: QuestionService,
    private commonService: CommonService,
    private progressTrackerService: ProgressTrackerService,
    private router: Router
    ) {
      const extras = this.router.getCurrentNavigation().extras;
      if (extras !== undefined && extras.state !== undefined && extras.state.scenario !== undefined) {
        this.scenario = extras.state.scenario;
      } else {
        // ADD Redirect
        this.commonService.goTo('how-to');
        this.question = {
          id: 1,
          type: 'slider',
          pedagogical_type: 'task_question',
          question: 'For me, finding the pharmacy opening hours is:',
          answers: [
            'Very difficult',
            'Difficult',
            'Middling',
            'Easy'
          ],
          description: 'Description for numeracy 1',
          product: 1,
          scenario: 1
        };
      }
    }

  ngOnInit() {
    this.currentScenario = +this.progressTrackerService.getScenarioIndex();
    // ADD redirect
    this.loadScenario(this.currentScenario);
  }

  loadScenario(scenarioindex: number) {
    this.scenario = this.dataLogService.getScenario(scenarioindex);
    this.dataLogService.loadQuestions(
      this.currentScenario,
      this.dataLogService.getCategory().id,
      this.dataLogService.getInterest().id,
      this.scenario.id).subscribe( () => {
        this.nextQuestion();
    });
  }

  nextQuestion(loadFromPrevious = false) {
    if (loadFromPrevious) {
      this.currentQuestion = this.dataLogService.getQuestionCount(this.currentScenario) - 1;
      this.loadQuestion(this.currentScenario, this.currentQuestion);
    } else {
      if (this.currentQuestion === this.questionService.getQuestionOrder().length - 1 ) {
        this.progressTrackerService.nextScenario();
      } else {
        ++this.currentQuestion;
        this.loadQuestion(this.currentScenario, this.currentQuestion);
      }
    }
  }

  loadQuestion(scenarioindex: number, questionindex: number) {
    this.question = null;
    this.question = this.dataLogService.getQuestion(scenarioindex, questionindex);

    if (this.question.type === 'slider' || this.question.type === 'multiple') {
      this.currentAnswer = 0;
    } else {
      this.currentAnswer = -1;
    }
    const savedAnswer = this.dataLogService.getAnswer(this.currentScenario, this.currentQuestion);
    if (savedAnswer !== -1) {
      this.currentAnswer = savedAnswer;
    }
    this.errorMessage = '';
    this.question.scenario = this.scenario.id;

    this.afterLoadQuestion();
  }

  afterLoadQuestion() {
    this.btnForward = 'default';
    this.btnBack = 'default';
    const isLastQuestion = (
      this.currentScenario === this.dataLogService.getScenarioCount() - 1
      && this.currentQuestion === this.questionService.getQuestionOrder().length - 1);
    if (isLastQuestion) {
      this.btnForward = 'See results';
    } else if (this.currentScenario === 0 && this.currentQuestion === 0) {
      this.btnBack = 'default';
    }
  }

  saveAnswer() {
    if (this.currentAnswer < 0) {
      this.showError('Please, select one of the options bellow');
    } else {
      this.dataLogService.setAnswer(this.currentScenario, this.currentQuestion, this.currentAnswer);
      if ( this.questionService.shouldSkipScenario(this.question, this.currentAnswer) ) {
        this.progressTrackerService.nextScenario();
      } else {
        this.nextQuestion();
      }
    }
  }

  previousQuestion() {
    --this.currentQuestion;
    if (this.currentQuestion < 0) {
      this.commonService.goTo('scenario-introduction', { scenarioindex: this.currentScenario });
    } else {
      this.loadQuestion(this.currentScenario , this.currentQuestion);
    }
  }

  showError(message: string): void {
    this.errorMessage = message;

  }

  processAnswer(answer: number): void {
    this.currentAnswer = answer;
  }

}
