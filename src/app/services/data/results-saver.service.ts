import { Injectable } from '@angular/core';
import { ScenariosScreenComponent } from 'src/app/components/screens/scenarios-screen/scenarios-screen.component';
import { ChallengingScenario } from 'src/app/models/scenario-result';
import { environment } from 'src/environments/environment';

import { Course } from '../../models/course';

import { CommonService } from '../common.service';
import { CanvasManagerService } from '../etc/canvas-manager.service';
import { StringManagerService } from '../etc/string-manager.service';

@Injectable({
  providedIn: 'root'
})
export class ResultsSaverService {

  private readonly FILE_MAX_WIDTH = 2000;
  private readonly IMG_MAX_HEIGHT = 460;

  private readonly TITLE_SIZE = 60;
  private readonly TEXT_SIZE = 40;

  private readonly BALLOONS_TEXT_SEPARATION = 150;
  private readonly BALLOONS_LEARNING_PATHWAY_SEPARATION = 100;
  private readonly TITLE_LINES_SEPARATION = 20;
  private readonly LINES_SEPARATION = 10;
  private readonly TEXTS_SEPARATION = 20;

  private readonly PADDING_BALLOONS = 60;
  private readonly TITLE_PADDING = 50;
  private readonly RESULTS_TEXT_TOP_PADDING = 150;
  private readonly BACKGROUND_PADDING_SIDES = 80;
  private readonly BACKGROUND_PADDING_TOP = this.TITLE_PADDING + 100;
  private readonly SECTION_PADDING = 40;
  private readonly COURSE_MARGIN = 40;
  private readonly COURSES_BORDER_RADIUS = 40;
  private readonly BOTTOM_PADDING = 50;

  private readonly SPLIT_RESULTS_TEXT = 50;
  private readonly SPLIT_LEARNING_PATHWAY_DESCRIPTION = 45;
  private readonly SPLIT_COURSE_TEXTS = 100;

  private readonly MAX_LINES_RESULTS_TEXT = 5;
  private readonly MAX_LINES_COURSE_DESCRIPTION = 2;

  private readonly FILE_DOWNLOAD_NAME = $localize`:@@filename:SkillsChecker Results.png`;

  private readonly BACKGROUND_COLOR = '#fff';
  private readonly GRADIENT_COLOR = '#3FBDA8';
  private readonly SECTION_BACKGROUND_COLOR = '#E0E6EB';
  private readonly BRUSH_UP_COLOR = '#3FBDA8';
  private readonly DEVELOP_COLOR = '#2E3C67';

  private readonly TEXT_FONT_FAMILY = 'Raleway';
  private readonly TEXT_FONT_FAMILY_SOURCE = 'https://fonts.gstatic.com/s/raleway/v14/1Ptug8zYS_SKggPNyCMIT5lu.woff2';
  //private readonly TEXT_COLOR = '#62717A';
  private readonly TEXT_COLOR = '#2E3C67';
  private readonly TEXT_COLOR_LIGHT = '#F2F3F3';

  private canvasManager: CanvasManagerService;

  constructor(
    private commonService: CommonService,
    private stringManagerService: StringManagerService
  ) { }

