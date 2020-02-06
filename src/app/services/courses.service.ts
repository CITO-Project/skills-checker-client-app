import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course } from '../models/course';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonService } from './common.service';
import { Result } from '../models/result';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private httpClient: HttpClient, private commonService: CommonService) { }

  loadCourses(
    results: Result,
    location?: string
    ): Observable<Course[]> {
    const querry: string[] = [];
    if (!!results) {
      if (!!results.literacy) {
        querry.push('literacyLvl=' + results.literacy.level);
      }
      if (!!results.numeracy) {
        querry.push('numeracyLvl=' + results.numeracy.level);
      }
      if (!!results.digital_skills) {
        querry.push('digitalSkillsLvl=' + results.digital_skills.level);
      }
    }
    if (!!location) {
      querry.push('location=' + location);
    }
    let url = '/courses';
    if (querry.length > 0) {
      url += '?';
      querry.forEach( (field: string) => {
        url += field + '&';
      });
    }
    return this.httpClient.get(this.commonService.getApiUrl() + url)
      .pipe(map( (data: Course[]) => {
        data.map( (course: Course) => {
          course.priority = results[course.skill].priority;
        });
        return data;
      })
    );
  }
}
