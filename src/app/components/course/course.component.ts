import { Component, Input } from '@angular/core';
import { Course } from 'src/app/models/course';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent {

  @Input() course: Course;
  @Input() colour: string;

  constructor(public commonService: CommonService) { }

  loadLink(courseid: number): void {
    this.commonService.goTo(`course/${courseid}`);
  }

  getColour(skill: string): string {
    switch (skill) {
      case 'literacy':
        return 'green';
      case 'numeracy':
        return 'yellow';
      case 'digital_skills':
        return 'red';
      default:
        return 'blue';
    }
  }

}
