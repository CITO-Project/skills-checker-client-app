export interface Course {
  id: number;
  external_id?: string;
  product?: number;
  title?: string;
  description?: string;
  level?: number;
  skill?: string;
  location?: string;
  link?: string;
  date_start?: Date;
  date_finish?: Date;
  address?: string;
  enrolment_start?: Date;
  enrolment_finish?: Date;
  contact_person?: string;
  contact_attention: string;
  contact_telephone?: string;
  contact_email?: string;
  priority?: string;
}
