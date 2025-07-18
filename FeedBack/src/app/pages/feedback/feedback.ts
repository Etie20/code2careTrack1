import {Component, Input} from '@angular/core';
import {FeedbackForm} from '../../shared/components/feedback-form/feedback-form';
import {FeedbackSummaryCard} from '../../shared/components/feedback-summary-card/feedback-summary-card';

@Component({
  selector: 'app-feedback',
  imports: [
    FeedbackForm,
    FeedbackSummaryCard
  ],
  templateUrl: './feedback.html',
  styleUrl: './feedback.css'
})
export class Feedback {
  @Input() language: 'en' | 'fr' = 'en';





}
