import { Injectable } from '@angular/core';
import { Log } from '../models/log';
import { Question } from '../models/question';
import { Result } from '../models/result';
import { Answer } from '../models/answer';

@Injectable({
  providedIn: 'root'
})
export class DataProcessingService {

  private brushUpThreshold = 3;
  private developThreshold = 2;

  constructor() { }

  getChallengingSkills(
    questions: Question[],
    questionAnswers: Answer[][],
    answers: number[],
    challengingOrder: string[],
    questionOrder: string[]) {
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
    let level = -1;
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].pedagogical_type === 'challenging_skill') {
        level++;
        if (answers[i - 1] < questionAnswers[i - 1].length - 1 && answers[i] > 0) {
          let answer = answers[i].toString(2);
          while (answer.length < challengingOrder.length) {
            answer = '0' + answer;
          }
          for (let j = 0; j < answer.length; j++) {
            if (answer.charAt(j) === '1' && r[challengingOrder.slice().reverse()[j]].level <= 0 ) {
              const answerTaskQuestion = answers[questionOrder.length * level + 0];
              let priority = 'none';
              if (answerTaskQuestion < this.brushUpThreshold) {
                priority = 'brush_up';
                if (answerTaskQuestion < this.developThreshold) {
                  priority = 'develop';
                }
              }
              r[challengingOrder.slice().reverse()[j]] = {
                level: level + 1,
                priority
              };
            }
          }
        }
      }
    }
    return r;
  }

  getResults(log: Log): Result {
    return this.getChallengingSkills(log.questions, log.question_answers, log.answers, log.challenging_order, log.question_order) as Result;
  }

}
