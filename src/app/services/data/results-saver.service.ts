import { Injectable } from '@angular/core';

import { Course } from '../../models/course';

import { CommonService } from '../common.service';
import { CanvasManagerService } from '../etc/canvas-manager.service';
import { StringManagerService } from '../etc/string-manager.service';

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
  private readonly TEXTS_SEPARATION = 20;

  private readonly PADDING = 60;
  private readonly TITLE_PADDING = 50;
  private readonly BACKGROUND_PADDING_SIDES = 80;
  private readonly BACKGROUND_PADDING_TOP = this.TITLE_PADDING + 100;
  private readonly SECTION_PADDING = 40;
  private readonly COURSE_PADDING = 40;
  private readonly COURSES_BORDER_RADIUS = 40;
  private readonly BOTTOM_PADDING = 50;

  private readonly SPLIT_RESULTS_TEXT = 25;
  private readonly SPLIT_LEARNING_PATHWAY_DESCRIPTION = 45;
  private readonly SPLIT_COURSE_DESCRIPTION = 47;
  private readonly MAX_LINES_COURSE_DESCRIPTION = 2;

  private readonly FILE_DOWNLOAD_NAME = 'SkillsChecker Results.png';

  private readonly BACKGROUND_COLOR = '#fff';
  private readonly GRADIENT_COLOR = '#3FBDA8';
  private readonly LEARNING_PATHWAY_BACKGROUND_COLOR = '#E0E6EB';
  private readonly BRUSH_UP_COLOR = '#3FBDA8';
  private readonly DEVELOP_COLOR = '#2E3C67';

  private readonly TEXT_FONT_FAMILY = 'Raleway';
  private readonly TEXT_FONT_FAMILY_SOURCE = 'https://fonts.gstatic.com/s/raleway/v14/1Ptug8zYS_SKggPNyCMIT5lu.woff2';
  private readonly TEXT_COLOR = '#62717A';
  private readonly TEXT_COLOR_LIGHT = '#F2F3F3';

  private canvastemp: CanvasManagerService;

  constructor(
    private commonService: CommonService,
    private stringManagerService: StringManagerService
  ) { }

  async generateImage(
    graphDataURI: string,
    header: string,
    resultsText: string,
    learningPathwayHeader: string,
    learningPathwayDescription: string[],
    learningPathway: Course[]
    ): Promise<void> {
      this.canvastemp = new CanvasManagerService(
        this.calculateHeight(resultsText, learningPathwayDescription, learningPathway),
        this.FILE_MAX_WIDTH);
      if (!this.canvastemp) {
        this.commonService.error('results-saver.service.ts [generateImage()] ERROR_CREATING_CANVAS', this.canvastemp);
        return;
      }
      await this.canvastemp.loadFont(this.TEXT_FONT_FAMILY, this.TEXT_FONT_FAMILY_SOURCE);
      let multiplier = 1;
      this.paintBackground(this.canvastemp.getCanvasContext());

      //#region Printing header
      this.canvastemp.setColour(this.TEXT_COLOR_LIGHT);
      this.canvastemp.addY(this.TITLE_PADDING);
      this.canvastemp.setTextAlignment('center');
      this.printHeader(header, 'bold', this.FILE_MAX_WIDTH / 2);
      this.canvastemp.addY(this.TITLE_PADDING);
      //#endregion


      //#region Drawing graph
      await this.canvastemp.loadResource(this.commonService.getImagePath('background-results.svg'))
        .then( (backgroundImage: any) => {
          multiplier = (this.FILE_MAX_WIDTH - this.BACKGROUND_PADDING_SIDES * 2) / backgroundImage.width;
          this.canvastemp.getCanvasContext().drawImage(
            backgroundImage,
            this.BACKGROUND_PADDING_SIDES,
            this.BACKGROUND_PADDING_TOP,
            backgroundImage.width * multiplier,
            backgroundImage.height * multiplier);
      });
      await this.canvastemp.loadResource(graphDataURI).then( (balloonsAndBasketImage: any) => {
        multiplier = this.IMG_MAX_HEIGHT / balloonsAndBasketImage.height;
        this.canvastemp.setX(balloonsAndBasketImage.width * multiplier);
        this.canvastemp.getCanvasContext().drawImage(
          balloonsAndBasketImage,
          this.PADDING,
          this.canvastemp.getY(),
          balloonsAndBasketImage.width * multiplier,
          balloonsAndBasketImage.height * multiplier);
      });
      //#endregion

      //#region Writing resultsText
      this.canvastemp.setTextAlignment('left');
      this.canvastemp.setColour(this.TEXT_COLOR);
      // TODO Need to vertical align this text
      this.canvastemp.addY(this.TEMPORARY_TOP_SEPARATION_RESULTS_TEXT);
      this.canvastemp.addX(this.BALLOONS_TEXT_SEPARATION);
      this.stringManagerService.splitTextInLines(resultsText, this.SPLIT_RESULTS_TEXT).forEach( (text: string) => {
        this.canvastemp.addY(this.LINES_SEPARATION);
        this.printText(text, '');
      });
      this.canvastemp.setY(this.IMG_MAX_HEIGHT + this.TITLE_PADDING * 2 + this.TEXT_SIZE);
      //#endregion

      //#region Printing Pathway description
      this.canvastemp.setX(this.FILE_MAX_WIDTH / 2);
      this.canvastemp.addY(this.BALLONS_LEARNING_PATHWAY_SEPARATION);
      this.canvastemp.setTextAlignment('center');
      this.printHeader(learningPathwayHeader, 'bold');
      this.canvastemp.addY(this.TEXTS_SEPARATION);
      this.canvastemp.setTextAlignment('center');
      learningPathwayDescription.forEach( (line: string) => {
        this.stringManagerService.splitTextInLines(
          line, this.SPLIT_LEARNING_PATHWAY_DESCRIPTION)
          .forEach( (text: string) => {
            this.printText(text);
            this.canvastemp.addY(10);
        });
        this.canvastemp.addY(this.TEXTS_SEPARATION);
      });
      //#endregion

      const brushUpCourses = learningPathway.filter( (course: Course) => course.priority === 'brush_up');
      const developCourses = learningPathway.filter( (course: Course) => course.priority === 'develop');

      //#region Printing 'brush_up' courses
      this.canvastemp.setTextAlignment('left');
      if (brushUpCourses.length > 0) {
        this.printSection('Oppfrisking', brushUpCourses, this.BRUSH_UP_COLOR);
      }
      //#endregion

      //#region Printing 'develop' courses
      if (developCourses.length > 0) {
        this.printSection('Videreutvikle', developCourses, this.DEVELOP_COLOR);
      }
      this.canvastemp.addY(this.COURSES_BORDER_RADIUS / 2);
      //#endregion

      this.canvastemp.setColour(this.LEARNING_PATHWAY_BACKGROUND_COLOR);
      this.canvastemp.setX(0);
      this.canvastemp.drawBox(this.FILE_MAX_WIDTH, this.BOTTOM_PADDING);

      this.canvastemp.downloadImage(this.FILE_DOWNLOAD_NAME);
  }

  printText(text: string, variant: string = '', x?: number, y?: number) {
    this.canvastemp.setFont(this.TEXT_SIZE, variant);
    this.canvastemp.printLine(text, x, y);
  }

  printHeader(text: string, variant: string = '', x?: number, y?: number) {
    this.canvastemp.setFont(this.HEADING_SIZE, variant);
    this.canvastemp.printLine(text, x, y);
  }

  printSection(title: string, courses: Course[], sectionColor: string = this.BRUSH_UP_COLOR): void {
    //#region Printing courses background
    this.canvastemp.setColour(this.LEARNING_PATHWAY_BACKGROUND_COLOR);
    this.canvastemp.addY(this.LINES_SEPARATION);
    this.canvastemp.drawBox(this.FILE_MAX_WIDTH, this.calculateHeightSection(courses), 0, 0);
    //#endregion

    this.canvastemp.setX(this.SECTION_PADDING);
    this.canvastemp.setFont(this.HEADING_SIZE, '', this.TEXT_FONT_FAMILY);
    this.canvastemp.setTextAlignment('left');
    this.canvastemp.setColour(this.TEXT_COLOR);
    this.canvastemp.addY(this.TEXT_SIZE);
    this.printHeader(title);

    courses.forEach( (course: Course) => this.printCourse(course, sectionColor));
  }

  printCourse(course: Course, courseColor: string = this.BRUSH_UP_COLOR) {
    const { id, title, description, link } = course;
    const descriptionSplitted = this.stringManagerService.splitTextInLines(description, this.SPLIT_COURSE_DESCRIPTION);
    if (descriptionSplitted.length > this.MAX_LINES_COURSE_DESCRIPTION) {
      descriptionSplitted[this.MAX_LINES_COURSE_DESCRIPTION - 1] =
      descriptionSplitted[this.MAX_LINES_COURSE_DESCRIPTION - 1].slice(0, -3).concat('...');
    }

    //#region Drawing course box
    this.canvastemp.addY(this.TEXT_SIZE);
    this.canvastemp.setColour(courseColor);
    this.canvastemp.drawBox(
      this.FILE_MAX_WIDTH - this.COURSE_PADDING * 2,
      this.calculateHeightCourse(course),
      this.COURSES_BORDER_RADIUS
    );
    //#endregion

    //#region Printing couse info
    this.canvastemp.setColour(this.TEXT_COLOR_LIGHT);
    this.canvastemp.addX(this.COURSE_PADDING);
    this.canvastemp.addY(this.COURSE_PADDING);
    this.printText(`#${id} - ${title}`, 'bold');
    descriptionSplitted.slice(0, this.MAX_LINES_COURSE_DESCRIPTION).forEach( (text: string) => this.printText(text));
    this.printText(link, 'italic');
    //#endregion

    this.canvastemp.setX(this.COURSE_PADDING);
    this.canvastemp.addY(this.LINES_SEPARATION);
  }

  calculateHeightCourse(course: Course): number {
    let r = 0;
    const numberLinesCourseDescription = this.stringManagerService.splitTextInLines(
      course.description,
      this.SPLIT_COURSE_DESCRIPTION
      ).length;
    r += this.COURSE_PADDING * 2;
    r += this.TEXT_SIZE * (
      ( numberLinesCourseDescription > this.MAX_LINES_COURSE_DESCRIPTION ?
        this.MAX_LINES_COURSE_DESCRIPTION :
        numberLinesCourseDescription) + 2);
    return r;
  }

  calculateHeightSection(courses: Course[]): number {
    let r = 0;
    r += this.LINES_SEPARATION + this.HEADING_SIZE + this.TEXT_SIZE;
    courses.forEach( (course: Course) => r += this.calculateHeightCourse(course) + this.LINES_SEPARATION);
    return r;
  }

  calculateHeight(resultsText: string, learningPathwayDescription: string[], learningPathway: Course[]): number {
    // TODO add resultsText in case it is longer than the image
    let r = 0;
    r += this.TITLE_PADDING * 2 + this.HEADING_SIZE;
    r += this.IMG_MAX_HEIGHT + this.BALLONS_LEARNING_PATHWAY_SEPARATION;
    r += this.HEADING_SIZE + this.TEXTS_SEPARATION;
    learningPathwayDescription.forEach( (text: string) => {
      r += (this.TEXT_SIZE + 10) * this.stringManagerService.splitTextInLines(
        text,
        this.SPLIT_LEARNING_PATHWAY_DESCRIPTION
      ).length;
      r += this.TEXTS_SEPARATION;
    });
    r += this.calculateHeightSection(learningPathway.filter( (course: Course) => course.priority === 'brush_up'));
    r += this.calculateHeightSection(learningPathway.filter( (course: Course) => course.priority === 'develop'));
    r += this.BOTTOM_PADDING;
    return r;
  }

  paintBackground(canvasContext: CanvasRenderingContext2D) {
    const backgroundGradient = canvasContext.createLinearGradient(
      this.FILE_MAX_WIDTH / 2,
      0,
      this.FILE_MAX_WIDTH / 2,
      500);
    backgroundGradient.addColorStop(0, this.GRADIENT_COLOR);
    backgroundGradient.addColorStop(1, this.BACKGROUND_COLOR);
    canvasContext.fillStyle = backgroundGradient;
    canvasContext.fillRect(0, 0, this.FILE_MAX_WIDTH, this.FILE_MAX_HEIGHT);
  }
}
