import { Injectable } from '@angular/core';
import {environment} from '../../environment/environment';
import {HttpClient} from '@angular/common/http';
import {TokenService} from '../token/token-service';
import {Observable} from 'rxjs';

export interface Stat {
  total_feedbacks: number
  average_rating: number
  response_rate: number
}

export interface Sentiment {
  sentiment: string
  count: number
  percentage: number
}

export interface Theme {
  theme: string
  count: number
}


@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  apiUrl = environment.analyticsApiUrl
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  getStats(): Observable<Stat> {
    return this.http.get<Stat>(`${this.apiUrl}/feedback-stats/`)
  }

  getSentiments(): Observable<Sentiment[]> {
    return this.http.get<Sentiment[]>(`${this.apiUrl}/sentiment-distribution/`)
  }

  getOccurrences(): Observable<Theme[]> {
    return this.http.get<Theme[]>(`${this.apiUrl}/theme-occurrences/`)
  }
}
