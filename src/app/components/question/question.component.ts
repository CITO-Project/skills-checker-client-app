import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, DoCheck } from '@angular/core';
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


  constructor() { }

  ngOnInit() { }

  ngDoCheck() {
    if (this.initialAnswer > -1) {
      this.setAnswer(this.initialAnswer);
    } else {
      this.resetSlider();
    }
  }

  retrieveAnswer(answer: number): void {
    this.answer.emit(answer);
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

}
