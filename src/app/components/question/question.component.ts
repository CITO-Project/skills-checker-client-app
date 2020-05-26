import { Component, Input, Output, EventEmitter, DoCheck } from '@angular/core';

import { Question } from 'src/app/models/question';
import { Answer } from 'src/app/models/answer';

import { DataLogService } from 'src/app/services/data/data-log.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements DoCheck {

  @Input() question: Question;
  @Input() error: string;
  @Input() initialAnswer = -1;
  @Output() answer = new EventEmitter<number>();

  public sliderProperties = {
    value: 0,
    options: {
      floor: 0,
      ceil: 0,
      step: 1,
      showTicks: true,
      showSelectionBar: true,
      hidePointerLabels: true,
      hideLimitLabels: true,
      selectionBarGradient: {
        from: '#A66C4F',
        to: '#3FBDA8'
      },
      stepsArray: []
    }
  };

  constructor() { }

  ngDoCheck() {
    if (this.question.type === 'slider') {
      this.updateSlider();
    }
    if (this.initialAnswer > -1) {
      this.setAnswer(this.initialAnswer);
    } else {
      this.resetSlider();
    }
  }

  updateSlider(): void {
    this.sliderProperties.value = this.initialAnswer;
    this.sliderProperties.options.stepsArray = [];
    this.sortAnswers(this.question.answers).forEach( (answer: Answer) => {
      this.sliderProperties.options.stepsArray.push({ value: answer.value, legend: answer.text});
    });
    this.sliderProperties.options.ceil = this.question.answers.length - 1;
  }

  retrieveAnswer(answer: number): void {
    this.answer.emit(answer);
  }

  retrieveAnswerMultiple(element: HTMLInputElement): void {
    const elements: HTMLInputElement[] = Array.from(document.getElementsByTagName('input'));
    let r = 0;
    if (+element.value < 0 && element.checked) {
      if (this.question.answers[element.id].special === 'none') {
        elements.filter( (el: HTMLInputElement) => {
          if (el.id !== element.id) {
            return true;
          }
        }).forEach( (el: HTMLInputElement) => {
          el.checked = false;
        });
      }
    } else {
      elements.filter( (el: HTMLInputElement) => {
        if (+el.value < 0) {
          return true;
        }
      }).forEach( (el: HTMLInputElement) => {
        el.checked = false;
      });
      elements.slice().filter( (el: HTMLInputElement) => {
        if (+el.value >= 0 && el.checked) {
          return true;
        }
      }).forEach( (el: HTMLInputElement) => {
        r += Math.pow(2, +el.value);
      });
    }
    this.retrieveAnswer(r);
  }

  resetSlider(): void {
    if (!!document.getElementById('slider')) {
      this.setValueSlider(0);
    }
  }

  setAnswer(answer: number): void {
    switch (this.question.type) {
      case 'slider':
        this.setValueSlider(answer);
        break;
      case 'single':
        this.setValueSingle(answer);
        break;
      case 'multiple':
        this.setValueMultiple(answer);
        break;
    }
  }

  updateAnswer(value: number): void {
    this.setValueSlider(value);
    this.retrieveAnswer(+value);
  }

  setValue(id: string, property: string, value: any): void {
    const el = document.getElementById(id) as HTMLInputElement;
    if (!!el) {
      el[property] = value;
    }
  }

  setValueSlider(answer: number): void {
    this.setValue('slider', 'value', '' + answer);
  }

  setValueSingle(answer: number): void {
    this.setValue('' + answer, 'checked', true);
  }

  setValueMultiple(answer: number): void {
    if (answer === 0) {
      this.question.answers.filter( (ans: Answer) => {
        if (ans.special === 'none') {
          return true;
        }
      }).forEach( (ans: Answer) => {
        this.setValue('' + ans.order, 'checked', true);
      });
    } else {
      let answers = -1;
      while (answers++ < this.question.answers.length) {
        if (answer % 2 === 1) {
          this.setValue('' + answers, 'checked', true);
        }
        answer = Math.floor(answer / 2);
      }
    }
  }

  sortAnswers(answers: Answer[]): Answer[] {
    if (!!answers && answers.length > 0) {
      return answers.sort( (a: Answer, b: Answer) => {
        return a.order - b.order;
      });
    }
  }

}
