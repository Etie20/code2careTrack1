"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Mic, Send, Star, Smile, Meh, Frown, Heart, ThumbsUp, ThumbsDown } from "lucide-react"

const feedbackTranslations = {
  en: {
    title: "Share Your Experience",
    description: "Help us improve our healthcare services",
    rateExperience: "Rate your experience",
    howFeeling: "How are you feeling?",
    writeReview: "Write your review (optional)",
    voiceNote: "Voice Note",
    submit: "Submit Feedback",
    thankYou: "Thank you for your feedback!",
    placeholder: "Tell us about your experience...",
  },
  fr: {
    title: "Partagez Votre Expérience",
    description: "Aidez-nous à améliorer nos services de santé",
    rateExperience: "Évaluez votre expérience",
    howFeeling: "Comment vous sentez-vous?",
    writeReview: "Écrivez votre avis (optionnel)",
    voiceNote: "Note Vocale",
    submit: "Envoyer Commentaire",
    thankYou: "Merci pour vos commentaires!",
    placeholder: "Parlez-nous de votre expérience...",
  },
  douala: {
    title: "Shɛa Ɛkspiriɛns Na Yɔ",
    description: "Hɛlɛp bísɔ impruv hɛlɛt sɛvis",
    rateExperience: "Rɛt ɛkspiriɛns na yɔ",
    howFeeling: "Haw yɔ di fil?",
    writeReview: "Rayt rivyu na yɔ",
    voiceNote: "Vɔys Not",
    submit: "Sɛn Fídbak",
    thankYou: "Tɛnki fɔ fídbak na yɔ!",
    placeholder: "Tɔk bísɔ abawt ɛkspiriɛns na yɔ...",
  },
  bassa: {
    title: "Shɛ̀à Ɛ̀kspìryɛ̀ns Ì Wɔ̀",
    description: "Hɛ̀lɛ̀p ɓísɔ̀ ìmpròv hɛ̀lɛ̀t sɛ̀vìs",
    rateExperience: "Rɛ̀t ɛ̀kspìryɛ̀ns ì wɔ̀",
    howFeeling: "Ndáp wɔ̀ ì kɛ̀?",
    writeReview: "Ràyt rìvyù ì wɔ̀",
    voiceNote: "Vɔ̀ys Nòt",
    submit: "Sɛ̀n Fídbàk",
    thankYou: "Tɛ̀nkì fɔ̀ fídbàk ì wɔ̀!",
    placeholder: "Tɔ̀k ɓísɔ̀ àbàwt ɛ̀kspìryɛ̀ns ì wɔ̀...",
  },
  ewondo: {
    title: "Tɔ́b Mɛ́lɔ́ Wɔ́",
    description: "Dɔ́m ɓísɔ́ tɔ́b akɔ́s ayɔ́s",
    rateExperience: "Kɔ́b mɛ́lɔ́ wɔ́",
    howFeeling: "Ndé wɔ́ à kɛ́?",
    writeReview: "Ŋwál mɛ́lɔ́ wɔ́",
    voiceNote: "Ŋwál Ńlɔ́m",
    submit: "Tɔ́m Mɛ́lɔ́",
    thankYou: "Akíbá mɛ́lɔ́ wɔ́!",
    placeholder: "Tɔ́b ɓísɔ́ mɛ́lɔ́ wɔ́...",
  },
}

const emotions = [
  { icon: Smile, label: "Happy", color: "text-green-500", bg: "bg-green-50" },
  { icon: Meh, label: "Neutral", color: "text-yellow-500", bg: "bg-yellow-50" },
  { icon: Frown, label: "Sad", color: "text-red-500", bg: "bg-red-50" },
  { icon: Heart, label: "Love", color: "text-pink-500", bg: "bg-pink-50" },
  { icon: ThumbsUp, label: "Good", color: "text-blue-500", bg: "bg-blue-50" },
  { icon: ThumbsDown, label: "Bad", color: "text-gray-500", bg: "bg-gray-50" },
]

interface FeedbackFormProps {
  language: keyof typeof feedbackTranslations
}

export default function FeedbackForm({ language }: FeedbackFormProps) {
  const [rating, setRating] = useState(0)
  const [selectedEmotion, setSelectedEmotion] = useState<number | null>(null)
  const [feedback, setFeedback] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const t = feedbackTranslations[language]

  const handleSubmit = () => {
    // Simulate feedback submission
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // Simulate voice recording
    if (!isRecording) {
      setTimeout(() => setIsRecording(false), 3000)
    }
  }

  if (submitted) {
    return (
      <Card className="text-center p-8 border-0 shadow-lg">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-green-100 rounded-full">
            <Heart className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-green-600 mb-2">{t.thankYou}</h3>
      </Card>
    )
  }

  return (
    <div className="grid gap-6">
      {/* Star Rating */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            {t.rateExperience}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button key={star} variant="ghost" size="lg" onClick={() => setRating(star)} className="p-2">
                <Star className={`h-8 w-8 ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emotion Selection */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>{t.howFeeling}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {emotions.map((emotion, index) => {
              const Icon = emotion.icon
              return (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={() => setSelectedEmotion(index)}
                  className={`p-4 h-auto flex-col gap-2 ${selectedEmotion === index ? emotion.bg : ""}`}
                >
                  <Icon className={`h-6 w-6 ${emotion.color}`} />
                  <span className="text-xs">{emotion.label}</span>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Text/Voice Feedback */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>{t.writeReview}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={t.placeholder}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[100px] resize-none"
          />

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={toggleRecording}
              className={`flex items-center gap-2 ${isRecording ? "bg-red-50 text-red-600 border-red-200" : ""}`}
            >
              <Mic className={`h-4 w-4 ${isRecording ? "animate-pulse" : ""}`} />
              {isRecording ? "Recording..." : t.voiceNote}
            </Button>

            <Button onClick={handleSubmit} className="flex items-center gap-2 ml-auto">
              <Send className="h-4 w-4" />
              {t.submit}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
