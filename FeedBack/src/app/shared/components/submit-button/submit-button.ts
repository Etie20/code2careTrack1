import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-submit-button',
  imports: [],
  templateUrl: './submit-button.html',
  styleUrl: './submit-button.css'
})
export class SubmitButton {
  @Input() label: string = 'Submit FeedbackService';
  @Output() submit = new EventEmitter<void>();

  onClick() {
    this.submit.emit();
  }

}
