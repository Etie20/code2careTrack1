import {Email} from './email';

export interface Patient {
  id:                number;
  fullName:          string;
  age:               number;
  department:        string;
  phoneNumber:       string;
  createdAt:         Date;
  preferredLanguage: string;
  email:             Email;
}
