import {Component, Input} from '@angular/core';
import {LanguageSelector} from '../../shared/components/language-selector/language-selector';
import {FeedbackForm} from '../../shared/components/feedback-form/feedback-form';
import {NgForOf, NgIf} from '@angular/common';
import {MessageSquare, TrendingUp, LucideAngularModule, Bell, Users} from 'lucide-angular';
import {Feedback} from '../feedback/feedback';


interface Translations {
  title: string;
  subtitle: string;
  dashboard: string;
  feedback: string;
  reminders: string;
  analytics: string;
}

@Component({
  selector: 'app-home',
  imports: [
    LanguageSelector,
    LucideAngularModule,
    Feedback
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {


  activeTab = 'dashboard';
  language: 'ENGLISH' | 'FRENCH' = 'ENGLISH';

  translations: Record<string, Translations> = {
    ENGLISH: {
      title: 'Patient Care System',
      subtitle: 'Comprehensive healthcare feedback and reminder management',
      dashboard: 'Dashboard',
      feedback: 'FeedbackService',
      reminders: 'Reminders',
      analytics: 'Analytics',
    },
    FRENCH: {
      title: 'Système de Soins aux Patients',
      subtitle: 'Gestion complète des commentaires et rappels de santé',
      dashboard: 'Tableau de bord',
      feedback: 'Commentaires',
      reminders: 'Rappels',
      analytics: 'Analyses',
    },
    douala: {
      title: 'Système ya Soins ya Bato',
      subtitle: 'Gestion complète ya commentaires na rappels ya santé',
      dashboard: 'Tableau ya bord',
      feedback: 'Commentaires',
      reminders: 'Rappels',
      analytics: 'Analyses',
    },
  };

  get t(): any {
    return this.translations[this.language] || this.translations['ENGLISH'];
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  onLanguageChange(language: any) {
    this.language = language;
  }

}
