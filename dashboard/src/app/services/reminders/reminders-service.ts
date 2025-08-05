import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environment/environment';
import {Observable} from 'rxjs';
import {Reminder} from '../../models/reminder';
import {ReminderRequest} from '../../dto/request/reminderRequest';
import {TokenService} from '../token/token-service';

@Injectable({
  providedIn: 'root'
})
export class RemindersService {
  apiUrl = environment.apiUrl + '/reminder'
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  findAllReminders(): Observable<Reminder[]> {
    return this.http.get<Reminder[]>(`${this.apiUrl}/${this.tokenService.getUserId()}`)
  }

  findReminderByType(ReminderId: string): Observable<Reminder[]> {
    return this.http.get<Reminder[]> (`${this.apiUrl}/${ReminderId}`)
  }

  createReminder(createReminder: ReminderRequest): Observable<Reminder> {
    return this.http.post<Reminder> (`${this.apiUrl}`, createReminder)
  }
}
