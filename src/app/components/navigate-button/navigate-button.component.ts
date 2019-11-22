import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigate-button',
  templateUrl: './navigate-button.component.html',
  styleUrls: ['./navigate-button.component.scss']
})
export class NavigateButtonComponent implements OnInit {

  @Input() text: string;
  @Input() destination: string;

  constructor(private router: Router) { }

  ngOnInit() { }

  btnClick() {
    this.router.navigateByUrl('/' + this.destination);
  }

}
