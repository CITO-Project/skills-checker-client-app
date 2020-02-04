import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Question } from '../models/question';

import { CommonService } from './common.service';

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

  private CHALLENGING_ORDER = [
    'literacy',
    'numeracy',
    'digital_skills'
  ];

  constructor(private httpClient: HttpClient, private common: CommonService) { }

  getQuestions(categoryid: number, interestid: number, scenarioId: number): Observable<Question[]> {
    if (categoryid === undefined) {
      categoryid = -1;
    } else if (interestid === undefined) {
      interestid = -1;
    } else if (scenarioId === undefined) {
      scenarioId = -1;
    } else {
      const url = `/categories/${categoryid}/interests/${interestid}/scenarios/${scenarioId}/questions`;
      return this.httpClient.get(this.common.getApiUrl() + url)
        .pipe(map( (data: Question[]) => {
          return data;
        })
      );
    }
  }

  shouldSkipScenario(question: Question, answer: number): boolean {
    answer = +answer;
    let r = false;
    switch (question.pedagogical_type) {
      case 'task_question':
        if (answer === question.answers.length - 1) {
          r = true;
        }
        break;
      case 'dimension_independence':
      case 'dimension_confidence':
      case 'dimension_fluency':
        if (answer === question.answers.length - 1) {
          r = true;
        }
        break;
    }
    return r;
  }

  getPedagogicalType(order: number): string {
    return this.QUESTION_ORDER[order];
  }

  getQuestionOrder(): string[] {
    return this.QUESTION_ORDER;
  }

  getChallengingOrder(): string[] {
    return this.CHALLENGING_ORDER;
  }

  getQuestionInOrder(questions: Question[], questionindex: number): Question {
    // TODO: Change foreach so it doesnt check every single value in the list
    let r: Question = null;
    questions.forEach((question: Question) => {
      if (question.pedagogical_type === this.QUESTION_ORDER[questionindex]) {
        r = question;
      }
    });
    return r;
  }

}
