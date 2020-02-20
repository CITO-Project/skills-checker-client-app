import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { GoogleAnalyticsService } from './google-analytics.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private productName = 'nala';
  private apiUrl = 'http://localhost:3000/' + this.productName;
  private RESOURCE_PATH = 'assets/';
  private GATrackID = 'UA-157405394-1';


  constructor(private router: Router) { }

  // constructor(private httpHeaders: HttpHeaders) {
  //   httpHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
  //  }

  // getHttpHeaders(): HttpHeaders {
  //    return this.httpHeaders;
  //  }

  getProductName(): string {
    return this.productName;
  }

  getApiUrl(): string {
    return this.apiUrl;
  }

  getExtras(): NavigationExtras {
    return this.router.getCurrentNavigation().extras;
  }

  goTo(url: string, extras?: object): void {
    this.router.navigate(['/' + url], { state: extras });
  }

  log(...data: any): void {
    const currentdate = new Date();
    const datetime = '[' +
      this.addZeros('' + currentdate.getDate()) + '/' +
      this.addZeros('' + currentdate.getMonth() + 1)  + '/' +
      currentdate.getFullYear() + ' @ ' +
      this.addZeros('' + currentdate.getHours()) + ':' +
      this.addZeros('' + currentdate.getMinutes()) + ':' +
      this.addZeros('' + currentdate.getSeconds()) + '.' +
      this.addZeros('' + currentdate.getMilliseconds(), 3) + ']';
    console.log( datetime + ' >> ', (data !== undefined ? data : 'check') );
  }

  addZeros(value: string, nZeros: number = 2): string {
    if (value.length >= nZeros) {
      return value;
    } else {
      return this.addZeros('0' + value, nZeros);
    }
  }

  loadLink(link: string) {
    window.open(link, '_blank');
  }

  getPath(name: string, type: string): string {
    let r = '';
    const file = name.split('/').pop();
    switch (type) {
      case 'images':
      case 'icons':
      case 'resources':
        r = this.RESOURCE_PATH + type + '/' + file;
        break;
    }
    return r;
  }

  getIconPath(name: string): string {
    return this.getPath(name, 'icons');
  }

  getImagePath(name: string): string {
    return this.getPath(name, 'images');
  }

  getResourcePath(name: string): string {
    return this.getPath(name, 'resources');
  }

  getGATrackID(): string {
    return this.GATrackID;
  }

}
