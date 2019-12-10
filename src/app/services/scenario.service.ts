import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { map } from 'rxjs/operators';
import { Scenario } from '../models/scenario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {

  private scenarios: Scenario[] = [];

  constructor(private http: HttpClient, private common: CommonService) { }

  getScenarios(categoryid: number, interestid: number): Observable<void> {
    if (categoryid < 1) {
      this.common.goTo('/categories');
    } else if (interestid < 1) {
      this.common.goTo('/interests');
    } else {
      const url = `/categories/${categoryid}/interests/${interestid}/scenarios`;
      return this.http.get(this.common.getApiUrl() + url).pipe(map(
        (data: Scenario[]) => {
          this.scenarios = data;
        }
      ));
    }
  }

  getScenarioById(scenarioId: number): Scenario {
    let r: Scenario = null;
    this.scenarios.forEach( (scenario: Scenario) => {
      if (scenario.id === scenarioId) {
        r = scenario;
      }
    });
    return r;
  }

  getScenarioByOrder(order: number): Scenario {
    if (order >= this.getCount()) {
      return null;
    }
    return this.scenarios[order];
  }

  getCount(): number {
    return this.scenarios.length;
  }

}
