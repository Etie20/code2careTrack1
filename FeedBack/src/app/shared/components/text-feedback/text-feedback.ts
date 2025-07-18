import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-text-feedback',
  imports: [],
  templateUrl: './text-feedback.html',
  styleUrl: './text-feedback.css'
})
export class TextFeedback {
  @Input() label: string = 'Additional comments';
  @Input() placeholder: string = 'Tell us about your experience...';
  @Input() text: string = '';
  @Output() textChange = new EventEmitter<string>();

  onTextChange(value: any) {
    this.text = value;
    this.textChange.emit(value);
  }

}
