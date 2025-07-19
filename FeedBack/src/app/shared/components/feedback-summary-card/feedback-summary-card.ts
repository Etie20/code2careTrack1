import {Component, EventEmitter, Input, Output} from '@angular/core';
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
  //@Input() text: string = 'FeedbackService';
  @Input() borderColor: string = 'border-gray-200';
  @Input() label: string = 'Wait Time';
  @Input() placeholder: string = 'Tell us about your experience...';
  @Output() textChange = new EventEmitter<string>();
  @Input() text : number = 0

  onTextChange(value: any) {
    this.text = value;
    this.textChange.emit(value);
  }
}
