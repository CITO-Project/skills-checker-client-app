import { Injectable } from '@angular/core';
import { Interest } from '../models/interest';
import { Scenario } from '../models/scenario';
import { Question } from '../models/question';
import { Result } from '../models/result';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class TestResultsService {

  private results: Result;

  constructor() {
    this.results = {
      product: null,
      interest: null,
      scenarios: [],
      questions: [],
      answers: [],
      result: null
    };
  }

  setProduct(product: Product): void {
    // delete this.results;
    this.results.product = product;
  }

  getProduct(): Product {
    return this.results.product;
  }

  setInterest(interest: Interest): void {
    // delete this.results.scenarios;
    // delete this.results.questions;
    // delete this.results.answers;
    // delete this.results.result;
    this.results.interest = interest;
  }

  getInterest(): Interest {
    return this.results.interest;
  }

  setScenario(scenario: Scenario): void {
    const index = this.getNextIndex(this.results.scenarios);
    this.results.scenarios[index] = scenario;
    // delete this.results.questions[index];
    // delete this.results.answers[index];
  }

  getScenario(index: number): Scenario {
    return this.results.scenarios[index];
  }

  setQuestion(question: Question): void {
    const index = this.getNextIndex(this.results.questions);
    this.results.questions[index] = question;
    // delete this.results.answers[index];
  }

  // getQuestion(scenarioid: number, skill: number): Question {
  //   const scenarioIndex = this.getScenarioIndex(scenarioid);
  //   const index = this.getQuestionIndex(scenarioIndex, skill);
  //   return this.results.questions[scenarioIndex][index];
  // }

  setAnswer(questionid: number, answer: number): void {
    const index = this.getNextIndex(this.results.answers);
    this.results.answers[index] = {
      questionid,
      answer: +answer
    };
  }

  getAnswer(questionid: number): number {
    this.results.answers.forEach( (answer: {
      questionid: number,
      answer: number
    }) => {
      if (answer.questionid === questionid) {
        return answer.answer;
      }
    });
    return -1;
  }

  getNextIndex(array: any[]): number {
    if (array.length === 0) {
      return 0;
    } else {
      return array.length;
    }
  }

  getAll() {
    return this.results;
  }

}
