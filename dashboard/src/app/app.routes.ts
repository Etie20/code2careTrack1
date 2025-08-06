import { Routes } from '@angular/router';
import {Dashboard} from './pages/dashboard/dashboard';
import {Reminders} from './pages/reminders/reminders';
import {Home} from './pages/home/home';
import {Login} from './pages/login/login';
import {Landing} from './pages/landing/landing';
import {authGuard} from './core/guard/auth-guard';

export const routes: Routes = [
  {
    path: '**',
    redirectTo: 'landing',
  },
  {path : '', component : Landing},
  {path : 'home', component : Home, canActivate: [authGuard],},
  {path : 'login', component : Login},
  {path : 'dash', component : Dashboard, canActivate: [authGuard]},
  {path : 'remind', component : Reminders,canActivate: [authGuard]},
];
