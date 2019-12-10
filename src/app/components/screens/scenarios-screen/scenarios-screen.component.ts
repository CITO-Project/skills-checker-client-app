import { Component, OnInit } from '@angular/core';

import { Interest } from 'src/app/models/interest';
import { Scenario } from 'src/app/models/scenario';
import { Question } from 'src/app/models/question';

import { DataLogService } from 'src/app/services/data-log.service';
import { ScenarioService } from 'src/app/services/scenario.service';
import { QuestionService } from 'src/app/services/question.service';
import { CategoryService } from 'src/app/services/category.service';
import { InterestService } from 'src/app/services/interest.service';
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

  private currentAnswer = -1;
  private currentIndex = -1;

  constructor(
    private dataLogService: DataLogService,
    private categoryService: CategoryService,
    private interestService: InterestService,
    private scenarioService: ScenarioService,
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
      this.scenarioService.getScenarios(category.id, interest.id).subscribe( () => {
        this.currentScenario = -1;
        this.nextScenario();
      });
    }

  }

  nextScenario() {
    if (this.currentScenario === this.scenarioService.getCount() - 1 ) {
      this.commonService.goTo('results');
    } else {
      ++this.currentScenario;
      this.loadScenario(this.currentScenario);
    }
  }

  loadScenario(order: number, loadFromPrevious = false) {
    this.scenario = this.scenarioService.getScenarioByOrder(order);
    this.dataLogService.setScenario(this.scenario);
    this.questionService.getQuestions(
        this.dataLogService.getCategory().id,
        this.dataLogService.getInterest().id,
        this.scenario.id).subscribe( () => {
      this.currentQuestion = -1;
      this.nextQuestion();
    });
  }

  nextQuestion() {
    if (this.currentQuestion === this.questionService.getCount() - 1 ) {
      this.nextScenario();
    } else {
      ++this.currentQuestion;
      ++this.currentIndex;
      this.loadQuestion(this.currentQuestion);
    }
  }

  loadQuestion(order: number) {
    this.question = null;
    this.question = this.questionService.getQuestionByOrder(order);
    if (this.question.type === 'slider') {
      this.currentAnswer = 0;
    } else {
      this.currentAnswer = -1;
    }
    this.errorMessage = '';
    this.dataLogService.setQuestion(this.question, this.currentIndex);

    this.isLastQuestion();
  }

  saveAnswer() {
    if (this.currentAnswer < 0) {
      this.showError('Please, select one of the options bellow');
    } else {
      this.dataLogService.setAnswer(this.currentIndex, this.currentAnswer);
      if ( this.questionService.shouldSkipScenario(this.currentQuestion, this.currentAnswer) ) {
        this.nextScenario();
      } else {
        this.nextQuestion();
      }
    }
  }

  isLastQuestion(): boolean {
    this.btnForward = 'Next';
    const isIt = (this.currentScenario === this.scenarioService.getCount() - 1
      && this.currentQuestion === this.questionService.getCount() - 1);
    if (isIt) {
      this.btnForward = 'See results';
    }
    return isIt;
  }

  previousQuestion() {
    this.commonService.goTo('how-to');
  }

  showError(message: string): void {
    this.errorMessage = message;

  }

  processAnswer(answer: number): void {
    this.currentAnswer = answer;
  }

}
