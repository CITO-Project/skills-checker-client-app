import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

import { Category } from '../../models/category';
import { Interest } from '../../models/interest';
import { CustomResponse } from '../../models/custom-response';
import { Answer } from '../../models/answer';

import { CommonService } from '../common.service';
import { DataLogService } from './data-log.service';
import { GoogleAnalyticsService } from '../google-analytics.service';

@Injectable({
  providedIn: 'root'
})

export class ProgressTrackerService {

  private QUESTIONS_PER_SCENARIO: number;
  private NUMBER_OF_SCENARIOS: number;

  private readonly PREVIOUS_SCREEN = 'interests';
  private readonly NEXT_SCREEN = 'results';

  private scenario: number;
  private question: number;

  constructor(
    private commonService: CommonService,
    private dataLogService: DataLogService,
    private googleAnalyticsService: GoogleAnalyticsService) {
  }

  async initializeTracker(): Promise<void> {
    const category = this.dataLogService.getCategory();
    const interest = this.dataLogService.getInterest();
    this.dataLogService.resetInterest();
    await this.loadScenarios(category, interest).toPromise();
    this.QUESTIONS_PER_SCENARIO = this.dataLogService.getQuestionOrder().length;
    this.NUMBER_OF_SCENARIOS = this.dataLogService.getScenarioCount();
    await this.loadQuestions(this.NUMBER_OF_SCENARIOS);
    this.scenario = 0;
    this.question = -1;
    this.commonService.goTo('scenario-introduction', { scenarioindex: 0, loadingNext: true });
  }

  loadQuestions(numberOfScenarios: number): Promise<void[]> {
    const r: Promise<void>[] = [];
    for (let i = 0; i < numberOfScenarios; i++) {
      r.push(this.loadScenario(i).toPromise());
    }
    return Promise.all(r);
  }

  loadScenarios(category: Category, interest: Interest): Observable<void> {
    if (interest === null) {
      this.commonService.goTo('interests');
    } else {
      return this.dataLogService.loadScenarios(interest.id);
    }
  }

  current(): Observable<CustomResponse> {
    return this.getResponse(true) as Observable<CustomResponse>;
  }

  next(answerValue?: number): Observable<CustomResponse> {
    this.question++;
    if (this.shouldSkipScenario(answerValue === undefined ? -1 : answerValue)) {
      return this.nextScenario();
    }
    if (this.question >= this.QUESTIONS_PER_SCENARIO) {
      return this.nextScenario();
    } else {
      return this.getResponse(true) as Observable<CustomResponse>;
    }
  }

  previous(): Observable<CustomResponse> {
    if (this.question <= 0 && this.scenario <= 0) {
      this.commonService.goTo('scenario-introduction', { scenarioindex: 0, loadingNext: false });
    }
    this.question--;
    const { answers, question_order } = this.dataLogService.getAll();
    let questionIndex = this.getQuestionIndexInLog(this.question, this.scenario);
    while (answers[questionIndex] < 0) {
      if (this.question < 0) {
        this.scenario--;
        this.question = question_order.length - 1;
        this.commonService.goTo('scenario-introduction', { scenarioindex: this.scenario, loadingNext: false });
      }
      this.question--;
      questionIndex = this.getQuestionIndexInLog(this.question, this.scenario);
    }
    return this.getResponse(true) as Observable<CustomResponse>;
  }

  nextScenario(): Observable<CustomResponse> {
    this.scenario++;
    if (this.scenario >= this.NUMBER_OF_SCENARIOS) {
      this.calculateNumberOfAnsweredQuestions();
      this.googleAnalyticsService.addEvent('finished_test', '' + this.dataLogService.getInterest().id);
      this.commonService.goTo(this.NEXT_SCREEN);
    } else {
      this.question = -1;
      this.commonService.goTo('scenario-introduction', { scenarioindex: this.scenario, loadingNext: true });
      return this.getResponse(true) as Observable<CustomResponse>;
    }
  }

  loadScenario(scenarioindex: number): Observable<void> {
    this.question = 0;
    return this.dataLogService.loadQuestions(
      scenarioindex,
      this.dataLogService.getInterest().id
    );
  }

  shouldSkipScenario(answer: number): boolean {
    answer = +answer;
    if (answer < 0) {
      return false;
    }
    const { questions, question_order } = this.dataLogService.getAll();
    if (questions.length < 1) {
      this.commonService.goTo('interests');
    }
    const question = questions[this.getQuestionIndexInLog(this.question > 0 ? this.question - 1 : this.question)];
    const currentAnswer = question.answers.find( (value: Answer) => {
      return value.value === answer;
    });
    if (!!currentAnswer && !!currentAnswer.skipTo) {
      if (currentAnswer.skipTo === 'nextScenario') {
        return true;
      } else if (question_order.includes(currentAnswer.skipTo)) {
        while (this.question < question_order.length && questions[this.question].pedagogical_type !== currentAnswer.skipTo) {
          this.question++;
        }
      }
    }
    return false;
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
      if (log.questions.length < 1) {
        this.commonService.goTo(this.PREVIOUS_SCREEN);
      }
      const questionIndexInLog = this.getQuestionIndexInLog();
      if (!!log.questions && log.questions.length > 0 && !!log.questions[questionIndexInLog]) {
        const questionid = log.questions[questionIndexInLog].id;
        let answersIndex = -1;
        // tslint:disable-next-line: no-bitwise
        answersIndex = this.getAnswerIndexPerQuestionId(questionid) | -1;
        return {
          scenarioIndex: this.scenario,
          questionIndex: this.question,
          scenario: log.scenarios[this.scenario],
          question: log.questions[questionIndexInLog],
          question_answers: log.question_answers[answersIndex],
          answer: log.answers[this.question],
          isFirstQuestion: this.scenario === 0 && this.question === 0,
          isLastQuestion: this.scenario >= this.NUMBER_OF_SCENARIOS - 1 && this.question >= this.QUESTIONS_PER_SCENARIO - 1,
          isFirstQuestionInScenario: this.question === 0,
          isLastQuestionInScenario: this.question >= this.QUESTIONS_PER_SCENARIO - 1
        } as CustomResponse;
      } else if (this.scenario === 0 && this.question === -1) {
        this.question = 0;
        return this.getResponse(asObservable);
      } else {
        this.commonService.goTo('interests');
      }
    }
  }

  getAnswerIndexPerQuestionId(questionid: number): number {
    return this.dataLogService.getAll().question_answers.findIndex( (item: Answer[]) => {
      return item.length > 0 && item[0].question === questionid;
    });
  }

  getQuestionIndexInLog(questionIndex: number = this.question, scenarioIndex: number = this.scenario): number {
    return scenarioIndex * this.QUESTIONS_PER_SCENARIO + questionIndex;
  }

  calculateNumberOfAnsweredQuestions(): void {
    const { answers, question_order, scenarios, interest } = this.dataLogService.getAll();
    let total = 0;
    let scenarioTotal = 0;
    answers.forEach( (value: number, index: number) => {
      if (value >= 0) {
        total++;
        scenarioTotal++;
      }
      if ((index + 1) % question_order.length === 0) {
        this.googleAnalyticsService.addEvent(
          'answered_questions_per_scenario',
          '' + scenarios[Math.floor(index / question_order.length)].id,
          scenarioTotal);
        scenarioTotal = 0;
      }
    });
    this.googleAnalyticsService.addEvent(
      'answered_questions_per_interest',
      '' + interest.id,
      total);
  }
}
