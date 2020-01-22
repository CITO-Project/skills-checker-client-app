import { Component,
 OnInit } from '@angular/core';
import { CoursesService } from 'src/app/services/courses.service';
import { Course } from 'src/app/models/course';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-localization-screen',

  templateUrl: './localization-screen.component.html',

  styleUrls: ['./localization-screen.component.scss']
})
export class LocalizationScreenComponent implements OnInit {

  public IRELAND_COUNTIES = [
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

  private courses: Course[] = [];
  public filteredCourses: Course[] = [];
  private selectedCounty = '';

  constructor(private courseService: CoursesService, private commonService: CommonService) { }

  ngOnInit() {
    this.courseService.loadCourses().subscribe( () => {
      this.courses = this.courseService.getCourses();
      this.updateCourses();
    });
  }

  setCounty(county: string) {
    this.selectedCounty = county;
    this.updateCourses();
  }

  updateCourses() {
    if (this.selectedCounty === 'all') {
      this.filteredCourses = this.courses;
    } else {
      this.filteredCourses = [];
      this.courses.forEach( (course: Course) => {
        if (course.area === this.selectedCounty) {
          this.filteredCourses.push(course);
        }
      });
    }
  }

  loadLink(link: string) {
    this.commonService.loadLink(link);
  }

}
