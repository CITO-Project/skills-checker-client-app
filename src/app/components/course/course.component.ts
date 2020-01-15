import { Component, OnInit, Input } from '@angular/core';
import { Course } from 'src/app/models/course';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {

  @Input() course: Course;

  constructor(public commonService: CommonService) { }

  ngOnInit() {
  }

  loadLink(link: string): void {
    this.commonService.loadLink(link);
  }

}
