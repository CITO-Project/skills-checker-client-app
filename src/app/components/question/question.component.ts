import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, DoCheck, AfterContentChecked, AfterContentInit, AfterViewInit } from '@angular/core';
import { Question } from 'src/app/models/question';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, OnChanges {

  @Input() question: Question;
  @Input() error: string;
  @Output() answer = new EventEmitter<number>();


  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    this.resetSlider(changes);
  }

  retrieveAnswer(answer: number): void {
    this.answer.emit(answer);
  }

  setValueSlider(value: number): void {
    (document.getElementById('slider') as HTMLInputElement).value = '' + value;
  }

  resetSlider(changes: SimpleChanges): void {
    if (
      !!changes.question &&
      !changes.question.isFirstChange() &&
      changes.question.previousValue.type === 'slider' &&
      changes.question.currentValue.type === 'slider'
      ) {
        this.setValueSlider(0);
    }
  }

  updateAnswer(value: number): void {
    this.setValueSlider(+value);
    this.retrieveAnswer(+value);
  }

}
