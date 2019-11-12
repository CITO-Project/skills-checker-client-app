import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private apiUrl = 'http://localhost:3000/';


  constructor() { }

  // constructor(private httpHeaders: HttpHeaders) {
  //   httpHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
  //  }

  // getHttpHeaders(): HttpHeaders {
  //    return this.httpHeaders;
  //  }

  getApiUrl(): string {
    return this.apiUrl;
  }
}
