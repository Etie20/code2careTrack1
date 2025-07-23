import {Doctor} from '../../models/doctor';
import {Patient} from '../../models/patient';

export interface ReminderRequest {
  id:           number;
  patient:      Patient;
  doctor:       Doctor;
  message:      string;
  reminderDate: Date;
  type:         string;
  language:     string;
}
