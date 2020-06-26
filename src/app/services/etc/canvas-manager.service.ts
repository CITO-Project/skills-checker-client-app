import { Injectable } from '@angular/core';

import { saveAs } from 'file-saver';

declare let FontFace: any;

@Injectable({
  providedIn: 'root'
})
export class CanvasManagerService {

  private FILE_MAX_WIDTH;
  private FILE_MAX_HEIGHT;

  private xCoord = 0;
  private yCoord = 0;
  private FONT_FAMILY = 'sans-serif';
  private FONT_SIZE = 10;

  private canvas: HTMLCanvasElement;
  private canvasContext: CanvasRenderingContext2D;

  constructor() {}
  
  createCanvas(
      maxHeight: number,
      maxWidth: number
    ) {
    this.canvas = document.createElement('canvas');
    this.canvas.height = this.FILE_MAX_HEIGHT = maxHeight;
    this.canvas.width = this.FILE_MAX_WIDTH = maxWidth;
    this.canvasContext = this.canvas.getContext('2d');
    this.canvasContext.textBaseline = 'top';
    this.xCoord = 0;
    this.yCoord = 0;
  }

  async loadFont(name: string, source: string): Promise<void> {
    try {
      await (new FontFace(name, `url(${source})`)).load().then( () => this.FONT_FAMILY = name);
    } catch (error) {
      console.error('ERROR LOADING FONT', error);
    }
  }

  loadResource(source: string): Promise<any> {
    return new Promise( (resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(`ERROR_LOADING_RESOURCE canvas-manager.service.ts [loadResource(${source})]`);
      image.src = source;
    });
  }

  async printImageFromSource(source: string, x: number = 0, y: number = 0, width: number = -1, height: number = -1): Promise<void> {
    await this.loadResource(source).then(
      (image: any) => {
        if (width < 0) {
          width = image.width;
        }
        if (height < 0) {
          height = image.height;
        }
        this.canvasContext.drawImage(image, x, y, width, height);
      });
  }

  printImage(image: any, x: number = 0, y: number = 0, width: number = image.width, height: number = image.height): void {
    this.canvasContext.drawImage(image, x, y, width, height);
  }

  printLine(text: string, x: number = this.xCoord, y: number = this.yCoord) {
    this.canvasContext.fillText(text, x, y);
    this.yCoord += this.FONT_SIZE;
  }

  drawBox(width: number, height, borderRadius: number = 0, x: number = this.xCoord, y: number = this.yCoord): void {
    this.xCoord = x;
    this.yCoord = y;
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(this.xCoord, this.yCoord);
    const yStart = this.getY();
    this.canvasContext.moveTo(this.xCoord, this.yCoord += borderRadius);
    this.canvasContext.quadraticCurveTo(this.xCoord, this.yCoord -= borderRadius, this.xCoord += borderRadius, this.yCoord);
    this.canvasContext.lineTo(this.xCoord += (width - borderRadius * 2 ), this.yCoord);
    this.canvasContext.quadraticCurveTo(this.xCoord += borderRadius, this.yCoord, this.xCoord, this.yCoord += borderRadius);
    this.canvasContext.lineTo(this.xCoord, this.yCoord += height - borderRadius * 2);
    this.canvasContext.quadraticCurveTo(this.xCoord, this.yCoord += borderRadius, this.xCoord -= borderRadius, this.yCoord);
    this.canvasContext.lineTo(this.xCoord -= (width - borderRadius * 2), this.yCoord);
    this.canvasContext.quadraticCurveTo(this.xCoord -= borderRadius, this.yCoord, this.xCoord, this.yCoord - borderRadius);
    this.canvasContext.closePath();
    this.canvasContext.fill();
    this.setY(yStart);
  }

  setColour(colour: string): void {
    this.canvasContext.fillStyle = colour;
  }

  setFont(size: number, variant: string = '', fontFamily: string = this.FONT_FAMILY): void {
    this.FONT_FAMILY = fontFamily;
    if (size > -1) {
      this.FONT_SIZE = size;
    }
    this.canvasContext.font = `${variant} ${size}px ${fontFamily}`;
  }

  setTextAlignment(alignment: 'start' | 'left' | 'center' | 'right' | 'end'): void {
    this.canvasContext.textAlign = alignment;
  }

  exportToData(): string {
    return this.canvas.toDataURL('image/png');
  }

  downloadImage(filename: string): void {
    const temp = this.canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    saveAs(temp, filename);
  }

  getCanvasContext(): CanvasRenderingContext2D {
    return this.canvasContext;
  }

  getX(): number { return this.xCoord; }
  setX(value: number): number { return this.xCoord = value; }
  addX(value: number): number { return this.xCoord += value; }

  getY(): number { return this.yCoord; }
  setY(value: number): number { return this.yCoord = value; }
  addY(value: number): number { return this.yCoord += value; }

}