  async generateImage(
    graphDataURI: string,
    header: string,
    scenarios: ChallengingScenario[],
    resultsText: string,
    interest: string,
    learningPathwayHeader: string,
    learningPathwayDescription: string[],
    learningPathway: Course[]
    ): Promise<void> {
      this.canvasManager = new CanvasManagerService();
      this.canvasManager.createCanvas(
        this.calculateHeight(resultsText, learningPathwayDescription, learningPathway, scenarios.length),
        this.FILE_MAX_WIDTH);
      if (!this.canvasManager) {
        this.commonService.error('results-saver.service.ts [generateImage()] ERROR_CREATING_CANVAS', this.canvasManager);
        return;
      }
      await this.canvasManager.loadFont(this.TEXT_FONT_FAMILY, this.TEXT_FONT_FAMILY_SOURCE);
      this.paintBackground(this.canvasManager.getCanvasContext(), resultsText);
      await this.printHeader(header, graphDataURI, resultsText, interest, scenarios);
      this.canvasManager.setColour(this.BACKGROUND_COLOR);
      this.canvasManager.drawBox(this.FILE_MAX_WIDTH, this.BALLOONS_LEARNING_PATHWAY_SEPARATION, 0, 0);
      this.canvasManager.addY(this.BALLOONS_LEARNING_PATHWAY_SEPARATION);
      this.canvasManager.drawBox(this.FILE_MAX_WIDTH, this.calculateHeightDescription(learningPathwayDescription), 0, 0);
      this.canvasManager.setColour(this.TEXT_COLOR);

      if( learningPathway.length > 0 ) {
        this.printDescription(learningPathwayHeader, learningPathwayDescription);

        const brushUpCourses = learningPathway.filter( (course: Course) => course.priority === 'brush_up');
        const developCourses = learningPathway.filter( (course: Course) => course.priority === 'develop');

        //#region Printing 'brush_up' courses
        this.canvasManager.setTextAlignment('left');
        if (brushUpCourses.length > 0) {
          this.printSection($localize`:@@brushUp:Brush up`, brushUpCourses, this.BRUSH_UP_COLOR);
        }
        //#endregion

        //#region Printing 'develop' courses
        if (developCourses.length > 0) {
          this.printSection($localize`:@@furtherDevelop:Further develop`, developCourses, this.DEVELOP_COLOR);
        }
        //#endregion

        this.paintBottom(
          (brushUpCourses.length + developCourses.length) > 0 ?
          this.SECTION_BACKGROUND_COLOR :
          this.BACKGROUND_COLOR
        );
      }

      this.canvasManager.downloadImage(this.FILE_DOWNLOAD_NAME);
  }

  printTextLine(text: string, variant: string = '', x?: number, y?: number) {
    this.canvasManager.setFont(this.TEXT_SIZE, variant);
    this.canvasManager.printLine(text, x, y);
  }

  printText(text: string, variant: string = '') {
    this.canvasManager.setFont(this.TEXT_SIZE, variant);
    this.canvasManager.print(text);
  }

  printTextLineSplit(text: string, variant: string = '', x?: number, y?: number) {

    const resultsTextSplitted = this.stringManagerService.splitTextInLines(text, this.SPLIT_RESULTS_TEXT);
    resultsTextSplitted.forEach( (text: string) => {
      this.printTextLine(text, variant);
    });

  }

  printTitle(text: string, variant: string = '', x?: number, y?: number) {
    this.canvasManager.setFont(this.TITLE_SIZE, variant);
    this.canvasManager.printLine(text, x, y);
  }


  printTitleCentre(text: string, variant: string = '', x?: number, y?: number) {
    
    let alignment = this.canvasManager.getTextAlignment();

    // Move the X position to the centre of the document
    this.canvasManager.setX(this.FILE_MAX_WIDTH - (this.FILE_MAX_WIDTH/2));
    this.canvasManager.setTextAlignment('center');

    this.printTitle( text, variant, x, y );

    // Move the X position back to the default value
    this.canvasManager.setX( this.BACKGROUND_PADDING_SIDES );

    // Set the Text Alignment back to the original setting
    this.canvasManager.setTextAlignment( alignment );
  }

