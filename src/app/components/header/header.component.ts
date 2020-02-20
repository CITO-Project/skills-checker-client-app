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
  @Input() skip: boolean;


  constructor(private commonService: CommonService, private dataLogService: DataLogService) { }

  ngOnInit() {
    if (this.text === 'default') {
      this.text = 'SkillsChecker';
    }
  }

  goToIndex() {
    this.commonService.goTo('');
  }

}
