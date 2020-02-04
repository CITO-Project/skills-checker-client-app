import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonService } from './common.service';

// tslint:disable-next-line:ban-types
declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  private times = {
    interest: {
      time: 0
    }
  };

  constructor(private router: Router, private commonService: CommonService) { }

  initializeGA(): void {
    this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      gtag('config', this.commonService.getGATrackID(),
        {
          page_path: event.urlAfterRedirects
        }
      );
      }
    }
  );
  }

  eventEmitter(
    eventName: string,
    eventCategory: string,
    eventLabel: string = null,
    eventValue: number = 2
  ) {
    console.log(arguments);
    gtag('event', eventName, {
      'event_category': eventCategory,
      'event_label': eventLabel,
      'value': eventValue
    });
  }

  sendEventInterestTime(time: number): void {
    this.eventEmitter('interest-time-seconds', 'interest', 'time', time)
  }

  startTimer(label: string): void {
    if (!!this.times[label]) {
      this.times[label].time = (new Date()).getTime();
    }
  }

  stopTimer(label: string): number {
    let r = 0;
    if (!!this.times[label]) {
      r = (new Date()).getTime() - this.times[label].time;
      this.times[label].time = 0;
    }
    return Math.floor(r / 1000);
  }

  startInterestTimer(): void {
    this.startTimer('interest');
  }

  stopInterestTimer(): void {
    const time = this.stopTimer('interest');
    this.sendEventInterestTime(time);
  }
}
