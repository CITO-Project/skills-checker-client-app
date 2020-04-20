import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { Course } from '../models/course';
import { CommonService } from './common.service';
declare let FontFace: any;

@Injectable({
  providedIn: 'root'
})
export class ResultsSaverService {

  private readonly TEMPORARY_TOP_SEPARATION_RESULTS_TEXT = 150;

  private readonly FILE_MAX_WIDTH = 1000;
  private readonly FILE_MAX_HEIGHT = 2500;
  private readonly IMG_MAX_HEIGHT = 460;

  private readonly HEADING_SIZE = 60;
  private readonly TEXT_SIZE = 40;
  
  private readonly BALLOONS_TEXT_SEPARATION = 150;
  private readonly BALLONS_LEARNING_PATHWAY_SEPARATION = 100;
  private readonly LINES_SEPARATION = 20;

  private readonly PADDING = 60;
  private readonly TITLE_PADDING = 50;
  private readonly BACKGROUND_PADDING_SIDES = 80;
  private readonly BACKGROUND_PADDING_TOP = this.TITLE_PADDING + 100;
  private readonly SECTION_PADDING = 40;
  private readonly COURSE_PADDING = 40;
  private readonly COURSES_BORDER_RADIUS = 40;

  private readonly SPLIT_LEARNING_PATHWAY_DESCRIPTION = 45;
  private readonly SPLIT_COURSE_DESCRIPTION = 47;
  private readonly MAX_LINES_COURSE_DESCRIPTION = 2;

  private readonly LEARNING_PATHWAY_HEADER = 'My Learning Pathway'
  private readonly FILE_HEADER = 'Check-In Take-Off'
  private readonly FILE_DOWNLOAD_NAME = 'SkillsChecker Results.png'

  private readonly BACKGROUND_COLOR = '#fff'
  private readonly GRADIENT_COLOR = '#3FBDA8'
  private readonly LEARNING_PATHWAY_BACKGROUND_COLOR = '#E0E6EB'
  private readonly BRUSH_UP_COLOR = '#3FBDA8'
  private readonly DEVELOP_COLOR = '#2E3C67'

