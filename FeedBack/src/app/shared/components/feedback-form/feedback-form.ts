import { Component } from '@angular/core';
import {RatingStars} from '../rating-stars/rating-stars';
import {EmojiPicker} from '../emoji-picker/emoji-picker';
import {TextFeedback} from '../text-feedback/text-feedback';
import {VoiceRecorder} from '../voice-recorder/voice-recorder';
import {SubmitButton} from '../submit-button/submit-button';

@Component({
  selector: 'app-feedback-form',
  imports: [
    RatingStars,
    EmojiPicker,
    TextFeedback,
    VoiceRecorder,
    SubmitButton
  ],
  templateUrl: './feedback-form.html',
  styleUrl: './feedback-form.css'
})
export class FeedbackForm {

}
