import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Question } from '../models/question';

import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private CHALLENGING_ORDER = [
    'literacy',
    'numeracy',
    'digital_skills'
  ];

  constructor(private commonService: CommonService) { }

  getQuestions(interestid: number, scenarioid: number): Observable<Question[]> {
    if (interestid === undefined) {
      interestid = -1;
    } else if (scenarioid === undefined) {
      scenarioid = -1;
    } else {
      const url = `/interests/${interestid}/scenarios/${scenarioid}/questions`;
      return this.commonService.getAPICaller(url)
        .pipe(map( (data: Question[]) => {
          return data;
        })
      );
    }
  }

  getQuestionsByCategory(categoryid: number, interestid: number, scenarioid: number): Observable<Question[]> {
    if (categoryid === undefined) {
      categoryid = -1;
    } else if (interestid === undefined) {
      interestid = -1;
    } else if (scenarioid === undefined) {
      scenarioid = -1;
    } else {
      const url = `/categories/${categoryid}/interests/${interestid}/scenarios/${scenarioid}/questions`;
      return this.commonService.getAPICaller(url)
        .pipe(map( (data: Question[]) => {
          return data;
        })
      );
    }
  }

  getChallengingOrder(): string[] {
    return this.CHALLENGING_ORDER;
  }

  getQuestionInOrder(questions: Question[], questionindex: number, questionOrder: string[]): Question {
    let r: Question = null;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].pedagogical_type === questionOrder[questionindex]) {
        r = questions[i];
        break;
      }
    }
    return r;
  }

}
