import { Injectable } from '@angular/core';
import {environment} from '../../environment/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FeedBack} from '../../models/feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  apiUrl = environment.apiUrl + '/feedback'
  constructor(private http: HttpClient) { }

  findAllFeedback(): Observable<FeedBack[]>{
    return this.http.get<FeedBack[]>(this.apiUrl);
  }
  findRecentFeedback(): Observable<FeedBack[]>{
    return this.http.get<FeedBack[]>(this.apiUrl+'/top3');
  }
}
