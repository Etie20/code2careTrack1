import {Patient} from './patient';
import {Doctor} from './doctor';

export interface Reminder {
  id:           number;
  patient:      Patient;
  doctor:       Doctor;
  message:      string;
  reminderDate: Date;
  type:         string;
  language:     string;
  channel: string;
}
