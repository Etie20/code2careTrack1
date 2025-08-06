import { Routes } from '@angular/router';
import {Authentification} from './pages/authentification/authentification';
import {Home} from './pages/home/home';
import {AuthGuard} from './services/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: Authentification
  },

  {
    path: 'feedback',
    component: Home,
    canActivate: [AuthGuard]
  }
];
