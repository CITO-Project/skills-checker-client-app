import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course } from '../models/course';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private courses: Course[];

  constructor(private httpClient: HttpClient) {
    this.resetCourses();
  }

  loadCourses(): Observable<void> {
    const url = 'http://localhost:3000/courses';
    return this.httpClient.get(url).pipe(map(
      (data: Course[]) => {
        this.courses = data;
      }
    ));
  }

  getCourses(): Course[] {
    return this.courses;
  }

  resetCourses(): void {
    this.courses = [];
  }
}
