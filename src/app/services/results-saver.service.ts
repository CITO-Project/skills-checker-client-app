import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { Course } from '../models/course';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ResultsSaverService {

  private readonly FILE_MAX_WIDTH = 1000;
  private readonly FILE_MAX_HEIGHT = 2000;
  private readonly IMG_MAX_HEIGHT = 460;

  private readonly HEADING_SIZE = 60;
  private readonly TEXT_SIZE = 40;
  private readonly ITEMS_SEPARATION = 150;
  private readonly LINES_SEPARATION = 20;

  private readonly PADDING = 60;
  private readonly BACKGROUND_PADDING = 80;
  private readonly SECTION_PADDING = 40;
  private readonly COURSE_PADDING = 40;

  private xCoord = 0;
  private yCoord = 0;

  private canvas: HTMLCanvasElement;
  private canvasContext: CanvasRenderingContext2D;

  constructor(
    private commonService: CommonService
  ) {
    this.canvas = document.createElement('canvas')
    this.canvas.height = this.FILE_MAX_HEIGHT;
    this.canvas.width = this.FILE_MAX_WIDTH;
  }

  generateImage(
    graphDataURI: string,
    resultsText: string,
    learningPathwayDescription: string,
    learningPathway: Course[]
    ) {
      this.canvas.height = this.calculateHeight(resultsText, learningPathwayDescription, learningPathway)
      this.canvasContext = this.canvas.getContext('2d');
      const courseFields = ['title', 'id', 'description', 'link', 'date_start', 'frecuency', 'address', 'location', 'enrolment_finish', 'contact_person', 'contact_telephone', 'contact_email']
      this.xCoord = 0;
      this.yCoord = 0;
      this.loadImages(graphDataURI, (data) => {
        let tempTextSplit = [], multiplier = 1;
        //#region Drawing background
        let backgroundGradient = this.canvasContext.createLinearGradient(this.FILE_MAX_WIDTH / 2, 0, this.FILE_MAX_WIDTH / 2, 500);
        backgroundGradient.addColorStop(0, '#3FBDA8');
        backgroundGradient.addColorStop(1, '#fff');
        this.canvasContext.fillStyle = backgroundGradient;
        this.canvasContext.fillRect(0, 0, this.FILE_MAX_WIDTH, this.FILE_MAX_HEIGHT);
        //#endregion

        //#region Drawing graph
        multiplier = 2.5;
        this.canvasContext.drawImage(data.backgroundImage, this.PADDING, this.yCoord += this.PADDING, data.backgroundImage.width * multiplier, data.backgroundImage.height * multiplier)
        multiplier = this.IMG_MAX_HEIGHT / data.balloonsAndBasketImage.height;
        this.canvasContext.drawImage(data.balloonsAndBasketImage, this.BACKGROUND_PADDING, this.BACKGROUND_PADDING, data.balloonsAndBasketImage.width * multiplier, data.balloonsAndBasketImage.height * multiplier);
        //#endregion

        //#region Writing resultsText
        tempTextSplit = this.splitTextInLines(resultsText, 25);
        this.canvasContext.fillStyle = 'black'
        this.canvasContext.textBaseline = 'middle'
        this.canvasContext.fillStyle = '#62717A'
        // TODO Need to vertical align this text
        this.yCoord += this.ITEMS_SEPARATION;
        tempTextSplit.forEach( (text: string) => {
          this.yCoord += this.LINES_SEPARATION;
          this.printText(text, '', data.balloonsAndBasketImage.width * multiplier + this.ITEMS_SEPARATION)
        })
        this.yCoord = this.IMG_MAX_HEIGHT + this.PADDING
        //#endregion

        //#region Printing Pathway description
        this.canvasContext.textAlign = 'center'
        this.xCoord = this.FILE_MAX_WIDTH / 2; this.yCoord += this.ITEMS_SEPARATION
        this.printHeader('My Learning Pathway', 'bold')
        this.yCoord += 20
        tempTextSplit = this.splitTextInLines(learningPathwayDescription, 45);
        tempTextSplit.forEach( (text: string) => {
          this.printText(text)
          this.yCoord += 10
        })
        //#endregion
        
        const brushUpCourses = learningPathway.filter( (course: Course) => course.priority === 'brush_up').slice(0, 2)
        const developCourses = learningPathway.filter( (course: Course) => course.priority === 'develop').slice(0, 1)

        //#region Printing 'brush_up' courses
        if (brushUpCourses.length > 0) {
          this.printSection('Brush up', brushUpCourses); 
        }
        //#endregion

        //#region Printing 'develop' courses
        if (developCourses.length > 0) {
          this.printSection('Further develop', developCourses)
        }
        //#endregion

        this.canvasContext.fillStyle = '#E0E6EB'
        this.canvasContext.fillRect(0, this.yCoord, this.FILE_MAX_WIDTH, 50)

        // Generating PNG and downloading
        const temp = this.canvas.toDataURL('image/png').replace("image/png", "image/octet-stream")
        saveAs(temp, 'results.png')
      })
  }

  loadImages(balloonsAndBasket: string, cb) {
    let balloonsAndBasketLoaded = false, backgroundLoaded = false;
    const balloonsAndBasketImage = new Image(), backgroundImage = new Image();
    balloonsAndBasketImage.onload = ( () => {
      balloonsAndBasketLoaded = true;
      if (backgroundLoaded) {
        cb({balloonsAndBasketImage, backgroundImage});
      }
    })
    backgroundImage.onload = ( () => {
      backgroundLoaded = true;
      if (balloonsAndBasketLoaded) {
        cb({balloonsAndBasketImage, backgroundImage});
      }
    })
    balloonsAndBasketImage.src = balloonsAndBasket;
    backgroundImage.src = this.commonService.getImagePath('background-results.svg')
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

  ellipsisText(text: string, maxLength: number = 120): string {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }

  printLine(text: string, size: number, variant: string = '', x: number = this.xCoord, y: number = this.yCoord) {
    this.canvasContext.font = `${variant} ${size}px Raleway`
    this.canvasContext.fillText(text, x, y)
    this.yCoord += size;
  }

  printText(text: string, variant: string = '', x: number = this.xCoord, y: number = this.yCoord) {
    this.printLine(text, this.TEXT_SIZE, variant, x, y)
  }

  printHeader(text: string, variant: string = '', x: number = this.xCoord, y: number = this.yCoord) {
    this.printLine(text, this.HEADING_SIZE, variant, x, y)
  }

  printSection(title: string, courses: Course[]): void {
    //#region Printing courses background
    this.canvasContext.fillStyle = '#E0E6EB'
    this.canvasContext.fillRect(0, this.yCoord += this.LINES_SEPARATION, this.FILE_MAX_WIDTH, this.calculateHeightSection(courses))
    //#endregion

    this.xCoord = this.SECTION_PADDING;
    this.canvasContext.font = `${this.HEADING_SIZE}px Raleway`
    this.canvasContext.textAlign = 'left'
    this.canvasContext.textBaseline = 'top'
    this.canvasContext.fillStyle = '#62717A'
    this.yCoord += this.TEXT_SIZE
    this.printHeader(title)

    courses.forEach( (course: Course) => this.printCourse(course))
  }

  printCourse(course: Course) {
    const { id, title, description, link } = course;
    const descriptionSplitted = this.splitTextInLines(this.ellipsisText(description), 60)
    
    //#region Drawing course box
    this.canvasContext.beginPath()
    this.canvasContext.moveTo(this.xCoord, this.yCoord += this.TEXT_SIZE)
    const yStart = this.yCoord
    this.canvasContext.lineTo(this.xCoord = this.FILE_MAX_WIDTH - this.COURSE_PADDING, this.yCoord)
    this.canvasContext.lineTo(this.xCoord, this.yCoord += this.calculateHeightCourse(course))
    this.canvasContext.lineTo(this.xCoord = this.COURSE_PADDING, this.yCoord)
    this.canvasContext.closePath()
    this.canvasContext.fillStyle = '#3FBDA8'
    this.canvasContext.fill()
    //#endregion

    //#region Printing couse info
    this.canvasContext.textBaseline = 'top'
    this.canvasContext.fillStyle = '#F2F3F3'
    this.yCoord = yStart
    this.xCoord += this.COURSE_PADDING; this.yCoord += this.COURSE_PADDING
    this.printText(`#${id} - ${title}`, 'bold')
    descriptionSplitted.forEach( (text: string) => this.printText(text))
    this.printText(link, 'italic')
    //#endregion

    this.xCoord = this.COURSE_PADDING
    this.yCoord += this.LINES_SEPARATION
  }

  calculateHeightCourse(course: Course): number {
    let r = 0;
    r += this.COURSE_PADDING * 2;
    r += this.TEXT_SIZE * (this.splitTextInLines(this.ellipsisText(course.description)).length + 2)
    return r;
  }

  calculateHeightSection(courses: Course[]): number {
    let r = 0;
    r += this.HEADING_SIZE + this.TEXT_SIZE * 2
    courses.forEach( (course: Course) => r += this.calculateHeightCourse(course) + this.LINES_SEPARATION)
    return r;
  }

  calculateHeight(resultsText: string, learningPathwayDescription: string, learningPathway: Course[]): number {
    let r = 0;
    r += this.PADDING
    r += this.IMG_MAX_HEIGHT
    r += this.ITEMS_SEPARATION
    r += this.HEADING_SIZE + 20 + (this.TEXT_SIZE + 10) * this.splitTextInLines(learningPathwayDescription).length
    r += this.calculateHeightSection(learningPathway.filter( (course: Course) => course.priority === 'brush_up').slice(0, 2))
    r += this.calculateHeightSection(learningPathway.filter( (course: Course) => course.priority === 'develpo').slice(0, 1))
    r += 50
    return r;
  }
}
