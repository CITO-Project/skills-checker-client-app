import { Injectable } from '@angular/core';

import { StringManagerService } from '../etc/string-manager.service';

import { Log } from '../../models/log';
import { Question } from '../../models/question';
import { Result } from '../../models/result';
import { Answer } from '../../models/answer';

@Injectable({
  providedIn: 'root'
})
export class DataProcessingService {

  private brushUpThreshold = 3;
  private developThreshold = 2;

  constructor(private stringManagerService: StringManagerService) { }

  getSkillsLevel(
    questions: Question[],
    answers: number[],
    challengingOrder: string[],
    questionOrder: string[]
      ): Result {
    const r: Result = {
      literacy: {
        level: 0,
        priority: ''
      },
      numeracy: {
        level: 0,
        priority: ''
      },
      digital_skills: {
        level: 0,
        priority: ''
      }
    };
    let level = 0;
    let currentQuestions: Question[] = this.getItemsPerLevel(questions, questionOrder.length, level);
    while (currentQuestions.length > 0) {
      const currentAnswers: number[] = this.getItemsPerLevel(answers, questionOrder.length, level);
      if (
        this.getItemByPedagogicalType(currentAnswers, questionOrder, 'task_question') < this.brushUpThreshold &&
        this.getItemByPedagogicalType(currentAnswers, questionOrder, 'challenging_skill') > -1
        ) {
          const challengingQuestion: Question = this.getItemByPedagogicalType(currentQuestions, questionOrder, 'challenging_skill');
          const answer = this.decimalToBinary(
            this.getItemByPedagogicalType(currentAnswers, questionOrder, 'challenging_skill'),
            challengingQuestion.answers.filter(
              (questionAnswer: Answer) => questionAnswer.value >= 0
              ).length);
          for (let i = 0; i < answer.length; i++) {
            if (answer.charAt(i) === '1' && r[challengingOrder[i]].level <= 0) {
              const answerTaskQuestion = this.getItemByPedagogicalType(currentAnswers, questionOrder, 'task_question');
              let priority = 'brush_up';
              if (answerTaskQuestion < this.developThreshold) {
                priority = 'develop';
              }
              r[challengingOrder[i]] = {
                level: level + 1,
                priority
              };
            }
          }
      }
      level++;
      currentQuestions = this.getItemsPerLevel(questions, questionOrder.length, level);
    }
    return r;
  }

  getSkillsLevelByDimension(
    questions: Question[],
    answers: number[],
    challengingOrder: string[],
    questionOrder: string[]
      ): Result {
    const r: Result = {
      literacy: {
        level: 0,
      },
      numeracy: {
        level: 0,
      },
      digital_skills: {
        level: 0,
      }
    };
    const maxLevel = questions.length / questionOrder.length;
    for (let level = 0; level <= maxLevel; level++) {
      const currentQuestions: Question[] = this.getItemsPerLevel(questions, questionOrder.length, level);
      const currentAnswers: number[] = this.getItemsPerLevel(answers, questionOrder.length, level);
      let nDimensionQuestions = 0;
      let dimensionDifficulty = 0;
      currentQuestions.forEach( (question: Question, index: number) => {
        if (question.pedagogical_type.startsWith('dimension')) {
          nDimensionQuestions++;
          if (currentAnswers[index] >= 0) {
              dimensionDifficulty++;
          }
          if (question.pedagogical_type === 'dimension_fluency_2' && currentAnswers[index] === 1) {
            dimensionDifficulty--;
          }
        }
      });
      this.getSkillsFromAnswer(
        currentAnswers[currentQuestions.findIndex( (question: Question) => question.pedagogical_type === 'challenging_skill')],
        challengingOrder
      ).forEach( (skill: string) => r[skill].level += dimensionDifficulty / (level + 1));
    }
    if (maxLevel > 0) {
      const dimensionQuestionPerLevel = this.getItemsPerLevel(questions, questionOrder.length, 0).filter(
        (question: Question) => question.pedagogical_type.startsWith('dimension')
      ).length;
      let maxScore = 0;
      for (let i = 0; i < maxLevel; i++) {
        maxScore += dimensionQuestionPerLevel / (i + 1);
      }
      Object.keys(r).forEach( (key: string) => r[key].level = r[key].level / maxScore * maxLevel);
    }
    return r;
  }

  getItemsPerLevel(items: any[], itemsPerLevel: number, level: number): any[] {
    const start = level * itemsPerLevel;
    return items.slice(start, start + itemsPerLevel);
  }

  getItemByPedagogicalType(items: any[], questionOrder: string[], pedagogicalType: string): any {
    return items[questionOrder.findIndex(
      (question: string) => question === pedagogicalType)
    ];
  }

  getCoursesLevel(log: Log): Result {
    return this.getSkillsLevel(log.questions, log.answers, log.challenging_order, log.question_order);
  }

  getBalloonSizes(log: Log, nSizes: number, nLevels: number): Result {
    const r = this.getSkillsLevel(log.questions, log.answers, log.challenging_order, log.question_order);
    const s = this.getSkillsLevelByDimension(log.questions, log.answers, log.challenging_order, log.question_order);
    Object.keys(r).forEach( (key: string) => {
      const average = (r[key].level + s[key].level) / 2;
      r[key].level = Math.round(average * nSizes / nLevels);
      if (r[key].level === 0) {
        r[key].level = nSizes;
      }
    });
    return r;
  }

