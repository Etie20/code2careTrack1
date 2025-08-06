import {Component, Input} from '@angular/core';
import {
  Bell,
  Calendar,
  LucideAngularModule,
  LucideIconData,
  MessageSquare,
  PersonStanding,
  Phone,
  Pill
} from "lucide-angular";
import {NgClass} from '@angular/common';
import {Patient} from '../../models/patient';

@Component({
  selector: 'app-patient-card',
  imports: [
    LucideAngularModule,
  ],
  templateUrl: './patient-card.html',
  styleUrl: './patient-card.css'
})
export class PatientCard {
  @Input() patient! : Patient
  @Input() language: string = 'en';

  translations = {
    en: {
      title: "Reminder Management",
      subtitle: "Manage appointment and medication reminders",
      activeReminders: "Active Reminders",
      createReminder: "Create New Reminder",
      appointment: "Appointment",
      medication: "Medication",
      scheduled: "Scheduled",
      sent: "Sent",
      pending: "Pending",
      sms: "SMS",
      voice: "Voice Call",
      email: "Email",
      reminderType: "Reminder Type",
      patientName: "Patient Name",
      dateTime: "Date & Time",
      method: "Notification Method",
      create: "Create Reminder",
    },

    fr: {
      title: "Gestion des Rappels",
      subtitle: "Gérer les rappels de rendez-vous et de médicaments",
      activeReminders: "Rappels Actifs",
      createReminder: "Créer un Nouveau Rappel",
      appointment: "Rendez-vous",
      medication: "Médicament",
      scheduled: "Programmé",
      sent: "Envoyé",
      pending: "En attente",
      sms: "SMS",
      voice: "Appel vocal",
      email: "Email",
      reminderType: "Type de Rappel",
      patientName: "Nom du Patient",
      dateTime: "Date et Heure",
      method: "Méthode de Notification",
      create: "Créer un Rappel",
    },
  }

  t = this.translations[this.language as keyof typeof this.translations] || this.translations.en;

  getTranslation(key: string): string {
    return this.t[key as keyof typeof this.t] ?? key;
  }

  protected readonly Phone = Phone;
  protected readonly PersonStanding = PersonStanding;
}
