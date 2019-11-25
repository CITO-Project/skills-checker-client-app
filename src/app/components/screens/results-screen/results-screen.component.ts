import { Component, OnInit } from '@angular/core';
import { TestResultsService } from 'src/app/services/test-results.service';
import { ResultsProcessingService } from 'src/app/services/results-processing.service';

@Component({
  selector: 'app-results-screen',
  templateUrl: './results-screen.component.html',
  styleUrls: ['./results-screen.component.scss']
})
export class ResultsScreenComponent implements OnInit {

  public courses;

  constructor(private resultsProcessing: ResultsProcessingService) { }

  ngOnInit() {
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

}
