import { Component, OnInit } from '@angular/core';
import { DataLogService } from 'src/app/services/data-log.service';
import { DataProcessingService } from 'src/app/services/data-processing.service';
import { CommonService } from 'src/app/services/common.service';
import { CoursesService } from 'src/app/services/courses.service';
import { Course } from 'src/app/models/course';
import { Log } from 'src/app/models/log';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Result } from 'src/app/models/result';

@Component({
  selector: 'app-results-screen',
  templateUrl: './results-screen.component.html',
  styleUrls: ['./results-screen.component.scss']
})
export class ResultsScreenComponent implements OnInit {

  public courses: Course[];
  public results;

  constructor(
    private commonService: CommonService,
    private dataLogService: DataLogService,
    private coursesService: CoursesService,
    private dataProcessingService: DataProcessingService) { }

  ngOnInit() {
    if (
      this.dataLogService.getProduct() === null ||
      this.dataLogService.getCategory() === null ||
      this.dataLogService.getInterest() === null
    ) {
      this.commonService.goTo('');
    }
    this.results = this.dataProcessingService.getResults(this.dataLogService.getAll());
    this.loadCourses(this.results).subscribe( (courses: Course[]) => {
      this.courses = courses;
    });
  }

  loadCourses(results: Result): Observable<Course[]> {
    return this.coursesService.loadCourses(results);
  }

  loadLink(link: string): void {
    this.commonService.loadLink(link);
  }

  chooseArea(): void {
    this.commonService.goTo('localization', this.results);
  }

  selectNewInterest(): void {
    this.dataLogService.initializeLog();
    this.commonService.goTo('categories');
  }

  getPath(name: string): string {
    return this.commonService.getImagePath(name);
  }

  getCourses(priority: string): Course[] {
    if (!this.courses) {
      return [];
    }
    return this.courses.filter( course => course.priority === priority);
  }

}
