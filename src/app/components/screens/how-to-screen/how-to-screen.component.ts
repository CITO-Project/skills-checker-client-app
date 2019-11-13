import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TestResultsService } from 'src/app/services/test-results.service';
import { InterestService } from 'src/app/services/interest.service';
import { Interest } from 'src/app/models/interest';

@Component({
  selector: 'app-how-to-screen',
  templateUrl: './how-to-screen.component.html',
  styleUrls: ['./how-to-screen.component.scss']
})
export class HowToScreenComponent implements OnInit {

  public selectedInterest: string;

  constructor(private router: Router, private testResults: TestResultsService, private interestService: InterestService) { }

  ngOnInit() {
    this.retrieveInterest();
  }

  btnClick() {
    this.router.navigate(['']);
  }

  retrieveInterest() {
    const interestId = this.testResults.getInterestId();
    if (!interestId) {
      this.router.navigate(['interests']);
    } else {
      this.interestService.getInterest(interestId).subscribe( (data: Interest) => {
        this.selectedInterest = data.text;
      });
    }
  }

}
