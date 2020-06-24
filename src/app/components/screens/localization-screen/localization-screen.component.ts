import { Component, OnInit } from '@angular/core';
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
export class LocalizationScreenComponent implements OnInit {

  public courses: Course[] = [];
  public IRELAND_COUNTIES = [
    'Online',
    'Cork',
    'Dublin',
    'Limerick',
  ];

  private results: Result;

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

  ngOnInit() {
    if (sessionStorage.length > 0) {
      this.courses = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        this.courses.push(JSON.parse(sessionStorage.getItem(sessionStorage.key(i))));
      }
    } else {
      this.setCounty('all');
    }
  }

  loadCourses(results: Result, location: string): Observable<Course[]> {
    return this.courseService.retrieveCourses(results, location);
  }

  setCounty(county: string) {
    this.updateCourses(county);
  }

  updateCourses(county: string = 'all') {
    const location = county === 'all' ? '' : county;
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

}
