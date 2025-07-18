import { Component, Input } from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';


@Component({
  selector: 'app-dashboard',
  imports: [
    NgClass,
    NgForOf
  ],
  templateUrl: './dashboard.html',
  standalone: true,
  styleUrl: './dashboard.css'
})
export class Dashboard {
   translations = {
    en: {
      welcome: "Welcome back, Dr. Sarah",
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
      welcome: "Bon retour, Dr. Sarah",
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

  @Input() language: string = 'en';

  t = this.translations[this.language as keyof typeof this.translations] || this.translations.en;

  upcomingAppointments = [
    { id: 1, patient: "Marie Dubois", time: "09:00", type: "Consultation", status: "confirmed" },
    { id: 2, patient: "Jean Kamga", time: "10:30", type: "Follow-up", status: "pending" },
    { id: 3, patient: "Fatima Nkomo", time: "14:00", type: "Check-up", status: "confirmed" },
  ]

   recentFeedback = [
    { id: 1, patient: "Anonymous", rating: 5, comment: "Excellent service, very caring staff", sentiment: "positive" },
    { id: 2, patient: "Patient #247", rating: 4, comment: "Good experience, short wait time", sentiment: "positive" },
    { id: 3, patient: "Anonymous", rating: 3, comment: "Service was okay, could be improved", sentiment: "neutral" },
  ]
}
