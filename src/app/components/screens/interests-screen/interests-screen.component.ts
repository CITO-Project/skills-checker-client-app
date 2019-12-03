import { Component, OnInit } from '@angular/core';
import { InterestService } from 'src/app/services/interest.service';
import { Interest } from 'src/app/models/interest';
import { DataLogService } from 'src/app/services/data-log.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interests-screen',
  templateUrl: './interests-screen.component.html',
  styleUrls: ['./interests-screen.component.scss']
})
export class InterestsScreenComponent implements OnInit {

  public interests;

  constructor(
    private interestService: InterestService,
    private dataLogService: DataLogService,
    private router: Router) { }

  ngOnInit() {
    this.interestService.getInterests().subscribe( data => {
      this.interests = data;
    });
    // this.testResults.resetInterest();
  }

  selectInterest(interest: Interest) {
    this.dataLogService.setInterest(interest);
    if (this.dataLogService.getInterest().id === interest.id) {
      this.router.navigate(['how-to']);
    }
  }

  test() {
    console.log('test');
  }

}
