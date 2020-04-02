export interface Answer {
  id: number;
  product: number;
  question: number;
  text: string;
  value: number;
  order: number;
  special?: string;
  skipTo?: string;
}
