import {CanActivate, CanActivateFn, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthentificationService} from './authentification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthentificationService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.getPatientData()) {
      return true;
    } else {
      this.router.navigate(['/']).then(r => console.log(r)); // Redirige vers la page de login
      return false;
    }
  }
}
