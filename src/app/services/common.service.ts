import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private apiUrl = 'http://localhost:3000/nala';
  private RESOURCE_PATH = 'assets/';


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

  getExtras(): NavigationExtras {
    return this.router.getCurrentNavigation().extras;
  }

  goTo(url: string, extras?: object): void {
    this.router.navigate(['/' + url], { state: extras });
  }

  log(data?: any): void {
    const currentdate = new Date();
    const datetime = '[' +
      this.addZero(currentdate.getDate()) + '/' +
      this.addZero(currentdate.getMonth() + 1)  + '/' +
      currentdate.getFullYear() + ' @ ' +
      this.addZero(currentdate.getHours()) + ':' +
      this.addZero(currentdate.getMinutes()) + ':' +
      this.addZero(currentdate.getSeconds()) + '.' +
      this.addZeroMiliseconds(currentdate.getMilliseconds()) + ']';
    console.log( datetime + ' >> ', (data !== undefined ? data : 'check') );
  }

  addZero(value: number): string {
    return value < 10 ? '0' + value : '' + value;
  }

  addZeroMiliseconds(value: number): string {
    return value < 100 ? '0' + this.addZero(value) : '' + value;
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

}
