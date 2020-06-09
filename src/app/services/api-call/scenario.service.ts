import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Scenario } from '../../models/scenario';

import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {

  constructor(private commonService: CommonService) { }

  getScenarios(interestid: number): Observable<Scenario[]> {
    if (interestid === undefined) {
      interestid = -1;
    } else {
      const url = `/categories/-1/interests/${interestid}/scenarios`;
      return this.commonService.getAPICaller(url).pipe(map(
        (data: Scenario[]) => {
          return data;
        }
      ));
    }
  }

}
