import { Component, AfterViewInit, Input } from '@angular/core';
import { GraphicsData } from 'src/app/models/graphics-data';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements AfterViewInit {

  @Input() data: GraphicsData[];

  private totalWeight = 0;

  constructor() {
  }

  ngAfterViewInit() {
    console.log(this.data);
  }

}
