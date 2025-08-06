import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {Globe, LucideAngularModule} from 'lucide-angular';
import {LanguageModel} from '../../../models/language.model';


@Component({
  selector: 'app-language-selector',
  imports: [
    LucideAngularModule
  ],
  templateUrl: './language-selector.html',
  styleUrl: './language-selector.css'
})
export class LanguageSelector {

  protected readonly globeIcon = Globe;

  @Input() language: string = 'en';
  @Output() languageChange = new EventEmitter<string>();

  isDropdownOpen = false;

  languages: LanguageModel[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'duala', name: 'Duálá', flag: '🇨🇲' },
    { code: 'bassa', name: 'Bassa', flag: '🇨🇲' },
    { code: 'ewondo', name: 'Ewondo', flag: '🇨🇲' },
  ];

  get selectedLanguage(): LanguageModel {
    return this.languages.find(lang => lang.code === this.language) || this.languages[0];
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectLanguage(language: LanguageModel) {
    this.languageChange.emit(language.code);
    this.isDropdownOpen = false;
  }

}
