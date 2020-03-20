import { Component, OnInit } from '@angular/core';

import { Product } from 'src/app/models/product';

import { DataLogService } from 'src/app/services/data-log.service';
import { ProductService } from 'src/app/services/product.service';
import { CommonService } from 'src/app/services/common.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@Component({
  selector: 'app-orientation-screen',
  templateUrl: './orientation-screen.component.html',
  styleUrls: ['./orientation-screen.component.scss']
})
export class OrientationScreenComponent implements OnInit {

  private readonly DEFAULT_IMAGE = 'orientation.png';
  private readonly DEFAULT_VIDEO = 'default.mp4';

  public currentResource: string;
  public addReplay: boolean;

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
    this.currentResource = this.DEFAULT_IMAGE;
    this.addReplay = false;
    this.dataLogService.initializeLog();
    this.productService.getProduct().subscribe(
      (product: Product) => {
        this.dataLogService.setProduct(product);
      }
    );
    this.googleAnalyticsService.stopTimer('time_review_results');
  }

  getPath(name: string): string {
    return this.commonService.getIconPath(name);
  }

  onClick(): void {
    this.googleAnalyticsService.restartTimer('time_select_interest');
    this.commonService.goTo('categories');
  }

  loadVideo(): void {
    if (this.currentResource !== this.DEFAULT_VIDEO) {
      this.currentResource = this.DEFAULT_VIDEO;
      this.addReplay = true;
    }
  }

}
