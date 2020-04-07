import { Component, OnInit } from '@angular/core';

import { Product } from 'src/app/models/product';

import { DataLogService } from 'src/app/services/data-log.service';
import { ProductService } from 'src/app/services/product.service';
import { CommonService } from 'src/app/services/common.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
import { QuestionOrderService } from 'src/app/services/question-order.service';
import { QuestionOrder } from 'src/app/models/question-order';
import { ResultsSaverService } from 'src/app/services/results-saver.service';
import { Course } from 'src/app/models/course';

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
    private questionOrderService: QuestionOrderService,
    private commonService: CommonService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private resultsSaverService: ResultsSaverService) { }

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
    const _delete: {
      graphDataURI: string;
      resultsText: string;
      learningPathwayDescription: string;
      learningPathway: Course[]
    } = {
      graphDataURI: "data:image/png;base64,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qUPhEIAABPQKIED0+qN3CEAAAsYKIECMnToUDgEIQECvAAJErz96hwAEIGCsAALE2KlD4RCAAAT0CiBA9PqjdwhAAALGCiBAjJ06FA4BCEBArwACRK8/eocABCBgrAACxNipQ+EQgAAE9AogQPT6o3cIQAACxgogQIydOhQOAQhAQK8AAkSvP3qHAAQgYKwAAsTYqUPhEIAABPQKIED0+qN3CEAAAsYKIECMnToUDgEIQECvAAJErz96hwAEIGCsAALE2KlD4RCAAAT0CiBA9PqjdwhAAALGCiBAjJ06FA4BCEBArwACRK8/eocABCBgrAACxNipQ+EQgAAE9AogQPT6o3cIQAACxgogQIydOhQOAQhAQK8AAkSvP3qHAAQgYKwAAsTYqUPhEIAABPQKIED0+qN3CEAAAsYKIECMnToUDgEIQECvAAJErz96hwAEIGCsAALE2KlD4RCAAAT0CiBA9PqjdwhAAALGCiBAjJ06FA4BCEBArwACRK8/eocABCBgrAACxNipQ+EQgAAE9AogQPT6o3cIQAACxgogQIydOhQOAQhAQK8AAkSvP3qHAAQgYKwAAsTYqUPhEIAABPQKIED0+qN3CEAAAsYKIECMnToUDgEIQECvAAJErz96hwAEIGCsAALE2KlD4RCAAAT0CiBA9PqjdwhAAALGCiBAjJ06FA4BCEBArwACRK8/eocABCBgrAACxNipQ+EQgAAE9AogQPT6o3cIQAACxgogQIydOhQOAQhAQK8AAkSvP3qHAAQgYKwAAsTYqUPhEIAABPQKIED0+qN3CEAAAsYKIECMnToUDgEIQECvAAJErz96hwAEIGCsAALE2KlD4RCAAAT0CiBA9PqjdwhAAALGCiBAjJ06FA4BCEBArwACRK8/eocABCBgrAACxNipQ+EQgAAE9AogQPT6o3cIQAACxgogQIydOhQOAQhAQK8AAkSvP3qHAAQgYKwAAsTYqUPhEIAABPQKIED0+qN3CEAAAsYKIECMnToUDgEIQECvAAJErz96hwAEIGCsAALE2KlD4RCAAAT0CiBA9PqjdwhAAALGCiBAjJ06FA4BCEBArwACRK8/eocABCBgrAACxNipQ+EQgAAE9AogQPT6o3cIQAACxgogQIydOhQOAQhAQK8AAkSvP3qHAAQgYKwAAsTYqUPhEIAABPQKIED0+qN3CEAAAsYKIECMnToUDgEIQECvAAJErz96hwAEIGCsAALE2KlD4RCAAAT0CiBA9PqjdwhAAALGCiBAjJ06FA4BCEBArwACRK8/eocABCBgrAACxNipQ+EQgAAE9AogQPT6o3cIQAACxgogQIydOhQOAQhAQK8AAkSvP3qHAAQgYKwAAsTYqUPhEIAABPQKIED0+qN3CEAAAsYKIECMnToUDgEIQECvAAJErz96hwAEIGCsAALE2KlD4RCAAAT0CiBA9PqjdwhAAALGCiBAjJ06FA4BCEBArwACRK8/eocABCBgrAACxNipQ+EQgAAE9AogU0fTDwAAAsxJREFUQPT6o3cIQAACxgogQIydOhQOAQhAQK8AAkSvP3qHAAQgYKwAAsTYqUPhEIAABPQKIED0+qN3CEAAAsYKIECMnToUDgEIQECvAAJErz96hwAEIGCsAALE2KlD4RCAAAT0CiBA9PqjdwhAAALGCiBAjJ06FA4BCEBArwACRK8/eocABCBgrAACxNipQ+EQgAAE9AogQPT6o3cIQAACxgogQIydOhQOAQhAQK8AAkSvP3qHAAQgYKwAAsTYqUPhEIAABPQKIED0+qN3CEAAAsYKIECMnToUDgEIQECvAAJErz96hwAEIGCsAALE2KlD4RCAAAT0CiBA9PqjdwhAAALGCiBAjJ06FA4BCEBArwACRK8/eocABCBgrAACxNipQ+EQgAAE9AogQPT6o3cIQAACxgogQIydOhQOAQhAQK8AAkSvP3qHAAQgYKwAAsTYqUPhEIAABPQKIED0+qN3CEAAAsYKIECMnToUDgEIQECvAAJErz96hwAEIGCsAALE2KlD4RCAAAT0CiBA9PqjdwhAAALGCiBAjJ06FA4BCEBArwACRK8/eocABCBgrAACxNipQ+EQgAAE9AogQPT6o3cIQAACxgogQIydOhQOAQhAQK8AAkSvP3qHAAQgYKwAAsTYqUPhEIAABPQKIED0+qN3CEAAAsYKIECMnToUDgEIQECvAAJErz96hwAEIGCsAALE2KlD4RCAAAT0CiBA9PqjdwhAAALGCiBAjJ06FA4BCEBArwACRK8/eocABCBgrAACxNipQ+EQgAAE9AogQPT6o3cIQAACxgogQIydOhQOAQhAQK8AAkSvP3qHAAQgYKwAAsTYqUPhEIAABPQKIED0+qN3CEAAAsYKIECMnToUDgEIQECvAAJErz96hwAEIGCsAALE2KlD4RCAAAT0CiBA9PqjdwhAAALGCiBAjJ06FA4BCEBAr8D/D4bJeflLSffAAAAAAElFTkSuQmCC",
      resultsText: "An example of some additional text beside the balloons... in this space here!",
      learningPathwayDescription: "If you want to develop your digital skills, try one of these courses below:",
      learningPathway: [
        {
          "id": 1,
          "name": "literacy_1",
          "title": "Literacy",
          "description": "Improve your literacy",
          "text": "Sed hendrerit quam vel nibh mollis interdum. Nunc orci ligula, feugiat in viverra ut, porttitor eget mi. In hac habitasse platea dictumst. Nam eu finibus diam, in tristique dolor. Morbi viverra justo cursus, sodales nisi id, rutrum enim. Mauris convallis sapien ut vestibulum vulputate. Aliquam tempor neque ac velit tristique, nec posuere dolor lobortis. In et cursus elit, in consectetur nunc. Vestibulum mollis volutpat erat.\n\nVestibulum maximus sollicitudin nulla eu porttitor. Sed sed lorem nec justo sagittis hendrerit. Sed nec ante euismod, consequat risus vehicula, malesuada ex. Ut consectetur, ipsum non lacinia vulputate, justo urna fermentum ex, et feugiat ipsum tortor at erat. Curabitur a est vitae ligula facilisis vestibulum. Integer ullamcorper blandit dolor et placerat. Maecenas vitae metus maximus, gravida nunc quis, laoreet nibh.\n\nDonec in ligula mauris. Donec fringilla convallis magna, sit amet gravida diam condimentum et. Vestibulum luctus, purus at porta consequat, velit est finibus risus, et dictum risus lectus ut massa. Nulla vulputate nibh nisl, vitae sodales mi convallis at. Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque tincidunt, neque vel aliquam cursus, enim nunc elementum turpis, id vestibulum ligula nulla nec risus. Donec ac ex ipsum. Etiam sed libero ultricies, faucibus magna at, feugiat velit.\n\nSuspendisse accumsan libero nibh, sit amet feugiat neque volutpat at. Quisque consequat mauris a laoreet euismod. Donec elementum pulvinar porta. Cras mattis vestibulum sapien, a tempus nulla gravida a. Aenean id mauris a eros porta feugiat. Maecenas maximus ullamcorper risus, nec molestie massa gravida sed. Nulla pretium sit amet ex ornare sollicitudin. Nulla mattis feugiat enim, vitae blandit ligula ornare eget.\n\nSed eu est non velit pharetra porta. Praesent elit risus, rutrum et dui at, tincidunt imperdiet metus. Praesent eget dui nisl. Etiam metus magna, mattis consequat ex in, finibus tempor lorem. Aliquam feugiat faucibus turpis non ullamcorper. Nulla vel diam sit amet erat mollis vulputate eu vitae lacus. Ut sem orci, posuere molestie lectus at, luctus interdum lorem. Aenean egestas ut dui at tristique. Ut sodales ut elit ornare venenatis. Donec velit orci, sollicitudin eu maximus quis, placerat eu mauris. Mauris tempus suscipit risus, in semper ante fringilla non. ",
          "level": 1,
          "skill": "literacy",
          "location": "dublin",
          "date_start": new Date("2020-01-07T11:00:00.000Z"),
          "date_finish": new Date("2020-06-07T11:00:00.000Z"),
          "duration": "8 weeks",
          "frequency": "Every Tuesday from 2:00PM to 3:00PM",
          "address": "1 Abbey Street Lower, North City, Dublin",
          "link": "https://www.fetchcourses.ie/",
          "enrolment_start": new Date("2020-02-07T11:00:00.000Z"),
          "enrolment_finish": new Date("2021-02-07T11:00:00.000Z"),
          "contact_person": "Patrick Adams",
          "contact_telephone": "079 4487 6229",
          "contact_email": "PatrickAdams@gmail.com ",
          "product": 1,
          "priority": "brush_up"
        },
        {
          "id": 2,
          "name": "numeracy_1",
          "title": "Numeracy",
          "description": "Improve your numeracy",
          "text": "Ut tincidunt purus nulla, ac venenatis eros hendrerit eget. Cras id nibh sit amet mauris fringilla vehicula eget ac dolor. Mauris condimentum elementum massa, vel laoreet leo suscipit id. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer pulvinar diam id neque ornare, quis vehicula mi viverra. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed feugiat semper eros, ac euismod metus varius et. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris enim mauris, vehicula vel velit eu, rhoncus congue risus. Mauris efficitur sodales neque non blandit. Donec sed massa sapien.\n\nPellentesque congue urna in elit scelerisque dignissim. Nulla vitae mauris orci. Sed viverra nulla vel ipsum auctor fringilla. Phasellus lectus tortor, ullamcorper at faucibus id, lobortis id tellus. Integer ultricies tincidunt dui ac molestie. Phasellus tempus feugiat odio a gravida. Etiam eget massa ut arcu accumsan finibus ut sed massa. Nunc massa erat, bibendum ac diam non, maximus hendrerit purus. Nunc nec diam vel turpis venenatis tristique non consequat velit. Sed ultrices fringilla eros elementum dictum. Sed ut pulvinar neque. Cras venenatis consectetur erat eget dignissim. Suspendisse dignissim sagittis aliquet. Sed pellentesque tempor metus, sit amet convallis sem facilisis nec.\n\nAliquam elementum lectus vitae dapibus finibus. Sed tempor ex ac nulla vehicula, id posuere massa interdum. Curabitur maximus nibh pretium, vehicula urna nec, posuere tellus. Donec ornare nisi in tempus scelerisque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam cursus, quam vel auctor sodales, elit ipsum auctor purus, et mattis risus enim quis magna. Praesent venenatis erat a libero ornare, et suscipit orci laoreet. Duis ante nulla, rhoncus in vehicula nec, aliquam quis magna. Nunc ut ipsum vitae lorem finibus ultrices. Sed sit amet felis lacinia, luctus mauris vitae, luctus elit. Donec et justo sit amet nibh laoreet volutpat. Sed non pharetra tellus. In hac habitasse platea dictumst. Maecenas imperdiet felis quis tincidunt faucibus.\n\nNam et suscipit risus. Phasellus efficitur pretium dolor, congue varius lacus. Pellentesque et malesuada dui, eu facilisis leo. In accumsan tincidunt magna, at lacinia ipsum ultrices in. Nulla vitae fermentum lectus. Nulla facilisi. Proin mattis erat erat. Nulla euismod erat feugiat, vehicula odio a, ornare orci. Nulla aliquam sem at eros ultricies pellentesque. Donec ut est eleifend, tincidunt risus id, commodo tortor.\n\nCurabitur vestibulum maximus dolor, ac tempus turpis volutpat sed. Ut in euismod turpis, eu luctus tellus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris et sagittis odio. Ut varius varius condimentum. Praesent sit amet leo quam. Maecenas eu porta dolor, vel faucibus libero. Fusce vitae neque non sem facilisis auctor id efficitur lorem. ",
          "level": 1,
          "skill": "numeracy",
          "location": "laois",
          "date_start": new Date("2020-06-07T11:00:00.000Z"),
          "date_finish": new Date("2021-02-07T11:00:00.000Z"),
          "duration": "200 hours",
          "frequency": "Everyday from 7:00PM to 7:30PM",
          "address": "16 Molesworth Pl, Dublin 2",
          "link": "https://www.fetchcourses.ie/",
          "enrolment_start": new Date("2020-02-07T11:00:00.000Z"),
          "enrolment_finish": new Date("2021-02-07T11:00:00.000Z"),
          "contact_person": "Sofia Cole",
          "contact_telephone": "070 8260 8235",
          "contact_email": "SofiaCole@gmail.com",
          "product": 1,
          "priority": "brush_up"
        },
        {
          "id": 2,
          "name": "numeracy_1",
          "title": "Numeracy",
          "description": "Improve your numeracy",
          "text": "Ut tincidunt purus nulla, ac venenatis eros hendrerit eget. Cras id nibh sit amet mauris fringilla vehicula eget ac dolor. Mauris condimentum elementum massa, vel laoreet leo suscipit id. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer pulvinar diam id neque ornare, quis vehicula mi viverra. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed feugiat semper eros, ac euismod metus varius et. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris enim mauris, vehicula vel velit eu, rhoncus congue risus. Mauris efficitur sodales neque non blandit. Donec sed massa sapien.\n\nPellentesque congue urna in elit scelerisque dignissim. Nulla vitae mauris orci. Sed viverra nulla vel ipsum auctor fringilla. Phasellus lectus tortor, ullamcorper at faucibus id, lobortis id tellus. Integer ultricies tincidunt dui ac molestie. Phasellus tempus feugiat odio a gravida. Etiam eget massa ut arcu accumsan finibus ut sed massa. Nunc massa erat, bibendum ac diam non, maximus hendrerit purus. Nunc nec diam vel turpis venenatis tristique non consequat velit. Sed ultrices fringilla eros elementum dictum. Sed ut pulvinar neque. Cras venenatis consectetur erat eget dignissim. Suspendisse dignissim sagittis aliquet. Sed pellentesque tempor metus, sit amet convallis sem facilisis nec.\n\nAliquam elementum lectus vitae dapibus finibus. Sed tempor ex ac nulla vehicula, id posuere massa interdum. Curabitur maximus nibh pretium, vehicula urna nec, posuere tellus. Donec ornare nisi in tempus scelerisque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam cursus, quam vel auctor sodales, elit ipsum auctor purus, et mattis risus enim quis magna. Praesent venenatis erat a libero ornare, et suscipit orci laoreet. Duis ante nulla, rhoncus in vehicula nec, aliquam quis magna. Nunc ut ipsum vitae lorem finibus ultrices. Sed sit amet felis lacinia, luctus mauris vitae, luctus elit. Donec et justo sit amet nibh laoreet volutpat. Sed non pharetra tellus. In hac habitasse platea dictumst. Maecenas imperdiet felis quis tincidunt faucibus.\n\nNam et suscipit risus. Phasellus efficitur pretium dolor, congue varius lacus. Pellentesque et malesuada dui, eu facilisis leo. In accumsan tincidunt magna, at lacinia ipsum ultrices in. Nulla vitae fermentum lectus. Nulla facilisi. Proin mattis erat erat. Nulla euismod erat feugiat, vehicula odio a, ornare orci. Nulla aliquam sem at eros ultricies pellentesque. Donec ut est eleifend, tincidunt risus id, commodo tortor.\n\nCurabitur vestibulum maximus dolor, ac tempus turpis volutpat sed. Ut in euismod turpis, eu luctus tellus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris et sagittis odio. Ut varius varius condimentum. Praesent sit amet leo quam. Maecenas eu porta dolor, vel faucibus libero. Fusce vitae neque non sem facilisis auctor id efficitur lorem. ",
          "level": 1,
          "skill": "numeracy",
          "location": "laois",
          "date_start": new Date("2020-06-07T11:00:00.000Z"),
          "date_finish": new Date("2021-02-07T11:00:00.000Z"),
          "duration": "200 hours",
          "frequency": "Everyday from 7:00PM to 7:30PM",
          "address": "16 Molesworth Pl, Dublin 2",
          "link": "https://www.fetchcourses.ie/",
          "enrolment_start": new Date("2020-02-07T11:00:00.000Z"),
          "enrolment_finish": new Date("2021-02-07T11:00:00.000Z"),
          "contact_person": "Sofia Cole",
          "contact_telephone": "070 8260 8235",
          "contact_email": "SofiaCole@gmail.com",
          "product": 1,
          "priority": "brush_up"
        },
        {
          "id": 2,
          "name": "numeracy_1",
          "title": "Numeracy",
          "description": "Improve your numeracy",
          "text": "Ut tincidunt purus nulla, ac venenatis eros hendrerit eget. Cras id nibh sit amet mauris fringilla vehicula eget ac dolor. Mauris condimentum elementum massa, vel laoreet leo suscipit id. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer pulvinar diam id neque ornare, quis vehicula mi viverra. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed feugiat semper eros, ac euismod metus varius et. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris enim mauris, vehicula vel velit eu, rhoncus congue risus. Mauris efficitur sodales neque non blandit. Donec sed massa sapien.\n\nPellentesque congue urna in elit scelerisque dignissim. Nulla vitae mauris orci. Sed viverra nulla vel ipsum auctor fringilla. Phasellus lectus tortor, ullamcorper at faucibus id, lobortis id tellus. Integer ultricies tincidunt dui ac molestie. Phasellus tempus feugiat odio a gravida. Etiam eget massa ut arcu accumsan finibus ut sed massa. Nunc massa erat, bibendum ac diam non, maximus hendrerit purus. Nunc nec diam vel turpis venenatis tristique non consequat velit. Sed ultrices fringilla eros elementum dictum. Sed ut pulvinar neque. Cras venenatis consectetur erat eget dignissim. Suspendisse dignissim sagittis aliquet. Sed pellentesque tempor metus, sit amet convallis sem facilisis nec.\n\nAliquam elementum lectus vitae dapibus finibus. Sed tempor ex ac nulla vehicula, id posuere massa interdum. Curabitur maximus nibh pretium, vehicula urna nec, posuere tellus. Donec ornare nisi in tempus scelerisque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam cursus, quam vel auctor sodales, elit ipsum auctor purus, et mattis risus enim quis magna. Praesent venenatis erat a libero ornare, et suscipit orci laoreet. Duis ante nulla, rhoncus in vehicula nec, aliquam quis magna. Nunc ut ipsum vitae lorem finibus ultrices. Sed sit amet felis lacinia, luctus mauris vitae, luctus elit. Donec et justo sit amet nibh laoreet volutpat. Sed non pharetra tellus. In hac habitasse platea dictumst. Maecenas imperdiet felis quis tincidunt faucibus.\n\nNam et suscipit risus. Phasellus efficitur pretium dolor, congue varius lacus. Pellentesque et malesuada dui, eu facilisis leo. In accumsan tincidunt magna, at lacinia ipsum ultrices in. Nulla vitae fermentum lectus. Nulla facilisi. Proin mattis erat erat. Nulla euismod erat feugiat, vehicula odio a, ornare orci. Nulla aliquam sem at eros ultricies pellentesque. Donec ut est eleifend, tincidunt risus id, commodo tortor.\n\nCurabitur vestibulum maximus dolor, ac tempus turpis volutpat sed. Ut in euismod turpis, eu luctus tellus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris et sagittis odio. Ut varius varius condimentum. Praesent sit amet leo quam. Maecenas eu porta dolor, vel faucibus libero. Fusce vitae neque non sem facilisis auctor id efficitur lorem. ",
          "level": 1,
          "skill": "numeracy",
          "location": "laois",
          "date_start": new Date("2020-06-07T11:00:00.000Z"),
          "date_finish": new Date("2021-02-07T11:00:00.000Z"),
          "duration": "200 hours",
          "frequency": "Everyday from 7:00PM to 7:30PM",
          "address": "16 Molesworth Pl, Dublin 2",
          "link": "https://www.fetchcourses.ie/",
          "enrolment_start": new Date("2020-02-07T11:00:00.000Z"),
          "enrolment_finish": new Date("2021-02-07T11:00:00.000Z"),
          "contact_person": "Sofia Cole",
          "contact_telephone": "070 8260 8235",
          "contact_email": "SofiaCole@gmail.com",
          "product": 1,
          "priority": "brush_up"
        },
        {
          "id": 2,
          "name": "numeracy_1",
          "title": "Numeracy",
          "description": "Improve your numeracy",
          "text": "Ut tincidunt purus nulla, ac venenatis eros hendrerit eget. Cras id nibh sit amet mauris fringilla vehicula eget ac dolor. Mauris condimentum elementum massa, vel laoreet leo suscipit id. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer pulvinar diam id neque ornare, quis vehicula mi viverra. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed feugiat semper eros, ac euismod metus varius et. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris enim mauris, vehicula vel velit eu, rhoncus congue risus. Mauris efficitur sodales neque non blandit. Donec sed massa sapien.\n\nPellentesque congue urna in elit scelerisque dignissim. Nulla vitae mauris orci. Sed viverra nulla vel ipsum auctor fringilla. Phasellus lectus tortor, ullamcorper at faucibus id, lobortis id tellus. Integer ultricies tincidunt dui ac molestie. Phasellus tempus feugiat odio a gravida. Etiam eget massa ut arcu accumsan finibus ut sed massa. Nunc massa erat, bibendum ac diam non, maximus hendrerit purus. Nunc nec diam vel turpis venenatis tristique non consequat velit. Sed ultrices fringilla eros elementum dictum. Sed ut pulvinar neque. Cras venenatis consectetur erat eget dignissim. Suspendisse dignissim sagittis aliquet. Sed pellentesque tempor metus, sit amet convallis sem facilisis nec.\n\nAliquam elementum lectus vitae dapibus finibus. Sed tempor ex ac nulla vehicula, id posuere massa interdum. Curabitur maximus nibh pretium, vehicula urna nec, posuere tellus. Donec ornare nisi in tempus scelerisque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam cursus, quam vel auctor sodales, elit ipsum auctor purus, et mattis risus enim quis magna. Praesent venenatis erat a libero ornare, et suscipit orci laoreet. Duis ante nulla, rhoncus in vehicula nec, aliquam quis magna. Nunc ut ipsum vitae lorem finibus ultrices. Sed sit amet felis lacinia, luctus mauris vitae, luctus elit. Donec et justo sit amet nibh laoreet volutpat. Sed non pharetra tellus. In hac habitasse platea dictumst. Maecenas imperdiet felis quis tincidunt faucibus.\n\nNam et suscipit risus. Phasellus efficitur pretium dolor, congue varius lacus. Pellentesque et malesuada dui, eu facilisis leo. In accumsan tincidunt magna, at lacinia ipsum ultrices in. Nulla vitae fermentum lectus. Nulla facilisi. Proin mattis erat erat. Nulla euismod erat feugiat, vehicula odio a, ornare orci. Nulla aliquam sem at eros ultricies pellentesque. Donec ut est eleifend, tincidunt risus id, commodo tortor.\n\nCurabitur vestibulum maximus dolor, ac tempus turpis volutpat sed. Ut in euismod turpis, eu luctus tellus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris et sagittis odio. Ut varius varius condimentum. Praesent sit amet leo quam. Maecenas eu porta dolor, vel faucibus libero. Fusce vitae neque non sem facilisis auctor id efficitur lorem. ",
          "level": 1,
          "skill": "numeracy",
          "location": "laois",
          "date_start": new Date("2020-06-07T11:00:00.000Z"),
          "date_finish": new Date("2021-02-07T11:00:00.000Z"),
          "duration": "200 hours",
          "frequency": "Everyday from 7:00PM to 7:30PM",
          "address": "16 Molesworth Pl, Dublin 2",
          "link": "https://www.fetchcourses.ie/",
          "enrolment_start": new Date("2020-02-07T11:00:00.000Z"),
          "enrolment_finish": new Date("2021-02-07T11:00:00.000Z"),
          "contact_person": "Sofia Cole",
          "contact_telephone": "070 8260 8235",
          "contact_email": "SofiaCole@gmail.com",
          "product": 1,
          "priority": "brush_up"
        },
        {
          "id": 2,
          "name": "numeracy_1",
          "title": "Numeracy",
          "description": "Improve your numeracy",
          "text": "Ut tincidunt purus nulla, ac venenatis eros hendrerit eget. Cras id nibh sit amet mauris fringilla vehicula eget ac dolor. Mauris condimentum elementum massa, vel laoreet leo suscipit id. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer pulvinar diam id neque ornare, quis vehicula mi viverra. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed feugiat semper eros, ac euismod metus varius et. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris enim mauris, vehicula vel velit eu, rhoncus congue risus. Mauris efficitur sodales neque non blandit. Donec sed massa sapien.\n\nPellentesque congue urna in elit scelerisque dignissim. Nulla vitae mauris orci. Sed viverra nulla vel ipsum auctor fringilla. Phasellus lectus tortor, ullamcorper at faucibus id, lobortis id tellus. Integer ultricies tincidunt dui ac molestie. Phasellus tempus feugiat odio a gravida. Etiam eget massa ut arcu accumsan finibus ut sed massa. Nunc massa erat, bibendum ac diam non, maximus hendrerit purus. Nunc nec diam vel turpis venenatis tristique non consequat velit. Sed ultrices fringilla eros elementum dictum. Sed ut pulvinar neque. Cras venenatis consectetur erat eget dignissim. Suspendisse dignissim sagittis aliquet. Sed pellentesque tempor metus, sit amet convallis sem facilisis nec.\n\nAliquam elementum lectus vitae dapibus finibus. Sed tempor ex ac nulla vehicula, id posuere massa interdum. Curabitur maximus nibh pretium, vehicula urna nec, posuere tellus. Donec ornare nisi in tempus scelerisque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam cursus, quam vel auctor sodales, elit ipsum auctor purus, et mattis risus enim quis magna. Praesent venenatis erat a libero ornare, et suscipit orci laoreet. Duis ante nulla, rhoncus in vehicula nec, aliquam quis magna. Nunc ut ipsum vitae lorem finibus ultrices. Sed sit amet felis lacinia, luctus mauris vitae, luctus elit. Donec et justo sit amet nibh laoreet volutpat. Sed non pharetra tellus. In hac habitasse platea dictumst. Maecenas imperdiet felis quis tincidunt faucibus.\n\nNam et suscipit risus. Phasellus efficitur pretium dolor, congue varius lacus. Pellentesque et malesuada dui, eu facilisis leo. In accumsan tincidunt magna, at lacinia ipsum ultrices in. Nulla vitae fermentum lectus. Nulla facilisi. Proin mattis erat erat. Nulla euismod erat feugiat, vehicula odio a, ornare orci. Nulla aliquam sem at eros ultricies pellentesque. Donec ut est eleifend, tincidunt risus id, commodo tortor.\n\nCurabitur vestibulum maximus dolor, ac tempus turpis volutpat sed. Ut in euismod turpis, eu luctus tellus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris et sagittis odio. Ut varius varius condimentum. Praesent sit amet leo quam. Maecenas eu porta dolor, vel faucibus libero. Fusce vitae neque non sem facilisis auctor id efficitur lorem. ",
          "level": 1,
          "skill": "numeracy",
          "location": "laois",
          "date_start": new Date("2020-06-07T11:00:00.000Z"),
          "date_finish": new Date("2021-02-07T11:00:00.000Z"),
          "duration": "200 hours",
          "frequency": "Everyday from 7:00PM to 7:30PM",
          "address": "16 Molesworth Pl, Dublin 2",
          "link": "https://www.fetchcourses.ie/",
          "enrolment_start": new Date("2020-02-07T11:00:00.000Z"),
          "enrolment_finish": new Date("2021-02-07T11:00:00.000Z"),
          "contact_person": "Sofia Cole",
          "contact_telephone": "070 8260 8235",
          "contact_email": "SofiaCole@gmail.com",
          "product": 1,
          "priority": "brush_up"
        },
        {
          "id": 2,
          "name": "numeracy_1",
          "title": "Numeracy",
          "description": "Improve your numeracy",
          "text": "Ut tincidunt purus nulla, ac venenatis eros hendrerit eget. Cras id nibh sit amet mauris fringilla vehicula eget ac dolor. Mauris condimentum elementum massa, vel laoreet leo suscipit id. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer pulvinar diam id neque ornare, quis vehicula mi viverra. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed feugiat semper eros, ac euismod metus varius et. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris enim mauris, vehicula vel velit eu, rhoncus congue risus. Mauris efficitur sodales neque non blandit. Donec sed massa sapien.\n\nPellentesque congue urna in elit scelerisque dignissim. Nulla vitae mauris orci. Sed viverra nulla vel ipsum auctor fringilla. Phasellus lectus tortor, ullamcorper at faucibus id, lobortis id tellus. Integer ultricies tincidunt dui ac molestie. Phasellus tempus feugiat odio a gravida. Etiam eget massa ut arcu accumsan finibus ut sed massa. Nunc massa erat, bibendum ac diam non, maximus hendrerit purus. Nunc nec diam vel turpis venenatis tristique non consequat velit. Sed ultrices fringilla eros elementum dictum. Sed ut pulvinar neque. Cras venenatis consectetur erat eget dignissim. Suspendisse dignissim sagittis aliquet. Sed pellentesque tempor metus, sit amet convallis sem facilisis nec.\n\nAliquam elementum lectus vitae dapibus finibus. Sed tempor ex ac nulla vehicula, id posuere massa interdum. Curabitur maximus nibh pretium, vehicula urna nec, posuere tellus. Donec ornare nisi in tempus scelerisque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam cursus, quam vel auctor sodales, elit ipsum auctor purus, et mattis risus enim quis magna. Praesent venenatis erat a libero ornare, et suscipit orci laoreet. Duis ante nulla, rhoncus in vehicula nec, aliquam quis magna. Nunc ut ipsum vitae lorem finibus ultrices. Sed sit amet felis lacinia, luctus mauris vitae, luctus elit. Donec et justo sit amet nibh laoreet volutpat. Sed non pharetra tellus. In hac habitasse platea dictumst. Maecenas imperdiet felis quis tincidunt faucibus.\n\nNam et suscipit risus. Phasellus efficitur pretium dolor, congue varius lacus. Pellentesque et malesuada dui, eu facilisis leo. In accumsan tincidunt magna, at lacinia ipsum ultrices in. Nulla vitae fermentum lectus. Nulla facilisi. Proin mattis erat erat. Nulla euismod erat feugiat, vehicula odio a, ornare orci. Nulla aliquam sem at eros ultricies pellentesque. Donec ut est eleifend, tincidunt risus id, commodo tortor.\n\nCurabitur vestibulum maximus dolor, ac tempus turpis volutpat sed. Ut in euismod turpis, eu luctus tellus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris et sagittis odio. Ut varius varius condimentum. Praesent sit amet leo quam. Maecenas eu porta dolor, vel faucibus libero. Fusce vitae neque non sem facilisis auctor id efficitur lorem. ",
          "level": 1,
          "skill": "numeracy",
          "location": "laois",
          "date_start": new Date("2020-06-07T11:00:00.000Z"),
          "date_finish": new Date("2021-02-07T11:00:00.000Z"),
          "duration": "200 hours",
          "frequency": "Everyday from 7:00PM to 7:30PM",
          "address": "16 Molesworth Pl, Dublin 2",
          "link": "https://www.fetchcourses.ie/",
          "enrolment_start": new Date("2020-02-07T11:00:00.000Z"),
          "enrolment_finish": new Date("2021-02-07T11:00:00.000Z"),
          "contact_person": "Sofia Cole",
          "contact_telephone": "070 8260 8235",
          "contact_email": "SofiaCole@gmail.com",
          "product": 1,
          "priority": "brush_up"
        },
        {
          "id": 3,
          "name": "digital_skills_1",
          "title": "Digital skills",
          "description": "Improve your digital skills",
          "text": "Ut tincidunt purus nulla, ac venenatis eros hendrerit eget. Cras id nibh sit amet mauris fringilla vehicula eget ac dolor. Mauris condimentum elementum massa, vel laoreet leo suscipit id. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer pulvinar diam id neque ornare, quis vehicula mi viverra. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed feugiat semper eros, ac euismod metus varius et. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris enim mauris, vehicula vel velit eu, rhoncus congue risus. Mauris efficitur sodales neque non blandit. Donec sed massa sapien.\n\nPellentesque congue urna in elit scelerisque dignissim. Nulla vitae mauris orci. Sed viverra nulla vel ipsum auctor fringilla. Phasellus lectus tortor, ullamcorper at faucibus id, lobortis id tellus. Integer ultricies tincidunt dui ac molestie. Phasellus tempus feugiat odio a gravida. Etiam eget massa ut arcu accumsan finibus ut sed massa. Nunc massa erat, bibendum ac diam non, maximus hendrerit purus. Nunc nec diam vel turpis venenatis tristique non consequat velit. Sed ultrices fringilla eros elementum dictum. Sed ut pulvinar neque. Cras venenatis consectetur erat eget dignissim. Suspendisse dignissim sagittis aliquet. Sed pellentesque tempor metus, sit amet convallis sem facilisis nec.\n\nAliquam elementum lectus vitae dapibus finibus. Sed tempor ex ac nulla vehicula, id posuere massa interdum. Curabitur maximus nibh pretium, vehicula urna nec, posuere tellus. Donec ornare nisi in tempus scelerisque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam cursus, quam vel auctor sodales, elit ipsum auctor purus, et mattis risus enim quis magna. Praesent venenatis erat a libero ornare, et suscipit orci laoreet. Duis ante nulla, rhoncus in vehicula nec, aliquam quis magna. Nunc ut ipsum vitae lorem finibus ultrices. Sed sit amet felis lacinia, luctus mauris vitae, luctus elit. Donec et justo sit amet nibh laoreet volutpat. Sed non pharetra tellus. In hac habitasse platea dictumst. Maecenas imperdiet felis quis tincidunt faucibus.\n\nNam et suscipit risus. Phasellus efficitur pretium dolor, congue varius lacus. Pellentesque et malesuada dui, eu facilisis leo. In accumsan tincidunt magna, at lacinia ipsum ultrices in. Nulla vitae fermentum lectus. Nulla facilisi. Proin mattis erat erat. Nulla euismod erat feugiat, vehicula odio a, ornare orci. Nulla aliquam sem at eros ultricies pellentesque. Donec ut est eleifend, tincidunt risus id, commodo tortor.\n\nCurabitur vestibulum maximus dolor, ac tempus turpis volutpat sed. Ut in euismod turpis, eu luctus tellus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris et sagittis odio. Ut varius varius condimentum. Praesent sit amet leo quam. Maecenas eu porta dolor, vel faucibus libero. Fusce vitae neque non sem facilisis auctor id efficitur lorem. ",
          "level": 1,
          "skill": "digital_skills",
          "location": "dublin",
          "date_start": new Date("2020-06-07T11:00:00.000Z"),
          "date_finish": new Date("2021-02-07T11:00:00.000Z"),
          "duration": "200 hours",
          "frequency": "Every Tuesday from 2:00PM to 3:00PM",
          "address": "16 Molesworth Pl, Dublin 2",
          "link": "https://www.fetchcourses.ie/",
          "enrolment_start": new Date("2020-02-07T11:00:00.000Z"),
          "enrolment_finish": new Date("2021-02-07T11:00:00.000Z"),
          "contact_person": "Matthew Bates",
          "contact_telephone": "070 8615 8540",
          "contact_email": "matthewbates@gmail.com",
          "product": 1,
          "priority": "brush_up"
        }
      ]
    }
    this.resultsSaverService.generateImage(_delete.graphDataURI, _delete.resultsText, _delete.learningPathwayDescription, _delete.learningPathway)
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
