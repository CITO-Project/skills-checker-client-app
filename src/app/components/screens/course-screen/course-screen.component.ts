import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Course } from 'src/app/models/course';
import { CoursesService } from 'src/app/services/courses.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-course-screen',
  templateUrl: './course-screen.component.html',
  styleUrls: ['./course-screen.component.scss']
})
export class CourseScreenComponent implements OnInit {

  public course: Course;

  constructor(private route: ActivatedRoute, private courseService: CoursesService, private commonService: CommonService) { }

  ngOnInit() {
    this.route.params.subscribe( (params: Params) => {
      if (Object.keys(params).length < 1 || !params.courseid || params.courseid < 1) {
        this.commonService.goTo('results');
      }
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
    const k = day % 100;
    if (j === 1 && k !== 11) {
        return day + 'st';
    }
    if (j === 2 && k !== 12) {
        return day + 'nd';
    }
    if (j === 3 && k !== 13) {
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

}
