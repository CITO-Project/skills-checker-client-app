import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { Course } from 'src/app/models/course';
import { Result } from 'src/app/models/result';

import { CoursesService } from 'src/app/services/api-call/courses.service';
import { CommonService } from 'src/app/services/common.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@Component({
  selector: 'app-localization-screen',

  templateUrl: './localization-screen.component.html',

  styleUrls: ['./localization-screen.component.scss']
})
export class LocalizationScreenComponent {

  public courses: Course[] = [];
  public REGIONS = [
    'Online',
    'Birkirkara',
    'Blata l-Bajda Adult Learning Centre',
    'Floriana',
    'Għajnsielem (Gozo)',
    'Ħal Far',
    'Mosta',
    'Paola',
    'Qormi',
    'Qormi Local Council',
    'Tarxien Adult Learning Centre',
    'Valletta',
    'Żebbuġ'
  ];
  public readonly buttons: {
    text: string,
    event: string,
    icon?: string,
    visible?: boolean,
    special?: boolean
  }[] = [
    {
      text: 'Back to results',
      event: 'goBack'
    }
  ];

  public results: Result;

  constructor(
    private courseService: CoursesService,
    private commonService: CommonService,
    private googleAnalyticsService: GoogleAnalyticsService) {
    const extras = this.commonService.getExtras();
    if (extras !== undefined && extras.state !== undefined) {
      this.results = extras.state as Result;
    } else {
      commonService.goTo('results');
    }
  }

  loadCourses(results: Result, location: string): Observable<Course[]> {
    return this.courseService.retrieveCourses(results, location);
  }

  setRegion(region: string) {
    this.updateCourses(region);
  }

  updateCourses(region: string = 'all') {
    const location = region === 'all' ? '' : region;
    this.googleAnalyticsService.addEvent('selected_location', location);
    this.loadCourses(this.results, location).subscribe( (courses: Course[]) => {
      this.courses = courses;
    });
  }

  getCourses(priority: string): Course[] {
    if (!this.courses) {
      return [];
    }
    return this.courses.filter( course => course.priority === priority);
  }

  loadLink(link: string) {
    this.commonService.loadLink(link);
  }

  onButtonsEvent(data: string): void {
    switch (data) {
      case 'goBack':
        this.commonService.goTo('results');
        break;
      case 'goSurveyEnglish':
        this.commonService.loadLink(this.commonService.getSurveyLink('en'));
        break;
      case 'goSurveyMaltese':
        this.commonService.loadLink(this.commonService.getSurveyLink('mt'));
        break;
    }
  }

}
