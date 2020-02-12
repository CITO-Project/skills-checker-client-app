import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';
import { Question } from 'src/app/models/question';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, DoCheck {

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

  ngOnInit() { }

  ngDoCheck() {
    this.updateSlider();
    if (this.initialAnswer > -1) {
      this.setAnswer(this.initialAnswer);
    } else {
      this.resetSlider();
    }
  }

  updateSlider(): void {
    this.sliderProperties.value = this.initialAnswer;
    this.sliderProperties.options.stepsArray = [];
    this.question.answers.forEach( (answer: string, index: number) => {
      this.sliderProperties.options.stepsArray.push({ value: index, legend: answer});
    });
    this.sliderProperties.options.ceil = this.question.answers.length - 1;
  }

  retrieveAnswer(answer: number): void {
    this.answer.emit(answer);
  }

  retrieveAnswerMultiple(): void {
    let answer = 0;
    for (let i = 0; i < this.question.answers.length; i++) {
      const el = document.getElementById('' + i) as HTMLInputElement;
      answer += el.checked ? Math.pow(2, i) : 0;
    }
    this.retrieveAnswer(answer);
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
    let answers = -1;
    while (answers++ < this.question.answers.length) {
      if (answer % 2 === 1) {
        this.setValue('' + answers, 'checked', true);
      }
      answer = Math.floor(answer / 2);
    }
  }

}
