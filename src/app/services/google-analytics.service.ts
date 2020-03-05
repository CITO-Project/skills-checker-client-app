import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { CommonService } from './common.service';

// tslint:disable-next-line:ban-types
declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  private readonly GOOGLE_ANALYTICS_ENABLED = false;

  private starts: {
    time_answer_interest: {
      id?: number,
      start?: number
    },
    time_answer_scenario: {
      id?: number,
      start?: number
    },
    time_answer_question: {
      id?: number,
      pedagogical_type?: string,
      start?: number
    },
    time_select_interest: {
      id?: number,
      start?: number
    },
    time_review_results: {
      id?: number,
      start?: number
    },
    time_use_app: {
      start?: number
    }
  };

  private counters: {
    count_corrected_questions_per_scenario?: {
      id?: number,
      count?: number
    }
    count_plays_per_scenario?: {
      id?: number,
      count?: number
    }
  };

  private EVENTS = [
    'finished_test',
    'clicked_link',
    'selected_course',
    'selected_location',
    'selected_interest',
    'started_app',
    'started_test',
    'left_interest_at_level',
    'left_scenario_at_question_number'
  ];

  constructor(
    private router: Router,
    private commonService: CommonService
    ) { }

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
      time_answer_interest: {},
      time_answer_scenario: {},
      time_answer_question: {},
      time_select_interest: {},
      time_review_results: {},
      time_use_app: {}
    };
    this.counters = {
      count_corrected_questions_per_scenario: {},
      count_plays_per_scenario: {}
    };
  }

  eventEmitter(
    eventName: string,
    eventValue: number = 1,
    eventLabel: string = null
  ) {
    if (this.GOOGLE_ANALYTICS_ENABLED) {
      gtag('event', eventName, {
        event_category: this.commonService.getProductName(),
        event_label: eventLabel,
        value: eventValue
      });
    }
  }

  //#region Timer
  restartTimer(action: string, label?: string, pedagogicalType?: string): void {
    if (!!this.starts[action]) {
      this.starts[action].start = (new Date()).getTime();
      this.starts[action].id = label;
      if (action === 'time_answer_question') {
        this.starts[action].pedagogical_type = pedagogicalType;
      }
    }
  }

  startTimer(action: string, label?: string, pedagogicalType?: string): void {
    if (!!this.starts[action] && !(this.starts[action].start >= 0)) {
      this.restartTimer(action, label, pedagogicalType);
    }
  }

  stopTimer(action: string, label?: string): void {
    if (!!this.starts[action] && this.starts[action].start > -1) {
      if (!!label) {
        this.starts[action].id = label;
      }
      const time = Math.round(((new Date()).getTime() - this.starts[action].start) / 1000);
      let actionQuestion = action;
      if (action === 'time_answer_question') {
        actionQuestion = 'time_answer_question_' + this.starts[action].pedagogical_type;
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
    if (!!this.counters[action] && this.counters[action].count >= 0) {
      this.counters[action].count += 1;
    }
  }

  stopCounter(action: string): void {
    if (!!this.counters[action] && this.counters[action].count >= 0) {
      this.eventEmitter(action, this.counters[action].count, this.counters[action].id);
      this.counters[action].count = -1;
      this.counters[action].id = -1;
    }
  }
  //#endregion

  addEvent(action: string, label?: string, value: number = 1): void {
    if (this.EVENTS.includes(action)) {
      this.eventEmitter(action, value, label);
    }
  }
}
