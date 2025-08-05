import {PatientModel} from './patient.model';

export interface FeedbackRequestModel {
  patient: PatientModel;
  feedbackText: string;
  feedbackAudioUrl?: string;
  waitTimeMin: number,
  resolutionTimeMin: number,
  emojiRating: string;
  starRating: number;
  language: string;
}
