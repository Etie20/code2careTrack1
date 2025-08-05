import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-feedback-summary-card',
  imports: [
    NgClass,
    FormsModule
  ],
  templateUrl: './feedback-summary-card.html',
  styleUrl: './feedback-summary-card.css'
})
export class FeedbackSummaryCard {
  @Input() borderColor: string = 'border-gray-200';
  @Input() label: string = 'Wait Time';
  @Input() placeholder: string = 'Evaluate your experience on 5';
  @Output() textChange = new EventEmitter<number>();
  @Input() text : number = 0

  onTextChange(value: any) {
    this.text = value.target.value;
    this.textChange.emit(value);
  }
}
