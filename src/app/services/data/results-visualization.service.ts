import { Injectable } from '@angular/core';

import { Log } from 'src/app/models/log';

import { CommonService } from '../common.service';
import { DataProcessingService } from './data-processing.service';
import { StringManagerService } from '../etc/string-manager.service';
import { CanvasManagerService } from '../etc/canvas-manager.service';
import { Result } from 'src/app/models/result';

declare let FontFace: any;

@Injectable({
  providedIn: 'root'
})
export class ResultsVisualizationService {

  private readonly TEXT_FONT_FAMILY = 'Raleway';
  private readonly TEXT_FONT_FAMILY_SOURCE = 'https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwPIsWqhPAMif.woff2';
  private readonly BALLOON_LEVELS = 'smb'.split('');
  // private readonly BALLON_SKILLS_TEXT = {
  //   literacy: {
  //     text: 'Reading & Writing'
  //   },
  //   numeracy: {
  //     text: 'Maths'
  //   },
  //   digital_skills: {
  //     text: 'Computers'
  //   }
  // }
  private readonly BALLON_SKILLS_TEXT = {
    literacy: {
      text: 'Reading and Writing'
    },
    numeracy: {
      text: 'Maths'
    },
    digital_skills: {
      text: 'Computers'
    }
  };
  constructor(
    private commonService: CommonService,
    private stringManagerService: StringManagerService,
    private dataProcessingService: DataProcessingService
    ) { }

  async generateGraph(log: Log): Promise<any> {
    await (new FontFace(this.TEXT_FONT_FAMILY, `url(${this.TEXT_FONT_FAMILY_SOURCE})`)).load();
    const multiplier = 2;
    const fontSize = 8;

    const results = this.dataProcessingService.getBalloonSizes(log, this.BALLOON_LEVELS.length, log.scenarios[log.scenarios.length - 1].level)
    const balloonSize = this.calculateBalloonsSize(results);
    console.log('balloonSize', balloonSize)
    const balloonsOrder = this.calculateBalloonsOrder(results, balloonSize)
    console.log("balloonsOrder", balloonsOrder)
    const canvastemp = await this.loadBallonTemplate(balloonSize, multiplier);


    // const canvastemp = new CanvasManagerService(
    //   this.commonService,
    //   ballonTemplate.height * multiplier,
    //   ballonTemplate.width * multiplier
    // )
    // console.log(
    //   ballonTemplate.width)
    // const canvas = document.createElement("canvas");
    // canvas.height = ballonTemplate.height * multiplier
    // canvas.width = ballonTemplate.width * multiplier
    // const context = canvas.getContext('2d');
    // canvastemp.printImageFromSource(ballonTemplate, 0, 0, ballonTemplate.width * multiplier, ballonTemplate.height * multiplier)
    canvastemp.setFont(fontSize * multiplier, 'bold', 'Raleway');
    canvastemp.setTextAlignment('center');
    canvastemp.setColour('white');
    // context.drawImage(ballonTemplate, 0, 0, ballonTemplate.width * multiplier, ballonTemplate.height * multiplier);
    // context.font = `bold ${fontSize * multiplier}px Raleway`;
    // context.fillStyle = 'white';
    // context.textAlign = 'center';
    console.log(balloonSize, balloonsOrder)
    this.calculateCoordinates(balloonSize).forEach( (coordinates: {x: number, y: number}, position: number) =>
      this.stringManagerService.splitTextInLines(
        balloonsOrder[position], 9
        ).forEach( (text: string, index: number) => {
          // canvastemp.printLine('o', coordinates.x*multiplier, coordinates.y *multiplier)
          // console.log(coordinates)
          if (index === 0) {
            canvastemp.setX(coordinates.x * multiplier);
            canvastemp.setY(coordinates.y * multiplier);
          }
          canvastemp.printLine(text);
        }
          // context.fillText(text, coordinates.x * multiplier, coordinates.y * multiplier)
      )
      // context.fillText(this.BALLON_SKILLS_TEXT[balloonSize[index + 1]].text, coordinates.x * multiplier, coordinates.y * multiplier)
    )

    return canvastemp.exportToData();
    // return new Promise( (resolve, reject) => {
    //   const r = new Image()
    //   r.onload = () => resolve(r);
    //   r.onerror = () => reject('results-visualization.service.ts [generateGraph()] ERROR_GENERATING_GRAPH')
    //   r.src = canvas.toDataURL("image/png")
    // })
  }

