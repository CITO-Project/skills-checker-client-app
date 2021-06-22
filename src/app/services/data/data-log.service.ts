import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Interest } from '../../models/interest';
import { Scenario } from '../../models/scenario';
import { Question } from '../../models/question';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { Log } from '../../models/log';
import { Answer } from '../../models/answer';
import { QuestionOrder } from '../../models/question-order';

import { QuestionService } from '../api-call/question.service';
import { ScenarioService } from '../api-call/scenario.service';
import { AnswerService } from '../api-call/answer.service';


@Injectable({
  providedIn: 'root'
})
export class DataLogService {

  private log: Log;

  constructor(
    private questionService: QuestionService,
    private scenarioService: ScenarioService,
    private answerService: AnswerService) {
      this.initializeLog();
  }

  initializeLog() {
    let product = null;
    let questionOrder = null;
    if (!!this.log && !!this.log.product) {
      product = this.log.product;
    }
    if (!!this.log && !!this.log.question_order) {
      questionOrder = this.log.question_order;
    }
    this.log = {
      product,
      interest: null,
      scenarios: [],
      questions: [],
      answers: [],
      question_answers: [],
      question_order: questionOrder,
      challenging_order: this.questionService.getChallengingOrder(),
      location: null
    };
  }

  getLocation(): string {
    return this.log.location;
  }

  setLocation(location: string): void {
    this.log.location = location;
  }

  //#region Product
  setProduct(product: Product): void {
    this.log.product = product;
  }

  getProduct(): Product {
    return this.log.product;
  }
  //#endregion

  //#region Category
  setCategory(category: Category): void {
    this.log.category = category;
  }

  getCategory(): Category {
    return this.log.category;
  }
  //#endregion

  //#region Interest
  setInterest(interest: Interest): void {
    this.log.interest = interest;
  }

  getInterest(): Interest {
    return this.log.interest;
  }

  resetInterest(): void {
    this.log.scenarios = [];
    this.log.questions = [];
    this.log.answers = [];
    this.log.question_answers = [];
  }
  //#endregion

  //#region Scenario
  loadScenarios(interestid: number): Observable<void> {
    return this.scenarioService.getScenarios(interestid).pipe(map( (data: Scenario[]) => {
      this.log.scenarios = data;
    }));
  }
  loadScenariosByCategory(categoryid: number, interestid: number): Observable<void> {
    return this.scenarioService.getScenarios(interestid).pipe(map( (data: Scenario[]) => {
      this.log.scenarios = data;
    }));
  }

  getScenario(index: number): Scenario {
    return this.log.scenarios[index];
  }

  getScenarioCount(): number {
    return this.log.scenarios.length;
  }
  //#endregion

  //#region Question
  loadQuestions(scenarioindex: number, interestid: number): Observable<void> {
    const scenarioid = this.log.scenarios[scenarioindex].id;
    if (this.log.questions.length <= 0) {
      this.log.questions = [];
    }
    return this.questionService.getQuestions(interestid, scenarioid).pipe(map( (data: Question[]) => {
      const questions = [];
      this.log.question_order.forEach( (orderValue: string) => {
        this.log.answers.push(-1);
        questions.push(data.find( (question: Question) => {
          return question.pedagogical_type === orderValue;
        }));
      });
      for (let i = 0; i < data.length; i++) {
        this.log.questions[this.getIndex(scenarioindex, i)] = questions[i];
      }
    }));
  }
  loadQuestionsByCategory(scenarioindex: number, categoryid: number, interestid: number): Observable<void> {
    const scenarioid = this.log.scenarios[scenarioindex].id;
    if (this.log.questions.length <= 0) {
      this.log.questions = [];
    }
    return this.questionService.getQuestionsByCategory(categoryid, interestid, scenarioid).pipe(map( (data: Question[]) => {
      const questions = [];
      this.log.question_order.forEach( (orderValue: string) => {
        this.log.answers.push(-1);
        questions.push(data.find( (question: Question) => {
          return question.pedagogical_type === orderValue;
        }));
      });
      this.log.questions = this.log.questions.concat(questions);
    }));
  }

  getQuestion(scenarioindex: number, questionindex: number): Question {
    let r: Question = null;
    const index = this.getIndex(scenarioindex, questionindex);
    if (this.log.questions[index] !== undefined) {
      r = this.log.questions[index];
    }
    return r;
  }

  getQuestionCount(scenarioindex: number): number {
    let r = 0;
    this.log.answers.slice(
        this.getIndex(scenarioindex, 0),
        this.getIndex(scenarioindex, this.getQuestionOrder().length)
      ).forEach(
      (answer: number) => {
        if (answer !== -1) {
          r++;
        }
      }
    );
    return r;
  }
  //#endregion

  //#region QuestionAnswers (deprecated)
  loadAnswers(categoryid: number, interestid: number, scenarioid: number, questionid: number, questionindex: number): Observable<void> {
    return this.answerService.getAnswers(categoryid, interestid, scenarioid, questionid).pipe(map( (data: Answer[]) => {
      this.log.question_answers[questionindex] = data;
    }));
  }
  //#endregion

  //#region Answer
  setAnswer(scenarioindex: number, questionindex: number, answerValue: number): void {
    const index: number = this.getIndex(scenarioindex, questionindex);
    if (this.log.answers[index] !== answerValue) {
      this.log.answers[index] = +answerValue;
      this.resetAnswers(scenarioindex, questionindex);
    }
  }

  getAnswer(scenarioindex: number, questionindex: number): number {
    let r = -1;
    const index = this.getIndex(scenarioindex, questionindex);
    if (this.log.answers[index] !== undefined) {
      r = this.log.answers[index];
    } else {
      this.log.answers[index] = -1;
    }
    return r;
  }

  resetAnswers(scenarioindex: number, questionindex: number): void {
    const index = this.getIndex(scenarioindex, questionindex);
    for (let i = index + 1; i < this.log.answers.length; i++) {
      this.log.answers[i] = -1;
    }
  }
  //#endregion

  //#region QuestionOrder
  setQuestionOrder(questionOrder: QuestionOrder[]): void {
    this.log.question_order = questionOrder
      .sort( (a: QuestionOrder, b: QuestionOrder) => {
        return a.order - b.order;
      })
      .map( (value: QuestionOrder) => {
        return value.name;
      });
  }

  getQuestionOrder(): string[] {
    return this.log.question_order;
  }
  //#endregion

  getIndex(scenarioindex: number, questionindex: number): number {
    return questionindex + scenarioindex * this.log.question_order.length;
  }

  getAll(): Log {
    return this.log;
  }

}
