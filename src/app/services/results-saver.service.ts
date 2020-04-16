import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { Course } from '../models/course';

@Injectable({
  providedIn: 'root'
})
export class ResultsSaverService {

  private readonly IMG_WIDTH = 700;
  private IMG_HEIGHT = 2000;

  private readonly HEADING_SIZE = 40;
  private readonly TEXT_SIZE = 30;
  private readonly ITEMS_SEPARATION = 40;
  private readonly LINES_SEPARATION = 20;


  private canvas: HTMLCanvasElement;
  private canvasContext: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas')
    this.canvas.height = this.IMG_HEIGHT;
    this.canvas.width = this.IMG_WIDTH;

    this.canvasContext = this.canvas.getContext('2d');
  }

  generateImage(
    graphDataURI: string,
    resultsText: string,
    learningPathwayDescription: string,
    learningPathway: Course[]
    ) {
      const courseFields = ['title', 'id', 'description', 'link', 'date_start', 'frecuency', 'address', 'location', 'enrolment_finish', 'contact_person', 'contact_telephone', 'contact_email']
      let xCoord = 0;
      let yCoord = 0;
      const image = new Image();
      image.onload = ( () => {
        //#region Drawing background
        let backgroundGradient = this.canvasContext.createLinearGradient(this.IMG_WIDTH / 2, 0, this.IMG_WIDTH / 2, this.IMG_HEIGHT);
        backgroundGradient.addColorStop(0, 'green');
        backgroundGradient.addColorStop(1, 'white');
        this.canvasContext.fillStyle = backgroundGradient;
        this.canvasContext.fill()
        this.canvasContext.fillRect(0, 0, this.IMG_WIDTH, this.IMG_HEIGHT);
        //#endregion

        //#region Drawing graph
        this.canvasContext.fillStyle = 'red';
        this.canvasContext.fillRect(10, 10, 340, 340);
        this.canvasContext.drawImage(image, 10, 10, 340, 340);
        //#endregion

        let tempTextSplit;
        //#region Writing resultsText
        tempTextSplit = this.splitTextInLines(resultsText, 25);
        this.canvasContext.fillStyle = 'black'
        this.canvasContext.textBaseline = 'middle'
        this.canvasContext.font = `${this.HEADING_SIZE}px Raleway`
        yCoord += this.ITEMS_SEPARATION;
        tempTextSplit.forEach( (text: string) => {
          this.canvasContext.fillText(text, 350, yCoord += this.HEADING_SIZE);
          yCoord += this.LINES_SEPARATION;
        })
        //#endregion

        //#region Printing Pathway description
        yCoord = image.height;
        tempTextSplit = this.splitTextInLines(learningPathwayDescription, 45);
        yCoord += this.ITEMS_SEPARATION;
        this.canvasContext.font = `${this.HEADING_SIZE}px Raleway`
        this.canvasContext.textAlign = 'center'
        tempTextSplit.forEach( (text: string) => {
          this.canvasContext.fillText(text, this.IMG_WIDTH / 2, yCoord += this.HEADING_SIZE)
        })
        //#endregion

        //#region Printing courses
        xCoord = this.ITEMS_SEPARATION;
        yCoord += this.ITEMS_SEPARATION
        learningPathway.forEach( (course: Course) => {
          //#region First line
          this.canvasContext.font = `${this.HEADING_SIZE}px Raleway`
          this.canvasContext.textAlign = 'left'
          this.splitTextInLines(`#${course.id} - ${course.title}`, 50).forEach( (text: string) => {
            this.canvasContext.fillText(text, xCoord, yCoord += this.HEADING_SIZE)
          })
          //#endregion

          //#region Second line
          this.canvasContext.font = `${this.TEXT_SIZE}px Raleway`
          this.splitTextInLines(course.description, 50).forEach( (text: string) => {
            this.canvasContext.fillText(text, xCoord, yCoord += this.TEXT_SIZE)
          })
          //#endregion

          //#region Second-second line
          this.splitTextInLines(`Website: ${course.link}`).forEach( (text: string) => {
            this.canvasContext.fillText(text, xCoord, yCoord += this.TEXT_SIZE)
          })
          //#endregion

          //#region Third line
          this.splitTextInLines(`Start: ${course.date_start.toLocaleDateString()} (${course.frequency})`).forEach( (text: string) => {
            this.canvasContext.fillText(text, xCoord, yCoord += this.TEXT_SIZE)
          })
          //#endregion

          //#region Fourth line
          this.splitTextInLines(`Location: ${course.address}, ${course.location}`).forEach( (text: string) => {
            this.canvasContext.fillText(text, xCoord, yCoord += this.TEXT_SIZE)
          })
          //#endregion

          //#region Fifth line
          this.splitTextInLines(`Enrolment finish: ${course.enrolment_finish.toLocaleDateString()}`).forEach( (text: string) => {
            this.canvasContext.fillText(text, xCoord, yCoord += this.TEXT_SIZE)
          })
          //#endregion

          //#region Sixth line
          this.splitTextInLines(`Contact person: ${course.contact_person}`).forEach( (text: string) => {
            this.canvasContext.fillText(text, xCoord, yCoord += this.TEXT_SIZE)
          })
          //#endregion

          //#region Seventh line
          this.splitTextInLines(`Contact phone: ${course.contact_telephone}`).forEach( (text: string) => {
            this.canvasContext.fillText(text, xCoord, yCoord += this.TEXT_SIZE)
          })
          //#endregion

          //#region Eighth line
          this.splitTextInLines(`Contact email: ${course.contact_email}`).forEach( (text: string) => {
            this.canvasContext.fillText(text, xCoord, yCoord += this.TEXT_SIZE)
          })
          //#endregion

          yCoord += this.ITEMS_SEPARATION
        })
        //#endregion

        // Generating PNG and downloading
        const temp = this.canvas.toDataURL('image/png').replace("image/png", "image/octet-stream")
        saveAs(temp, 'results.png')
      })
      image.src = graphDataURI;
  }

  splitTextInLines(text: string, charsPerLine: number = 40): string[] {
    const r = [];
    let splittedText = text.split('');
    let endIndex: number = 0;
    while (text !== '') {
      if (text.length > charsPerLine) {
        if (splittedText[charsPerLine] !== ' ') {
          endIndex = text.slice(0, charsPerLine).lastIndexOf(' ')
        } else {
          endIndex = charsPerLine
        }
      } else {
        endIndex = text.length
      }
      r.push(text.slice(0, endIndex).trim())
      splittedText = text.split('')
      text = text.slice(endIndex)
    }
    return r;
  }
}
