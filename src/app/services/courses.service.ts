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

  constructor(private httpClient: HttpClient, private commonService: CommonService) { }

  loadCourses(
    literacyLvl?: number,
    numeracyLvl?: number,
    digitalSkillsLvl?: number,
    location?: string
    ): Observable<Course[]> {
    const querry: string[] = [];
    if (!!literacyLvl) {
      querry.push('literacyLvl=' + literacyLvl);
    }
    if (!!numeracyLvl) {
      querry.push('numeracyLvl=' + numeracyLvl);
    }
    if (!!digitalSkillsLvl) {
      querry.push('digitalSkillsLvl=' + digitalSkillsLvl);
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
        return data;
      })
    );
  }
}
