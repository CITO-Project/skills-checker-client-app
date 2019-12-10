import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, private common: CommonService) { }

  getProduct(): Observable<Product>  {
    const url = '/product';
    return this.http.get(this.common.getApiUrl() + url)
      .pipe(map( (data: Product) => {
        return data;
      })
    );
  }
}
