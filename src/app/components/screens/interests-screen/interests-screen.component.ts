import { Component, OnInit } from '@angular/core';
import { InterestService } from 'src/app/services/interest.service';
import { Interest } from 'src/app/models/interest';
import { TestResultsService } from 'src/app/services/test-results.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interests-screen',
  templateUrl: './interests-screen.component.html',
  styleUrls: ['./interests-screen.component.scss']
})
export class InterestsScreenComponent implements OnInit {

  public interests;

  constructor(private interestService: InterestService, private testResults: TestResultsService, private router: Router) { }

  ngOnInit() {
    this.interestService.getInterests().subscribe( data => {
      this.interests = data;
    });
    // this.testResults.resetInterest();
  }

  selectInterest(interest: Interest) {
    this.testResults.setInterest(interest);
    if (this.testResults.getInterest().id === interest.id) {
      this.router.navigate(['how-to']);
    }
  }

}
