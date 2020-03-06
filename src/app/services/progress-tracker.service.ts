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
    private googleAnalyticsService: GoogleAnalyticsService,
    questionService: QuestionService) {
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

  loadStart(numberOfScenarios: number): Observable<void> {
    const r: Observable<void>[] = [];
    for (let i = 0; i < numberOfScenarios; i++) {
      r.push(this.loadScenario(i));
    }
    return forkJoin(r).pipe(map( () => {
      this.scenario = 0;
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
    this.question--;
    const { answers, question_order } = this.dataLogService.getAll();
    let questionIndex = this.getQuestionIndexInLog(this.question, this.scenario);
    while (answers[questionIndex] < 0) {
      if (this.question < 0) {
        this.scenario--;
        if (this.scenario < 0) {
          this.commonService.goTo('how-to');
        } else {
          this.question = question_order.length - 1;
        }
      }
      this.question--;
      questionIndex = this.getQuestionIndexInLog(this.question, this.scenario);
    }
    return this.getResponse(true) as Observable<CustomResponse>;
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

  loadScenario(scenarioindex: number): Observable<void> {
    this.question = 0;
    return this.dataLogService.loadQuestions(
      scenarioindex,
      this.dataLogService.getCategory().id,
      this.dataLogService.getInterest().id
    );
  }

  shouldSkipScenario(answer: number): boolean {
    answer = +answer;
    const { questions, question_answers, question_order } = this.dataLogService.getAll();
    const question = questions[this.getQuestionIndexInLog(this.question > 0 ? this.question - 1 : this.question)];
    const currentAnswer = question_answers[this.getAnswerIndexPerQuestionId(question.id)].find( (value: Answer) => {
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
      if (log.questions.length < 1 || log.question_answers.length < 1) {
        this.commonService.goTo('how-to');
      }
      const questionIndexInLog = this.getQuestionIndexInLog();
      const questionid = log.questions[questionIndexInLog].id;
      const answersIndex = this.getAnswerIndexPerQuestionId(questionid);
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

}
