import {Component, Input} from '@angular/core';
import {LanguageSelector} from '../../shared/components/language-selector/language-selector';
import {FeedbackForm} from '../../shared/components/feedback-form/feedback-form';
import {NgForOf, NgIf} from '@angular/common';
import {MessageSquare, TrendingUp, LucideAngularModule, Bell, Users} from 'lucide-angular';
import {Feedback} from '../feedback/feedback';
import {Language} from '../../models/language.type';


interface Translations {
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-home',
  imports: [
    LanguageSelector,
    LucideAngularModule,
    FeedbackForm
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {



  language: Language = 'en';

  translations: Record<string, Translations> = {
    en: {
      title: 'Patient Care System',
      subtitle: 'Comprehensive healthcare feedback and reminder management',
    },
    fr: {
      title: 'Système de Soins aux Patients',
      subtitle: 'Gestion complète des commentaires et rappels de santé'
    },
    duala: {
      title: 'Système ya Soins ya Bato',
      subtitle: 'Gestion complète ya commentaires na rappels ya santé',

    },
    ewondo: {
      title: 'Ndako ya kosalela ba moto ba nyolo',
      subtitle: 'Bosali mobimba mwa masango na bokundoli ya mbombo'
    },
    bassa: {
      title: 'Nkap kukuluk ban be meyom',
      subtitle: 'Misala mi nyone mya malog na mekundol mya kukuluk'
    }
  };

  get t(): any {
    return this.translations[this.language] || this.translations['ENGLISH'];
  }

  onLanguageChange(language: any) {
    this.language = language;
  }

}
