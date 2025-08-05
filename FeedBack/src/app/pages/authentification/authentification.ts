import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {AuthentificationService} from "../../services/authentification.service";
import {FormsModule} from "@angular/forms";
import {PatientService} from "../../services/patient.service";

@Component({
  selector: 'app-authentification',
  imports: [
    FormsModule
  ],
  templateUrl: './authentification.html',
  styleUrl: './authentification.css'
})
export class Authentification {

  phone = '';
  error = false
  errorMessage = ''
  errorMessages = [
    'Verified your network connection please',
    "Incorrect phone number"
  ]
  isLoading: boolean = false;

  constructor(
      private router: Router,
      private patientService: PatientService,
      private authentificationService: AuthentificationService
  ) {}

   goHome() {
    let patient
     this.isLoading = true;
    this.patientService.searchPatient(this.phone).subscribe(
        {
          next: (result) => {

            console.log("heyx", result, result);
            if (result) {
              patient = result;
              this.authentificationService.setPatientData(patient)
              this.router.navigate(['feedback']).then((r) => console.log(r));

            } else {
              console.log(this.phone);
              this.error = true
              ;
            }
          },
          error: err =>{
            console.log("Erreur lors de la récupération", err)
            this.error = true;
            if (err.status == 0){
              this.errorMessage = this.errorMessages[0]
            }else {
              this.errorMessage = this.errorMessages[1]
            }
          },
          complete: () => {
            console.log("Complète")
            this.isLoading = false;
          }
        }
    )

  }
}
