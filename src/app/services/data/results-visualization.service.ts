import { Injectable } from '@angular/core';

import { Log } from 'src/app/models/log';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class ResultsVisualizationService {

  constructor(private commonService: CommonService) { }

  async generateGraph(log: Log): Promise<any> {
    const skills = ['Maths', 'Computers', 'Reading']

    const balloonSize = this.calculateBalloonsSize(log);
    const ballonTemplate = await this.loadBallonTemplate(balloonSize)
    const multiplier = 2, fontSize = 10;
    const canvas = document.createElement("canvas");
    canvas.height = ballonTemplate.height * multiplier
    canvas.width = ballonTemplate.width * multiplier
    const context = canvas.getContext('2d');
    context.drawImage(ballonTemplate, 0, 0, ballonTemplate.width * multiplier, ballonTemplate.height * multiplier);
    context.font = `bold ${fontSize * multiplier}px sans-serif`;
    context.fillStyle = 'white';
    context.textAlign = 'center';
    this.calculateCoordinates(balloonSize).forEach( (coordinates: {x: number, y: number}, index: number) => {
      context.fillText(skills[index], coordinates.x * multiplier, coordinates.y * multiplier)
    })

    return new Promise( (resolve, reject) => {
      const r = new Image()
      r.onload = () => resolve(r);
      r.onerror = () => reject('ERROR_GENERATING_GRAPH')
      r.src = canvas.toDataURL("image/png")
    })
  }

  calculateBalloonsSize(log: Log): string {
    return 'mbs';
  }

  calculateCoordinates(size: string): {x: number, y: number}[] {
    let r = []
    const firstTwo = size.slice(0,2)
    if (firstTwo === 'bb') {
      r[0] = {x: 35, y: 100}
      r[1] = {x: 90, y: 30}
      switch(size[2]) {
        case 'b':
          r[2] = {x: 125, y: 110}
          break;
        case 'm':
          r[2] = {x: 130, y: 100}
          break;
        case 's':
          r[2] = {x: 135, y: 90}
          break
      }
    } else if (firstTwo === 'sm') {
      r[0] = {x: 25, y: 70}
      r[1] = {x: 80, y: 25}
      switch(size[2]) {
        case 's':
          r[2] = {x: 135, y: 70}
          break;
        case 'm':
          r[2] = {x: 130, y: 80}
          break;
      }
    } else {
      switch (size) {
        case 'sbs':
          r = [
            {x: 25, y: 90},
            {x: 80, y: 30},
            {x: 135, y: 90}
          ];
          break;
        case 'mbm':
          r = [
            {x: 30, y: 90},
            {x: 80, y: 25},
            {x: 130, y: 90}
          ];
          break;
        case 'mbs':
          r = [
            {x: 30, y: 80},
            {x: 90, y: 25},
            {x: 135, y: 90}
          ];
          break;
      }
    }
    return r;
  }

  loadBallonTemplate(size: string): Promise<any> {
    return new Promise( (resolve, reject) => {
      const resultsImage = new Image()
      resultsImage.onload = () => resolve(resultsImage)
      resultsImage.onerror = () => reject('ERROR_LOADING_BALLOON_TEMPLATE')
      resultsImage.src = this.commonService.getBalloonsPath(`balloons-${size}.svg`)
    }) 
  }

  imageToDataURI(image): string {
    const canvas = document.createElement("canvas");
    canvas.height = image.height
    canvas.width = image.width
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, image.width, image.height);
    return canvas.toDataURL("image/png");
  }
}