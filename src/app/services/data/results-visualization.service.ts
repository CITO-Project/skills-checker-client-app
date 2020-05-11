
import { Injectable } from '@angular/core';

import { Log } from 'src/app/models/log';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class ResultsVisualizationService {

  constructor(private commonService: CommonService) { }

  generateGraph(log: Log, cb) {




    const balloonSize = this.calculateBalloonsSize(log);
    this.loadBallonTemplate(balloonSize, (data) => {
      console.log(data)
    })













    // const resultsImage = new Image()
    // resultsImage.onload = () => cb(resultsImage)
    // resultsImage.src = this.commonService.getBalloonsPath('')
  }

  calculateBalloonsSize(log: Log): string {
    return 'bbb';
  }

  loadBallonTemplate(size: string, cb): void {
    const resultsImage = new Image()
    resultsImage.onload = () => cb(resultsImage)
    resultsImage.src = this.commonService.getBalloonsPath(`balloons-${size}`)
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