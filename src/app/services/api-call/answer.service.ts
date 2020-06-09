import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Answer } from '../../models/answer';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  constructor(private commonService: CommonService) { }

  getAnswers(categoryid: number, interestid: number, scenarioid: number, questionid: number): Observable<Answer[]> {
    if (categoryid === undefined) {
      categoryid = -1;
    } else if (interestid === undefined) {
      interestid = -1;
    } else if (scenarioid === undefined) {
      scenarioid = -1;
    } else if (questionid === undefined) {
      questionid = -1;
    } else {
      const url = `/categories/${categoryid}/interests/${interestid}/scenarios/${scenarioid}/questions/${questionid}/answers`;
      return this.commonService.getAPICaller(url).pipe(map(
        (data: Answer[]) => {
          return data;
        }
      ));
    }
  }
}
