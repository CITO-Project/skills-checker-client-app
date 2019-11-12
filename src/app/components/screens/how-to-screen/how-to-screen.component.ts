import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-how-to-screen',
  templateUrl: './how-to-screen.component.html',
  styleUrls: ['./how-to-screen.component.scss']
})
export class HowToScreenComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  btnClick() {
    this.router.navigate(['']);
  }

}
