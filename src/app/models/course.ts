export interface Course {
  id: number;
  product: number;
  name: string;
  title?: string;
  description?: string;
  text?: string;
  level?: number;
  skill?: string;
  location?: string;
  link?: string;
  date_start?: Date;
  date_finish?: Date;
  duration?: string;
  frequency?: string;
  address?: string;
  enrolment_start?: Date;
  enrolment_finish?: Date;
  contact_person?: string;
  contact_telephone?: string;
  contact_email?: string;
  priority?: string;
}
