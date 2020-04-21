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

  getChallengingSkills(
    questions: Question[],
    answers: number[],
    challengingOrder: string[],
    questionOrder: string[]): Result {
    const _r: Result = {
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
    let currentQuestions: Question[] = this.getItemsPerLevel(questions, questionOrder, level);
    while (currentQuestions.length > 0) {
      const currentAnswers: number[] = this.getItemsPerLevel(answers, questionOrder, level);
      if (
        this.getItemByPedagogicalType(currentAnswers, questionOrder, 'task_question') < this.brushUpThreshold &&
        this.getItemByPedagogicalType(currentAnswers, questionOrder, 'challenging_skill') > -1
        ) {
          let answer = this.getItemByPedagogicalType(currentAnswers, questionOrder, 'challenging_skill').toString(2);
          const challenging_question: Question = this.getItemByPedagogicalType(currentQuestions, questionOrder, 'challenging_skill');
          while (answer.length < challenging_question.answers.filter(
            (questionAnswer: Answer) => {
            if (questionAnswer.value >= 0) {
              return true;
            }
          }).length) {
            answer = '0' + answer;
          }
          answer = answer.split('').reverse().join('');
          for (let i = 0; i < answer.length; i++) {
            if (answer.charAt(i) === '1' && _r[challengingOrder[i]].level <= 0) {
              const answerTaskQuestion = this.getItemByPedagogicalType(currentAnswers, questionOrder, 'task_question');
              let priority = 'brush_up';
              if (answerTaskQuestion < this.developThreshold) {
                priority = 'develop';
              }
              _r[challengingOrder[i]] = {
                level: level + 1,
                priority
              };
            }
          }
      }
      level++;
      currentQuestions = this.getItemsPerLevel(questions, questionOrder, level);
    }
    return _r;
  }

  getItemsPerLevel(items: any[], questionOrder: string[], level: number): any[] {
    const start = level * questionOrder.length;
    return items.slice(start, start + questionOrder.length - 1);
  }

  getItemByPedagogicalType(items: any[], questionOrder: string[], pedagogicalType: string): any {
    let _r: any = null;
    questionOrder.forEach( (question: string, index: number) => {
      if (question === pedagogicalType) {
        _r = items[index];
      }
    });
    return _r;
  }

  getResults(log: Log): Result {
    return this.getChallengingSkills(log.questions, log.answers, log.challenging_order, log.question_order);
  }

}
