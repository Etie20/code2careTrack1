import {Component, EventEmitter, Input, Output} from '@angular/core';
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
    { code: 'ENGLISH', name: 'English', flag: '🇺🇸' },
    { code: 'FRENCH', name: 'Français', flag: '🇫🇷' },
    { code: 'DLA', name: 'Duálá', flag: '🇨🇲' },
    { code: 'BASSA', name: 'Bassa', flag: '🇨🇲' },
    { code: 'EWONDO', name: 'Ewondo', flag: '🇨🇲' },
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
