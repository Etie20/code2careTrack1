import { Component } from '@angular/core';
import {Feedback} from './pages/feedback/feedback';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Feedback],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FeedBack';
}
