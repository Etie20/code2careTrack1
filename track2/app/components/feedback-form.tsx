"use client"

import {useEffect, useRef, useState} from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Star, Smile, Meh, Frown, Heart, ThumbsUp, ThumbsDown } from "lucide-react"
import AudioRecorder from "@/app/components/AudioRecorder";

// Declare a global interface to add the webkitSpeechRecognition property to the Window object
declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// Define the type for the commands object

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
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const t = feedbackTranslations[language]

  // State variables to manage transcription status and text
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionComplete, setTranscriptionComplete] = useState(false);

  // Reference to store the SpeechRecognition instance
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startTranscription = () => {
    setIsTranscribing(true);
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const { transcript } = event.results[event.results.length - 1][0];
      console.log(event.results);
      setFeedback(transcript);
    };
    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopTranscription = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setTranscriptionComplete(true);
    }
  };

  const handleToggleTranscription = () => {
    if (isTranscribing) {
      stopTranscription();
    } else {
      startTranscription();
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleSubmit = () => {
    setIsLoading(true)
    // Simulate feedback submission
    setTimeout(() => {
      setSubmitted(true)
      setIsLoading(false)
      setTimeout(() => setSubmitted(false), 3000)
    }, 1000)
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
            <AudioRecorder
                handleToogleTranscription={handleToggleTranscription}
                isTranscribing={isTranscribing}
                transcriptionComplete={transcriptionComplete}
                onTranscriptionComplete={(text) => {
                  setFeedback(prev => prev + (prev ? ' ' : '') + text)
                }}
                language={language === 'fr' ? 'fr' : 'en'}
                disabled={isLoading}
            />

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