  decimalToBinary(decimal: number, length: number): string {
    if (isNaN(+decimal)) {
      return '';
    }
    let r = (+decimal).toString(2);
    while (r.length < length) {
      r = '0' + r;
    }
    r = r.split('').reverse().join('');
    return r;
  }

  getSkillsFromAnswer(answer: number, challengingOrder: string[]): string[] {
    const r = [];
    const answerBinary = this.decimalToBinary(answer, challengingOrder.length);
    answerBinary.split('').forEach( (value: string, index: number) => {
      if (+value === 1) {
        r.push(challengingOrder[index]);
      }
    });
    return r;
  }

  getDimensionsLevel(questions: Question[], answers: number[]): string[] {
    const r = [];
    const prefix = 'dimension_';
    const dimensions = ['independence', 'confidence', 'fluency'];
    dimensions.forEach( (dimension: string) => {
      dimension = prefix + dimension;
      const currentAnswers = answers.filter( (item, index: number) => questions[index].pedagogical_type.startsWith(dimension));
      const currentQuestions = questions.filter( (question: Question) => question.pedagogical_type.startsWith(dimension));
      currentQuestions.forEach( (question: Question, index: number) => {
        if (this.shouldIncreaseLevel(question.pedagogical_type, currentAnswers[index])) {
          r.push(dimension.slice(prefix.length));
        }
      });
    });
    return r;
  }

  getResultsText(log: Log, skillsResults: Result): {
    resultsText: string,
    learningPathwayDescription: string[]
  } {
    const brushUpSkills: string[] = [];
    const brushUpDimensions: string[] = [];
    const developSkills: string[] = [];
    const developDimensions: string[] = [];
    Object.entries(skillsResults).forEach(
      (item: [string, { level: number, priority: string}], index: number, array) => {
        const level = item[1].level - 1;
        if (item[1].priority === 'develop') {
          this.addToUniqueArray(developSkills, [item[0]]);
        } else if (item[1].priority === 'brush_up') {
          this.addToUniqueArray(brushUpSkills, [item[0]]);
        }
        const result = this.getDimensionsLevel(
          this.getItemsPerLevel(log.questions, log.question_order.length, level),
          this.getItemsPerLevel(log.answers, log.question_order.length, level)
        );
        if (item[1].priority === 'develop') {
          this.addToUniqueArray(developDimensions, result);
        } else if (item[1].priority === 'brush_up') {
          this.addToUniqueArray(brushUpDimensions, result);
        }
    });
    const interest = log.interest.text; 

    const r = {
      resultsText: $localize`You have taken the first step towards achieving your goal to: ${
        this.stringManagerService.lowerCaseFirst(this.stringManagerService.correctText(interest))}.`,
      learningPathwayDescription: []
    };
    if (brushUpSkills.length > 0) {
      let text = $localize`Brushing up on your ${this.stringManagerService.concatenateText(brushUpSkills)} skills`;
      if (brushUpDimensions.length > 0) {
        text += ', ' + $localize`:@@doSimilarTasks:so that you can do similar tasks ${this.stringManagerService.concatenateText(brushUpDimensions)}`;
      }
      text += '.';
      r.learningPathwayDescription.push(text);
    }
    if (developSkills.length > 0) {
      let text = $localize`Developing your ${this.stringManagerService.concatenateText(developSkills)} skills`;
      if (developDimensions.length > 0) {
        text += ' ' + $localize`:@@doTheseTasks: to do these tasks ${this.stringManagerService.concatenateText(developDimensions)}`;
      }
      text += '.';
      r.learningPathwayDescription.push(text);
    }
    if ((brushUpSkills.length + developSkills.length) < 1) {
      r.learningPathwayDescription.push( $localize`:@@easyPathMsgOne:You have shown that you have strong reading, writing, maths and computer skills.`);
      r.learningPathwayDescription.push( $localize`:@@easyPathMsgTwo:Take the next step by developing your skills even further.` );
      // tslint:disable-next-line: max-line-length
      r.learningPathwayDescription.push( $localize`:@@easyPathMsgThree:Call NALA today on 1800 20 20 65 to chat about your options or check out www.fetchcourses.ie to find a course that is right for you.` );
    }/* else if ((brushUpSkills.length + developSkills.length) === 1) {
      r.learningPathwayDescription.push('Check out the course below and find if it is right for you');
    } else {
      r.learningPathwayDescription.push('Check out the courses below and find one that\'s right for you.');
    } */
    return r;
  }

  getVariableText(variable: string): string {
    return this.stringManagerService.TEXTS[variable];
  }

  shouldIncreaseLevel(questionType: string, value: number): boolean {
    const prefix = 'dimension_';
    const increaseIfYes = ['independence_1', 'fluency_2'];
    const increaseIfNo = ['confidence_1', 'confidence_2', 'fluency_1'];

    if (questionType.startsWith(prefix)) {
      questionType = questionType.slice(prefix.length);
    }
    let r = false;
    if (
      (increaseIfYes.includes(questionType) && value === 0) ||
      (increaseIfNo.includes(questionType) && value === 1) ) {
        r = true;
    }
    return r;
  }

  addToUniqueArray(array: string[], items: string[]): void {
    items.forEach( (value: string) => {
      if (!array.includes(this.getVariableText(value))) {
        array.push(this.getVariableText(value));
      }
    });
  }

}
