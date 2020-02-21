import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Product } from '../models/product';

import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClient, private common: CommonService) { }

  getProduct(): Observable<Product>  {
    const url = '/product';
    return this.httpClient.get(this.common.getApiUrl() + url)
      .pipe(map( (data: Product) => {
        return data;
      })
    );
  }

}
