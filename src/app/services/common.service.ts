import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StringManagerService } from './etc/string-manager.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private readonly USE_CONSOLE_LOG = true;
  private readonly useAWSServer = true;

  private readonly localhostUrl = 'http://localhost';
  private readonly AWSUrl = 'https://skillscheck.citoproject.eu/';

  private productName = 'nala';
  private apiUrl = (this.useAWSServer ? this.AWSUrl + 'api/' : this.localhostUrl + ':3000/') + this.productName;
  private resourceFolderUrl = this.AWSUrl + 'static/';
  private RESOURCE_PATH = 'assets/';
  private GATrackID = 'UA-170127374-1';


  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private stringManagerService: StringManagerService
    ) { }

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

  logging(type: string, ...data) {
    if (this.USE_CONSOLE_LOG && ['log', 'error', 'warn', 'trace'].includes(type)) {
      const currentdate = new Date();
      const datetime = '[' +
        this.stringManagerService.addZeros('' + currentdate.getDate()) + '/' +
        this.stringManagerService.addZeros('' + currentdate.getMonth() + 1)  + '/' +
        currentdate.getFullYear() + ' @ ' +
        this.stringManagerService.addZeros('' + currentdate.getHours()) + ':' +
        this.stringManagerService.addZeros('' + currentdate.getMinutes()) + ':' +
        this.stringManagerService.addZeros('' + currentdate.getSeconds()) + '.' +
        this.stringManagerService.addZeros('' + currentdate.getMilliseconds(), 3) + ']';
      console.log(`%c${datetime} >> ${type}`, 'background-color: black; color: white;');
      let content: any;
      if (data.length > 0 && data[0].length > 0) {
        content = data[0];
      } else {
        content = 'check';
      }
      switch (type) {
        case 'log':
          console.log(data);
          break;
        case 'error':
          console.error(content);
          break;
        case 'warn':
          console.warn(content);
          break;
        case 'trace':
          // tslint:disable-next-line: no-console
          console.trace(content);
          break;
      }
    }
  }

  log(...data): void {
    this.logging('log', ...data);
  }

  error(...data): void {
    this.logging('error', data);
  }

  warn(...data): void {
    this.logging('warn', data);
  }

  trace(...data): void {
    this.logging('trace', data);
  }

  loadLink(link: string) {
    window.open(link, '_blank');
  }

  getPath(name: string, type: string): string {
    let r = '';
    switch (type) {
      case 'images':
      case 'icons':
      case 'balloons':
        r = this.RESOURCE_PATH + type + '/' + name;
        break;
      case 'resources':
        r = this.resourceFolderUrl + name;
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

  getBalloonsPath(name: string): string {
    return this.getPath(name, 'balloons');
  }

  getGATrackID(): string {
    return this.GATrackID;
  }

  getAPICaller(url: string): Observable<any> {
    return this.httpClient.get( this.getApiUrl() + url );
  }

}
