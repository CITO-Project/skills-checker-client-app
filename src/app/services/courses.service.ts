import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course } from '../models/course';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private courses: Course[];

  constructor(private httpClient: HttpClient, private commonService: CommonService) {
    this.resetCourses();
  }

  loadCourses(): Observable<void> {
    const url = '/courses';
    return this.httpClient.get(this.commonService.getApiUrl() + url)
      .pipe(map( (data: Course[]) => {
        this.courses = data;
      })
    );
  }

  getCourses(): Course[] {
    return this.courses;
  }

  resetCourses(): void {
    this.courses = [];
  }
}
