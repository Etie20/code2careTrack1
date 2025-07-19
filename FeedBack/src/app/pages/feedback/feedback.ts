import {Component, Input} from '@angular/core';
import {FeedbackForm} from '../../shared/components/feedback-form/feedback-form';

@Component({
  selector: 'app-feedback',
  imports: [
    FeedbackForm,
  ],
  templateUrl: './feedback.html',
  styleUrl: './feedback.css'
})
export class Feedback {
  @Input() language: 'en' | 'fr' = 'en';


}
