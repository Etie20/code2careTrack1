import {Injectable} from '@angular/core';
import {environment} from '../environment';
import {HttpClient} from '@angular/common/http';
import {FeedbackRequestModel} from '../models/feedback-request.model';
import {Observable} from 'rxjs';
import {PatientModel} from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private readonly API_URL = environment.apiURL + "/api/patient/search";

  constructor(private http: HttpClient) {}

   searchPatient(query: string): Observable<PatientModel[]> {
   return this.http.get<PatientModel[]>(
     this.API_URL,
     {
       params: {"query": query}
     }
   );
  }
}
