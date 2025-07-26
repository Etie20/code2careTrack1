// src/app/services/patient-data.service.ts
import { Injectable } from '@angular/core';
import {PatientModel} from '../models/patient.model';


@Injectable({
  providedIn: 'root',
})
export class PatientDataService {
  private patientData!: PatientModel;

  setPatientData(data: PatientModel) {
    this.patientData = data;
  }

  getPatientData(): PatientModel {
    return JSON.parse(<string>localStorage.getItem('patient'))
  }
}
