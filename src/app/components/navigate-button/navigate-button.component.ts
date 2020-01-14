import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit() { }

  btnClick() {
    if (this.destination !== undefined) {
      this.router.navigate([this.destination]);
    } else {
      this.event.emit();
    }
  }

  btnClickBack() {
    if (this.backDestination !== undefined) {
      this.router.navigate([this.backDestination]);
    } else {
      this.backEvent.emit();
    }
  }

  btnClickForward() {
    if (this.forwardDestination !== undefined) {
      this.router.navigate([this.forwardDestination]);
    } else {
      this.forwardEvent.emit();
    }
  }

}
