import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigate-button',
  templateUrl: './navigate-button.component.html',
  styleUrls: ['./navigate-button.component.scss']
})
export class NavigateButtonComponent implements OnInit {

  @Input('text') text: String;
  @Input('destination') destination: String;

  constructor(private router: Router) { }

  ngOnInit() {
    console.log(this.text, this.destination);
  }

  btnClick() {
    console.log('check');
    this.router.navigateByUrl('/' + this.destination);
  }

}
