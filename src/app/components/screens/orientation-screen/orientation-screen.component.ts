import { Component, OnInit } from '@angular/core';
import { DataLogService } from 'src/app/services/data-log.service';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import { CommonService } from 'src/app/services/common.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@Component({
  selector: 'app-orientation-screen',
  templateUrl: './orientation-screen.component.html',
  styleUrls: ['./orientation-screen.component.scss']
})
export class OrientationScreenComponent implements OnInit {

  public FEATURES = [
    {
      text: 'Private',
      icon: this.getPath('key-emblem.svg'),
      color: 'blue'
    },
    {
      text: 'Safe',
      icon: this.getPath('laptop-checked.svg'),
      color: 'green'
    },
    {
      text: 'Secure',
      icon: this.getPath('lock.svg'),
      color: 'yellow'
    }
  ];

  constructor(
    private dataLogService: DataLogService,
    private productService: ProductService,
    private commonService: CommonService,
    private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.dataLogService.initializeLog();
    this.productService.getProduct().subscribe(
      (product: Product) => {
        this.dataLogService.setProduct(product);
      }
    );
  }

  getPath(name: string): string {
    return this.commonService.getIconPath(name);
  }

  onClick(): void {
    this.googleAnalyticsService.startInterestTimer();
    this.commonService.goTo('categories');
  }

}