  async printHeader(header: string, balloonsAndBasketURI: string, resultsText: string, interest: string, scenarios: ChallengingScenario[]): Promise<void> {
    let multiplier = 1;
    //#region Printing header
    this.canvasManager.setColour(this.TEXT_COLOR_LIGHT);
    this.canvasManager.addY(this.TITLE_PADDING);
    this.canvasManager.setTextAlignment('center');
    this.printTitle(header, 'bold', this.FILE_MAX_WIDTH / 2);
    this.canvasManager.addY(this.TITLE_PADDING);
    const tempY = this.canvasManager.getY();
    //#endregion


    //#region Drawing graph
    await this.canvasManager.loadResource(this.commonService.getImagePath('background-results.svg'))
      .then( (backgroundImage: any) => {
        multiplier = (this.FILE_MAX_WIDTH - this.BACKGROUND_PADDING_SIDES * 2) / backgroundImage.width;
        multiplier = multiplier*2;
        this.canvasManager.getCanvasContext().drawImage(
          backgroundImage,
          this.BACKGROUND_PADDING_SIDES,
          this.BACKGROUND_PADDING_TOP,
          backgroundImage.width * multiplier,
          backgroundImage.height * multiplier);
    });
    await this.canvasManager.loadResource(balloonsAndBasketURI).then( (balloonsAndBasketImage: any) => {
      multiplier = this.IMG_MAX_HEIGHT / balloonsAndBasketImage.height;
      multiplier = multiplier*2;
      this.canvasManager.setX(balloonsAndBasketImage.width * multiplier);
      this.canvasManager.getCanvasContext().drawImage(
        balloonsAndBasketImage,
        this.PADDING_BALLOONS,
        this.canvasManager.getY(),
        balloonsAndBasketImage.width * multiplier,
        balloonsAndBasketImage.height * multiplier);
    });
    //#endregion

    //#region Writing resultsText
    this.canvasManager.setTextAlignment('left');
    this.canvasManager.setColour(this.TEXT_COLOR);
    this.canvasManager.setY(tempY);
    this.canvasManager.addY(this.RESULTS_TEXT_TOP_PADDING);
    this.canvasManager.addY( 150 ); // some extra vertical space to better centre text with balloon graphic
    this.canvasManager.addX(this.BALLOONS_TEXT_SEPARATION);
    const resultsTextSplitted = this.stringManagerService.splitTextInLines(resultsText, this.SPLIT_RESULTS_TEXT);
    resultsTextSplitted.forEach( (text: string) => {
      this.printTextLine(text, 'bold');
      this.canvasManager.addY(this.TITLE_LINES_SEPARATION);
    });

    this.printTextLineSplit($localize`You\'re on your way to achieving your goal to:`);
    
    this.printTextLine('');

    this.printTextLineSplit(interest, 'bold');

    this.printTextLine('');

    this.printTextLineSplit($localize`:@@balloonDescription:The balloons will give you an idea of your skill level. The bigger the balloon, the stronger your skill in this area is!`);

    this.canvasManager.setX( this.BACKGROUND_PADDING_SIDES );
    this.canvasManager.setY( 1150 );


    let scenario_count_str = ''
    let task_str = $localize`everyday tasks`;

    if( scenarios.length == 4) {
      scenario_count_str = $localize`four`;
    }
    else if( scenarios.length == 3) {
      scenario_count_str = $localize`three`;
    }
    else if( scenarios.length == 2) {
      scenario_count_str = $localize`two`;
    }
    else if( scenarios.length == 1) {
      scenario_count_str = $localize`one`;
      task_str = $localize`everyday task`;
    }
    else {
      scenario_count_str = $localize`a number of`;
    }

    this.printTitleCentre( $localize`My Skills Summary`, 'bold' );
    this.canvasManager.addY(this.TITLE_LINES_SEPARATION);

    let summaryStr = $localize`You looked at ${scenario_count_str} ${task_str}.`;

    if( scenarios.length > 0 ) {
      summaryStr += ' ' + $localize`You found aspects of the following ${task_str} challenging:`
    }

    this.printText( summaryStr );

    this.printTextLine('');
    this.printTextLine('');

    //console.log( 'Scenarios: ', scenarios );
    
    scenarios.forEach( (scen: ChallengingScenario) => {
      this.printTextLine(scen.name, 'bold');

      // add a little spacing below the scenario title
      this.canvasManager.addY(this.TITLE_LINES_SEPARATION);

      this.printText( $localize`You identified that you found ` );

      let task_str = '';

      // scen.aspect.forEach( ({name}, index, arr ) => {
        
      //   if( index > 0 ) {
      //     if( index != (arr.length - 1)) {
      //       task_str = task_str + ', ';
      //     }
      //     else {
      //       //task_str = task_str + ' ' + $localize`:@@and_punctuation:and` + ' ';
      //       task_str = task_str + $localize`:@@and_punctuation:and` + ' ';
      //     }
      //   }

      //   task_str = task_str + name.toLowerCase();
      // })

      // console.log( "Task String: '" + task_str + "'" );

      // var localisedText = $localize`${task_str} ${scen.level}`;
      
      // this.printText( localisedText + '.', 'bold' );
      //this.printText( '.' );

      scen.aspect.forEach( ({name}, index, arr ) => {

        if( index > 0 ) {

          var join_str = '';

          if( index != (arr.length - 1)) {
            join_str = $localize`:@@task_action_quotation_end:` + ', ' + $localize`:@@task_action_quotation_start:`;
          }
          else {
            //task_str = task_str + ' ' + $localize`:@@and_punctuation:and` + ' ';
            //join_str = $localize`:@@and_punctuation:and`;
            join_str = $localize`:@@task_action_quotation_end:` + ' ' + $localize`and` + ' ' + $localize`:@@task_action_quotation_start:`
          }

          this.printText( join_str );
        }

        this.printText( name.toLowerCase(), 'bold' );
      })

      this.printText( $localize`:@@task_action_quotation_end:`);

      this.printText( ' ' + scen.level + '. ', 'bold' );

      if( scen.level === 'a little difficult' || scen.level === 'difficult') {
        this.printText( $localize`Take the next step to achieve your goal by brushing up on your ` );
      }
      else {
        this.printText( $localize`You can reach your goal by developing your ` );
      }

      let skills_str = '';
      
      scen.aspect.forEach( ({skill}, index, arr) => {
        
        if( index > 0 ) {
          if( index != (arr.length - 1)) {
            skills_str = skills_str + ', ';
          }
          else {
            skills_str = skills_str + ' ' + $localize`and` + ' ';
          }
        }

        skills_str = skills_str + skill;

        //this.printText( skill, 'bold' );
      })

      var localisedWord = $localize`skills`

      if( localisedWord.length > 0 ) {
        console.log( 'localisedWord is \'' + localisedWord + '\'' );
        skills_str = skills_str + ' ' + localisedWord;
      }
      else {
        console.log( 'localisedWord is empty' );
        console.log( '\'' + skills_str + '\'' );
      }


      this.printText( skills_str.toLowerCase(), 'bold' );

      //console.log( 'scen.independence: ' + scen.independence );

      if(scen.independence == 0) {

        // User answered 'yes' [0] to question about needing help to do this task
        let todo_str = $localize`:@@doThisTaskSimple: to do this task `;

        if( scen.aspect.length > 1 ) {
          todo_str = $localize`:@@doTheseTasksSimple: to do these tasks `;
        }

        this.printText( todo_str );
        this.printText( $localize`without help.`, 'bold' );
      }
      else if( scen.fluency == 1 || scen.confidence == 1 ) {
        this.printText( ', ' + $localize`:@@doSimilarTasksSimple:so that you can do similar tasks ` );

        let dimension_str = ''
        
        if( scen.fluency == 1 ) {
          dimension_str = dimension_str + $localize`faster`;
        }

        if( scen.fluency == 1 && scen.confidence == 1 ) {
          dimension_str = dimension_str + ' ' + $localize`and` + ' ';
        }

        if( scen.confidence == 1 ) {
          dimension_str = dimension_str +$localize`with more confidence`;
        }

        dimension_str = dimension_str + '.';

        this.printText( dimension_str, 'bold' );
      }

      this.printTextLine( '' );
      this.printTextLine( '' );
    });

    if( scenarios.length > 0 ) {
      let str = $localize`Check out the courses below and find one that\'s right for you.`;

      this.printTextLine( str );
    }
    else {
      this.printText( $localize`:@@easyPathMsgOne:You have shown that you have strong reading, writing, maths and computer skills.` );
      this.printTextLine('');
      this.printTextLine('');
      this.printText( $localize`:@@easyPathMsgTwo:Take the next step by developing your skills further.` );
      this.printTextLine('');
      this.printTextLine('');
      this.printText( $localize`:@@easyPathMsgThree:Call NALA today on 1800 20 20 65 to chat about your options or check out www.fetchcourses.ie to find a course that is right for you.` );
    }

    this.printTextLine('');
    this.printTextLine('');

    //#endregion
  }

