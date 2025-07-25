import { Injectable } from '@angular/core';
import {environment} from '../../environment/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Patient} from '../../models/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  apiUrl = environment.apiUrl + '/patient'
  constructor(private http: HttpClient) { }

  findAllPatient(): Observable<Patient[]>{
    return this.http.get<Patient[]>(this.apiUrl+'/search/fullName?query=');
  }
}
