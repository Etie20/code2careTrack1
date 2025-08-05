// src/app/services/authentification.service.ts
import { Injectable } from '@angular/core';
import {PatientModel} from '../models/patient.model';


@Injectable({
  providedIn: 'root',
})
export class AuthentificationService {
  private patientData!: PatientModel;

  setPatientData(data: PatientModel[]) {
    localStorage.setItem('patient',JSON.stringify(data))
  }

  getPatientData(): PatientModel {
    return JSON.parse(<string>localStorage.getItem('patient'))
  }
}
