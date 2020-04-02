import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CommonService } from './common.service';

import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private commonService: CommonService) { }

  getCategories(): Observable<Category[]> {
    const url = '/categories';
    return this.commonService.getAPICaller(url).pipe(map(
      (data: Category[]) => {
        return data;
      }
    ));
  }
}
