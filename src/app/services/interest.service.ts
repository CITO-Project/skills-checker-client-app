import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { Interest } from '../models/interest';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InterestService {

  private interest: Interest;

  constructor(private http: HttpClient, private common: CommonService) { }

  getInterests(categoryid: number): Observable<Interest[]> {
    if (categoryid < 1) {
      this.common.goTo('/categories');
    } else {
      const url = `/categories/${categoryid}/interests`;
      return this.http.get(this.common.getApiUrl() + url).pipe(map(
        (data: Interest[]) => {
          return data;
        }
      ));
    }
  }

  setInterest(interest: Interest): void {
    this.interest = interest;
  }

  getInterest(): Interest {
    return this.interest;
  }

}
