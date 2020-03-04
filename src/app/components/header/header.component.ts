import { Component, OnInit, Input } from '@angular/core';

import { CommonService } from 'src/app/services/common.service';
import { DataLogService } from 'src/app/services/data-log.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() text: string;

  constructor(private commonService: CommonService) { }

  ngOnInit() {
    if (this.text === 'default') {
      this.text = 'SkillsChecker';
    }
  }

  goToIndex() {
    this.commonService.goTo('');
  }

}
