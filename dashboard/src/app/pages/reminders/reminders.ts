import {Component, Input, signal, WritableSignal} from '@angular/core';
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
import {Patient} from '../../models/patient';
import {TokenService} from '../../services/token/token-service';

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
  @Input() language: string = 'EN';

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

  reminderForm!: FormGroup;
  loading = signal(false);
  error = signal('');

  reminders = rxResource({
    defaultValue: [],
    stream: () => this.remindersService.findAllReminders(),
  });

  patients: WritableSignal<Patient[]> = signal([]);

  constructor(private remindersService: RemindersService, private patientService: PatientService, private fb: FormBuilder, private tokenService: TokenService) {
    this.reminderForm = this.fb.group({
      type: ['', Validators.required],
      patient: [null, Validators.required],
      doctor: [null, Validators.required],
      channel: ['', Validators.required],
      message: ['', Validators.required],
      reminderDate: [new Date(Date.now()), Validators.required],
      reminderTime: [new Date(Date.now()), Validators.required],
      language: [this.language, Validators.required],
    });
  }

  ngOnInit() {
    this.patientService.findAllPatient().subscribe({
      next: (patients) => {
        this.patients.set(patients);
      }
    })
  }

  onSubmit() {
    this.reminderForm.patchValue({
      'doctor': {'id': Number(this.tokenService.getUserId())},
      'patient': this.patients().find(p => p.fullName == this.reminderForm.value['patient']) ?? this.reminderForm.value['patient'],
      'reminderDate': new Date(`${this.reminderForm.value['reminderDate']}T${this.reminderForm.value['reminderTime']}`).toISOString(),
    });
    if(this.reminderForm.valid) {
      this.loading.set(true);
      this.remindersService.createReminder(this.reminderForm.value).subscribe({
        complete: () => {
          document.dispatchEvent(new CustomEvent('basecoat:toast', {
            detail: {
              config: {
                category: 'success',
                title: 'success',
                description: 'Reminder created successfully.',
                cancel: {
                  label: 'Dismiss'
                }
              }
            }
          }))
          this.loading.set(false);
          location.reload();
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err);
          document.dispatchEvent(new CustomEvent('basecoat:toast', {
            detail: {
              config: {
                category: 'error',
                title: 'error',
                description: 'An error occured',
                cancel: {
                  label: 'Dismiss'
                }
              }
            }
          }))
        }
      })
    } else {
      document.dispatchEvent(new CustomEvent('basecoat:toast', {
        detail: {
          config: {
            category: 'info',
            title: 'info',
            description: 'Please fill all the form correctly.',
            cancel: {
              label: 'Dismiss'
            }
          }
        }
      }))
    }
  }


  protected readonly Bell = Bell;
  protected readonly MessageSquare = MessageSquare;
  protected readonly Clock = Clock;
  protected readonly Plus = Plus;
  protected readonly Loader2 = Loader2;
}
