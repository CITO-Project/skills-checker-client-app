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
import { ChallengingScenario } from 'src/app/models/scenario-result';
import { Answer } from 'src/app/models/answer';

import { HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';

declare let ReadSpeaker: any ;
declare let rspkr: any ;

@Component({
  selector: 'app-results-screen',
  templateUrl: './results-screen.component.html',
  styleUrls: ['./results-screen.component.scss']
})
export class ResultsScreenComponent implements OnInit {

  env = environment;

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

    var scenarios:ChallengingScenario[] = new Array();
    for( var i=0; i<this.dataLogService.getScenarioCount(); i++ ){

      // EASY               == 3
      // A LITTLE DIFFICULT == 2
      // DIFFICULT          == 1
      // VERY DIFFICULT     == 0
      let scenario_difficulty = this.dataLogService.getAnswer(i, 0);

      let difficulty_str = (scenario_difficulty==0) ? 'very difficult' 
                            : (scenario_difficulty==1) ? 'difficult' 
                            : (scenario_difficulty==2) ? 'a little difficult' : 'easy';

      // If user selected value other than EASY (less that 3)
      if( scenario_difficulty != -1 && scenario_difficulty  < 3 ) {

        const scenario: ChallengingScenario = {
          name: this.dataLogService.getScenario(i).text,
          level: difficulty_str,
          aspect: new Array(),
          fluency: -1,
          confidence: -1,
          independence: -1
        }

          // 0 == None
          // 1 == reading and writing
          // 2 == Maths
          // 3 == Reading and Writing + Maths
          // 4 == Computers
          // 5 == Reading and Writing + Computers
          // 6 == Maths + Computers
          // 7 == Reading and Writing + Maths + Computers
          let aspect = this.dataLogService.getAnswer(i, 1);

          if( aspect == 1 ) {
            scenario.aspect.push( this.toObj( 'reading and writing', this.dataLogService.getQuestion(i, 1).answers[0] ) );
          }
          else if( aspect == 2) {
            scenario.aspect.push( this.toObj( 'maths', this.dataLogService.getQuestion(i, 1).answers[1] ) );
          }
          else if( aspect == 4 ) {
            scenario.aspect.push( this.toObj( 'computers', this.dataLogService.getQuestion(i, 1).answers[2] ) );
          }
          else if( aspect == 3 ) {
            scenario.aspect.push( this.toObj( 'reading and writing', this.dataLogService.getQuestion(i, 1).answers[0] ) );
            scenario.aspect.push( this.toObj( 'maths', this.dataLogService.getQuestion(i, 1).answers[1] ) );
          }
          else if( aspect == 5 ) {
            scenario.aspect.push( this.toObj( 'reading and writing', this.dataLogService.getQuestion(i, 1).answers[0] ) );
            scenario.aspect.push( this.toObj( 'computers', this.dataLogService.getQuestion(i, 1).answers[2] ) );
          }
          else if( aspect == 6 ) {
            scenario.aspect.push( this.toObj( 'maths', this.dataLogService.getQuestion(i, 1).answers[1] ) );
            scenario.aspect.push( this.toObj( 'computers', this.dataLogService.getQuestion(i, 1).answers[2] ) );
          }
          else if( aspect == 7 ) {
            scenario.aspect.push( this.toObj( 'reading and writing', this.dataLogService.getQuestion(i, 1).answers[0] ) );
            scenario.aspect.push( this.toObj( 'maths', this.dataLogService.getQuestion(i, 1).answers[1] ) );
            scenario.aspect.push( this.toObj( 'computers', this.dataLogService.getQuestion(i, 1).answers[2] ) );
          }

          // independence
          scenario.independence = this.dataLogService.getAnswer(i, 2);

          // confidence
          let conf_1 = this.dataLogService.getAnswer(i, 3);
          let conf_2 = this.dataLogService.getAnswer(i, 4);

          scenario.confidence = conf_1;

          // fluency
          let fluency_1 = this.dataLogService.getAnswer(i, 5);
          let fluency_2 = this.dataLogService.getAnswer(i, 6);

          scenario.fluency = fluency_1;
          
          scenarios.push( scenario );
        }
    }

    this.resultsSaverService.generateImage(
      this.resultsImage,
      this.HEADER,
      scenarios,
      $localize`:@@wellDone:Well done for completing your skills check! You have taken the first step towards achieving your goal to be:`,
      this.stringManagerService.correctText(this.interest.text),
      this.LEARNING_PATHWAY_HEADER,
      this.texts.learningPathwayDescription,
      this.courses);
  }

  toObj(skill: string, answer: Answer): any {

    let obj = { name: answer.text,
                skill: skill };

    return obj;
  }

  getCourses(priority: string): Course[] {
    if (!this.courses) {
      return [];
    }
    return this.courses.filter( course => course.priority === priority);
  }

  getReadSpeakerURL(readid: string): string {

    const baseURL = '//app-eu.readspeaker.com/cgi-bin/rsent';

    const params = new HttpParams()
                          .set( 'customerid', environment.readspeaker.id.toString() )
                          .set( 'lang', environment.readspeaker.lang )
                          .set( 'voice', environment.readspeaker.voice )
                          .set( 'readid', readid)
                          .set( 'url', encodeURIComponent('https://skillscheck.citoproject.eu/updates/'));

    return `${baseURL}?${params.toString()}`;
  }

}