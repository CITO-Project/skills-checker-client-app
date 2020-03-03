import { Component, AfterViewInit, Input } from '@angular/core';
import { GraphicsData } from 'src/app/models/graphics-data';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-ballons-and-basket',
  templateUrl: './ballons-and-basket.component.html',
  styleUrls: ['./ballons-and-basket.component.scss']
})
export class BallonsAndBasketComponent implements AfterViewInit {

  @Input() data: GraphicsData[];

  readonly svgNS = 'http://www.w3.org/2000/svg';

  private totalWeight = 0;

  constructor(private commonService: CommonService) {
  }

  ngAfterViewInit() {
    const el = document.getElementById('canvas');
    const svg = this.createSVG(el);
    el.append(svg);
    this.createEllipse(svg, 50, 50, 20, 10, { stroke: '3', fill: 'red' });
  }

  createSVG(parent: HTMLElement, width: number = 100, height: number = 100, extras?: any): SVGSVGElement {
    const el = document.createElementNS(this.svgNS, 'svg');
    el.setAttribute('width', width + '');
    el.setAttribute('height', height + '');
    if (!!extras) {
      Object.keys(extras).forEach( (key: string) => {
        el.setAttribute(key, extras[key] + '');
      });
    }
    parent.appendChild(el);
    return el;
  }

  createEllipse(
    parent: SVGSVGElement,
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    extras?: any
    ): SVGEllipseElement {
      const el = document.createElementNS(this.svgNS, 'ellipse');
      el.setAttribute('cx', cx + '');
      el.setAttribute('cy', cy + '');
      el.setAttribute('rx', rx + '');
      el.setAttribute('ry', ry + '');
      if (!!extras) {
        Object.keys(extras).forEach( (key: string) => {
          el.setAttribute(key, extras[key] + '');
        });
      }
      parent.append(el);
      return el;
  }

}
