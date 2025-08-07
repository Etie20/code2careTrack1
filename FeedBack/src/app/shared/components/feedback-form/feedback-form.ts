import {Component, EventEmitter, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
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
import {Language} from '../../../models/language.type';

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
export class FeedbackForm implements OnChanges {

  @ViewChild('speechtotext') speechToTextInstance !: SpeechToTextComponent;

  @Input() language: Language = 'ENGLISH';

  rating = 0;
  selectedEmoji = '';
  feedbackText = '';
  feedbackAudioUrl = '';
  feedbackSummaryTexts: number[] = [0, 0];
  protected readonly mic = Mic;
  recording: boolean = false;
  recordingChange = new EventEmitter<boolean>();
  isLoading: boolean = false;
  test !: {  }



  translations = {
    ENGLISH: {
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
    FRENCH: {
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
    DLA:{
      title: 'Masango ma ba moto ba nyolo',
      subtitle: 'Salani biso to longola misala ma mbombo',
      rateExperience: 'Tanga ndenge o moni misala ma biso',
      howFeeling: 'Ndenge nini o yemi nsima na mboka na yo?',
      additionalComments: 'Masango ma nkaka',
      placeholder: 'Loba na biso ndenge o moni misala ma biso...',
      voiceNote: 'Masango ma mongongo',
      submit: 'Tinda masango',
      thankYou: 'Matondo mpo na masango ma yo!',
      label: ["Tango ya kele", 'Tango ya kosilisa']
    },
    EWONDO:{
      title: 'Minkukuma mi ba fam',
      subtitle: 'Dim biso to lônge misala mi akukuma',
      rateExperience: 'Tob ndenge a wu kiri misala mi biso',
      howFeeling: 'Ndenge nanga a wu yem emana eyene wu ne kele?',
      additionalComments: 'Minkukuma mi nkaka',
      placeholder: 'Kobe na biso ndenge a wu kiri misala mi biso...',
      voiceNote: 'Nkukuma wa ngul',
      submit: 'Tom minkukuma',
      thankYou: 'Akiba mpo minkukuma mi a wo!',
      label: ["Ango wa kele", 'Ango wa silise']
    },
    BASSA:{
      title: 'Malog ma ban be meyom',
      subtitle: 'Yem hii to malekle misala mya kukuluk',
      rateExperience: 'Yangla ndeh i ne wula misala mya hii',
      howFeeling: 'Ndeh nde i ne yem nlok i ne kele?',
      additionalComments: 'Malog ma ikôt',
      placeholder: 'Log na hii ndeh i ne wula misala mya hii...',
      voiceNote: 'Malog ma dikul',
      submit: 'Tôma malog',
      thankYou: 'Matondo mpo malog ma wo!',
      label: ["Nlog wa kele", 'Nlog wa bôsle']
    }

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

  t: any = this.translations[this.language];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['language']) {
      this.t = this.translations[this.language];
    }
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
    this.isLoading = true;
    const formField: FeedbackRequestModel = {
      patient,
      feedbackText: this.feedbackText,
      feedbackAudioUrl: this.feedbackAudioUrl,
      emojiRating: this.selectedEmoji,
      starRating: this.rating,
      waitTimeMin : this.feedbackSummaryTexts[0],
      resolutionTimeMin : this.feedbackSummaryTexts[1],
      language: this.language,
    };

    console.log("vos informations: ",patient, formField)
    this.test = formField

    this.feedbackService.createFeedback(formField).subscribe({
      next: () => {
        alert("✅ " +this.t.thankYou + " 😊");
        console.log("send")
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erreur lors de l\'envoi du feedback', err, this.test);
        alert('❌Erreur lors de l\'envoi😔');
      },
      complete: () => {
        console.log("Complète")
        this.isLoading = false;
      }
    });
  }

}