  calculateBalloonsSize(results: Result): string {
    let r: string = '';
    // const nLevels = log.scenarios[log.scenarios.length - 1].level;
    const data: {
      skill: string,
      level: number
    }[] = Object.entries(results)
      .map( (entry: any) => {
        return {
          skill: entry[0],
          level: entry[1].level
        }
      })
    const nUniqueLevels = data
      .map( entry => entry.level)
      .filter( (level: number, index: number, array: number[]) => array.indexOf(level) === index)
      .length;
    switch (nUniqueLevels) {
      case 1:
        r = data[0].level > 0 ? 'bbb' : 'mmm';
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
    // r[0].split('').forEach( (size: string) => {
    //   const level = this.BALLOON_LEVELS.indexOf(size) + 1;
    //   results.find( (item: any) => {
    //     if (item.level === 0) {
    //       item.level++;
    //     }
    //     if (item.level === level) {
    //       r.push(item.skill);
    //       item.level = -1;
    //       return true;
    //     }
    //   })
    // })
    // console.log(results);
    // console.log(r);
    return r;
  }

  calculateBalloonsOrder(results: Result, balloonSize: string): string[] {
    const r: string[] = [];
    const data = Object.entries(results)
      .map( (value: [string, any]) => {
        return {
          skill: value[0],
          level: value[1].level
        }
      })
      .sort( (a: any, b: any) => {
        return b.level - a.level
      })
    data.slice(1,2).concat(data[0]).concat(data.slice(-1)).forEach( (value: any) => {
      r.push(this.BALLON_SKILLS_TEXT[value.skill].text)
    })
    // const data = Object.entries(results).map( ( value: [ string, any ]) => {
    //   return {
    //     skill: value[0],
    //     level: value[1].level
    //   }
    // })
    // console.log(this.getNumberLevelsRepeated(results), data)
    // switch (this.getNumberLevelsRepeated(results)) {
    //   case 1:
    //     Object.values(this.BALLON_SKILLS_TEXT).forEach( (value: { text: string }) => r.push(value.text));
    //     break;
    //   case 2:
    //     balloonSize.split('').forEach( (levelString: string) => {
    //       this.BALLOON_LEVELS.find( (value: string, index: number) => {
    //         if (value === levelString) {
    //           const level = index + 1

    //           r.push(data.find( (item: {skill: string, level: number}) => {
    //             level === item.level
    //             item.level = -2
    //             return true
    //           }).skill)
    //           return true;
    //         }
    //       })
    //     })
    //     break;
    //   case 3:
    //     balloonSize.split('').forEach( (levelString: string) => {
    //       this.BALLOON_LEVELS.find( (value: string, index: number) => {
    //         if (value === levelString) {
    //           const level = index + 1
    //           r.push(data.find( (item: {skill: string, level: number}) => {
    //             return level === item.level
    //           }).skill)
    //           return true;
    //         }
    //       })
    //     })
    //     break;

    // }
    // const data = Object.entries(results).map( (entry: [ string, number ]) => {
    //   return {
    //     skill: entry[0],
    //     level: entry[1]
    //   }
    // })
    // console.log('begin')
    // console.log(results, data)
    // balloonSize.split('').forEach( (size: string) => {
    //   const level = this.BALLOON_LEVELS.indexOf(size) + 1
    //   console.log(size, level)
    //   data.find( (item: any) => {
    //     console.log(item.level, level, item.level === level)
    //     if (item.level === level) {
    //       r.push(item.skill)
    //       item.level = -1
    //       return true
    //     }
    //     console.log('end')
    //   })
    // })
    return r;
  }

  calculateCoordinates(size: string): {x: number, y: number}[] {
    let r = []
    const thirdLetter = size[2]
    switch (size.slice(0, 2)) {
      case 'bb':
        r[0] = {x: 40, y: 110}
        r[1] = {x: 93, y: 40}
        switch ( thirdLetter) {
          case 'b':
            r[2] = {x: 131, y: 125}
            break;
          case 'm':
            r[2] = {x: 136, y: 115}
            break;
          case 's':
            r[2] = {x: 140, y: 102}
            break
        }
        break;
      case 'mb':
        switch (thirdLetter) {
          case 'm':
            r[0] = {x: 34, y: 103}
            r[1] = {x: 86, y: 40}
            r[2] = {x: 136, y: 105}
            break;
          case 's':
            r[0] = {x: 34, y: 92}
            r[1] = {x: 93, y: 42}
            r[2] = {x: 141, y: 100}
            break;
        }
        break;
      case 'mm':
        r[0] = {x: 34, y: 97}
        r[1] = {x: 86, y: 40}
        switch (thirdLetter) {
          case 'm':
            r[2] = {x: 136, y: 98}
            break;
          case 's':
            r[2] = {x: 140, y: 85}
            break;
        }
        break;
      case 'sb':
        if (thirdLetter === 's') {
          r = [
            {x: 29, y: 100},
            {x: 85, y: 42},
            {x: 141, y: 101}
          ];
        }
        break;
      case 'sm':
        if (thirdLetter === 's') {
          r = [
            {x: 29, y: 75},
            {x: 86, y: 30},
            {x: 140, y: 75}
          ];
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
      const image = new Image()
      image.onload = () => {
        const canvastemp = new CanvasManagerService(this.commonService, image.height * multiplier, image.width * multiplier)
        canvastemp.printImage(image, 0, 0, image.width * multiplier, image.height * multiplier)
        resolve(canvastemp)
      }
      image.onerror = () => reject('ERROR_LOADING_BALLOON_TEMPLATE')
      image.src = this.commonService.getBalloonsPath(`balloons-${size}.svg`)
    }) 
  }

  async imageToDataURI(image): Promise<string> {
    const canvastemp = new CanvasManagerService(this.commonService, image.height, image.width)
    await canvastemp.printImageFromSource(image, 0, 0, image.width, image.height)
    return await canvastemp.exportToData()
    // await canvastemp.loadResource(image).then( (image: any) =>
    //   canvastemp.printImage(image, 0, 0, image.width, image.height))
    // context.drawImage(image, 0, 0, image.width, image.height);
    // return canvas.toDataURL("image/png");
  }
}