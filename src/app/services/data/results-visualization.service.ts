import { Injectable } from '@angular/core';

import { Log } from 'src/app/models/log';

import { CommonService } from '../common.service';
import { DataProcessingService } from './data-processing.service';
import { StringManagerService } from '../etc/string-manager.service';
import { CanvasManagerService } from '../etc/canvas-manager.service';
import { Result } from 'src/app/models/result';

@Injectable({
  providedIn: 'root'
})
export class ResultsVisualizationService {

  private readonly TEXT_FONT_FAMILY = 'Raleway';
  private readonly TEXT_FONT_FAMILY_SOURCE = 'https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwPIsWqhPAMif.woff2';
  private readonly BALLOON_LEVELS = 'smb'.split('');
  private readonly BALLON_SKILLS_TEXT = {
    literacy: {
      text: $localize`:@@skill-reading-and-writing-simple:Reading and Writing`
    },
    numeracy: {
      text: $localize`:@@skill-maths-simple:Maths`
    },
    digital_skills: {
      text: $localize`:@@skill-computers-simple:Computers`
    }
  };
  constructor(
    private commonService: CommonService,
    private stringManagerService: StringManagerService,
    private dataProcessingService: DataProcessingService
    ) { }

  async generateGraph(log: Log): Promise<any> {
    const multiplier = 2;
    const fontSize = 8;

    const results = this.dataProcessingService.getBalloonSizes(
      log,
      this.BALLOON_LEVELS.length,
      log.scenarios[log.scenarios.length - 1].level
      );
    const balloonSize = this.calculateBalloonsSize(results);
    const balloonsOrder = this.calculateBalloonsOrder(results, balloonSize);

    const canvasManager = await this.loadBallonTemplate(balloonSize, multiplier);

    await canvasManager.loadFont(this.TEXT_FONT_FAMILY, this.TEXT_FONT_FAMILY_SOURCE);
    canvasManager.setFont(fontSize * multiplier, 'bold', 'Raleway');
    canvasManager.setTextAlignment('center');
    canvasManager.setColour('white');
    this.calculateCoordinates(balloonSize).forEach( (coordinates: {x: number, y: number}, position: number) =>
      this.stringManagerService.splitTextInLines(
        balloonsOrder[position], 12
        ).forEach( (text: string, index: number) => {
          if (index === 0) {
            canvasManager.setX(coordinates.x * multiplier);
            canvasManager.setY(coordinates.y * multiplier);
          }
          canvasManager.printLine(text);
        }
      )
    );

    return canvasManager.exportToData();
  }

  calculateBalloonsSize(results: Result): string {
    let r = '';
    const data: {
      skill: string,
      level: number
    }[] = Object.entries(results)
      .map( (entry: any) => {
        return {
          skill: entry[0],
          level: entry[1].level
        };
      });
    const nUniqueLevels = data
      .map( entry => entry.level)
      .filter( (level: number, index: number, array: number[]) => array.indexOf(level) === index)
      .length;
    switch (nUniqueLevels) {
      case 1:
        r = data[0].level > 1 ? 'bbb' : 'mmm';
        break;
      case 2:
        const levelRepeated = data
          .map( (entry: any) => entry.level)
          .filter( (level: number, index: number, array: number[]) => array.indexOf(level) !== index)[0];
        switch (levelRepeated) {
          case 3:
            r = `bb${this.BALLOON_LEVELS[data.filter( (item: any) => item.level !== 3)[0].level - 1]}`;
            break;
          case 2:
            if (this.BALLOON_LEVELS[data.filter( (item: any) => item.level !== 3)[0].level - 1] === 'b') {
              r = 'mbm';
            } else {
              r = 'mms';
            }
            break;
          case 1:
            r = `s${this.BALLOON_LEVELS[data.filter( (item: any) => item.level !== 1)[0].level - 1]}s`;
            break;
        }
        break;
      case 3:
        r = 'mbs';
        break;
    }
    return r;
  }

  calculateBalloonsOrder(results: Result, balloonSize: string): string[] {
    const r: string[] = [];
    const data = Object.entries(results)
      .map( (value: [string, any]) => {
        return {
          skill: value[0],
          level: value[1].level
        };
      })
      .sort( (a: any, b: any) => {
        return b.level - a.level;
      });

    data.slice(1, 2).concat(data[0]).concat(data.slice(-1)).forEach( (value: any) => {
      r.push(this.BALLON_SKILLS_TEXT[value.skill].text);
    });
    return r;
  }

  // this function will get very confused if there is any white space aroud the strings
  calculateCoordinates(size: string): {x: number, y: number}[] {
    const r = [];
    const thirdLetter = size[2];
    switch (size.slice(0, 2)) {
      case 'bb':
        r[0] = {x: 40, y: 103};
        r[1] = {x: 93, y: 35};
        switch ( thirdLetter) {
          case 'b':
            r[2] = {x: 131, y: 118};
            break;
          case 'm':
            r[2] = {x: 136, y: 110};
            break;
          case 's':
            r[2] = {x: 140, y: 98};
            break;
        }
        break;
      case 'mb':
        switch (thirdLetter) {
          case 'm':
            r[0] = {x: 34, y: 100};
            r[1] = {x: 86, y: 34};
            r[2] = {x: 136, y: 100};
            break;
          case 's':
            r[0] = {x: 34, y: 87};
            r[1] = {x: 93, y: 34};
            r[2] = {x: 141, y: 91};
            break;
        }
        break;
      case 'mm':
//        r[0] = {x: 34, y: 88};
        r[0] = {x: 30, y: 88};
        r[1] = {x: 86, y: 31};
        switch (thirdLetter) {
          case 'm':
            r[2] = {x: 136, y: 88};
            break;
          case 's':
            r[2] = {x: 140, y: 75};
            break;
        }
        break;
      case 'sb':
        if (thirdLetter === 's') {
          r[0] = {x: 29, y: 94};
          r[1] = {x: 85, y: 34};
          r[2] = {x: 141, y: 94};
        }
        break;
      case 'sm':
        if (thirdLetter === 's') {
          r[0] = {x: 29, y: 74};
          r[1] = {x: 86, y: 32};
          r[2] = {x: 140, y: 75};
        }
        break;
    }
    return r;
  }

  getNumberLevelsRepeated(results: Result): number {
    return Object.values(results)
    .map( skill => skill.level)
    .filter( (level: number, index: number, array: number[]) => array.indexOf(level) === index)
    .length;
  }

  loadBallonTemplate(size: string, multiplier: number): Promise<CanvasManagerService> {
    return new Promise( (resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const canvasManager = new CanvasManagerService();
        canvasManager.createCanvas(image.height * multiplier, image.width * multiplier);
        canvasManager.printImage(image, 0, 0, image.width * multiplier, image.height * multiplier);
        resolve(canvasManager);
      };
      image.onerror = () => reject('ERROR_LOADING_BALLOON_TEMPLATE');
      image.src = this.commonService.getBalloonsPath(`balloons-${size}.svg`);
    });
  }

  async imageToDataURI(image): Promise<string> {
    const canvasManager = new CanvasManagerService();
    canvasManager.createCanvas(image.height, image.width);
    await canvasManager.printImageFromSource(image, 0, 0, image.width, image.height);
    return await canvasManager.exportToData();
  }
}
