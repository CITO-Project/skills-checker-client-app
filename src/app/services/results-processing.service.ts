import { Injectable } from '@angular/core';
import { TestResultsService } from './test-results.service';
import { Result } from '../models/result';
import { Question } from '../models/question';
import { Scenario } from '../models/scenario';

@Injectable({
  providedIn: 'root'
})
export class ResultsProcessingService {

  private results: Result;

  constructor(private testResults: TestResultsService) {
    this.results = this.testResults.getAll();
  }

  getSkillLevel(skill: number): number {
    const questions: Question[] = [];
    let skillLevel = -1;
    this.results.questions.forEach( (question: Question) => {
      if (question.skill === skill) {
        questions.push(question);
      }
    });
    questions.forEach( (question: Question) => {
      const level = this.getLevel(question);
      skillLevel = level > skillLevel ? level : skillLevel;
    });
    return skillLevel;
  }

  getSkills(): number[] {
    const skills: number[] = [];
    this.results.scenarios.forEach( (scenario: Scenario) => {
      if (scenario.level === 1) {
        this.results.questions.forEach( (question: Question) => {
          if (question.scenario === scenario.level) {
            skills.push(question.skill);
          }
        });
      }
    });
    return skills;
  }

  getLevel(question: Question): number {
    this.results.scenarios.forEach( (scenario: Scenario) => {
      if (scenario.id === question.scenario) {
        return scenario.level;
      }
    });
    return -1;
  }
}
