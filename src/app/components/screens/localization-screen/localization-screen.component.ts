import { Component, OnInit } from '@angular/core';
import { CoursesService } from 'src/app/services/courses.service';
import { Course } from 'src/app/models/course';
import { CommonService } from 'src/app/services/common.service';
import { Observable } from 'rxjs';

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

  private results;

  constructor(private courseService: CoursesService, private commonService: CommonService) {
    const extras = this.commonService.getExtras();
    if (extras !== undefined && extras.state !== undefined) {
      this.results = extras.state;
    } else {
      commonService.goTo('results');
    }
  }

  ngOnInit() {
    this.setCounty('all');
  }

  setCounty(county: string) {
    this.updateCourses(county);
  }

  updateCourses(county: string = 'all') {
    const location = county === 'all' ? '' : county;
    this.getCourses(location).subscribe( (courses: Course[]) => {
      this.setCourses(courses);
    });
  }

  getCourses(location?: string): Observable<Course[]> {
    return this.courseService.loadCourses(
      this.results['literacy'],
      this.results['numeracy'],
      this.results['digital_skills'],
      location
    );
  }

  setCourses(courses: Course[]): void {
    this.courses = courses;
  }

  loadLink(link: string) {
    this.commonService.loadLink(link);
  }

}
