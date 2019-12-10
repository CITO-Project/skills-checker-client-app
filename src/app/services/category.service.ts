import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient, private common: CommonService) { }

  getCategories(): Observable<Category[]> {
    const url = '/categories';
    return this.http.get( this.common.getApiUrl() + url ).pipe(map(
      (data: Category[]) => {
        return data;
      }
    ));
  }
}
