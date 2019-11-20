import { Component, OnInit } from '@angular/core';
import { TestResultsService } from 'src/app/services/test-results.service';
import { Interest } from 'src/app/models/interest';
import { ScenarioService } from 'src/app/services/scenario.service';
import { Scenario } from 'src/app/models/scenario';
import { QuestionService } from 'src/app/services/question.service';
import { Question } from 'src/app/models/question';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scenarios-screen',
  templateUrl: './scenarios-screen.component.html',
  styleUrls: ['./scenarios-screen.component.scss']
})
export class ScenariosScreenComponent implements OnInit {

  public interest: Interest;
  public scenario: Scenario;
  public question: Question;


  private scenarios: number[] = [];
  private nScenario = 0;
  private questions: number[] = [];
  private nQuestion = 0;

  private currentAnswer: number = 0;

  constructor(
    private testResultsService: TestResultsService,
    private scenarioService: ScenarioService,
    private questionService: QuestionService,
    private router: Router
    ) { }

  ngOnInit() {
    this.getScenarios();
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
    if (this.nScenario === this.scenarios.length - 1 ) {
      this.router.navigate(['results']);
    } else {
      const scenarioId = this.scenarios[this.nScenario++];
      this.loadScenario(scenarioId);
    }
  }

  loadScenario(scenarioId: number) {
    this.scenarioService.getScenario(scenarioId).subscribe( (scenario: Scenario) => {
      this.scenario = scenario;
      this.testResultsService.setScenario(scenario);
      this.getQuestions(scenario.id);
    });
  }

  getQuestions(scenarioId: number) {
    this.nQuestion = 0;
    this.questions = [];
    this.questionService.getQuestions(scenarioId).subscribe( (questions: {
      id: number
    }[]) => {
      questions.forEach( question => {
        this.questions.push(question.id);
      });
      this.nextQuestion();
    });
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

  retrieveAnswer(answer: any) {
    this.currentAnswer = answer.target.value;
  }

  saveAnswer() {
    this.testResultsService.setAnswer(this.question.id, this.currentAnswer);
    this.nextQuestion();
  }

}
