import {Component, Input} from '@angular/core';
import {Language} from '../../models/language.type';

@Component({
  selector: 'app-feedback',
  imports: [

  ],
  templateUrl: './feedback.html',
  styleUrl: './feedback.css'
})
export class Feedback {
  @Input() language: Language = 'ENGLISH';
}
