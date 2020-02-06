export interface Course {
  id: number;
  product: number;
  title: string;
  description: string;
  level: number;
  skill: string;
  location: string;
  date: Date;
  link: string;
  priority?: string;
}
