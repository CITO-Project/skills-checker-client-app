import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class InterestService {

  constructor(private http: HttpClient, private common: CommonService) { }

  getInterests() {
        return this.http.get(this.common.getApiUrl() + 'interests');
  }
}