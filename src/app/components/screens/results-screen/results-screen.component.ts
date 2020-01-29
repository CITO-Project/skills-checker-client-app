import { Component, OnInit } from '@angular/core';
import { DataLogService } from 'src/app/services/data-log.service';
import { DataProcessingService } from 'src/app/services/data-processing.service';
import { CommonService } from 'src/app/services/common.service';
import { CoursesService } from 'src/app/services/courses.service';
import { Course } from 'src/app/models/course';

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
    this.coursesService.loadCourses(
      this.results['literacy'],
      this.results['numeracy'],
      this.results['digital_skills']
      ).subscribe( (courses: Course[]) => {
        this.courses = courses;
    });
  }

  loadLink(link: string): void {
    this.commonService.loadLink(link);
  }

  showAll(): void {
    this.commonService.goTo('localization', this.results);
  }

  selectNewInterest(): void {
    this.dataLogService.initializeLog();
    this.commonService.goTo('categories');
  }

  getPath(name: string): string {
    return this.commonService.getImagePath(name);
  }

  getCourses() {

  }

}
