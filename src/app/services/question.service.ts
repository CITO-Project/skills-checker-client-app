import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { map } from 'rxjs/operators';
import { Question } from '../models/question';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private QUESTION_ORDER = [
    'task_question',
    'challenging_skill',
    'dimension_independence',
    'dimension_confidence',
    'dimension_fluency'
  ];

  private questions: Question[] = [];

  constructor(private httpClient: HttpClient, private common: CommonService) { }

  getQuestions(categoryid: number, interestid: number, scenarioId: number): Observable<void> {
    if (categoryid < 1) {
      this.common.goTo('categories');
    } else if (interestid < 1) {
      this.common.goTo('interests');
    } else if (scenarioId < 1) {
      this.common.goTo('how-to');
    } else {
      const url = `/categories/${categoryid}/interests/${interestid}/scenarios/${scenarioId}/questions`;
      return this.httpClient.get(this.common.getApiUrl() + url)
        .pipe(map( (data: Question[]) => {
          this.questions = data;
        })
      );
    }
  }

  getQuestionByOrder(order: number): Question {
    const pedagogicalType = this.QUESTION_ORDER[order];
    let r: Question = null;
    this.questions.forEach( (question: Question) => {
      if (question.pedagogical_type === pedagogicalType) {
        r = question;
      }
    });
    return r;
  }

  getQuestionById(questionId: number): Question {
    let r: Question = null;
    if (this.questions.length > 0) {
      this.questions.forEach( (question: Question) => {
        if (question.id === questionId) {
          r = question;
        }
      });
    }
    return r;
  }

  getQuestionByPedagogicalType(pedagogicalType: string): Question {
    let r: Question = null;
    if (this.questions.length > 0) {
      this.questions.forEach( (question: Question) => {
        if (question.pedagogical_type === pedagogicalType) {
          r = question;
        }
      });
    }
    return r;
  }

  shouldSkipScenario(order: number, answer: number): boolean {
    answer = +answer;
    const pedagogicalType = this.QUESTION_ORDER[order];
    const lastNAnswer = this.getQuestionByPedagogicalType(pedagogicalType).answers.length - 1;
    let r = false;
    switch (pedagogicalType) {
      case 'task_question':
        if (answer === lastNAnswer) {
          r = true;
        }
        break;
      case 'dimension_independence':
      case 'dimension_confidence':
      case 'dimension_fluency':
        if (answer === lastNAnswer) {
          r = true;
        }
        break;
    }
    return r;
  }

  getCount(): number {
    return this.questions.length;
  }

  getPedagogicalType(order: number): string {
    return this.QUESTION_ORDER[order];
  }

  getQuestionOrder(): string[] {
    return this.QUESTION_ORDER;
  }

}
