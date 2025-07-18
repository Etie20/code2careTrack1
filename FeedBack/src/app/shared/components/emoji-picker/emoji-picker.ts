import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-emoji-picker',
  imports: [
    NgClass
  ],
  templateUrl: './emoji-picker.html',
  styleUrl: './emoji-picker.css'
})
export class EmojiPicker {
  @Input() selectedEmoji: string = '';
  @Input() label: string = 'How are you feeling?';
  @Output() emojiSelect = new EventEmitter<string>();

  emojiOptions = [
    { emoji: '😊', label: 'Very Happy', value: 'very_happy' },
    { emoji: '🙂', label: 'Happy', value: 'happy' },
    { emoji: '😐', label: 'Neutral', value: 'neutral' },
    { emoji: '😕', label: 'Sad', value: 'sad' },
    { emoji: '😢', label: 'Very Sad', value: 'very_sad' },
  ];

  selectEmoji(value: string) {
    this.emojiSelect.emit(value);
  }
}
