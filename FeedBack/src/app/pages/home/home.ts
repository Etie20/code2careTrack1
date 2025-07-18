import { Component } from '@angular/core';
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
    NgForOf,
    NgIf,
    LucideAngularModule,
    Feedback
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  protected readonly dashboardIcon = TrendingUp;
  protected readonly feedbackIcon = MessageSquare;
  protected readonly reminderIcon = Bell;
  protected readonly analyticIcon = Users;

  activeTab = 'dashboard';
  language : 'en' | 'fr' = 'en';

  translations: Record<string, Translations> = {
    en: {
      title: 'Patient Care System',
      subtitle: 'Comprehensive healthcare feedback and reminder management',
      dashboard: 'Dashboard',
      feedback: 'Feedback',
      reminders: 'Reminders',
      analytics: 'Analytics',
    },
    fr: {
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
    return this.translations[this.language] || this.translations['en'];
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  onLanguageChange(language: any) {
    this.language = language;
  }

}
