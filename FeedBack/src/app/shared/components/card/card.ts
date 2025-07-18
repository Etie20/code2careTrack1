import { Component } from '@angular/core';
import {RatingStars} from '../rating-stars/rating-stars';
import {EmojiPicker} from '../emoji-picker/emoji-picker';

@Component({
  selector: 'app-card',
  imports: [
    RatingStars,
    EmojiPicker
  ],
  templateUrl: './card.html',
  styleUrl: './card.css'
})
export class Card {

}
