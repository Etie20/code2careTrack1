import {Component, Input} from '@angular/core';
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
  @Input() language: 'en' | 'fr' = 'en';

  rating = 0;
  selectedEmoji = '';
  feedbackText = '';
  isRecording = false;

  translations = {
    en: {
      title: 'Patient Feedback',
      subtitle: 'Help us improve our healthcare services',
      rateExperience: 'Rate your experience',
      howFeeling: 'How are you feeling about your visit?',
      additionalComments: 'Additional comments',
      placeholder: 'Tell us about your experience...',
      voiceNote: 'Voice Note',
      submit: 'Submit Feedback',
      thankYou: 'Thank you for your feedback!',
    },
    fr: {
      title: 'Commentaires des Patients',
      subtitle: 'Aidez-nous à améliorer nos services de santé',
      rateExperience: 'Évaluez votre expérience',
      howFeeling: 'Comment vous sentez-vous après votre visite?',
      additionalComments: 'Commentaires supplémentaires',
      placeholder: 'Parlez-nous de votre expérience...',
      voiceNote: 'Note vocale',
      submit: 'Soumettre les commentaires',
      thankYou: 'Merci pour vos commentaires!',
    },
  };

  get t() {
    return this.translations[this.language];
  }

  onSubmit() {
    console.log({
      rating: this.rating,
      emoji: this.selectedEmoji,
      comment: this.feedbackText,
    });
    alert(this.t.thankYou);
  }

}
