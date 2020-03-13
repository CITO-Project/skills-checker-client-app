import { Component, Input } from '@angular/core';
import { GraphicsData } from 'src/app/models/graphics-data';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-ballons-and-basket',
  templateUrl: './ballons-and-basket.component.html',
  styleUrls: ['./ballons-and-basket.component.scss']
})
export class BallonsAndBasketComponent {

  @Input() data: GraphicsData[];

  constructor(private commonService: CommonService) { }

  /*
Demo data:
  [
    {
      text: 'Literacy'
    },
    {
      text: 'Numeracy',
      isRight: true
    },
    {
      text: 'Digital skills'
    },
    {
      text: 'Independence',
      isRight: true
    }
  ]
  */

}
