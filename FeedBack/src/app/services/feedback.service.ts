import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {FeedbackRequestModel} from '../models/feedback-request.model';
import {environment} from '../environment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private readonly API_URL = environment.apiURL + "/api/feedback";

  constructor(private http: HttpClient) {}

  createFeedback(data: FeedbackRequestModel): Observable<any> {
    return this.http.post(this.API_URL, data);
  }
}
