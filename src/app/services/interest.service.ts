import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Interest } from '../models/interest';

import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class InterestService {

  constructor(private httpClient: HttpClient, private common: CommonService) { }

  getInterests(categoryid: number): Observable<Interest[]> {
    if (categoryid < 1) {
      this.common.goTo('categories');
    } else {
      const url = `/categories/${categoryid}/interests`;
      return this.httpClient.get(this.common.getApiUrl() + url).pipe(map(
        (data: Interest[]) => {
          return data;
        }
      ));
    }
  }

}
