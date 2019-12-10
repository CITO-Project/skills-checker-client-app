import { Injectable } from '@angular/core';
import { Interest } from '../models/interest';
import { Scenario } from '../models/scenario';
import { Question } from '../models/question';
import { Log } from '../models/log';
import { Product } from '../models/product';
import { QuestionService } from './question.service';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class DataLogService {

  private log: Log;

  constructor(private questionService: QuestionService) {
    this.initializeLog();
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



  initializeLog() {
    let product = null;
    if (!!this.log && !!this.log.product) {
      product = this.log.product;
    }
    this.log = {
      product,
      category: null,
      interest: null,
      scenarios: [],
      questions: [],
      answers: [],
      question_order: this.questionService.getQuestionOrder()
    };
  }

  setProduct(product: Product): void {
    this.log.product = product;
  }

  getProduct(): Product {
    return this.log.product;
  }

  setCategory(category: Category): void {
    this.log.category = category;
  }

  getCategory(): Category {
    return this.log.category;
  }

  setInterest(interest: Interest): void {
    this.log.interest = interest;
  }

  getInterest(): Interest {
    return this.log.interest;
  }

  setScenario(scenario: Scenario): void {
    if (!this.getScenarioById(scenario.id)) {
      const index = this.getNextIndex(this.log.scenarios);
      this.log.scenarios[index] = scenario;
    }
  }

  getScenario(index: number): Scenario {
    return this.log.scenarios[index];
  }

  getScenarioById(scenarioid: number): Scenario {
    this.log.scenarios.forEach( (scenario: Scenario) => {
      if (scenario.id === scenarioid) {
        return scenario;
      }
    });
    return null;
  }

  setQuestion(question: Question, index: number): void {
    if (this.log.questions[index] === undefined) {
      this.log.questions[index] = question;
    } else if (this.log.questions[index].id !== question.id) {
      this.log.questions[index] = question;
    }
  }

  getQuestion(index: number): Question {
    let r: Question = null;
    if (this.log.questions[index] !== undefined) {
      r = this.log.questions[index];
    }
    return r;
  }




  // Teño que facer que se graven as preguntas e respostas en orden, non por id. Porque si non sobrescribense as preguntas que son comuns.





  // getQuestionByOrder(scenarioid: number, order: number): Question {
  //   const pedagogicalType = this.questionService.getPedagogicalType(order);
  //   this.log.questions.forEach( (question: Question) => {
  //     if (question.scenario === scenarioid && question.pedagogical_type === pedagogicalType) {
  //       return question;
  //     }
  //   });
  //   return null;
  // }

  setAnswer(index: number, answerValue: number): void {
    // console.log(answerValue);
    this.log.answers[index] = +answerValue;
    // let index = this.getAnswerIndex(questionid);
    // if (index < 0) {
    //   index = this.getNextIndex(this.log.answers);
    // }
    // this.log.answers[index] = {
    //   questionid,
    //   answer: +answerValue
    // };
  }

  getAnswer(index: number): number {
    let r = -1;
    if (this.log.answers[index] !== undefined) {
      r = this.log.answers[index];
    }
    return r;
  }

  // getAnswerIndex(questionId: number): number {
  //   if ( this.log.answers.length > 0) {
  //     for (let i = 0; i < this.log.answers.length; i++) {
  //       if (this.log.answers[i].questionid === questionId) {
  //         return i;
  //       }
  //     }
  //   }
  //   return -1;
  // }

  getNextIndex(array: any[]): number {
    if (array.length === 0) {
      return 0;
    } else {
      return array.length;
    }
  }

  resetInterest(): void {
    this.log.scenarios = [];
    this.log.questions = [];
    this.log.answers = [];
  }

  getAll(): Log {
    return this.log;
  }

}
