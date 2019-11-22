import { Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private product: Product;

  constructor() { }

  getProduct(): Product  {
    return this.product;
  }

  setProduct() {
    this.product = {
      id: 1,
      name: 'nala',
      description: 'First version of SkillsChecker'
    };
  }
}
