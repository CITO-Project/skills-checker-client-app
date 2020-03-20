import { Component, Input } from '@angular/core';
import { GraphicsData } from 'src/app/models/graphics-data';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent {

  @Input() data: GraphicsData[];

  constructor() { }

}
