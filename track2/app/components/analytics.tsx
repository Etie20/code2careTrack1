"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, MessageSquare, Star, Heart } from "lucide-react"

const analyticsTranslations = {
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

const mockAnalytics = {
  totalFeedback: 1247,
  avgRating: 4.3,
  responseRate: 78,
  sentiment: {
    positive: 65,
    neutral: 25,
    negative: 10,
  },
  themes: [
    { theme: "Staff Friendliness", count: 342, sentiment: "positive" },
    { theme: "Wait Time", count: 198, sentiment: "negative" },
    { theme: "Cleanliness", count: 156, sentiment: "positive" },
    { theme: "Communication", count: 134, sentiment: "neutral" },
    { theme: "Appointment Scheduling", count: 89, sentiment: "negative" },
  ],
}

interface AnalyticsProps {
  language: keyof typeof analyticsTranslations
}

export default function Analytics({ language }: AnalyticsProps) {
  const t = analyticsTranslations[language]

  return (
    <div className="grid gap-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t.totalFeedback}</p>
                <p className="text-3xl font-bold text-blue-600">{mockAnalytics.totalFeedback}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t.avgRating}</p>
                <p className="text-3xl font-bold text-yellow-600">{mockAnalytics.avgRating}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t.responseRate}</p>
                <p className="text-3xl font-bold text-green-600">{mockAnalytics.responseRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment Analysis */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            {t.sentimentAnalysis}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-600">{t.positive}</span>
              <span className="text-sm text-gray-600">{mockAnalytics.sentiment.positive}%</span>
            </div>
            <Progress value={mockAnalytics.sentiment.positive} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-yellow-600">{t.neutral}</span>
              <span className="text-sm text-gray-600">{mockAnalytics.sentiment.neutral}%</span>
            </div>
            <Progress value={mockAnalytics.sentiment.neutral} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-red-600">{t.negative}</span>
              <span className="text-sm text-gray-600">{mockAnalytics.sentiment.negative}%</span>
            </div>
            <Progress value={mockAnalytics.sentiment.negative} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Common Themes */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            {t.commonThemes}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAnalytics.themes.map((theme, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{theme.theme}</span>
                  <Badge
                    className={
                      theme.sentiment === "positive"
                        ? "bg-green-100 text-green-800"
                        : theme.sentiment === "negative"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {theme.sentiment === "positive"
                      ? t.positive
                      : theme.sentiment === "negative"
                        ? t.negative
                        : t.neutral}
                  </Badge>
                </div>
                <span className="text-sm text-gray-600">{theme.count} mentions</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
