import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { Interest } from '../models/interest';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InterestService {

  private interest: Interest;

  constructor(private http: HttpClient, private common: CommonService) { }

  getInterests(): Observable<Interest[]> {
    return this.http.get(this.common.getApiUrl() + 'interests').pipe(map(
      (data: Interest[]) => {
        return data;
      }
    ));
  }

  setInterest(interest: Interest): void {
    this.interest = interest;
  }

  getInterest(): Interest {
    return this.interest;
  }

}