  private readonly TEXT_FONT_FAMILY = 'Raleway'
  private readonly TEXT_FONT_FAMILY_SOURCE = 'https://fonts.gstatic.com/s/raleway/v14/1Ptug8zYS_SKggPNyCMIT5lu.woff2'
  private readonly TEXT_COLOR = '#62717A'
  private readonly TEXT_COLOR_LIGHT = '#F2F3F3'

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
      this.xCoord = 0;
      this.yCoord = 0;
      (new FontFace(this.TEXT_FONT_FAMILY, `url(${this.TEXT_FONT_FAMILY_SOURCE})`)).load().then( () => {
        this.loadResources(graphDataURI, (data) => {
          let tempTextSplit = [], multiplier = 1;
          this.canvasContext.textBaseline = 'top'

          //#region Drawing background
          let backgroundGradient = this.canvasContext.createLinearGradient(this.FILE_MAX_WIDTH / 2, 0, this.FILE_MAX_WIDTH / 2, 500);
          backgroundGradient.addColorStop(0, this.GRADIENT_COLOR);
          backgroundGradient.addColorStop(1, this.BACKGROUND_COLOR);
          this.canvasContext.fillStyle = backgroundGradient;
          this.canvasContext.fillRect(0, 0, this.FILE_MAX_WIDTH, this.FILE_MAX_HEIGHT);
          //#endregion

          //#region Printing header
          this.canvasContext.textAlign = 'center'
          this.canvasContext.fillStyle = this.TEXT_COLOR_LIGHT
          this.yCoord += this.TITLE_PADDING
          this.printHeader(this.FILE_HEADER, 'bold', this.FILE_MAX_WIDTH / 2)
          this.yCoord += this.TITLE_PADDING
          //#endregion
          
          //#region Drawing graph
          multiplier = (this.FILE_MAX_WIDTH - this.BACKGROUND_PADDING_SIDES * 2) / data.backgroundImage.width;
          this.canvasContext.drawImage(
            data.backgroundImage,
            this.BACKGROUND_PADDING_SIDES,
            this.BACKGROUND_PADDING_TOP,
            data.backgroundImage.width * multiplier,
            data.backgroundImage.height * multiplier)
          multiplier = this.IMG_MAX_HEIGHT / data.balloonsAndBasketImage.height;
          this.canvasContext.drawImage(
            data.balloonsAndBasketImage,
            this.PADDING,
            this.yCoord,
            data.balloonsAndBasketImage.width * multiplier,
            data.balloonsAndBasketImage.height * multiplier);
          //#endregion
          
          //#region Writing resultsText
          tempTextSplit = this.splitTextInLines(resultsText, 25);
          this.canvasContext.textAlign = 'left'
          this.canvasContext.fillStyle = this.TEXT_COLOR
          // TODO Need to vertical align this text
          this.yCoord += this.TEMPORARY_TOP_SEPARATION_RESULTS_TEXT;
          tempTextSplit.forEach( (text: string) => {
            this.yCoord += this.LINES_SEPARATION;
            this.printText(text, '', data.balloonsAndBasketImage.width * multiplier + this.BALLOONS_TEXT_SEPARATION)
          })
          this.yCoord = this.IMG_MAX_HEIGHT + this.TITLE_PADDING * 2 + this.TEXT_SIZE
          //#endregion
          
          //#region Printing Pathway description
          this.canvasContext.textAlign = 'center'
          this.xCoord = this.FILE_MAX_WIDTH / 2;
          this.yCoord += this.BALLONS_LEARNING_PATHWAY_SEPARATION
          this.printHeader(this.LEARNING_PATHWAY_HEADER, 'bold')
          this.yCoord += 20
          tempTextSplit = this.splitTextInLines(learningPathwayDescription, this.SPLIT_LEARNING_PATHWAY_DESCRIPTION);
          tempTextSplit.forEach( (text: string) => {
            this.printText(text)
            this.yCoord += 10
          })
          //#endregion
  
          const brushUpCourses = learningPathway.filter( (course: Course) => course.priority === 'brush_up').slice(0, 3)
          const developCourses = learningPathway.filter( (course: Course) => course.priority === 'develop').slice(0, 3)
          
          //#region Printing 'brush_up' courses
          if (brushUpCourses.length > 0) {
            this.printSection('Brush up', brushUpCourses, this.BRUSH_UP_COLOR); 
          }
          //#endregion
          
          //#region Printing 'develop' courses
          if (developCourses.length > 0) {
            this.printSection('Further develop', developCourses, this.DEVELOP_COLOR)
          }
          //#endregion
          
          this.canvasContext.fillStyle = this.LEARNING_PATHWAY_BACKGROUND_COLOR
          this.canvasContext.fillRect(0, this.yCoord += this.COURSES_BORDER_RADIUS / 2, this.FILE_MAX_WIDTH, 50)
  
          // Generating PNG and downloading
          const temp = this.canvas.toDataURL('image/png').replace("image/png", "image/octet-stream")
          saveAs(temp, this.FILE_DOWNLOAD_NAME)
        })
      })
  }

  loadResources(balloonsAndBasket: string, cb) {
    const resourcesReady: boolean[] = [];
    const balloonsAndBasketImage = new Image(), backgroundImage = new Image();
    function isEverythingReady() {
      resourcesReady.push(true)
      // We have to load 3 items: ballonsAndBasket and background
      if (resourcesReady.length >= 2) {
        cb({balloonsAndBasketImage, backgroundImage});
      }
    }
    balloonsAndBasketImage.onload = ( () => isEverythingReady())
    backgroundImage.onload = ( () => isEverythingReady())
    balloonsAndBasketImage.src = balloonsAndBasket;
    backgroundImage.src = this.commonService.getImagePath('background-results.svg')
  }

  splitTextInLines(text: string, charsPerLine: number): string[] {
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

  ellipsisText(text: string, maxLength: number) : string {
    return text.length > maxLength ? text.slice(0, maxLength - 3) + '...' : text
  }

  printLine(text: string, size: number, variant: string = '', x: number = this.xCoord, y: number = this.yCoord) {
    this.canvasContext.font = `${variant} ${size}px ${this.TEXT_FONT_FAMILY}`
    this.canvasContext.fillText(text, x, y)
    this.yCoord += size;
  }

  printText(text: string, variant: string = '', x: number = this.xCoord, y: number = this.yCoord) {
    this.printLine(text, this.TEXT_SIZE, variant, x, y)
  }

  printHeader(text: string, variant: string = '', x: number = this.xCoord, y: number = this.yCoord) {
    this.printLine(text, this.HEADING_SIZE, variant, x, y)
  }

  printSection(title: string, courses: Course[], sectionColor: string = this.BRUSH_UP_COLOR): void {
    //#region Printing courses background
    this.canvasContext.fillStyle = this.LEARNING_PATHWAY_BACKGROUND_COLOR
    this.canvasContext.fillRect(0, this.yCoord += this.LINES_SEPARATION, this.FILE_MAX_WIDTH, this.calculateHeightSection(courses))
    //#endregion

    this.xCoord = this.SECTION_PADDING;
    this.canvasContext.font = `${this.HEADING_SIZE}px ${this.TEXT_FONT_FAMILY}`
    this.canvasContext.textAlign = 'left'
    this.canvasContext.textBaseline = 'top'
    this.canvasContext.fillStyle = this.TEXT_COLOR
    this.yCoord += this.TEXT_SIZE
    this.printHeader(title)

    courses.forEach( (course: Course) => this.printCourse(course, sectionColor))
  }

  printCourse(course: Course, courseColor: string = this.BRUSH_UP_COLOR) {
    const { id, title, description, link } = course;
    // const descriptionSplitted = this.splitTextInLines(this.ellipsisText(description, this.SPLIT_COURSE_DESCRIPTION * 2 - 3), this.SPLIT_COURSE_DESCRIPTION)
    const descriptionSplitted = this.splitTextInLines(description, this.SPLIT_COURSE_DESCRIPTION)
    if (descriptionSplitted.length > this.MAX_LINES_COURSE_DESCRIPTION) {
      descriptionSplitted[this.MAX_LINES_COURSE_DESCRIPTION - 1] = descriptionSplitted[this.MAX_LINES_COURSE_DESCRIPTION - 1].slice(0, -3).concat('...')
    }
    
    //#region Drawing course box
    this.canvasContext.beginPath()
    this.canvasContext.moveTo(this.xCoord, this.yCoord += this.TEXT_SIZE)
    const yStart = this.yCoord
    const courseWidth = this.FILE_MAX_WIDTH - this.COURSE_PADDING * 2
    this.canvasContext.moveTo(this.xCoord, this.yCoord += this.COURSES_BORDER_RADIUS)
    this.canvasContext.quadraticCurveTo(this.xCoord, this.yCoord -= this.COURSES_BORDER_RADIUS, this.xCoord += this.COURSES_BORDER_RADIUS, this.yCoord);
    this.canvasContext.lineTo(this.xCoord += (courseWidth - this.COURSES_BORDER_RADIUS * 2 ), this.yCoord)
    this.canvasContext.quadraticCurveTo(this.xCoord += this.COURSES_BORDER_RADIUS, this.yCoord, this.xCoord, this.yCoord += this.COURSES_BORDER_RADIUS);
    this.canvasContext.lineTo(this.xCoord, this.yCoord += this.calculateHeightCourse(course) - this.COURSES_BORDER_RADIUS * 2)
    this.canvasContext.quadraticCurveTo(this.xCoord, this.yCoord += this.COURSES_BORDER_RADIUS, this.xCoord -= this.COURSES_BORDER_RADIUS, this.yCoord);
    this.canvasContext.lineTo(this.xCoord -= (courseWidth - this.COURSES_BORDER_RADIUS * 2), this.yCoord)
    this.canvasContext.quadraticCurveTo(this.xCoord -= this.COURSES_BORDER_RADIUS, this.yCoord, this.xCoord, this.yCoord - this.COURSES_BORDER_RADIUS);
    this.canvasContext.closePath()
    this.canvasContext.fillStyle = courseColor
    this.canvasContext.fill()
    //#endregion

    //#region Printing couse info
    this.yCoord = yStart
    this.canvasContext.textBaseline = 'top'
    this.canvasContext.fillStyle = this.TEXT_COLOR_LIGHT
    this.xCoord += this.COURSE_PADDING; this.yCoord += this.COURSE_PADDING
    this.printText(`#${id} - ${title}`, 'bold')
    descriptionSplitted.slice(0, this.MAX_LINES_COURSE_DESCRIPTION).forEach( (text: string) => this.printText(text))
    this.printText(link, 'italic')
    //#endregion

    this.xCoord = this.COURSE_PADDING
    this.yCoord += this.LINES_SEPARATION
  }

  calculateHeightCourse(course: Course): number {
    let r = 0;
    const numberLinesCourseDescription = this.splitTextInLines(course.description, this.SPLIT_COURSE_DESCRIPTION).length
    r += this.COURSE_PADDING * 2;
    r += this.TEXT_SIZE * (( numberLinesCourseDescription > this.MAX_LINES_COURSE_DESCRIPTION ? this.MAX_LINES_COURSE_DESCRIPTION : numberLinesCourseDescription) + 2)
    return r;
  }

  calculateHeightSection(courses: Course[]): number {
    let r = 0;
    r += this.LINES_SEPARATION + this.HEADING_SIZE + this.TEXT_SIZE
    courses.forEach( (course: Course) => r += this.calculateHeightCourse(course) + this.LINES_SEPARATION)
    return r;
  }

  calculateHeight(resultsText: string, learningPathwayDescription: string, learningPathway: Course[]): number {
    let r = 0;
    r += this.TITLE_PADDING * 2 + this.HEADING_SIZE
    r += this.IMG_MAX_HEIGHT + this.BALLONS_LEARNING_PATHWAY_SEPARATION
    r += this.HEADING_SIZE + 20 + (this.TEXT_SIZE + 10) * this.splitTextInLines(learningPathwayDescription, this.SPLIT_LEARNING_PATHWAY_DESCRIPTION).length
    r += this.calculateHeightSection(learningPathway.filter( (course: Course) => course.priority === 'brush_up').slice(0, 3))
    r += this.calculateHeightSection(learningPathway.filter( (course: Course) => course.priority === 'develop').slice(0, 3))
    r += 50
    return r;
  }
}
