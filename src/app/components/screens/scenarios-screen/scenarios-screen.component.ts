import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Interest } from 'src/app/models/interest';
import { Scenario } from 'src/app/models/scenario';
import { Question } from 'src/app/models/question';

import { TestResultsService } from 'src/app/services/test-results.service';
import { ScenarioService } from 'src/app/services/scenario.service';
import { QuestionService } from 'src/app/services/question.service';

@Component({
  selector: 'app-scenarios-screen',
  templateUrl: './scenarios-screen.component.html',
  styleUrls: ['./scenarios-screen.component.scss']
})
export class ScenariosScreenComponent implements OnInit {

  public interest: Interest;
  public scenario: Scenario;
  public question: Question;

  public btnBack = 'Go back';
  public btnForward = 'Next';

  private scenarios: number[] = [];
  private nScenario = 0;
  private questions: number[] = [];
  private nQuestion = 0;

  private currentAnswer = 0;

  constructor(
    private testResultsService: TestResultsService,
    private scenarioService: ScenarioService,
    private questionService: QuestionService,
    private router: Router
    ) { }

  ngOnInit() {
    this.getScenarios();
    this.testResultsService.initializeResults();
  }

  getScenarios() {
    // Retrieve selected interest
    // const interestid = this.testResults.getInterestId();
    // this.interestService.getInterest(interestid).subscribe( (data: Interest) => {
    //   interest = data;
    //   console.log(interest);
    // });

    const interest: Interest = {
      id: 3,
      product: 1,
      name: 'shop',
      text: 'Using a digital catalogue',
      illustration: null,
      description: null
    };
    this.interest = interest;

    this.scenarioService.getScenarios(interest.id).subscribe( (scenarios: {
      id: number
    }[]) => {
      scenarios.forEach( scenario => {
        this.scenarios.push(scenario.id);
      });
      this.nextScenario();
    });
  }

  nextScenario() {
    if (this.nScenario === this.scenarios.length ) {
      this.router.navigate(['results']);
    } else {
      const scenarioId = this.scenarios[this.nScenario++];
      this.loadScenario(scenarioId);
    }
  }

  loadScenario(scenarioId: number, loadFromPrevious = false) {
    this.scenarioService.getScenario(scenarioId).subscribe( (scenario: Scenario) => {
      this.scenario = scenario;
      this.testResultsService.setScenario(scenario);
      this.getQuestions(scenario.id).subscribe( (questions: {
        id: number
      }[]) => {
        questions.forEach( question => {
          this.questions.push(question.id);
        });
        if (loadFromPrevious) {
          this.nQuestion = questions.length - 1;
        } else {
          this.nQuestion = 0;
        }
        this.nextQuestion();
      });
    });
  }

  getQuestions(scenarioId: number) {
    this.questions = [];
    return this.questionService.getQuestions(scenarioId);
  }

  nextQuestion() {
    if (this.nQuestion === this.questions.length ) {
      this.nextScenario();
    } else {
      const questionId = this.questions[this.nQuestion++];
      this.loadQuestion(questionId);
    }
  }

  loadQuestion(questionId: number) {
    this.questionService.getQuestion(questionId).subscribe( (question: Question) => {
      this.testResultsService.setQuestion(question);
      this.question = question;
    });
  }

  retrieveAnswer(answer: number): void {
    this.currentAnswer = answer;
  }

  saveAnswer() {
    this.testResultsService.setAnswer(this.question.id, this.currentAnswer);
    this.nextQuestion();
    console.log('Scenario', this.scenarios.length, this.nScenario, 'Questions', this.questions.length, this.nQuestion);
    if (this.scenarios.length === this.nScenario && this.questions.length === this.nQuestion - 1) {
      this.btnForward = 'See results';
    }
  }

  previousQuestion() {

  }

}
