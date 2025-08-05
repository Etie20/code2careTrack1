import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {RatingStars} from '../rating-stars/rating-stars';
import {EmojiPicker} from '../emoji-picker/emoji-picker';

import {SubmitButton} from '../submit-button/submit-button';

import {FeedbackService} from "../../../services/feedback.service";
import {AuthentificationService} from "../../../services/authentification.service";
import {FeedbackRequestModel} from "../../../models/feedback-request.model";
import {FormsModule} from '@angular/forms';
import { SpeechToTextModule, TranscriptChangedEventArgs, SpeechToTextComponent } from '@syncfusion/ej2-angular-inputs';
import {LucideAngularModule, Mic} from 'lucide-angular';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-feedback-form',
  imports: [
    RatingStars,
    EmojiPicker,
    SubmitButton,
    FormsModule,
    LucideAngularModule,
    NgClass,
    SpeechToTextModule
  ],
  templateUrl: './feedback-form.html',
  styleUrl: './feedback-form.css'
})
export class FeedbackForm {

  @ViewChild('speechtotext') speechToTextInstance !: SpeechToTextComponent;

  @Input() language: 'en' | 'fr' = 'en';

  rating = 0;
  selectedEmoji = '';
  feedbackText = '';
  feedbackAudioUrl = '';
  feedbackSummaryTexts: number[] = [0, 0];
  protected readonly mic = Mic;
  recording: boolean = false;
  recordingChange = new EventEmitter<boolean>();

  test !: {  }

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
      label : ['Wait Time', 'Resolution time'],
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
      private patientDataService: AuthentificationService
  ) {}

  feedEmoji($event: string) {
    this.selectedEmoji = $event

  }

  toggleRecording() {
    this.recording = !this.recording;
    this.recordingChange.emit(this.recording);
  }

  onTranscriptChange(args: TranscriptChangedEventArgs):  void{
    this.feedbackText = args.transcript
  }


  onSubmit() {
    const patient= this.patientDataService.getPatientData();

    const formField: FeedbackRequestModel = {
      patient,
      feedbackText: this.feedbackText,
      feedbackAudioUrl: this.feedbackAudioUrl,
      emojiRating: this.selectedEmoji,
      starRating: this.rating,
      waitTimeMin : this.feedbackSummaryTexts[0],
      resolutionTimeMin : this.feedbackSummaryTexts[1],
      language: this.language.toUpperCase(),
    };

    console.log("vos informations: ",patient, formField)
    this.test = formField

    this.feedbackService.createFeedback(formField).subscribe({
      next: () => {
        alert(this.t.thankYou)
        console.log("send")
      },
      error: (err) => {
        console.error('Erreur lors de l\'envoi du feedback', err, this.test);
        alert('Erreur lors de l\'envoi');
      },
    });
  }

}
