import { Component, OnInit } from '@angular/core';

import { Interest } from 'src/app/models/interest';
import { Scenario } from 'src/app/models/scenario';
import { Question } from 'src/app/models/question';

import { DataLogService } from 'src/app/services/data-log.service';
import { QuestionService } from 'src/app/services/question.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-scenarios-screen',
  templateUrl: './scenarios-screen.component.html',
  styleUrls: ['./scenarios-screen.component.scss']
})
export class ScenariosScreenComponent implements OnInit {

  public interest: Interest;
  public scenario: Scenario;
  public question: Question;
  public errorMessage = '';

  public btnBack = 'Go back';
  public btnForward = 'Next';

  private currentScenario = -1;
  private currentQuestion = -1;

  public currentAnswer = -1;

  constructor(
    private dataLogService: DataLogService,
    private questionService: QuestionService,
    private commonService: CommonService
    ) { }

  ngOnInit() {
    this.getScenarios();
    this.dataLogService.resetInterest();
  }

  getScenarios() {
    const category = this.dataLogService.getCategory();
    const interest = this.dataLogService.getInterest();
    if (category === null) {
      this.commonService.goTo('categories');
    } else if (interest === null) {
      this.commonService.goTo('interests');
    } else {
      this.dataLogService.loadScenarios(category.id, interest.id).subscribe( () => {
        this.currentScenario = -1;
        this.nextScenario();
      });
    }
  }

  nextScenario(loadFromPrevious = false) {
    if  (loadFromPrevious) {
      --this.currentScenario;
      this.loadScenario(this.currentScenario, loadFromPrevious);
    } else {
      if (this.currentScenario === this.dataLogService.getScenarioCount() -1) {
        this.commonService.goTo('results');
      } else {
        ++this.currentScenario;
        this.loadScenario(this.currentScenario);
      }
    }
  }

  loadScenario(scenarioindex: number, loadFromPrevious = false) {
    this.scenario = this.dataLogService.getScenario(scenarioindex);
    this.dataLogService.loadQuestions(
      this.currentScenario,
      this.dataLogService.getCategory().id,
      this.dataLogService.getInterest().id,
      this.scenario.id).subscribe( () => {
        if (!loadFromPrevious) {
          this.currentQuestion = -1;
        }
        this.nextQuestion(loadFromPrevious);
    });
  }

  nextQuestion(loadFromPrevious = false) {
    if (loadFromPrevious) {
      this.currentQuestion = this.dataLogService.getQuestionCount(this.currentScenario) - 1;
      this.loadQuestion(this.currentScenario, this.currentQuestion);
    } else {
      if (this.currentQuestion === this.questionService.getQuestionOrder().length - 1 ) {
        this.nextScenario();
      } else {
        ++this.currentQuestion;
        this.loadQuestion(this.currentScenario, this.currentQuestion);
      }
    }
  }

  loadQuestion(scenarioindex: number, questionindex: number) {
    this.question = null;
    this.question = this.dataLogService.getQuestion(scenarioindex, questionindex);

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
    this.question.scenario = this.scenario.id;

    this.afterLoadQuestion();
  }

  afterLoadQuestion() {
    this.btnForward = 'Next';
    this.btnBack = 'Previous';
    const isLastQuestion = (
      this.currentScenario === this.dataLogService.getScenarioCount() - 1
      && this.currentQuestion === this.questionService.getQuestionOrder().length - 1);
    if (isLastQuestion) {
      this.btnForward = 'See results';
    } else if (this.currentScenario === 0 && this.currentQuestion === 0) {
      this.btnBack = 'Go back';
    }
  }

  saveAnswer() {
    if (this.currentAnswer < 0) {
      this.showError('Please, select one of the options bellow');
    } else {
      this.dataLogService.setAnswer(this.currentScenario, this.currentQuestion, this.currentAnswer);
      if ( this.questionService.shouldSkipScenario(this.question, this.currentAnswer) ) {
        this.nextScenario();
      } else {
        this.nextQuestion();
      }
    }
  }

  previousQuestion() {
    --this.currentQuestion;
    if (this.currentQuestion < 0) {
      if (this.currentScenario <= 0) {
        this.commonService.goTo('how-to');
      } else {
        --this.currentScenario;
        this.loadScenario(this.currentScenario, true);
      }
    } else {
      this.loadQuestion(this.currentScenario ,this.currentQuestion);
    }
  }

  showError(message: string): void {
    this.errorMessage = message;

  }

  processAnswer(answer: number): void {
    this.currentAnswer = answer;
  }

}
