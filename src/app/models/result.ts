import { Question } from './question';
import { Scenario } from './scenario';
import { Interest } from './interest';
import { Product } from './product';

export interface Result {
  product?: Product;
  interest?: Interest;
  scenarios?: Scenario[];
  questions?: Question[];
  answers?: {
    questionid: number,
    answer: number
  }[];
  result?: {
    datetime?: string;
  };
}
