import { Question } from './question';
import { Scenario } from './scenario';
import { Interest } from './interest';
import { Product } from './product';
import { Category } from './category';
import { Answer } from './answer';

export interface Log {
  product?: Product;
  category?: Category;
  interest?: Interest;
  scenarios?: Scenario[];
  questions?: Question[];
  question_answers?: Answer[][];
  answers?: number[];
  question_order: string[];
  challenging_order: string[];
  location: string;
}
