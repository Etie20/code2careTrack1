"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star, Mic, Send, Heart } from "lucide-react"

interface FeedbackFormProps {
  selectedLanguage: string
}

export default function FeedbackForm({ selectedLanguage }: FeedbackFormProps) {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [selectedEmoji, setSelectedEmoji] = useState("")
  const [isRecording, setIsRecording] = useState(false)

  const translations = {
    en: {
      title: "Share Your Feedback",
      subtitle: "Help us improve your healthcare experience",
      rateExperience: "Rate your experience",
      howFeeling: "How are you feeling?",
      additionalComments: "Additional comments",
      placeholder: "Tell us about your experience...",
      submit: "Submit Feedback",
      voiceNote: "Voice Note",
      recording: "Recording...",
    },
    fr: {
      title: "Partagez vos Commentaires",
      subtitle: "Aidez-nous à améliorer votre expérience de soins",
      rateExperience: "Évaluez votre expérience",
      howFeeling: "Comment vous sentez-vous?",
      additionalComments: "Commentaires supplémentaires",
      placeholder: "Parlez-nous de votre expérience...",
      submit: "Envoyer les Commentaires",
      voiceNote: "Note Vocale",
      recording: "Enregistrement...",
    },
    douala: {
      title: "Toli Commentaire na yo",
      subtitle: "Sala biso améliorer expérience soins na yo",
      rateExperience: "Note expérience na yo",
      howFeeling: "Ndenge nani o feel?",
      additionalComments: "Commentaire supplémentaire",
      placeholder: "Toli biso expérience na yo...",
      submit: "Envoyer Commentaire",
      voiceNote: "Note Vocal",
      recording: "Na enregistrer...",
    },
  }

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en

  const emojis = [
    { emoji: "😢", label: "Very Sad", value: "very_sad" },
    { emoji: "😕", label: "Sad", value: "sad" },
    { emoji: "😐", label: "Neutral", value: "neutral" },
    { emoji: "😊", label: "Happy", value: "happy" },
    { emoji: "😍", label: "Very Happy", value: "very_happy" },
  ]

  const handleSubmit = () => {
    // Simulate feedback submission
    console.log({ rating, feedback, selectedEmoji })
    // Reset form
    setRating(0)
    setFeedback("")
    setSelectedEmoji("")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Feedback Form */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Heart className="w-5 h-5" />
            {t.title}
          </CardTitle>
          <CardDescription>{t.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Star Rating */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">{t.rateExperience}</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-all duration-200 hover:scale-110"
                >
                  <Star className={`w-8 h-8 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Emoji Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">{t.howFeeling}</label>
            <div className="flex gap-3">
              {emojis.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setSelectedEmoji(item.value)}
                  className={`text-3xl p-3 rounded-full transition-all duration-200 hover:scale-110 ${
                    selectedEmoji === item.value ? "bg-blue-100 ring-2 ring-blue-400" : "hover:bg-gray-100"
                  }`}
                >
                  {item.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Text Feedback */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">{t.additionalComments}</label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={t.placeholder}
              className="min-h-24 bg-white/60 border-blue-200 focus:border-blue-400"
            />
          </div>

          {/* Voice Input */}
          <div className="flex gap-3">
            <Button
              variant={isRecording ? "destructive" : "outline"}
              onClick={() => setIsRecording(!isRecording)}
              className="flex items-center gap-2"
            >
              <Mic className="w-4 h-4" />
              {isRecording ? t.recording : t.voiceNote}
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              <Send className="w-4 h-4" />
              {t.submit}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Feedback */}
      <Card className="bg-white/80 backdrop-blur-sm border-green-100">
        <CardHeader>
          <CardTitle className="text-green-800">Recent Feedback</CardTitle>
          <CardDescription>Latest patient responses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { name: "Marie K.", rating: 5, comment: "Excellent service!", emoji: "😍", time: "2 hours ago" },
            { name: "Jean P.", rating: 4, comment: "Very good care", emoji: "😊", time: "5 hours ago" },
            { name: "Alice M.", rating: 5, comment: "Professional staff", emoji: "😍", time: "1 day ago" },
          ].map((item, index) => (
            <div key={index} className="p-4 bg-white/60 rounded-lg border border-green-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800">{item.name}</span>
                  <span className="text-2xl">{item.emoji}</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-2">{item.comment}</p>
              <p className="text-xs text-gray-500">{item.time}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
