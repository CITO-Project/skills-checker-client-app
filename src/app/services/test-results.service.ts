import { Injectable } from '@angular/core';
import { Interest } from '../models/interest';
import { Scenario } from '../models/scenario';
import { Question } from '../models/question';
import { Result } from '../models/result';
import { Product } from '../models/product';
import { QuestionService } from './question.service';

@Injectable({
  providedIn: 'root'
})
export class TestResultsService {

  private results: Result;

  constructor() {
    this.initializeResults();
  }


  /* .I need to find the way to go back and forth in the scenario questions.
      When going back to a question in the same scenario
        Load the question and answer from test-results
      When going back to the previous scenario
        Load the last question from the array in test-results and its answer
      When going forward to the next question in the same scenario
        Load the question and its answer. If the questions hasn't been loaded yet, get it from the
        API and save it
      When going forward to the next question in the next scenario
        Load the scenario from test-results and load the questions from test-results along with its
        answers. If it hasn't been loaded yet, get it from the API and save it
  */



  initializeResults() {
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
    this.results.product = product;
  }

  getProduct(): Product {
    return this.results.product;
  }

  setInterest(interest: Interest): void {
    this.results.interest = interest;
  }

  getInterest(): Interest {
    return this.results.interest;
  }

  setScenario(scenario: Scenario): void {
    const index = this.getNextIndex(this.results.scenarios);
    this.results.scenarios[index] = scenario;
  }

  getScenario(index: number): Scenario {
    return this.results.scenarios[index];
  }

  getScenarioById(scenarioid: number): Scenario {
    this.results.scenarios.forEach( (scenario: Scenario) => {
      if (scenario.id === scenarioid) {
        return scenario;
      }
    });
    return null;
  }

  setQuestion(question: Question): void {
    const index = this.getNextIndex(this.results.questions);
    this.results.questions[index] = question;
  }

  getQuestionById(questionid: number): Question {
    this.results.questions.forEach( (question: Question) => {
      if (question.id === questionid) {
        return question;
      }
    });
    return null;
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

  getAll(): Result {
    return this.results;
  }

}
