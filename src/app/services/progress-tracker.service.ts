import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { DataLogService } from './data-log.service';
import { Category } from '../models/category';
import { Interest } from '../models/interest';
import { QuestionService } from './question.service';
import { Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomResponse } from '../models/custom-response';

@Injectable({
  providedIn: 'root'
})

export class ProgressTrackerService {

  private QUESTIONS_PER_SCENARIO;
  private NUMBER_OF_SCENARIOS;

  private scenario: number;
  private question: number;

  constructor(
    private commonService: CommonService,
    private dataLogService: DataLogService,
    questionService: QuestionService) {
    this.QUESTIONS_PER_SCENARIO = questionService.getQuestionOrder().length;

  }

  initializeTracker(): Observable<void> {
    const category = this.dataLogService.getCategory();
    const interest = this.dataLogService.getInterest();
    this.dataLogService.resetInterest();
    return this.loadScenarios(category, interest).pipe(map( () => {
      this.NUMBER_OF_SCENARIOS = this.dataLogService.getScenarioCount();
      this.loadStart().subscribe(() => {
        this.question = -1;
      });
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

  loadStart(): Observable<void> {
    this.scenario = 0;
    return this.loadScenario(this.scenario);
  }

  next(): Observable<CustomResponse> {
    this.question++;
    if (this.question >= this.QUESTIONS_PER_SCENARIO) {
      return this.nextScenario();
    } else {
      return this.getResponse(true) as Observable<CustomResponse>;
    }
  }

  previous(): Observable<CustomResponse> {
    this.question--;
    if (this.question <= -1) {
      return this.previousScenario().pipe(map( () => {
        this.question = this.QUESTIONS_PER_SCENARIO - 1;
        return this.getResponse() as CustomResponse;
      }));
    } else {
      return this.getResponse(true) as Observable<CustomResponse>;
    }
  }

  nextScenario(): Observable<CustomResponse> {
    this.scenario++;
    if (this.scenario >= this.NUMBER_OF_SCENARIOS) {
      this.commonService.goTo('results');
    } else {
      return this.loadScenario(this.scenario).pipe(map( () => {
        return this.getResponse() as CustomResponse;
      }));
    }
  }

  previousScenario(): Observable<void> {
    this.scenario--;
    if (this.scenario < 0) {
      this.commonService.goTo('how-to');
    } else {
      return this.loadScenario(this.scenario);
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

  getResponse(asObservable: boolean = false): CustomResponse | Observable<CustomResponse> {
    if (!!asObservable) {
      const r = new Observable<CustomResponse>( (observer: Observer<CustomResponse>) => {
        observer.next(this.getResponse() as CustomResponse);
        observer.complete();
      });
      return r as Observable<CustomResponse>;
    } else {
      const log = this.dataLogService.getAll();
      return {
        scenarioIndex: this.scenario,
        questionIndex: this.question,
        scenario: log.scenarios[this.scenario],
        question: log.questions[this.question],
        question_answers: log.question_answers[this.question],
        answer: log.answers[this.question],
        isFirstQuestion: this.scenario === 0 && this.question === 0,
        isLastQuestion: this.scenario >= this.NUMBER_OF_SCENARIOS - 1 && this.question >= this.QUESTIONS_PER_SCENARIO - 1,
        isFirstQuestionInScenario: this.question === 0,
        isLastQuestionInScenario: this.question >= this.QUESTIONS_PER_SCENARIO - 1
      } as CustomResponse;
    }
  }

}
