import {Component, Input} from '@angular/core';
import {LucideAngularModule, Star} from "lucide-angular";
import {NgClass} from '@angular/common';
import {FeedBack} from '../../models/feedback';

@Component({
  selector: 'app-feedback-card',
  imports: [
    LucideAngularModule,
    NgClass
  ],
  templateUrl: './feedback-card.html',
  standalone: true,
  styleUrl: './feedback-card.css'
})
export class FeedbackCard {

  @Input() feedback : FeedBack | undefined ;

  @Input() language: string = 'en';

  translations = {
    en: {
      welcome: "Welcome to your healthcare companion",
      todayOverview: "Today's Overview",
      upcomingAppointments: "Upcoming Appointments",
      recentFeedback: "Recent Patient Feedback",
      medicationAlerts: "Medication Alerts",
      viewAll: "View All",
      excellent: "Excellent",
      good: "Good",
      needsAttention: "Needs Attention",
      patients: "patients",
      appointments: "appointments",
      pending: "pending",
      completed: "completed",
    },
    fr: {
      welcome: "Bienvenue chez votre compagnon de santé",
      todayOverview: "Aperçu d'aujourd'hui",
      upcomingAppointments: "Rendez-vous à venir",
      recentFeedback: "Commentaires récents des patients",
      medicationAlerts: "Alertes de médicaments",
      viewAll: "Voir tout",
      excellent: "Excellent",
      good: "Bon",
      needsAttention: "Nécessite attention",
      patients: "patients",
      appointments: "rendez-vous",
      pending: "en attente",
      completed: "terminé",
    },
  }
  t = this.translations[this.language as keyof typeof this.translations] || this.translations.en;
  protected readonly Star = Star;
}
