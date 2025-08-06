import {Email} from './email';

export interface Doctor {
  id:          number;
  fullName:    string;
  specialty:   string;
  phoneNumber: string;
  createdAt:   null;
  password:    string;
  email:       Email;
}
