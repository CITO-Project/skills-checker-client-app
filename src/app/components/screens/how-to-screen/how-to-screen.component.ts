import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataLogService } from 'src/app/services/data-log.service';

@Component({
  selector: 'app-how-to-screen',
  templateUrl: './how-to-screen.component.html',
  styleUrls: ['./how-to-screen.component.scss']
})
export class HowToScreenComponent implements OnInit {

  public selectedInterest: string;

  constructor(
    private router: Router,
    private dataLogService: DataLogService) { }

  ngOnInit() {
    this.retrieveInterest();
  }

  btnClick() {
    this.router.navigate(['scenarios']);
  }

  retrieveInterest() {
    const interest = this.dataLogService.getInterest();
    if (!interest) {
      this.router.navigate(['interests']);
    } else {
      this.selectedInterest = interest.text;
    }
  }

}
