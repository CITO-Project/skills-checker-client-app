import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';

import { Course } from '../../models/course';
import { Result } from '../../models/result';

import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private commonService: CommonService) { }

  retrieveCourses(
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
    return this.commonService.getAPICaller(url)
      .pipe(map( (data: Course[]) => {
        data.map( (course: Course) => {
          course.priority = results[course.skill].priority;
        });
        return data;
      })
    );
  }

  loadCourse(courseid: number): Observable<Course> {
    const url = `/courses/${courseid}`;
    return this.commonService.getAPICaller(url);
  }
}
