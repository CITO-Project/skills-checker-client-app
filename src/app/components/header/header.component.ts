import { Component, OnInit, Input } from '@angular/core';
import { DataLogService } from 'src/app/services/data-log.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() text: string;
  @Input() skip: boolean;


  constructor(private dataLogService: DataLogService, private commonService: CommonService) { }

  ngOnInit() {
    if (this.text === undefined) {
      const category = this.dataLogService.getCategory();
      if (category !== null) {
        this.text = category.text;
      } else {
        this.text = 'SkillsChecker';
      }
    }
  }

  goToIndex() {
    this.commonService.goTo('');
  }

  goToResults() {
    this.commonService.goTo('results');
  }

  showMore() {
    console.log(this.dataLogService.getAll());
  }

}
