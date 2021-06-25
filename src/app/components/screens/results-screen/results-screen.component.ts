import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Course } from 'src/app/models/course';
import { Result } from 'src/app/models/result';

import { DataProcessingService } from 'src/app/services/data/data-processing.service';
import { StringManagerService} from 'src/app/services/etc/string-manager.service';
import { CommonService } from 'src/app/services/common.service';
import { CoursesService } from 'src/app/services/api-call/courses.service';
import { DataLogService } from 'src/app/services/data/data-log.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
import { ResultsSaverService } from 'src/app/services/data/results-saver.service';
import { ResultsVisualizationService } from 'src/app/services/data/results-visualization.service';
import { map } from 'rxjs/operators';
import { Interest } from 'src/app/models/interest';

@Component({
  selector: 'app-results-screen',
  templateUrl: './results-screen.component.html',
  styleUrls: ['./results-screen.component.scss']
})
export class ResultsScreenComponent implements OnInit {

  public texts: {
    resultsText: string,
    learningPathwayDescription: string[]};
  public readonly HEADER = $localize`:@@appName:Check-In Take-Off`;
  public readonly SUBTITLE = $localize`My Results`;
  public readonly LEARNING_PATHWAY_HEADER = $localize`My Learning Pathway`;

  private readonly DEFAULT_IMAGE = 'orientation-ie.svg';

  public interest: Interest;
  public courses: Course[];
  public results: Result;
  public resultsImage: string;
  public currentResource: string;

  constructor(
    public commonService: CommonService,
    private stringManagerService: StringManagerService,
    private dataLogService: DataLogService,
    private coursesService: CoursesService,
    private dataProcessingService: DataProcessingService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private resultsSaverService: ResultsSaverService,
    private resultsVisualizationService: ResultsVisualizationService) { }

  ngOnInit() {
    if (
      this.dataLogService.getProduct() === null ||
      this.dataLogService.getInterest() === null
    ) {
      this.commonService.goTo('');
    }
    const log = this.dataLogService.getAll();

    this.currentResource = this.DEFAULT_IMAGE;
    
    this.interest = this.dataLogService.getInterest();
    this.results = this.dataProcessingService.getCoursesLevel(log);
    this.texts = this.dataProcessingService.getResultsText(log, this.results);
    this.resultsVisualizationService.generateGraph(log)
      .then( (imgData: string) => this.resultsImage = imgData);
    this.loadCourses(this.results).subscribe( (courses: Course[]) => {
      this.courses = courses;
      this.googleAnalyticsService.stopTimer('time_answer_interest');
      this.googleAnalyticsService.stopTimer('time_answer_scenario');
      this.googleAnalyticsService.stopTimer('time_answer_question');
      this.googleAnalyticsService.stopCounter('count_corrected_questions_per_scenario');
      this.googleAnalyticsService.stopCounter('count_plays_per_scenario');

      this.googleAnalyticsService.startTimer('time_review_results', '' + this.interest.id);
    });
  }

  loadCourses(results: Result): Observable<Course[]> {
    return this.coursesService.retrieveCourses(results, 'Online').pipe(
      map( (courses: Course[]) => {
        return courses.filter( (course: Course, index: number) => {
          return courses.findIndex( (currentCourse: Course) => {
            return currentCourse.skill === course.skill;
          }) === index;
        });
      })
    );
  }

  loadLink(link: string): void {
    this.commonService.loadLink(link);
  }

  chooseArea(): void {
    this.commonService.goTo('localization', this.results);
  }

  selectNewInterest(): void {
    this.dataLogService.initializeLog();
    this.googleAnalyticsService.stopTimer('time_review_results');
    this.commonService.goTo('interests');
  }

  getPath(name: string): string {
    return this.commonService.getImagePath(name);
  }

  saveResults(): void {

    var scenarios:string[] = new Array(4);
    for( var i=0; i<this.dataLogService.getScenarioCount(); i++ ){
      scenarios[i] = this.dataLogService.getScenario(i).text;
    }

    this.resultsSaverService.generateImage(
      this.resultsImage,
      this.HEADER,
      scenarios,
      $localize`:@@wellDone:Well done!` + ' ' + this.texts.resultsText,
      this.stringManagerService.correctText(this.interest.text),
      this.LEARNING_PATHWAY_HEADER,
      this.texts.learningPathwayDescription,
      this.courses);
  }

  getCourses(priority: string): Course[] {
    if (!this.courses) {
      return [];
    }
    return this.courses.filter( course => course.priority === priority);
  }

}
