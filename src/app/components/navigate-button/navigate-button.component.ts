import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-navigate-button',
  templateUrl: './navigate-button.component.html',
  styleUrls: ['./navigate-button.component.scss']
})
export class NavigateButtonComponent implements OnInit {

  @Input() backText: string;
  @Input() backDestination: string;
  @Output() backEvent = new EventEmitter();

  @Input() forwardText: string;
  @Input() forwardDestination: string;
  @Output() forwardEvent = new EventEmitter();

  @Input() text: string;
  @Input() destination: string;
  @Output() event =  new EventEmitter();

  constructor(private commonService: CommonService) {
  }

  ngOnInit() {
    if (this.text === 'default') {
      this.text = '<< Back';
    }
    if (this.backText === 'default') {
      this.backText = '<< Back';
    }
    if (this.forwardText === 'default') {
      this.forwardText = 'Next >>';
    }
  }

  btnClick() {
    if (this.destination !== undefined) {
      this.commonService.goTo(this.destination);
    } else {
      this.event.emit();
    }
  }

  btnClickBack() {
    if (this.backDestination !== undefined) {
      this.commonService.goTo(this.backDestination);
    } else {
      this.backEvent.emit();
    }
  }

  btnClickForward() {
    if (this.forwardDestination !== undefined) {
      this.commonService.goTo(this.forwardDestination);
    } else {
      this.forwardEvent.emit();
    }
  }

}
