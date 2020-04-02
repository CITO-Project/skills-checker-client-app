import { Answer } from './answer';

export interface Question {
  id: number;
  product: number;
  scenario: number;
  type: string;
  question: string;
  answers: Answer[];
  description: string;
  pedagogical_type: string;
}
