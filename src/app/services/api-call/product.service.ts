import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Product } from '../../models/product';

import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private commonService: CommonService) { }

  getProduct(): Observable<Product>  {
    const url = '/product';
    return this.commonService.getAPICaller(url)
      .pipe(map( (data: Product) => {
        return data;
      })
    );
  }

}