  printDescription(title: string, description: string[]): void {
    this.canvasManager.setX(this.FILE_MAX_WIDTH - (this.FILE_MAX_WIDTH/2));
    this.canvasManager.setTextAlignment('center');
    this.printTitle(title, 'bold');
    this.canvasManager.addY(this.TEXTS_SEPARATION);
    // this.canvasManager.setTextAlignment('center');
    // description.forEach( (line: string) => {
    //   this.stringManagerService.splitTextInLines(
    //     line, 60)
    //     .forEach( (text: string) => {
    //       this.printTextLine(text);
    //       this.canvasManager.addY(this.LINES_SEPARATION);
    //   });
    //   this.canvasManager.addY(this.TEXTS_SEPARATION);
    // });
  }

  printSection(title: string, courses: Course[], sectionColor: string = this.BRUSH_UP_COLOR): void {
    //#region Printing courses background
    this.canvasManager.setColour(this.SECTION_BACKGROUND_COLOR);
    this.canvasManager.drawBox(this.FILE_MAX_WIDTH, this.calculateHeightSection(courses), 0, 0);
    //#endregion

    this.canvasManager.setX(this.SECTION_PADDING);
    this.canvasManager.setFont(this.TITLE_SIZE, '', this.TEXT_FONT_FAMILY);
    this.canvasManager.setTextAlignment('left');
    this.canvasManager.setColour(this.TEXT_COLOR);
    this.canvasManager.addY(this.TEXT_SIZE);
    this.printTitle(title);

    courses.forEach( (course: Course) => {
      this.canvasManager.addY(this.COURSE_MARGIN);
      this.printCourse(course, sectionColor);
    });
  }

