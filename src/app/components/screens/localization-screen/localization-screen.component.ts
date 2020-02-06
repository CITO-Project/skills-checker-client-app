import { Component, OnInit } from '@angular/core';
import { CoursesService } from 'src/app/services/courses.service';
import { Course } from 'src/app/models/course';
import { CommonService } from 'src/app/services/common.service';
import { Observable } from 'rxjs';
import { Result } from 'src/app/models/result';

@Component({
  selector: 'app-localization-screen',

  templateUrl: './localization-screen.component.html',

  styleUrls: ['./localization-screen.component.scss']
})
export class LocalizationScreenComponent implements OnInit {

  public courses: Course[] = [];
  public IRELAND_COUNTIES = [
    'Online',
    'Antrim',
    'Armagh',
    'Carlow',
    'Cavan',
    'Clare',
    'Cork',
    'Derry',
    'Donegal',
    'Down',
    'Dublin',
    'Fermanagh',
    'Galway',
    'Kerry',
    'Kildare',
    'Kilkenny',
    'Laois',
    'Leitrim',
    'Limerick',
    'Longford',
    'Louth',
    'Mayo',
    'Meath',
    'Monaghan',
    'Offaly',
    'Roscommon',
    'Sligo',
    'Tipperary',
    'Tyrone',
    'Waterford',
    'Westmeath',
    'Wexford',
    'Wicklow'
  ];

  private results: Result;

  constructor(private courseService: CoursesService, private commonService: CommonService) {
    const extras = this.commonService.getExtras();
    if (extras !== undefined && extras.state !== undefined) {
      this.results = extras.state as Result;
    } else {
      commonService.goTo('results');
    }
  }

  ngOnInit() {
    this.setCounty('all');
  }

  loadCourses(results: Result, location: string): Observable<Course[]> {
    return this.courseService.loadCourses(results, location);
  }

  setCounty(county: string) {
    this.updateCourses(county);
  }

  updateCourses(county: string = 'all') {
    const location = county === 'all' ? '' : county;
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
