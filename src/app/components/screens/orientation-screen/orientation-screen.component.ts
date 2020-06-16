import { Component, OnInit } from '@angular/core';

import { Product } from 'src/app/models/product';
import { QuestionOrder } from 'src/app/models/question-order';

import { DataLogService } from 'src/app/services/data/data-log.service';
import { ProductService } from 'src/app/services/api-call/product.service';
import { CommonService } from 'src/app/services/common.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
import { QuestionOrderService } from 'src/app/services/api-call/question-order.service';
import { VgAPI } from 'videogular2/compiled/core';

@Component({
  selector: 'app-orientation-screen',
  templateUrl: './orientation-screen.component.html',
  styleUrls: ['./orientation-screen.component.scss']
})
export class OrientationScreenComponent implements OnInit {

  private readonly DEFAULT_IMAGE = 'orientation-no.svg';
  private readonly DEFAULT_VIDEO = 'how-to-use-no.mp4';
  private readonly IMAGE_TEXT = [
    'Velkommen til Check In Take Off',
    // tslint:disable-next-line: max-line-length
    'Hei! Jeg heter Petra og jeg skal være veilederen din i dag. Se “Hvordan bruke” videoen vår, jeg bistår deg i å finne dine ferdigheter og utdanningsmuligheter som kan passe for deg.'];

  public currentResource: string;
  public mediaType: string;
  public addReplay: boolean;
  public isVideoLoaded = false;
  public isVideoPaused = false;

  public FEATURES = [
    {
      text: 'Datamaskiner',
      icon: this.getIconPath('computers.svg'),
      color: 'red'
    },
    {
      text: 'Mattematikk',
      icon: this.getIconPath('maths.svg'),
      color: 'green'
    },
    {
      text: 'Lesing og skriving',
      icon: this.getIconPath('reading.svg'),
      color: 'yellow'
    }
  ];
  public PARTNERS = [
    {
      text: 'CITO',
      image: this.getImagePath('cito-logo.png')
    },
    {
      text: 'Erasmus',
      image: this.getImagePath('erasmus-logo.png')
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
    );
    this.googleAnalyticsService.stopTimer('time_review_results');
    const temp = new Image();
    temp.src = this.getIconPath('lock.svg');
  }

  getIconPath(name: string): string {
    return this.commonService.getIconPath(name);
  }

  getImagePath(name: string): string {
    return this.commonService.getImagePath(name);
  }

  onClick(): void {
    this.googleAnalyticsService.restartTimer('time_select_interest');
    this.commonService.goTo('interests');
  }

  loadVideo(): void {
    if (this.currentResource !== this.DEFAULT_VIDEO) {
      this.mediaType = '';
      this.currentResource = this.DEFAULT_VIDEO;
      this.addReplay = true;
      this.isVideoLoaded = true;
    }
  }

  mediaLoaded(vgAPI: VgAPI): void {
    vgAPI.getDefaultMedia().subscriptions.playing.subscribe(
      () => this.isVideoPaused = false);
    vgAPI.getDefaultMedia().subscriptions.pause.subscribe(
      () => this.isVideoPaused = true);
  }

}
