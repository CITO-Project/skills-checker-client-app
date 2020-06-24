import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Course } from 'src/app/models/course';

import { CoursesService } from 'src/app/services/api-call/courses.service';
import { CommonService } from 'src/app/services/common.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@Component({
  selector: 'app-course-screen',
  templateUrl: './course-screen.component.html',
  styleUrls: ['./course-screen.component.scss']
})
export class CourseScreenComponent implements OnInit {

  public course: Course;

  constructor(
    private route: ActivatedRoute,
    private courseService: CoursesService,
    private commonService: CommonService,
    private googleAnalyticsService: GoogleAnalyticsService) { }

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

}
