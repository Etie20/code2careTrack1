import {Component, Input} from '@angular/core';
import {
  Bell,
  MessageSquare,
  Clock,
  Plus,
  Loader2,
  LucideAngularModule,
} from 'lucide-angular';
import {FormsModule} from '@angular/forms';
import {ReminderCard} from '../../components/reminder-card/reminder-card';
import {RemindersService} from '../../services/reminders/reminders-service';
import {Reminder} from '../../models/reminder';
import {rxResource} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-reminders',
  imports: [
    LucideAngularModule,
    FormsModule,
    ReminderCard
  ],
  templateUrl: './reminders.html',
  standalone: true,
  styleUrl: './reminders.css'
})
export class Reminders {
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

  activeReminders = [
    {
      id: 1,
      type: "appointment",
      title: "Dr. Appointment - Cardiology",
      date: "2024-01-20",
      time: "10:00",
      patient: "Marie Dubois",
      status: "scheduled",
      method: "sms",
    },
    {
      id: 2,
      type: "medication",
      title: "Take Blood Pressure Medication",
      date: "2024-01-18",
      time: "08:00",
      patient: "Jean Kamga",
      status: "sent",
      method: "voice",
    },
    {
      id: 3,
      type: "appointment",
      title: "Follow-up Visit",
      date: "2024-01-22",
      time: "14:30",
      patient: "Fatima Nkomo",
      status: "pending",
      method: "sms",
    },
  ];

  // These properties bind to your form inputs
  newReminderType: string = '';
  newPatientName: string = '';
  newDate: string = '';
  newTime: string = '';
  newMethod: string = '';

  /*
  newReminder = {
    id: '',
    type: '',
    title: '',
    date: '',
    time: '',
    patient: '',
    status: 'pending',
    method: '',
  };

   */

  constructor(private remindersService: RemindersService) {}

  reminders = rxResource({
    defaultValue: [],
    stream: () => this.remindersService.findAllReminders(),
  });

  createReminder() {
    if (!this.newReminderType || !this.newPatientName || !this.newDate || !this.newTime || !this.newMethod) {
      alert('Please fill all fields'); // basic validation
      return;
    }

    const newId = this.activeReminders.length > 0
      ? Math.max(...this.activeReminders.map(r => r.id)) + 1
      : 1;

    const newReminder = {
      id: newId,
      type: this.newReminderType,
      title: this.newReminderType === 'appointment'
        ? `Dr. Appointment - ${this.newPatientName}`
        : `Take Medication - ${this.newPatientName}`,
      date: this.newDate,
      time: this.newTime,
      patient: this.newPatientName,
      status: 'pending',
      method: this.newMethod,
    };

    this.activeReminders = [...this.activeReminders, newReminder];

    // Reset form inputs
    this.newReminderType = '';
    this.newPatientName = '';
    this.newDate = '';
    this.newTime = '';
    this.newMethod = '';
  }

  protected readonly Bell = Bell;
  protected readonly MessageSquare = MessageSquare;
  protected readonly Clock = Clock;
  protected readonly Plus = Plus;
  protected readonly Loader2 = Loader2;
}
