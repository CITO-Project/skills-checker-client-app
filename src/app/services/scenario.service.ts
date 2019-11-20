import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {

  constructor(private http: HttpClient, private common: CommonService) { }

  getScenarios(interestId: number) {
    return this.http.get(`${this.common.getApiUrl()}scenarios?filter[where][interest]=${interestId}&filter[fields][id]=true&filter[limit]=4`);
  }

  getScenario(scenarioId: number) {
    return this.http.get(`${this.common.getApiUrl()}scenarios/${scenarioId}`);
  }

}
