import {PatientModel} from './patient.model';

export interface FeedbackRequestModel {
  patient: PatientModel;
  feedbackText: string;
  feedbackAudioUrl?: string;
  emojiRating: string;
  starRating: number;
  language: string;
}
