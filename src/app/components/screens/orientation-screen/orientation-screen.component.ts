import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { Product } from 'src/app/models/product';
import { QuestionOrder } from 'src/app/models/question-order';

import { DataLogService } from 'src/app/services/data/data-log.service';
import { ProductService } from 'src/app/services/api-call/product.service';
import { CommonService } from 'src/app/services/common.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
import { QuestionOrderService } from 'src/app/services/api-call/question-order.service';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { faBookOpen, faCalculator, faLaptop, faPlay } from '@fortawesome/free-solid-svg-icons';

import { environment } from 'src/environments/environment';

declare let ReadSpeaker: any ;
declare let rspkr: any ;

@Component({
  selector: 'app-orientation-screen',
  templateUrl: './orientation-screen.component.html',
  styleUrls: ['./orientation-screen.component.scss']
})
export class OrientationScreenComponent implements OnInit {

  env = environment;
  
  faLaptop = faLaptop;
  faCalculator = faCalculator;
  faBookOpen = faBookOpen;
  faPlay = faPlay;

  private readonly DEFAULT_IMAGE = 'orientation-' + environment.locale + '.svg';
  private readonly DEFAULT_VIDEO = 'how-to-use-' + environment.locale + '.mp4';
  public readonly IMAGE_TEXT = [
    //'Welcome to Check In Take Off',
    // tslint:disable-next-line: max-line-length
    $localize`Hi! I'm Frank and I am your guide today.`,
    $localize`Watch our 'How to Use' video`, 
    $localize`- click the button below`];

  public currentResource: string;
  public mediaType: string;
  public addReplay: boolean;
  public isVideoLoaded = false;
  public isVideoPaused = false;

  /*
  public FEATURES = [
    {
      text: 'Computers',
      icon: this.getIconPath('computers.svg'),
      color: 'red'
    },
    {
      text: 'Maths',
      icon: this.getIconPath('maths.svg'),
      color: 'green'
    },
    {
      text: 'Reading and Writing',
      icon: this.getIconPath('reading.svg'),
      color: 'yellow'
    }
  ];
  */
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

  ngAfterContentInit() {
    ReadSpeaker.init();
    ReadSpeaker.q(function() {rspkr.ui.addClickEvents();});
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

  mediaLoaded(vgAPI: VgApiService): void {
    vgAPI.getDefaultMedia().subscriptions.playing.subscribe(
      () => this.isVideoPaused = false);
    vgAPI.getDefaultMedia().subscriptions.pause.subscribe(
      () => this.isVideoPaused = true);
  }

  getReadSpeakerURL(readid: string): string {

    const baseURL = '//app-eu.readspeaker.com/cgi-bin/rsent';

    const params = new HttpParams()
                          .set( 'customerid', environment.readspeaker.id.toString() )
                          .set( 'lang', environment.readspeaker.lang )
                          .set( 'voice', environment.readspeaker.voice )
                          .set( 'readid', readid)
                          .set( 'url', encodeURIComponent('https://skillscheck.citoproject.eu/updates/') );

    return `${baseURL}?${params.toString()}`;
  }

}