  printCourse(course: Course, courseColor: string = this.BRUSH_UP_COLOR) {
    const { title, description, link } = course;
    const descriptionSplitted = this.stringManagerService.splitTextInLines(description, this.SPLIT_COURSE_TEXTS);
    if (descriptionSplitted.length > this.MAX_LINES_COURSE_DESCRIPTION) {
      descriptionSplitted[this.MAX_LINES_COURSE_DESCRIPTION - 1] =
      descriptionSplitted[this.MAX_LINES_COURSE_DESCRIPTION - 1].slice(0, -3).concat('...');
    }

    //#region Drawing course box
    this.canvasManager.setColour(courseColor);
    this.canvasManager.drawBox(
      this.FILE_MAX_WIDTH - this.COURSE_MARGIN * 2,
      this.calculateHeightCourse(course),
      this.COURSES_BORDER_RADIUS
    );
    //#endregion

    //#region Printing couse info
    this.canvasManager.setColour(this.TEXT_COLOR_LIGHT);
    this.canvasManager.addX(this.COURSE_MARGIN);
    this.canvasManager.addY(this.COURSE_MARGIN);
    if (!!course.title) {
      // tslint:disable-next-line: max-line-length
      this.printTextLine(this.stringManagerService.ellipsisText(title, this.SPLIT_COURSE_TEXTS), 'bold');
    }
    //descriptionSplitted.slice(0, this.MAX_LINES_COURSE_DESCRIPTION).forEach( (text: string) => this.printTextLine(text));

    // add some space between course description and contact information
    this.printTextLine('');

    if(environment.download.level && !!course.level) {
      this.printTextLine($localize`Course Level: ${course.level}`);
    }
    if (!!course.contact_telephone) {
      // tslint:disable-next-line: max-line-length
      this.printTextLine(this.stringManagerService.ellipsisText($localize`Phone: ${course.contact_telephone}`, this.SPLIT_COURSE_TEXTS), 'italic');
    }
    if (!!course.link) {
      this.printTextLine(this.stringManagerService.ellipsisText($localize`Web: ${link}`, this.SPLIT_COURSE_TEXTS), 'italic');
    }
    //#endregion

    this.canvasManager.setX(this.COURSE_MARGIN);
    this.canvasManager.addY(this.COURSE_MARGIN);
  }

