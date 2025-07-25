import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private tokenSignal = signal<string | null>(null);

  setToken(token: string) {
    this.tokenSignal.set(token);
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return this.tokenSignal() ?? localStorage.getItem('auth_token');
  }

  clearToken() {
    this.tokenSignal.set(null);
    localStorage.removeItem('auth_token');
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000); // timestamp en secondes
      return payload.exp && now < payload.exp;
    } catch (e) {
      return false; // token mal formé
    }
  }

  getUserName(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub ?? null;
    } catch (e) {
      return null;
    }
  }
}
