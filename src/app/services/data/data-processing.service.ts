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

  private readonly TEXTS = {
    literacy: 'reading and writing',
    numeracy: 'maths',
    digital_skills: 'computer',
    fluency: 'faster',
    confidence: 'more confidently',
    independence: 'by yourself'
  };

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
        r[key].level = 1;
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

  getDimensionsLevel(questions: Question[], answers: number[]): {
    fluency: number,
    confidence: number,
    independence: number
  } {
    const r = {
      fluency: 0,
      confidence: 0,
      independence: 0
    };
    const prefix = 'dimension_';
    const dimensions = ['independence', 'confidence', 'fluency'];
    dimensions.forEach( (dimension: string) => {
      let currentIndex = 0;
      dimension = prefix + dimension;
      questions.filter(
        (question: Question) => question.pedagogical_type.startsWith(dimension))
          .forEach( (pedagogicalQuestion: Question) => {
            currentIndex = questions.findIndex(
              (question: Question, index: number) => index > currentIndex && question.id === pedagogicalQuestion.id);
            if (this.shouldIncreaseLevel(pedagogicalQuestion.pedagogical_type, answers[currentIndex])) {
              r[dimension.slice(prefix.length)]++;
            }
          });
    });
    return r;
  }

  getResultsText(log: Log, skillsResults: Result): {
    resultsText: string,
    learningPathwayDescription: string[]
  } {
    const interest = log.interest.text;
    const dimensionResults = this.getDimensionsLevel(log.questions, log.answers);
    const dimension = [];
    Object.entries(dimensionResults).forEach( (value: [string, number]) => {
      if (value[1] > 0) {
        return dimension.push(this.getVariableText(value[0]));
      }
    });
    const skills = [];
    Object.entries(skillsResults).forEach( (value: [string, { level: number }]) => {
      if (value[1].level > 0) {
        return skills.push(this.getVariableText(value[0]));
      }
    });
    const r = {
      resultsText: `You have taken the first step towards achieving your goal of being able to ${
        this.stringManagerService.lowerCaseFirst(this.stringManagerService.correctText(interest))}`,
      learningPathwayDescription: [
        `Take the next step and develop your ${this.stringManagerService.concatenateText(skills)} skills ` +
        `so that you can do similar tasks ${this.stringManagerService.concatenateText(dimension)}`,
        'Check out the courses below and find one that\'s right for you'
      ]};
    return r;
  }

  getVariableText(variable: string): string {
    return this.TEXTS[variable];
  }

  shouldIncreaseLevel(questionType: string, value: number): boolean {
    const prefix = 'dimension_';
    const increaseIfYes = ['independence_1', 'confidence_1', 'fluency_1'];
    const increaseIfNo = ['confidence_2'];

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

}
