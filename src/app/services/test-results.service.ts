import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TestResultsService {

  private productid: number;
  private interestid: number;

  constructor() { }

  setProductId(productid: number) {
    this.productid = productid;
  }

  getProductId() {
    return this.productid;
  }

  setInterestId(interestid: number) {
    this.interestid = interestid;
  }

  getInterestId() {
    return this.interestid;
  }

}
