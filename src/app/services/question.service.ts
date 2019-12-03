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

  constructor(private http: HttpClient, private common: CommonService) { }

  getQuestions(scenarioId: number): Observable<void> {
    const url = `questions?` +
    `filter[where][or][0][scenario]=0&` +
    `filter[where][or][1][scenario]=${scenarioId}&` +
    `filter[order]=id%20ASC&` +
    `filter[limit]=5`;
    return this.http.get(this.common.getApiUrl() + url)
      .pipe(map( (data: Question[]) => {
        this.questions = data;
      })
    );
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
