import { Component, OnInit } from '@angular/core';
import { TestResultsService } from 'src/app/services/test-results.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-orientation-screen',
  templateUrl: './orientation-screen.component.html',
  styleUrls: ['./orientation-screen.component.scss']
})
export class OrientationScreenComponent implements OnInit {

  constructor(private testResults: TestResultsService, private productService: ProductService) { }

  ngOnInit() {
    if (!this.testResults.getProduct()) {
      this.productService.setProduct();
    }
  }

}
