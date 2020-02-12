import { Question } from './question';
import { Scenario } from './scenario';
import { Interest } from './interest';
import { Product } from './product';
import { Category } from './category';

export interface Log {
  product?: Product;
  category?: Category;
  interest?: Interest;
  scenarios?: Scenario[];
  questions?: Question[];
  answers?: number[];
  question_order: string[];
  challenging_order: string[];
}
