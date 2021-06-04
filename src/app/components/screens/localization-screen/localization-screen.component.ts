import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Interest } from 'src/app/models/interest';
import { Course } from 'src/app/models/course';
import { Result } from 'src/app/models/result';

import { DataProcessingService } from 'src/app/services/data/data-processing.service';
import { CoursesService } from 'src/app/services/api-call/courses.service';
import { CommonService } from 'src/app/services/common.service';
import { DataLogService } from 'src/app/services/data/data-log.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@Component({
  selector: 'app-localization-screen',

  templateUrl: './localization-screen.component.html',

  styleUrls: ['./localization-screen.component.scss']
})
export class LocalizationScreenComponent implements OnInit {

  public interest: Interest;
  public courses: Course[] = [];
  public REGIONS = [
    'Online',
    'Carlow',
    'Cavan',
    'Clare',
    'Cork City',
    'Cork County',
    'Donegal',
    'Dublin North',
    'Dublin North County - Fingal',
    'Dublin South',
    'Dublin West County',
    'Dun Laoghaire - Rathdown',
    'Galway',
    'Kerry',
    'Kildare',
    'Kilkenny',
    'Laois',
    'Leitrim',
    'Limerick City',
    'Limerick County',
    'Longford',
    'Louth',
    'Mayo',
    'Meath',
    'Monaghan',
    'Offaly',
    'Roscommon',
    'Sligo',
    'Tipperary',
    'Waterford City',
    'Waterford County',
    'Westmeath',
    'Wexford',
    'Wicklow'
  ];

  public texts: {
    resultsText: string,
    learningPathwayDescription: string[]
  };

  public readonly LEARNING_PATHWAY_HEADER = 'My Learning Pathway';

  public results: Result;

  constructor(
    private courseService: CoursesService,
    public commonService: CommonService,
    private dataLogService: DataLogService,
    private dataProcessingService: DataProcessingService,
    private googleAnalyticsService: GoogleAnalyticsService) {
    const extras = this.commonService.getExtras();
    if (extras !== undefined && extras.state !== undefined) {
      this.results = extras.state as Result;
    } else {
      commonService.goTo('results');
    }
  }

  ngOnInit() {
    const log = this.dataLogService.getAll();
    this.interest = this.dataLogService.getInterest();
    this.results = this.dataProcessingService.getCoursesLevel(log);
    this.texts = this.dataProcessingService.getResultsText(log, this.results);

    this.setRegion( 'Online' );
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

  getPath(name: string): string {
    return this.commonService.getImagePath(name);
  }

}
