import { Component, OnInit } from '@angular/core';
import { InterestService } from 'src/app/services/interest.service';
import { Interest } from 'src/app/models/interest';
import { DataLogService } from 'src/app/services/data-log.service';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-interests-screen',
  templateUrl: './interests-screen.component.html',
  styleUrls: ['./interests-screen.component.scss']
})
export class InterestsScreenComponent implements OnInit {

  public interests: Interest[];

  constructor(
    private categoryService: CategoryService,
    private interestService: InterestService,
    private dataLogService: DataLogService,
    private commonService: CommonService) { }

  ngOnInit() {
    this.interestService.getInterests(this.categoryService.getCategory().id).subscribe( data => {
      this.interests = data;
    });
    // this.testResults.resetInterest();
  }

  selectInterest(interest: Interest): void {
    this.dataLogService.setInterest(interest);
    if (this.dataLogService.getInterest().id === interest.id) {
      this.commonService.goTo('how-to');
    }
  }

  test() {
    console.log('test');
  }

}
