import {Component, Input, signal, WritableSignal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {rxResource} from '@angular/core/rxjs-interop';
import {PatientService} from '../../services/patient/patient-service';
import {ReminderCard} from '../../components/reminder-card/reminder-card';
import {
  Bell,
  MessageSquare,
  Clock,
  Plus,
  Loader2,
  LucideAngularModule, PersonStanding,
} from 'lucide-angular';
import {PatientCard} from '../../components/patient-card/patient-card';

@Component({
  selector: 'app-patient',
  imports: [
    LucideAngularModule,
    ReactiveFormsModule,
    PatientCard
  ],
  templateUrl: './patient.html',
  styleUrl: './patient.css'
})
export class Patient {
  @Input() language: string = 'EN';

  translations = {
    en: {
      title: "Patient Management",
      patients: "Patients",
      createPatient: "Add New Patient",
      email: "Email",
      fullName: 'Full Name',
      department: "Department",
      age: "age",
      phone: "Phone Number",
    },
    fr: {
      title: "Gestion des patients",
      patients: "Patients",
      createPatient: "Ajouter un nouveau patient",
      email: "Email",
      fullName: 'Nom complet',
      department: "Département",
      age: "age",
      phone: "Numéro de téléphone",
    },
  }

  t = this.translations[this.language as keyof typeof this.translations] || this.translations.en;

  patientForm!: FormGroup;
  loading = signal(false);
  error = signal('');

  patients = rxResource({
    defaultValue: [],
    stream: () => this.patientService.findAllPatient(),
  });


  constructor(private patientService: PatientService, private fb: FormBuilder) {
    this.patientForm = this.fb.group({
      fullName: ['', Validators.required],
      age: ['', Validators.required],
      department: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      preferredLanguage: [this.language, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      createdAt: [new Date(Date.now()), Validators.required],
    });
  }

  onSubmit() {
    console.log(this.patientForm.value);
    if(this.patientForm.valid) {
      this.loading.set(true);
      this.patientService.savePatient(this.patientForm.value).subscribe({
        complete: () => {
          document.dispatchEvent(new CustomEvent('basecoat:toast', {
            detail: {
              config: {
                category: 'success',
                title: 'success',
                description: 'Patient created successfully.',
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

  protected readonly PersonStanding = PersonStanding;
  protected readonly MessageSquare = MessageSquare;
  protected readonly Clock = Clock;
  protected readonly Plus = Plus;
  protected readonly Loader2 = Loader2;
}
