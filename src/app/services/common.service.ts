import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private apiUrl = 'http://localhost:3000/nala';


  constructor(private router: Router) { }

  // constructor(private httpHeaders: HttpHeaders) {
  //   httpHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
  //  }

  // getHttpHeaders(): HttpHeaders {
  //    return this.httpHeaders;
  //  }

  getApiUrl(): string {
    return this.apiUrl;
  }

  goTo(url: string): void {
    this.router.navigate([url]);
  }
}
