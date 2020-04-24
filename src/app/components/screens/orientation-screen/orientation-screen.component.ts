import { Component, OnInit } from '@angular/core';

import { Product } from 'src/app/models/product';
import { QuestionOrder } from 'src/app/models/question-order';

import { DataLogService } from 'src/app/services/data/data-log.service';
import { ProductService } from 'src/app/services/api-call/product.service';
import { CommonService } from 'src/app/services/common.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
import { QuestionOrderService } from 'src/app/services/api-call/question-order.service';

@Component({
  selector: 'app-orientation-screen',
  templateUrl: './orientation-screen.component.html',
  styleUrls: ['./orientation-screen.component.scss']
})
export class OrientationScreenComponent implements OnInit {

  private readonly DEFAULT_IMAGE = 'orientation.png';
  private readonly DEFAULT_VIDEO = 'how-to.mp4';

  public currentResource: string;
  public addReplay: boolean;
  public isVideoLoaded = false;

  public FEATURES = [
    {
      text: 'Computers',
      icon: this.getPath('computers.svg'),
      color: 'red'
    },
    {
      text: 'Maths',
      icon: this.getPath('maths.svg'),
      color: 'green'
    },
    {
      text: 'Reading and Writing',
      icon: this.getPath('reading.svg'),
      color: 'yellow'
    }
  ];

  constructor(
    private dataLogService: DataLogService,
    private productService: ProductService,
    private questionOrderService: QuestionOrderService,
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
    this.questionOrderService.getQuestionOrder().subscribe(
      (questionOrder: QuestionOrder[]) => {
        this.dataLogService.setQuestionOrder(questionOrder);
      }
    )
    this.googleAnalyticsService.stopTimer('time_review_results');
    const _temp = new Image()
    _temp.src = this.getPath('lock.svg');
  }

  getPath(name: string): string {
    return this.commonService.getIconPath(name);
  }

  onClick(): void {
    this.googleAnalyticsService.restartTimer('time_select_interest');
    this.commonService.goTo('interests');
  }

  loadVideo(): void {
    if (this.currentResource !== this.DEFAULT_VIDEO) {
      this.currentResource = this.DEFAULT_VIDEO;
      this.addReplay = true;
      this.isVideoLoaded = true;
    }
  }

}
