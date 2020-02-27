import { Component, Input, AfterViewInit } from '@angular/core';
import { GraphicsData } from 'src/app/models/graphics-data';


@Component({
  selector: 'app-sign-post',
  templateUrl: './sign-post.component.html',
  styleUrls: ['./sign-post.component.scss']
})
export class SignPostComponent implements AfterViewInit {

  @Input() data: GraphicsData[];

  private totalWeight = 0;

  constructor() {
  }

  ngAfterViewInit() {
    this.processSigns();
    this.setWeights();

  }

  processSigns(): void {
    this.totalWeight = 0;
    this.data.forEach( (sign: GraphicsData, index: number) => {
      const orientation = !!sign.isRight ? 'right' : 'left';
      sign.HTMLelement = document.
        getElementsByClassName(`row${index + 1} ${orientation}`).item(0).
        getElementsByClassName('text').item(0) as HTMLElement;
      if (!sign.weight || sign.weight <= 0) {
        sign.weight = 1;
      }
      this.totalWeight += sign.weight;
    });
  }

  setWeights(): void {
    this.data.forEach( (sign: GraphicsData, index: number) => {
      if (!!sign.isRight) {
        sign.HTMLelement.style.paddingRight = `${4-index}0%`;
      } else {
        sign.HTMLelement.style.paddingLeft = `${4-index}0%`;
      }
    });
  }

}
