import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../environment/environment';
import {LoginRequest} from '../../dto/request/LoginRequest';
import {tap} from 'rxjs';
import {TokenService} from '../token/token-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.apiUrl + '/auth'
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(params: LoginRequest) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, params).pipe(
      tap(res => this.tokenService.setToken(res.token))
    );
  }
}
