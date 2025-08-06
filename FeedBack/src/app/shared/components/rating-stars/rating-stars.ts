import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-rating-stars',
  imports: [
    NgClass,
  ],
  templateUrl: './rating-stars.html',
  styleUrl: './rating-stars.css'
})
export class RatingStars {
  @Input() rating = 0;
  @Input() label = 'Rate your experience';
  @Output() ratingChange = new EventEmitter<number>();
  stars = [1, 2, 3, 4, 5];

  hoveredRating = 0;

  setHovered(value: number) {
    this.hoveredRating = value;
  }

  clearHover() {
    this.hoveredRating = 0;
  }

  selectRating(value: number) {
    this.ratingChange.emit(value);
  }

}
