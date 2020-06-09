import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Interest } from '../../models/interest';

import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class InterestService {

  constructor(private commonService: CommonService) { }

  getInterests(): Observable<Interest[]> {
    const url = `/interests`;
    return this.commonService.getAPICaller(url).pipe(map(
      (data: Interest[]) => {
        return data;
      }
    ));
  }

  getInterestsByCategory(categoryid: number): Observable<Interest[]> {
    if (categoryid < 1) {
      this.commonService.goTo('categories');
    } else {
      const url = `/categories/${categoryid}/interests`;
      return this.commonService.getAPICaller(url).pipe(map(
        (data: Interest[]) => {
          return data;
        }
      ));
    }
  }

}
