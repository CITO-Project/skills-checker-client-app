import { Question } from './question';
import { Scenario } from './scenario';
import { Interest } from './interest';
import { Product } from './product';

export interface Log {
  product?: Product;
  interest?: Interest;
  scenarios?: Scenario[];
  questions?: Question[];
  answers?: number[];
  question_order: string[];
}
