import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../environment/environment';
import {LoginRequest} from '../../dto/request/LoginRequest';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.apiUrl + '/auth'
  constructor(private http: HttpClient) {}

  login(params: LoginRequest) {
    return this.http.post<any>(`${this.apiUrl}/login`, params);
  }
}
