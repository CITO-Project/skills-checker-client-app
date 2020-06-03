import { Component, OnInit } from '@angular/core';

import { Product } from 'src/app/models/product';
import { QuestionOrder } from 'src/app/models/question-order';

import { DataLogService } from 'src/app/services/data/data-log.service';
import { ProductService } from 'src/app/services/api-call/product.service';
import { CommonService } from 'src/app/services/common.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
import { QuestionOrderService } from 'src/app/services/api-call/question-order.service';
import { VgAPI } from 'videogular2/compiled/core';
import { CanvasManagerService } from 'src/app/services/etc/canvas-manager.service';
import { StringManagerService } from 'src/app/services/etc/string-manager.service';

@Component({
  selector: 'app-orientation-screen',
  templateUrl: './orientation-screen.component.html',
  styleUrls: ['./orientation-screen.component.scss']
})
export class OrientationScreenComponent implements OnInit {

  private readonly DEFAULT_IMAGE = 'orientation.svg';
  private readonly DEFAULT_VIDEO = 'how-to.mp4';

  private readonly TEXT_FONT_FAMILY = 'Raleway';
  private readonly TEXT_FONT_FAMILY_SOURCE = 'https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwPIsWqhPAMif.woff2';
  private readonly IMAGE_TEXT = 'Hi! I\'m Frank and I am your guide today. Watch our \'How to Use\' video and I will help you check your skills and find learning options that work for you.'

  public currentResource: string;
  public mediaType: string;
  public addReplay: boolean;
  public isVideoLoaded = false;
  public isVideoPaused = false;

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
    private stringManagerService: StringManagerService,
    private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.mediaType = 'raw';
    this.currentResource = this.DEFAULT_IMAGE;
    this.addTextToImage().then( (imageData: string) => this.currentResource = imageData);
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
    temp.src = this.getPath('lock.svg');
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


  async addTextToImage(): Promise<string> {
    const multiplier = 10;
    const canvas = new CanvasManagerService(211 * multiplier, 375 * multiplier);
    await canvas.loadFont(this.TEXT_FONT_FAMILY, this.TEXT_FONT_FAMILY_SOURCE);
    canvas.setColour('#2E3C67');
    await canvas.printImageFromSource(this.commonService.getImagePath(`${this.DEFAULT_IMAGE}`), 0, 0, 375 * multiplier, 211 * multiplier);
    canvas.setX(375 * multiplier / 3);
    canvas.setY(40 * multiplier);
    canvas.setFont(15 * multiplier, 'bold');
    canvas.printLine('Welcome to Check In Take Off');
    canvas.setFont(15 * multiplier, 'normal');
    canvas.addY(20 * multiplier);
    this.stringManagerService.splitTextInLines(this.IMAGE_TEXT, 30).forEach( (text: string) => [
      canvas.printLine(text)
    ])
    return canvas.exportToData();
  }
}
