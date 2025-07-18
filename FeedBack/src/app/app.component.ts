import { Component } from '@angular/core';
import {Feedback} from './pages/feedback/feedback';
import {Home} from './pages/home/home';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Home],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FeedBack';
}
