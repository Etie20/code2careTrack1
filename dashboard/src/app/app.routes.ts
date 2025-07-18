import { Routes } from '@angular/router';
import {Dashboard} from './pages/dashboard/dashboard';
import {Reminders} from './pages/reminders/reminders';
import {Home} from './pages/home/home';

export const routes: Routes = [
  {path : '', component : Home},
  {path : 'dash', component : Dashboard},
  {path : 'remind', component : Reminders},
];
