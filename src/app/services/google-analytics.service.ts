import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonService } from './common.service';

// tslint:disable-next-line:ban-types
declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  private starts: {
    answer_interest: {
      id?: number,
      start?: number
    },
    answer_scenario: {
      id?: number,
      start?: number
    },
    answer_question: {
      id?: number,
      pedagogical_type?: string,
      start?: number
    },
    select_interest: {
      id?: number,
      start?: number
    },
    review_results_per_interest: {
      id?: number,
      start?: number
    },
    use_app: {
      start?: number
    }
  };

  private counters: {
    performed_clicks?: {
      count?: number
    },
    corrected_questions_per_scenario?: {
      id?: number,
      count?: number
    }
    video_play_times?: {
      id?: number,
      count?: number
    }
  };

  private EVENTS = [
    'finished_test',
    'skipped_test',
    'click_link',
    'click_course',
    'loaded_location',
    'selected_interest',
    'start_app'
  ];

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
    });
    this.initializeTrackers();
  }

  initializeTrackers(): void {
    this.starts = {
      answer_interest: {},
      answer_scenario: {},
      answer_question: {},
      select_interest: {},
      review_results_per_interest: {},
      use_app: {}
    };
    this.counters = {
      performed_clicks: {},
      corrected_questions_per_scenario: {},
      video_play_times: {}
    };
  }

  eventEmitter(
    eventName: string,
    eventValue: number = 1,
    eventLabel: string = null
  ) {
    console.log(arguments);
    gtag('event', eventName, {
      event_category: this.commonService.getProductName(),
      event_label: eventLabel,
      value: eventValue
    });
  }

  //#region Timer
  startTimer(action: string, label?: string, pedagogicalType?: string): void {
    if (!!this.starts[action]) {
      this.starts[action].start = (new Date()).getTime();
      this.starts[action].id = label;
      if (action === 'answer_question') {
        this.starts[action].pedagogical_type = pedagogicalType;
      }
    }
  }

  stopTimer(action: string): void {
    if (!!this.starts[action] && this.starts[action].start > -1) {
      const time = (new Date()).getTime() - this.starts[action].start.getTime();
      let actionQuestion = action;
      if (action === 'answer_question') {
        actionQuestion = 'answer_question_' + this.starts[action].pedagogical_type;
      }
      this.eventEmitter(actionQuestion, time, this.starts[action].id);
      this.starts[action].start = -1;
      this.starts[action].id = -1;
      this.starts[action].pedagogical_type = null;
    }
  }
  //#endregion

  //#region Counter
  restartCounter(action: string, label?: string): void {
    if (!!this.counters[action]) {
      this.counters[action].count = 0;
      this.counters[action].id = label;
    }
  }

  addCounter(action: string): void {
    if (!!this.counters[action]) {
      ++this.counters[action];
    }
  }

  stopCounter(action: string): void {
    if (!!this.counters[action]) {
      this.eventEmitter(action, this.counters[action]);
      this.restartCounter(action);
    }
  }
  //#endregion

  addEvent(action: string, label?: string): void {
    if (this.EVENTS.includes(action)) {
      this.eventEmitter(action, 1, label);
    }
  }
}
