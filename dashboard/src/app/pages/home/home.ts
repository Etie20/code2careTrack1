import { Component } from '@angular/core';
import {NgClass} from '@angular/common';
import {Dashboard} from '../dashboard/dashboard';
import {Reminders} from '../reminders/reminders';

@Component({
  selector: 'app-home',
  imports: [
    NgClass,
    Dashboard,
    Reminders
  ],
  templateUrl: './home.html',
  standalone: true,
  styleUrl: './home.css'
})
export class Home {
  translations = {
    en: {
      title: "Patient Care System",
      subtitle: "Comprehensive healthcare feedback and reminder management",
      dashboard: "Dashboard",
      feedback: "Feedback",
      reminders: "Reminders",
      analytics: "Analytics",
    },
    fr: {
      title: "Système de Soins aux Patients",
      subtitle: "Gestion complète des commentaires et rappels de santé",
      dashboard: "Tableau de bord",
      feedback: "Commentaires",
      reminders: "Rappels",
      analytics: "Analyses",
    },
    douala: {
      title: "Système ya Soins ya Bato",
      subtitle: "Gestion complète ya commentaires na rappels ya santé",
      dashboard: "Tableau ya bord",
      feedback: "Commentaires",
      reminders: "Rappels",
      analytics: "Analyses",
    },
  }

  activeTab: string = 'dashboard';
  language: string = 'en';

  t = this.translations[this.language as keyof typeof this.translations] || this.translations.en;
  tb: { [key: string]: string } = {
    dashboard: 'Dashboard',
    reminders: 'Reminders',
    settings: 'Settings'
  };

  tabs = [
    {
      value: 'dashboard',
      label: 'dashboard',
      icon: 'lucide lucide-home'
    },
    {
      value: 'reminders',
      label: 'reminders',
      icon: 'lucide lucide-bell'
    },
    {
      value: 'settings',
      label: 'settings',
      icon: 'lucide lucide-settings'
    }
  ];

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  setLanguage(lang: string): void {
    this.language = lang;
  }

}
