import { Injectable } from '@angular/core';
import { Observable, Observer, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { Category } from '../models/category';
import { Interest } from '../models/interest';
import { CustomResponse } from '../models/custom-response';
import { Answer } from '../models/answer';

import { CommonService } from './common.service';
import { DataLogService } from './data-log.service';
import { QuestionService } from './question.service';
import { GoogleAnalyticsService } from './google-analytics.service';

@Injectable({
  providedIn: 'root'
})

export class ProgressTrackerService {

  private QUESTIONS_PER_SCENARIO: number;
  private NUMBER_OF_SCENARIOS: number;

  private scenario: number;
  private question: number;

  constructor(
    private commonService: CommonService,
    private dataLogService: DataLogService,
    private questionService: QuestionService,
    private googleAnalyticsService: GoogleAnalyticsService) {
      this.QUESTIONS_PER_SCENARIO = questionService.getQuestionOrder().length;
  }

  initializeTracker(): Observable<Observable<void>> {
    const category = this.dataLogService.getCategory();
    const interest = this.dataLogService.getInterest();
    this.dataLogService.resetInterest();
    return this.loadScenarios(category, interest).pipe(map( () => {
      this.NUMBER_OF_SCENARIOS = this.dataLogService.getScenarioCount();
      return this.loadStart(this.NUMBER_OF_SCENARIOS).pipe(map (() => {
        this.question = -1;
      }));
    }));
  }

  loadScenarios(category: Category, interest: Interest): Observable<void> {
    if (category === null) {
      this.commonService.goTo('categories');
    } else if (interest === null) {
      this.commonService.goTo('interests');
    } else {
      return this.dataLogService.loadScenarios(category.id, interest.id);
    }
  }

  loadStart(numberOfScenarios: number): Observable<void> {
    const r: Observable<void>[] = [];
    for (let i = 0; i < numberOfScenarios; i++) {
      r.push(this.loadScenario(i));
    }
    return forkJoin(r).pipe(map( () => {
      this.scenario = 0;
    }));
  }

  next(answerValue?: number): Observable<CustomResponse> {
    this.question++;
    if (this.shouldSkipScenario(answerValue === undefined ? -1 : answerValue)) {
      return this.nextScenario();
    }
    if (this.shouldSkip(answerValue === undefined ? -1 : answerValue)) {
      this.question++;
    }
    if (this.question >= this.QUESTIONS_PER_SCENARIO) {
      return this.nextScenario();
    } else {
      return this.getResponse(true) as Observable<CustomResponse>;
    }
  }

  previous(): Observable<CustomResponse> {
    this.question--;
    if (this.isPreviousSkipped()) {
      this.question--;
    }
    if (this.question <= -1) {
      this.previousScenario();
      this.question = this.QUESTIONS_PER_SCENARIO - 1;
      if (this.isPreviousSkipped()) {
        this.question--;
      }
      return this.getResponse(true) as Observable<CustomResponse>;
    } else {
      return this.getResponse(true) as Observable<CustomResponse>;
    }
  }

  nextScenario(): Observable<CustomResponse> {
    this.scenario++;
    if (this.scenario >= this.NUMBER_OF_SCENARIOS) {
      this.googleAnalyticsService.addEvent('finished_test', '' + this.dataLogService.getInterest().id);
      this.commonService.goTo('results');
    } else {
      this.question = 0;
      return this.getResponse(true) as Observable<CustomResponse>;
    }
  }

  previousScenario(): void {
    this.scenario--;
    if (this.scenario < 0) {
      this.commonService.goTo('how-to');
    }
  }

  loadScenario(scenarioindex: number): Observable<void> {
    this.question = 0;
    return this.dataLogService.loadQuestions(
      scenarioindex,
      this.dataLogService.getCategory().id,
      this.dataLogService.getInterest().id
    );
  }

  shouldSkip(answer: number): boolean {
    let r = false;
    if (this.question > 0) {
      const previousQuestion = this.question - 1;
      if (
        previousQuestion === this.questionService.getQuestionOrder().indexOf('dimension_confidence_1') ||
        previousQuestion === this.questionService.getQuestionOrder().indexOf('dimension_fluency_1')
        ) {
        if (+answer === 0) {
          r = true;
        }
      }
    }
    return r;
  }

  shouldSkipScenario(answer: number): boolean {
    let r = false;
    if (this.question > 0) {
      const { questions, question_order, question_answers } = this.dataLogService.getAll();
      const currentQuestionIndex = (question_order.length * this.scenario + this.question) - 1;
      if (
        // tslint:disable-next-line:max-line-length
        (questions[currentQuestionIndex].pedagogical_type === 'task_question' && answer === question_answers[currentQuestionIndex].length - 1)
        ||
        (questions[currentQuestionIndex].pedagogical_type === 'dimension_independence_1' && answer === 0)
        ||
        (questions[currentQuestionIndex].pedagogical_type === 'dimension_confidence_2' && answer === 1)
        ) {
          r = true;
      }
    }
    return r;
  }

  isPreviousSkipped(): boolean {
    let r = false;
    if (this.dataLogService.getAnswer(this.scenario, this.question) < 0) {
      r = true;
    }
    return r;
  }

  getResponse(asObservable: boolean = false): CustomResponse | Observable<CustomResponse> {
    if (!!asObservable) {
      const r = new Observable<CustomResponse>( (observer: Observer<CustomResponse>) => {
        observer.next(this.getResponse() as CustomResponse);
        observer.complete();
      });
      return r as Observable<CustomResponse>;
    } else {
      const log = this.dataLogService.getAll();
      if (log.questions.length < 1 || log.question_answers.length < 1) {
        this.commonService.goTo('how-to');
      }
      const questionIndexInLog = this.scenario * this.QUESTIONS_PER_SCENARIO + this.question;
      const questionid = log.questions[questionIndexInLog].id;
      const questionIndex = log.question_answers.findIndex( (item: Answer[]) => {
        return item.length > 0 && item[0].question === questionid;
      });
      return {
        scenarioIndex: this.scenario,
        questionIndex: this.question,
        scenario: log.scenarios[this.scenario],
        question: log.questions[questionIndexInLog],
        question_answers: log.question_answers[questionIndex],
        answer: log.answers[this.question],
        isFirstQuestion: this.scenario === 0 && this.question === 0,
        isLastQuestion: this.scenario >= this.NUMBER_OF_SCENARIOS - 1 && this.question >= this.QUESTIONS_PER_SCENARIO - 1,
        isFirstQuestionInScenario: this.question === 0,
        isLastQuestionInScenario: this.question >= this.QUESTIONS_PER_SCENARIO - 1
      } as CustomResponse;
    }
  }

}
