// language-selector.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './language-selector.html',
})
export class LanguageSelector {
  @Input() language: string = 'en';
  @Output() languageChange = new EventEmitter<string>();

  languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'douala', name: 'Duálá', flag: '🇨🇲' },
    { code: 'bassa', name: 'Bassa', flag: '🇨🇲' },
    { code: 'ewondo', name: 'Ewondo', flag: '🇨🇲' },
  ];
}
