import { Component, OnInit } from '@angular/core';
import { TestResultsService } from 'src/app/services/test-results.service';

@Component({
  selector: 'app-orientation-screen',
  templateUrl: './orientation-screen.component.html',
  styleUrls: ['./orientation-screen.component.scss']
})
export class OrientationScreenComponent implements OnInit {

  constructor(private testResults: TestResultsService) { }

  ngOnInit() {
    if (!this.testResults.getProductId()) {
      this.testResults.setProductId(1);
    }
  }

}
