import {Component, Input, signal} from '@angular/core';
import {
  Bell,
  MessageSquare,
  Clock,
  Plus,
  Loader2,
  LucideAngularModule,
} from 'lucide-angular';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ReminderCard} from '../../components/reminder-card/reminder-card';
import {RemindersService} from '../../services/reminders/reminders-service';
import {Reminder} from '../../models/reminder';
import {rxResource} from '@angular/core/rxjs-interop';
import {PatientService} from '../../services/patient/patient-service';

@Component({
  selector: 'app-reminders',
  imports: [
    LucideAngularModule,
    FormsModule,
    ReminderCard,
    ReactiveFormsModule
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
      message: 'Message',
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
      message: 'Message',
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

  reminderForm: FormGroup;
  loading = signal(false);
  error = signal('');

  reminders = rxResource({
    defaultValue: [],
    stream: () => this.remindersService.findAllReminders()
  });

  patients = rxResource({
    defaultValue: [],
    stream: () => this.patientService.findAllPatient(),
  });

  constructor(private remindersService: RemindersService, private patientService: PatientService, private fb: FormBuilder) {
    this.reminderForm = this.fb.group({
      reminderType: ['', Validators.required],
      patient: [null, Validators.required],
      channel: ['', Validators.required],
      message: ['', Validators.required],
      reminderDate: ['', Validators.required],
      language: ['', Validators.required],
    });
  }

  onSubmit() {
    document.dispatchEvent(new CustomEvent('basecoat:toast', {
      detail: {
        config: {
          category: 'success',
          title: 'Success',
          description: 'A success toast called from the front-end.',
          cancel: {
            label: 'Dismiss'
          }
        }
      }
    }))
    // document.dispatchEvent(new CustomEvent('basecoat:toast', {
    //   detail: {
    //     config: {
    //       category: 'error',
    //       title: 'Error',
    //       description: this.reminderForm.value.toString(),
    //       cancel: {
    //         label: 'Dismiss'
    //       }
    //     }
    //   }
    // }))
    // if(this.reminderForm.valid) {
    //   this.loading.set(true);
    //   this.remindersService.createReminder(this.reminderForm.value).subscribe({
    //     complete: () => {
    //       this.loading.set(false);
    //       this.reminderForm.reset();
    //     },
    //     error: (err) => {
    //       this.error.set(err);
    //     }
    //   })
    // }
  }


  protected readonly Bell = Bell;
  protected readonly MessageSquare = MessageSquare;
  protected readonly Clock = Clock;
  protected readonly Plus = Plus;
  protected readonly Loader2 = Loader2;
}
