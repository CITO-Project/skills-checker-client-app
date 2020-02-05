import { Injectable } from '@angular/core';
import { Log } from '../models/log';
import { Question } from '../models/question';

@Injectable({
  providedIn: 'root'
})
export class DataProcessingService {

  private brushUpThreshold = 3;
  private developThreshold = 2;

  constructor() { }

  getChallengingSkills(questions: Question[], answers: number[], challengingOrder: string[], questionOrder: string[]) {
    const r = {};
    let level = 0;
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].pedagogical_type === 'challenging_skill') {
        level++;
        if (answers[i] > 0) {
          let answer = answers[i].toString(2);
          while (answer.length < challengingOrder.length) {
            answer = '0' + answer;
          }
          for (let j = 0; j < answer.length; j++) {
            if (answer.charAt(j) === '1' && !r[challengingOrder.slice().reverse()[j]] ) {
              const answerTaskQuestion = answers[questionOrder.length * level + 0];
              let priority = 'none';
              if (answerTaskQuestion < this.brushUpThreshold) {
                priority = 'brush_up';
                if (answerTaskQuestion < this.developThreshold) {
                  priority = 'develop';
                }
              }
              r[challengingOrder.slice().reverse()[j]] = {
                level,
                priority
              };
            }
          }
        }
      }
    }
    return r;
  }

  getResults(log: Log) {
    return this.getChallengingSkills(log.questions, log.answers, log.challenging_order, log.question_order);
  }

}
