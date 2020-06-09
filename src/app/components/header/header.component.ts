import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() text: string;
  @Output() customClick = new EventEmitter<void>();

  constructor(private commonService: CommonService) { }

  ngOnInit() {
    if (this.text === 'default') {
      this.text = 'Check-In Take-Off';
    }
  }

  goToIndex() {
    this.customClick.emit();
    this.commonService.goTo('');
  }

}
