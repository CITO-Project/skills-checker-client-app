export interface Question {
  id: number;
  product: number;
  scenario: number;
  type: string;
  question: string;
  answers: string[];
  description: string;
  pedagogical_type: string;
}
