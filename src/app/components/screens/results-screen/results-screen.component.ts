import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Course } from 'src/app/models/course';
import { Result } from 'src/app/models/result';

import { DataProcessingService } from 'src/app/services/data/data-processing.service';
import { CommonService } from 'src/app/services/common.service';
import { CoursesService } from 'src/app/services/api-call/courses.service';
import { DataLogService } from 'src/app/services/data/data-log.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
import { ResultsSaverService } from 'src/app/services/data/results-saver.service';
import { ResultsVisualizationService } from 'src/app/services/data/results-visualization.service';
import { ResultsProcessingService } from 'src/app/services/data/results-processing.service';

@Component({
  selector: 'app-results-screen',
  templateUrl: './results-screen.component.html',
  styleUrls: ['./results-screen.component.scss']
})
export class ResultsScreenComponent implements OnInit {

  public resultsText;
  public readonly HEADER = 'Check-In Take-Off';
  public readonly SUBTITLE = 'My Results';
  public readonly LEARNING_PATHWAY_HEADER = 'My Learning Pathway';
  public readonly LEARNING_PATHWAY = 'If you want to develop your digital skills, try one of these courses below:';

  public courses: Course[];
  public results: Result;
  public resultsImage: string;

  constructor(
    private commonService: CommonService,
    private dataLogService: DataLogService,
    private coursesService: CoursesService,
    private dataProcessingService: DataProcessingService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private resultsSaverService: ResultsSaverService,
    private resultsVisualizationService: ResultsVisualizationService,
    private resultsProcessingService: ResultsProcessingService) { }

  ngOnInit() {
    if (
      this.dataLogService.getProduct() === null ||
      this.dataLogService.getInterest() === null
    ) {
      this.commonService.goTo('');
    }
    const log = this.dataLogService.getAll();
    this.results = this.dataProcessingService.getResults(log);
    this.resultsVisualizationService.generateGraph(log)
      .then( (imgData: string) => this.resultsImage = imgData);
    this.loadCourses(this.results).subscribe( (courses: Course[]) => {
      this.courses = courses;
      this.googleAnalyticsService.stopTimer('time_answer_interest');
      this.googleAnalyticsService.stopTimer('time_answer_scenario');
      this.googleAnalyticsService.stopTimer('time_answer_question');
      this.googleAnalyticsService.stopCounter('count_corrected_questions_per_scenario');
      this.googleAnalyticsService.stopCounter('count_plays_per_scenario');

      this.googleAnalyticsService.startTimer('time_review_results', '' + this.dataLogService.getInterest().id);
    });
    this.resultsText = this.resultsProcessingService.generateText(log);
  }

  loadCourses(results: Result): Observable<Course[]> {
    return this.coursesService.retrieveCourses(results);
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
      this.resultsSaverService.generateImage(
        this.resultsImage,
        this.HEADER,
        this.resultsText,
        this.LEARNING_PATHWAY_HEADER,
        this.LEARNING_PATHWAY,
        this.courses);
  }

  getCourses(priority: string): Course[] {
    if (!this.courses) {
      return [];
    }
    return this.courses.filter( course => course.priority === priority);
  }

}
