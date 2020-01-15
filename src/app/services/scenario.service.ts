import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Scenario } from '../models/scenario';

import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {

  constructor(private httpClient: HttpClient, private commonService: CommonService) { }

  getScenarios(categoryid: number, interestid: number): Observable<Scenario[]> {
    if (categoryid === undefined) {
      categoryid = -1;
    } else if (interestid === undefined) {
      interestid = -1;
    } else {
      const url = `/categories/${categoryid}/interests/${interestid}/scenarios`;
      return this.httpClient.get(this.commonService.getApiUrl() + url).pipe(map(
        (data: Scenario[]) => {
          return data;
        }
      ));
    }
  }

}
