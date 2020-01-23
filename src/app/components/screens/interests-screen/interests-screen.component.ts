import { Component, OnInit } from '@angular/core';

import { Interest } from 'src/app/models/interest';

import { InterestService } from 'src/app/services/interest.service';
import { DataLogService } from 'src/app/services/data-log.service';
import { CommonService } from 'src/app/services/common.service';
import { Category } from 'src/app/models/category';


@Component({
  selector: 'app-interests-screen',
  templateUrl: './interests-screen.component.html',
  styleUrls: ['./interests-screen.component.scss']
})
export class InterestsScreenComponent implements OnInit {

  public interests: Interest[];
  public colour: string;
  public category: Category;

  constructor(
    private interestService: InterestService,
    private dataLogService: DataLogService,
    private commonService: CommonService) { }

  ngOnInit() {
    this.category = this.dataLogService.getCategory();
    this.colour = this.category.colour;
    if (this.category === null) {
      this.commonService.goTo('categories');
    } else {
      this.interestService.getInterests(this.category.id).subscribe( (data: Interest[]) => {
        this.interests = data;
      });
    }
  }

  selectInterest(interest: Interest): void {
    interest = {
      id: 3,
      product: 1,
      name: 'static_interest',
      text: 'Static interest. Change afterwards'
    };
    this.dataLogService.setInterest(interest);
    if (this.dataLogService.getInterest().id === interest.id) {
      this.commonService.goTo('how-to');
    }
  }

  getPath(name: string): string {
    return this.commonService.getIconPath(name);
  }

}
