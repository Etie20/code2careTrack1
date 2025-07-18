import { Component, Input } from '@angular/core';
import {NgClass} from '@angular/common';
import { LucideAngularModule, MessageSquare, BarChart3, Heart, TrendingUp, Star,  } from 'lucide-angular';
import {FeedbackCard} from '../../components/feedback-card/feedback-card';
import {FeedBack} from '../../models/feedback';
import {FeedbackService} from '../../services/feedback/feedback-service';


@Component({
  selector: 'app-dashboard',
  imports: [
    NgClass,
    LucideAngularModule,
    FeedbackCard,
  ],
  templateUrl: './dashboard.html',
  standalone: true,
  styleUrl: './dashboard.css'
})
export class Dashboard {

  analyticsTranslations = {
    en: {
      title: "Feedback Analytics",
      description: "Insights from patient feedback and satisfaction",
      overallSatisfaction: "Overall Satisfaction",
      feedbackSummary: "Feedback Summary",
      sentimentAnalysis: "Sentiment Analysis",
      commonThemes: "Common Themes",
      positive: "Positive",
      neutral: "Neutral",
      negative: "Negative",
      totalFeedback: "Total Feedback",
      avgRating: "Average Rating",
      responseRate: "Response Rate",
    },
    fr: {
      title: "Analyses des Commentaires",
      description: "Aperçus des commentaires et satisfaction des patients",
      overallSatisfaction: "Satisfaction Globale",
      feedbackSummary: "Résumé des Commentaires",
      sentimentAnalysis: "Analyse des Sentiments",
      commonThemes: "Thèmes Communs",
      positive: "Positif",
      neutral: "Neutre",
      negative: "Négatif",
      totalFeedback: "Total Commentaires",
      avgRating: "Note Moyenne",
      responseRate: "Taux de Réponse",
    },
    douala: {
      title: "Fídbak Analitiks",
      description: "Insayt frɔm peshɛnt fídbak na satisfakshɔn",
      overallSatisfaction: "Ɔvɔrɔl Satisfakshɔn",
      feedbackSummary: "Fídbak Sɔmari",
      sentimentAnalysis: "Sɛntimɛnt Analisis",
      commonThemes: "Kɔmɔn Tim",
      positive: "Pɔsitiv",
      neutral: "Nyutrɔl",
      negative: "Nɛgatif",
      totalFeedback: "Tɔtɔl Fídbak",
      avgRating: "Avɛrɛj Rɛtiŋ",
      responseRate: "Rispɔns Rɛt",
    },
    bassa: {
      title: "Fídbàk Ànàlìtìks",
      description: "Ìnsàyt frɔ̀m pàtyɛ̀nt fídbàk nà sàtìsfàkshɔ̀n",
      overallSatisfaction: "Ɔ̀vɔ̀rɔ̀l Sàtìsfàkshɔ̀n",
      feedbackSummary: "Fídbàk Sɔ̀màrì",
      sentimentAnalysis: "Sɛ̀ntìmɛ̀nt Ànàlìsìs",
      commonThemes: "Kɔ̀mɔ̀n Tìm",
      positive: "Pɔ̀sìtìv",
      neutral: "Nyùtrɔ̀l",
      negative: "Nɛ̀gàtìf",
      totalFeedback: "Tɔ̀tɔ̀l Fídbàk",
      avgRating: "Àvɛ̀rɛ̀j Rɛ̀tìŋ",
      responseRate: "Rìspɔ̀ns Rɛ̀t",
    },
    ewondo: {
      title: "Nkóbó Mɛ́lɔ́",
      description: "Ayɔ́s mɛ́lɔ́ bɔ́t sí ńlɔ́m",
      overallSatisfaction: "Ńlɔ́m Ńsɔ́",
      feedbackSummary: "Nkóbó Mɛ́lɔ́",
      sentimentAnalysis: "Nkóbó Ńlɔ́m",
      commonThemes: "Mɛ́lɔ́ Mɛ́sɔ́",
      positive: "Mɛ́bɔ́t",
      neutral: "Ńtɔ́l",
      negative: "Mɛ́bɛ́",
      totalFeedback: "Mɛ́lɔ́ Ńsɔ́",
      avgRating: "Kɔ́b Ńtɔ́l",
      responseRate: "Ńyáb Mɛ́lɔ́",
    },
  }

  @Input() language: string = 'en';

  tb = this.analyticsTranslations[this.language as keyof typeof this.analyticsTranslations] || this.analyticsTranslations.en;

  translations = {
    en: {
      welcome: "Welcome to your healthcare companion",
      todayOverview: "Today's Overview",
      upcomingAppointments: "Upcoming Appointments",
      recentFeedback: "Recent Patient Feedback",
      medicationAlerts: "Medication Alerts",
      viewAll: "View All",
      excellent: "Excellent",
      good: "Good",
      needsAttention: "Needs Attention",
      patients: "patients",
      appointments: "appointments",
      pending: "pending",
      completed: "completed",
    },
    fr: {
      welcome: "Bienvenue chez votre compagnon de santé",
      todayOverview: "Aperçu d'aujourd'hui",
      upcomingAppointments: "Rendez-vous à venir",
      recentFeedback: "Commentaires récents des patients",
      medicationAlerts: "Alertes de médicaments",
      viewAll: "Voir tout",
      excellent: "Excellent",
      good: "Bon",
      needsAttention: "Nécessite attention",
      patients: "patients",
      appointments: "rendez-vous",
      pending: "en attente",
      completed: "terminé",
    },
  }
  t = this.translations[this.language as keyof typeof this.translations] || this.translations.en;

  isLoadingFeedback = true;
  recentFeedBack: FeedBack[] = [];

  constructor(private feedbackService: FeedbackService) {}

  ngOnInit() {
    this.fetchRecentFeedBack();
  }

  fetchRecentFeedBack() {
    this.isLoadingFeedback = true;
    this.feedbackService.findRecentFeedback().subscribe({
      next: (feedbacks) => {
        console.log('waiting');
        this.recentFeedBack = feedbacks;
        this.isLoadingFeedback = false;
      },
      error: () => {
        console.log('error');
        this.isLoadingFeedback = false;
      },
    });
  }


  recentFeedback = [
    { id: 1, patient: "Anonymous", rating: 5, comment: "Excellent service, very caring staff", sentiment: "positive" },
    { id: 2, patient: "Patient #247", rating: 4, comment: "Good experience, short wait time", sentiment: "positive" },
    { id: 3, patient: "Anonymous", rating: 3, comment: "Service was okay, could be improved", sentiment: "neutral" },
  ]

  mockAnalytics = {
    totalFeedback: 1234,
    avgRating: 4.6,
    responseRate: 87,
    sentiment: {
      positive: 65,
      neutral: 25,
      negative: 10,
    },
    themes: [
      {theme: 'Support', sentiment: 'positive', count: 45},
      {theme: 'Speed', sentiment: 'neutral', count: 30},
      {theme: 'Pricing', sentiment: 'negative', count: 20},
    ],
  }
  protected readonly BarChart3 = BarChart3;
  protected readonly Heart = Heart;
  protected readonly TrendingUp = TrendingUp;
  protected readonly Star = Star;
  protected readonly MessageSquare = MessageSquare;
}
