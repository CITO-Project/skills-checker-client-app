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

  private category: Category;

  constructor(private http: HttpClient, private common: CommonService) { }

  getCategories(): Observable<Category[]> {
    const url = '/categories';
    return this.http.get( this.common.getApiUrl() + url ).pipe(map(
      (data: Category[]) => {
        return data;
      }
    ));
  }

  setCategory(category: Category): void {
    this.category = category;
  }

  getCategory(): Category {
    return {
      id: 3,
      product: 1,
      name: 'name',
      text: 'text',
      resource: 'resource',
      description: 'description'
    };
  }
}
