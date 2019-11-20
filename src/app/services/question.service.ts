import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient, private common: CommonService) { }

  getQuestions(scenarioId: number) {
    return this.http.get(`${this.common.getApiUrl()}questions?filter[where][scenario]=${scenarioId}&filter[fields][id]=true&filter[limit]=3`);
  }

  getQuestion(questionId: number) {
    return this.http.get(`${this.common.getApiUrl()}questions/${questionId}`);
  }

}
