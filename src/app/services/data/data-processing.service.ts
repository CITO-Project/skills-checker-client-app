import { Injectable } from '@angular/core';

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

  constructor() { }

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

}
