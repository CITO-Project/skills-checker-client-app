import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Question } from 'src/app/models/question';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  @Input() question: Question;
  @Output() answer = new EventEmitter<number>();


  constructor() { }

  ngOnInit() { }

  retrieveAnswer(answer: number): void {
    this.answer.emit(answer);
  }


}
