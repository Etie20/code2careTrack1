import { Component } from '@angular/core';
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
  feedbackCards = [
    {
      emoji: '😊',
      text: 'Excellent Service',
      bgColor: 'from-green-50 to-green-100',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      iconColor: 'text-green-600',
    },
    {
      emoji: '😐',
      text: 'Average Experience',
      bgColor: 'from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-700',
      iconColor: 'text-yellow-600',
    },
    {
      emoji: '😢',
      text: 'Needs Improvement',
      bgColor: 'from-red-50 to-red-100',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      iconColor: 'text-red-600',
    },
  ];


}
