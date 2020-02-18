import { Scenario } from './scenario';
import { Answer } from './answer';
import { Question } from './question';

export interface CustomResponse {
  scenarioIndex: number;
  questionIndex: number;
  scenario: Scenario;
  question: Question;
  question_answers: Answer[];
  answer: number;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isFirstQuestionInScenario: boolean;
  isLastQuestionInScenario: boolean;
}
