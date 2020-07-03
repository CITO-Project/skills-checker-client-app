import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Course } from 'src/app/models/course';

import { CoursesService } from 'src/app/services/api-call/courses.service';
import { CommonService } from 'src/app/services/common.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
import { Result } from 'src/app/models/result';
import { StringManagerService } from 'src/app/services/etc/string-manager.service';

@Component({
  selector: 'app-course-screen',
  templateUrl: './course-screen.component.html',
  styleUrls: ['./course-screen.component.scss']
})
export class CourseScreenComponent implements OnInit {

  private readonly TRANSLATIONS = {
    literacy: 'Lesing og skriving',
    numeracy: 'Matematikk',
    digital_skills: 'Data'
  }

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
  }

  loadCourse(courseid: number): void {
    this.courseService.loadCourse(courseid).subscribe( (course: Course) => {
      if (!!course) {
        course.skill = this.TRANSLATIONS[course.skill];
        this.course = course;
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
      'Mandag',
      'Tirsdag',
      'Onsdag',
      'Torsdag',
      'Fredag',
      'Lørdag',
      'Søndag'
    ];
    return days[day];
  }

  addSufix(day: number): string {
    return day + '';
  }

  getMonth(month: number): string {
    const months = [
      'Januar',
      'Februar',
      'Mars',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Desember'
    ];
    return months[month];
  }

  goBack(): void {
    this.commonService.goTo(this.fromLocation, this.results);
  }

}
