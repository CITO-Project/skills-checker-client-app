import { Component, OnInit } from '@angular/core';
import { InterestService } from 'src/app/services/interest.service';

@Component({
  selector: 'app-interests-screen',
  templateUrl: './interests-screen.component.html',
  styleUrls: ['./interests-screen.component.scss']
})
export class InterestsScreenComponent implements OnInit {

  public interests;

  constructor(private interestService: InterestService) { }

  ngOnInit() {
    this.interestService.getInterests().subscribe( data => {
      this.interests = data;
    });
  }

}
