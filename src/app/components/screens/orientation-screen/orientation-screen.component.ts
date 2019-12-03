import { Component, OnInit } from '@angular/core';
import { DataLogService } from 'src/app/services/data-log.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-orientation-screen',
  templateUrl: './orientation-screen.component.html',
  styleUrls: ['./orientation-screen.component.scss']
})
export class OrientationScreenComponent implements OnInit {

  constructor(private dataLogService: DataLogService, private productService: ProductService) { }

  ngOnInit() {
    if (!this.dataLogService.getProduct()) {
      this.productService.setProduct();
    }
  }

}
