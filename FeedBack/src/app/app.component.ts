import { Component } from '@angular/core';
import {Feedback} from './pages/feedback/feedback';
import {Home} from './pages/home/home';
import {Authentification} from './pages/authentification/authentification';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Home, Authentification, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FeedBack';
}
