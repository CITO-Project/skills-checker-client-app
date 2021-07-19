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

import { HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';

declare let ReadSpeaker: any ;
declare let rspkr: any ;

@Component({
  selector: 'app-localization-screen',

  templateUrl: './localization-screen.component.html',

  styleUrls: ['./localization-screen.component.scss']
})
export class LocalizationScreenComponent implements OnInit {

  env = environment;

  private location: string;
  public interest: Interest;
  public courses: Course[] = [];
  public REGIONS = environment.regions;

  public texts: {
    resultsText: string,
    learningPathwayDescription: string[]
  };

  public readonly LEARNING_PATHWAY_HEADER = $localize`My Learning Pathway`;

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

    this.location = this.dataLogService.getLocation();
    
    if( this.location == null ) {
      this.location = 'Online';
    }
    else {
      
    }

    this.setRegion( this.location );

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

  loadCourses(results: Result, location: string): Observable<Course[]> {
    return this.courseService.retrieveCourses(results, location);
  }

  setRegion(region: string) {
    this.updateCourses(region);
  }

  updateCourses(region: string = 'all') {
    const location = region === 'all' ? '' : region;
    this.dataLogService.setLocation( location );
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

  getReadSpeakerURL(readid: string): string {

    const baseURL = environment.readspeaker.baseurl;

    const params = new HttpParams()
                          .set( 'customerid', environment.readspeaker.id.toString() )
                          .set( 'lang', environment.readspeaker.lang )
                          .set( 'voice', environment.readspeaker.voice )
                          .set( 'readid', readid)
                          .set( 'url', encodeURIComponent('https://skillscheck.citoproject.eu/updates/'));

    return `${baseURL}?${params.toString()}`;
  }

}
