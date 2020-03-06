import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CommonService } from './common.service';

import { QuestionOrder } from '../models/question-order';


@Injectable({
  providedIn: 'root'
})
export class QuestionOrderService {

  constructor(private commonService: CommonService) { }

  getQuestionOrder(): Observable<QuestionOrder[]> {
    const url = '/questionorder';
    return this.commonService.getAPICaller(url).pipe(map(
      (data: QuestionOrder[]) => {
        return data;
      }
    ));
  }
}
