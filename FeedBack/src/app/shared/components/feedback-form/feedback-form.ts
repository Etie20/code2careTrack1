import {Component, Input} from '@angular/core';
import {RatingStars} from '../rating-stars/rating-stars';
import {EmojiPicker} from '../emoji-picker/emoji-picker';
import {TextFeedback} from '../text-feedback/text-feedback';
import {VoiceRecorder} from '../voice-recorder/voice-recorder';
import {SubmitButton} from '../submit-button/submit-button';
import {FeedbackSummaryCard} from '../feedback-summary-card/feedback-summary-card';
import {FeedbackService} from "../../../services/feedback.service";
import {PatientDataService} from "../../../services/patient-data.service";
import {FeedbackRequestModel} from "../../../models/feedback-request.model";

@Component({
  selector: 'app-feedback-form',
  imports: [
    RatingStars,
    EmojiPicker,
    TextFeedback,
    VoiceRecorder,
    SubmitButton,
    FeedbackSummaryCard
  ],
  templateUrl: './feedback-form.html',
  styleUrl: './feedback-form.css'
})
export class FeedbackForm {
  @Input() language: 'en' | 'fr' = 'en';

  rating = 0;
  selectedEmoji = '';
  feedbackText = '';
  feedbackAudioUrl = '';
  isRecording = false;

  @Input() label: string = 'Service Quality';

  translations = {
    en: {
      title: 'Patient FeedbackService',
      subtitle: 'Help us improve our healthcare services',
      rateExperience: 'Rate your experience',
      howFeeling: 'How are you feeling about your visit?',
      additionalComments: 'Additional comments',
      placeholder: 'Tell us about your experience...',
      voiceNote: 'Voice Note',
      submit: 'Submit FeedbackService',
      thankYou: 'Thank you for your feedback!',
      label : ['Wait Time', 'Resolution time']
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
      label : ["Temps d'attente", 'Temps de résolution']
    },
  };
  feedbackCards = [
    {
      bgColor: 'from-green-50 to-green-100',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      iconColor: 'text-green-600',
    },
    {
      bgColor: 'from-red-50 to-red-100',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      iconColor: 'text-red-600',
    },
  ];

  get t() {
    return this.translations[this.language];
  }

  constructor(
      private feedbackService: FeedbackService,
      private patientDataService: PatientDataService
  ) {}

  onSubmit() {
    const patient = this.patientDataService.getPatientData();

    const payload: FeedbackRequestModel = {
      patient,
      feedbackText: this.feedbackText,
      feedbackAudioUrl: this.feedbackAudioUrl,
      emojiRating: this.selectedEmoji,
      starRating: this.rating,
      language: this.language.toUpperCase(),
    };

    this.feedbackService.createFeedback(payload).subscribe({
      next: () => alert(this.t.thankYou),
      error: (err) => {
        console.error('Erreur lors de l\'envoi du feedback', err);
        alert('Erreur lors de l\'envoi');
      },
    });
  }

}
