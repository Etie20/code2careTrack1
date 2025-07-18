import { Component, Input } from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-feedback-summary-card',
  imports: [
    NgClass
  ],
  templateUrl: './feedback-summary-card.html',
  styleUrl: './feedback-summary-card.css'
})
export class FeedbackSummaryCard {
  @Input() emoji: string = '😊';
  @Input() text: string = 'Feedback';
  @Input() bgColor: string = 'from-gray-50 to-gray-100';
  @Input() borderColor: string = 'border-gray-200';
  @Input() textColor: string = 'text-gray-700';
  @Input() iconColor: string = 'text-gray-600';
}
