import {Patient} from './patient';

export interface FeedBack {
  id:                number;
  patient:           Patient;
  feedbackText:      string;
  feedbackAudioUrl:  string;
  waitTimeMin:       number;
  resolutionTimeMin: number;
  emojiRating:       string;
  starRating:        number;
  submittedAt:       Date;
  language:          string;
}