  calculateHeightHeader(resultsText: string): number {
    let r = 0;
    r += this.TITLE_PADDING * 2 + this.TITLE_SIZE;
    const resultsTextLines = this.stringManagerService.splitTextInLines(resultsText, this.SPLIT_RESULTS_TEXT).length;
    if (resultsTextLines > this.MAX_LINES_RESULTS_TEXT) {
      r += this.RESULTS_TEXT_TOP_PADDING;
      r += (this.TEXT_SIZE + this.TITLE_LINES_SEPARATION) * resultsTextLines;
    } else {
      r += this.IMG_MAX_HEIGHT;
    }
    return r;
  }

  calculateHeightDescription(description: string[]): number {
    let r = 0;
    r += this.TITLE_SIZE + this.TEXTS_SEPARATION;
    description.forEach( (line: string) => {
      this.stringManagerService.splitTextInLines(
        line, this.SPLIT_LEARNING_PATHWAY_DESCRIPTION
      ).forEach( () => {
        r += this.TEXT_SIZE + this.LINES_SEPARATION;
      });
      r += this.TEXTS_SEPARATION;
    });
    return r;
  }

  calculateHeightCourse(course: Course): number {
    let r = 0;
    // let numberLinesCourseDescription = this.stringManagerService.splitTextInLines(
    //   course.description,
    //   this.SPLIT_COURSE_TEXTS
    //   ).length;
    // if (numberLinesCourseDescription >= this.MAX_LINES_COURSE_DESCRIPTION) {
    //   numberLinesCourseDescription = this.MAX_LINES_COURSE_DESCRIPTION;
    // }
    // r += this.COURSES_BORDER_RADIUS * 2;
    let lines = 3;
    if (!!course.title) {
      lines++;
    }
    if (!!course.contact_telephone) {
      lines++;
    }
    if (!!course.link) {
      lines++;
    }
    if( environment.download.level ) {
      lines++;
    }
    //r += this.TEXT_SIZE * (numberLinesCourseDescription + lines);
    r += this.TEXT_SIZE * lines;
    return r;
  }

  calculateHeightSection(courses: Course[]): number {
    let r = 0;
    r += this.TITLE_SIZE + this.SECTION_PADDING;
    courses.forEach( (course: Course) => r += this.calculateHeightCourse(course) + this.COURSE_MARGIN);
    return r;
  }

  calculateHeightScenario( scenarioCount: number ) : number {
    let r = 0;

    r += scenarioCount * 100;

    return r;
  }

  calculateHeight(resultsText: string, learningPathwayDescription: string[], learningPathway: Course[], scenarioCount: number): number {
    let r = 15; // I've added in a few extra lines above so need to account for that at the bottom
    r += this.calculateHeightHeader(resultsText);
    r += this.BALLOONS_LEARNING_PATHWAY_SEPARATION;
    r += 1000; // more space for bigger balloon graphic
    r += this.calculateHeightScenario( scenarioCount );
    r += this.calculateHeightDescription(learningPathwayDescription);
    r += this.calculateHeightSection(learningPathway.filter( (course: Course) => course.priority === 'brush_up'));
    r += this.calculateHeightSection(learningPathway.filter( (course: Course) => course.priority === 'develop'));
    r += this.BOTTOM_PADDING;
    return r;
  }

  paintBackground(canvasContext: CanvasRenderingContext2D, resultsText: string) {
    const backgroundGradient = canvasContext.createLinearGradient(
      this.FILE_MAX_WIDTH / 2,
      0,
      this.FILE_MAX_WIDTH / 2,
      500);
    backgroundGradient.addColorStop(0, this.GRADIENT_COLOR);
    backgroundGradient.addColorStop(1, this.BACKGROUND_COLOR);
    canvasContext.fillStyle = backgroundGradient;
    canvasContext.fillRect(0, 0, this.FILE_MAX_WIDTH, this.calculateHeightHeader(resultsText));
  }

  paintBottom(color: string): void {
    this.canvasManager.setColour(color);
    this.canvasManager.setX(0);
    this.canvasManager.drawBox(this.FILE_MAX_WIDTH, this.BOTTOM_PADDING);
  }
}
