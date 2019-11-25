import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigate-button',
  templateUrl: './navigate-button.component.html',
  styleUrls: ['./navigate-button.component.scss']
})
export class NavigateButtonComponent implements OnInit {

  @Input() backText: string;
  @Input() backDestination: string;
  @Input() forwardText: string;
  @Input() forwardDestination: string;
  @Input() text: string;
  @Input() destination: string;

  constructor(private router: Router) { }

  ngOnInit() { }

  btnClick() {
    if (this.destination !== undefined) {
      this.router.navigate([this.destination]);
    }
  }

  btnClickBack() {
    if (this.backDestination !== undefined) {
      this.router.navigate([this.backDestination]);
    }
  }

  btnClickForward() {
    if (this.forwardDestination !== undefined) {
      this.router.navigate([this.forwardDestination]);
    }
  }

}
