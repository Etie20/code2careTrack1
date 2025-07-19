import {Component, Input} from '@angular/core';
import {Bell, Calendar, LucideAngularModule, LucideIconData, MessageSquare, Phone, Pill} from 'lucide-angular';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-reminder-card',
  imports: [
    NgClass,
    LucideAngularModule
  ],
  templateUrl: './reminder-card.html',
  standalone: true,
  styleUrl: './reminder-card.css'
})
export class ReminderCard {
  @Input() reminder : {
    date: string;
    method: string;
    patient: string;
    id: number;
    time: string;
    type: string;
    title: string;
    status: string
  } = {
    id: 1,
    type: "",
    title: "",
    date: "",
    time: "",
    patient: "",
    status: "",
    method: "",
  };

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

  getStatusColor(status: string): string {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getTypeIcon(type: string): LucideIconData {
    return type === 'appointment' ? Calendar : Pill;
  }

  getMethodIcon(method: string): LucideIconData {
    switch (method) {
      case 'sms':
        return MessageSquare;
      case 'voice':
        return Phone;
      case 'email':
      default:
        return Bell;
    }
  }

  getTranslation(key: string): string {
    return this.t[key as keyof typeof this.t] ?? key;
  }

}
