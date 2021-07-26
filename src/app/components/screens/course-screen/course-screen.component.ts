import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Course } from 'src/app/models/course';

import { CoursesService } from 'src/app/services/api-call/courses.service';
import { CommonService } from 'src/app/services/common.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
import { Result } from 'src/app/models/result';
import { StringManagerService } from 'src/app/services/etc/string-manager.service';
import { faAt, faCalendarAlt, faMapMarkerAlt, faPhoneAlt, faUser, faLaptop, faCalculator, faBookOpen } from '@fortawesome/free-solid-svg-icons';

import { HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';

declare let ReadSpeaker: any ;
declare let rspkr: any ;

@Component({
  selector: 'app-course-screen',
  templateUrl: './course-screen.component.html',
  styleUrls: ['./course-screen.component.scss']
})
export class CourseScreenComponent implements OnInit {

  env = environment;

  faUser = faUser;
  faMarker = faMapMarkerAlt;
  faPhone = faPhoneAlt;
  faAt = faAt;
  faCalendar = faCalendarAlt;
  icon;

  public course: Course;
  public fromLocation: string;
  public results: Result;

  constructor(
    private route: ActivatedRoute,
    private courseService: CoursesService,
    private commonService: CommonService,
    private googleAnalyticsService: GoogleAnalyticsService,
    public stringManagerService: StringManagerService) {
      const extras = commonService.getExtras();
      if (!!extras.state && !!extras.state.from && !!extras.state.results) {
        this.fromLocation = extras.state.from;
        this.results = extras.state.results;
      } else {
        this.fromLocation = 'results';
      }
    }

  ngOnInit() {
    this.route.params.subscribe( (params: Params) => {
      if (Object.keys(params).length < 1 || !params.courseid || params.courseid < 1) {
        this.commonService.goTo('results');
      }
      this.googleAnalyticsService.addEvent('selected_course', params.courseid);
      this.loadCourse(params.courseid);
    });

    // initialise ReadSpeaker
    ReadSpeaker.init();

    // stop play if it is already playing text from previous screen
    ReadSpeaker.q(
      function() {
        if (rspkr.ui.getActivePlayer()) {
          rspkr.ui.getActivePlayer().close();
        }
      });
  }

  ngAfterViewChecked() {
    // attach ReadSpeaker click event to buttons that have been dynamically added to page
    ReadSpeaker.q(function() {rspkr.ui.addClickEvents();});
  }

  loadCourse(courseid: number): void {
    this.courseService.loadCourse(courseid).subscribe( (course: Course) => {
      if (!!course) {
        this.course = course;
        this.course.skill = this.stringManagerService.TEXTS[course.skill];

        if (this.course.skill === "computer") {
          this.icon = faLaptop;
        }
        else if (this.course.skill === "maths") {
          this.icon = faCalculator;
        }
        else {
          this.icon = faBookOpen;
        }
      } else {
        this.commonService.goTo('results');
      }
    });
  }

  loadLink(link: string): void {
    this.commonService.loadLink(link);
  }

  formatDate(date: Date): string {
    date = new Date(date);
    if (!!date) {
      return `${this.getDayOfTheWeek(date.getDay())} ${this.addSufix(date.getDate())} ${this.getMonth(date.getMonth())}`;
    } else {
      return '';
    }
  }

  getDayOfTheWeek(day: number): string {
    const days = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thrusday',
      'Friday',
      'Saturday',
      'Sunday'
    ];
    return days[day];
  }

  addSufix(day: number): string {
    const j = day % 10;
    if (j === 1 && day !== 11) {
        return day + 'st';
    }
    if (j === 2 && day !== 12) {
        return day + 'nd';
    }
    if (j === 3 && day !== 13) {
        return day + 'rd';
    }
    return day + 'th';
  }

  getMonth(month: number): string {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    return months[month];
  }

  goBack(): void {
    this.commonService.goTo(this.fromLocation, this.results);
  }

  getReadSpeakerURL(readid: string): string {

    const baseURL = environment.readspeaker.baseurl;

    const params = new HttpParams()
                          .set( 'customerid', environment.readspeaker.id.toString() )
                          .set( 'lang', environment.readspeaker.lang )
                          .set( 'voice', environment.readspeaker.voice )
                          .set( 'readid', readid)
                          .set( 'url', encodeURIComponent(environment.api.host + '/updates/'));

    return `${baseURL}?${params.toString()}`;
  }

}
