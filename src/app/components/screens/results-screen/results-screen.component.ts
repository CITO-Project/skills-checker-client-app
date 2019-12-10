import { Component, OnInit } from '@angular/core';
import { DataLogService } from 'src/app/services/data-log.service';
import { DataProcessingService } from 'src/app/services/data-processing.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-results-screen',
  templateUrl: './results-screen.component.html',
  styleUrls: ['./results-screen.component.scss']
})
export class ResultsScreenComponent implements OnInit {

  public courses;

  constructor(
    private dataProcessingService: DataProcessingService,
    private commonService: CommonService,
    private dataLogService: DataLogService) { }

  ngOnInit() {
    if (
      this.dataLogService.getProduct() === null ||
      this.dataLogService.getCategory() === null ||
      this.dataLogService.getInterest() === null
    ) {
      this.commonService.goTo('');
    }
    this.courses = [
      {
        name: 'course1',
        text: 'Learn how to use a booking website',
        link: 'example1.org'
      },
      {
        name: 'course2',
        text: 'Learn how to pay with your credit card',
        link: 'example2.org'
      },
      {
        name: 'course3',
        text: 'Learn how to use this website',
        link: 'example3.org'
      }
    ];
  }

  loadLink(link: string): void {
    console.log('Loading ' + link);
  }

  selectNewInterest(): void {
    this.dataLogService.initializeLog();
    this.commonService.goTo('categories');
  }

}
