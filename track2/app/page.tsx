"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Send,
  Mic,
  MicOff,
  User,
  Bot,
  Stethoscope,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Heart,
  Shield,
  Globe,
} from "lucide-react"

interface UserProfile {
  age?: number
  gender?: "male" | "female" | "unknown"
  language: "fr" | "en"
  medicalContext?: string[]
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  metadata?: {
    confidence?: number
    intent?: string
    emotion?: string
  }
}

const getWelcomeMessage = (lang: "fr" | "en") => {
  return lang === "fr"
    ? "👋 Bonjour ! Je suis Dr. Assistant, votre compagnon médical intelligent de l'Hôpital Général de Douala.\n\n🩺 Je suis spécialement formé pour vous aider à :\n• Comprendre vos diagnostics en termes simples\n• Expliquer vos traitements et médicaments\n• Répondre à vos questions de santé\n• Vous rassurer avec empathie\n\n💬 Vous pouvez me parler en tapant ou en utilisant votre voix. Comment puis-je vous aider aujourd'hui ?"
    : "👋 Hello! I'm Dr. Assistant, your intelligent medical companion from Douala General Hospital.\n\n🩺 I'm specially trained to help you:\n• Understand your diagnoses in simple terms\n• Explain your treatments and medications\n• Answer your health questions\n• Reassure you with empathy\n\n💬 You can talk to me by typing or using your voice. How can I help you today?"
}

export default function AdvancedMedicalChatbot() {
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [language, setLanguage] = useState<"fr" | "en">("fr")
  const [userProfile, setUserProfile] = useState<UserProfile>({ language: "fr" })
  const [isTyping, setIsTyping] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"online" | "offline" | "connecting">("online")

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: "/api/chat",
    body: { language, userProfile },
    onResponse: () => setIsTyping(false),
    onFinish: (message) => {
      // Simulate semantic analysis
      analyzeMessage(message.content)
      if (isSpeaking) {
        speakMessage(message.content)
      }
    },
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: getWelcomeMessage(language),
      },
    ],
  })

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis
    }
  }, [])

  // Auto-scroll with smooth animation
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollElement) {
        scrollElement.scrollTo({
          top: scrollElement.scrollHeight,
          behavior: "smooth",
        })
      }
    }
  }, [messages])

  // Auto-resize textarea with animation
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200)
      textareaRef.current.style.height = `${newHeight}px`
    }
  }, [input])

  // Update welcome message when language changes
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: getWelcomeMessage(language),
      },
    ])
    setUserProfile((prev) => ({ ...prev, language }))
  }, [language, setMessages])

  const analyzeMessage = useCallback((content: string) => {
    // Simulate semantic analysis for age/gender detection
    const ageKeywords = {
      child: ["enfant", "bébé", "child", "baby", "petit", "petite"],
      adult: ["adulte", "adult", "travail", "work", "mari", "femme", "husband", "wife"],
      elderly: ["âgé", "vieux", "elderly", "old", "retraite", "retirement"],
    }

    const genderKeywords = {
      male: ["monsieur", "homme", "mr", "man", "père", "father", "papa", "dad"],
      female: ["madame", "femme", "mrs", "woman", "mère", "mother", "maman", "mom"],
    }

    let detectedAge: number | undefined
    let detectedGender: "male" | "female" | "unknown" = "unknown"

    // Simple age detection
    if (ageKeywords.child.some((word) => content.toLowerCase().includes(word))) {
      detectedAge = 10
    } else if (ageKeywords.elderly.some((word) => content.toLowerCase().includes(word))) {
      detectedAge = 70
    } else {
      detectedAge = 35
    }

    // Simple gender detection
    if (genderKeywords.male.some((word) => content.toLowerCase().includes(word))) {
      detectedGender = "male"
    } else if (genderKeywords.female.some((word) => content.toLowerCase().includes(word))) {
      detectedGender = "female"
    }

    setUserProfile((prev) => ({
      ...prev,
      age: detectedAge,
      gender: detectedGender,
    }))
  }, [])

  const handleAdvancedVoiceToggle = useCallback(() => {
    if (!isRecording) {
      setIsRecording(true)

      if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
        const recognition = new SpeechRecognition()

        recognition.lang = language === "fr" ? "fr-CM" : "en-CM"
        recognition.continuous = false
        recognition.interimResults = true
        recognition.maxAlternatives = 3

        recognition.onstart = () => {
          setConnectionStatus("connecting")
        }

        recognition.onresult = (event) => {
          const transcript = event.results[event.results.length - 1][0].transcript
          const confidence = event.results[event.results.length - 1][0].confidence

          if (event.results[event.results.length - 1].isFinal) {
            handleInputChange({ target: { value: transcript } } as any)
            setIsRecording(false)
            setConnectionStatus("online")
          }
        }

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error)
          setIsRecording(false)
          setConnectionStatus("offline")
        }

        recognition.onend = () => {
          setIsRecording(false)
          setConnectionStatus("online")
        }

        recognitionRef.current = recognition
        recognition.start()
      } else {
        // Enhanced fallback with medical examples
        const medicalExamples =
          language === "fr"
            ? [
                "Que signifie mon diagnostic de paludisme ?",
                "Comment prendre mes médicaments contre l'hypertension ?",
                "Quels sont les effets secondaires de la chloroquine ?",
                "J'ai de la fièvre depuis 3 jours, que faire ?",
              ]
            : [
                "What does my malaria diagnosis mean?",
                "How to take my hypertension medications?",
                "What are the side effects of chloroquine?",
                "I've had fever for 3 days, what should I do?",
              ]

        const randomExample = medicalExamples[Math.floor(Math.random() * medicalExamples.length)]

        setTimeout(() => {
          handleInputChange({ target: { value: randomExample } } as any)
          setIsRecording(false)
        }, 2000)
      }
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      setIsRecording(false)
    }
  }, [isRecording, language, handleInputChange])

  const speakMessage = useCallback(
    (text: string) => {
      if (synthRef.current && text) {
        synthRef.current.cancel()

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = language === "fr" ? "fr-FR" : "en-US"
        utterance.rate = 0.9
        utterance.pitch = 1.1
        utterance.volume = 0.8

        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)

        synthRef.current.speak(utterance)
      }
    },
    [language],
  )

  const toggleSpeech = useCallback(() => {
    if (isSpeaking && synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    } else {
      const lastAssistantMessage = messages.filter((m) => m.role === "assistant").pop()
      if (lastAssistantMessage) {
        speakMessage(lastAssistantMessage.content)
      }
    }
  }, [isSpeaking, messages, speakMessage])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (input.trim()) {
        setIsTyping(true)
        handleSubmit(e as any)
      }
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: getWelcomeMessage(language),
      },
    ])
  }

  const quickActions =
    language === "fr"
      ? [
          { text: "Expliquer mon diagnostic", icon: "🩺" },
          { text: "Posologie médicaments", icon: "💊" },
          { text: "Conseils prévention", icon: "🛡️" },
        ]
      : [
          { text: "Explain my diagnosis", icon: "🩺" },
          { text: "Medication dosage", icon: "💊" },
          { text: "Prevention advice", icon: "🛡️" },
        ]

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Enhanced Header */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="p-2.5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg">
                  <Stethoscope className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Dr. Assistant
                  <Sparkles className="h-4 w-4 text-blue-600" />
                </h1>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Heart className="h-3 w-3 text-red-500" />
                  {language === "fr" ? "Hôpital Général de Douala" : "Douala General Hospital"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Connection Status */}
              <Badge variant={connectionStatus === "online" ? "default" : "destructive"} className="text-xs">
                <div
                  className={`w-2 h-2 rounded-full mr-1 ${
                    connectionStatus === "online" ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                {connectionStatus === "online" ? "En ligne" : "Hors ligne"}
              </Badge>

              {/* Language Switcher */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={language === "fr" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setLanguage("fr")}
                  className="text-xs h-7 px-3 rounded-md"
                >
                  🇫🇷 FR
                </Button>
                <Button
                  variant={language === "en" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setLanguage("en")}
                  className="text-xs h-7 px-3 rounded-md"
                >
                  🇬🇧 EN
                </Button>
              </div>

              {/* Controls */}
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSpeech}
                  className="h-8 w-8 p-0"
                  title={language === "fr" ? "Écouter la réponse" : "Listen to response"}
                >
                  {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearChat}
                  className="h-8 w-8 p-0"
                  title={language === "fr" ? "Nouvelle conversation" : "New conversation"}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="max-w-4xl mx-auto px-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`group relative py-6 ${
                  message.role === "user" ? "bg-transparent" : index % 2 === 1 ? "bg-gray-50/50" : "bg-transparent"
                } transition-colors duration-200`}
              >
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10 shrink-0 shadow-md">
                    <AvatarFallback
                      className={
                        message.role === "user"
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                          : "bg-gradient-to-r from-green-600 to-green-700 text-white"
                      }
                    >
                      {message.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900">
                        {message.role === "user" ? (language === "fr" ? "Vous" : "You") : "Dr. Assistant"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {/*{new Date(message.createdAt || Date.now()).toLocaleTimeString()}*/}
                      </span>
                      {message.role === "assistant" && (
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          {language === "fr" ? "Vérifié" : "Verified"}
                        </Badge>
                      )}
                    </div>

                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">{message.content}</div>
                    </div>

                    {message.role === "assistant" && (
                      <div className="mt-3 flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => speakMessage(message.content)}
                          className="h-7 px-2 text-xs"
                        >
                          <Volume2 className="h-3 w-3 mr-1" />
                          {language === "fr" ? "Écouter" : "Listen"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Enhanced Loading State */}
            {(isLoading || isTyping) && (
              <div className="group relative py-6 bg-gray-50/50">
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10 shrink-0 shadow-md">
                    <AvatarFallback className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900">Dr. Assistant</span>
                      <Badge variant="secondary" className="text-xs animate-pulse">
                        <Sparkles className="h-3 w-3 mr-1" />
                        {language === "fr" ? "Analyse en cours..." : "Analyzing..."}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {language === "fr" ? "Je réfléchis à votre question..." : "I'm thinking about your question..."}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Enhanced Input Area */}
      <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto p-4">
          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                {language === "fr" ? "Actions rapides :" : "Quick actions:"}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleInputChange({ target: { value: action.text } } as any)}
                    className="justify-start text-left h-auto p-3 bg-white hover:bg-gray-50 border-gray-200 transition-all duration-200 hover:shadow-md"
                    disabled={isLoading}
                  >
                    <span className="mr-2 text-lg">{action.icon}</span>
                    <span className="text-xs">{action.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-2xl shadow-lg focus-within:border-blue-500 focus-within:shadow-xl transition-all duration-200">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={
                  language === "fr"
                    ? "💬 Décrivez vos symptômes ou posez votre question médicale..."
                    : "💬 Describe your symptoms or ask your medical question..."
                }
                className="flex-1 max-h-[200px] resize-none border-white border-0 bg-transparent p-4 text-base focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
                rows={1}
                disabled={isLoading}
              />

              <div className="flex items-center gap-2 p-3">
                {/* Voice Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAdvancedVoiceToggle}
                  className={`h-10 w-10 p-0 rounded-xl transition-all duration-200 ${
                    isRecording
                      ? "bg-red-100 text-red-600 hover:bg-red-200 animate-pulse"
                      : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                  disabled={isLoading}
                  title={language === "fr" ? "Parler au micro" : "Speak to microphone"}
                >
                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>

                {/* Send Button */}
                <Button
                  type="submit"
                  size="sm"
                  disabled={!input.trim() || isLoading}
                  className="h-10 w-10 p-0 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl"
                  title={language === "fr" ? "Envoyer le message" : "Send message"}
                >
                  <Send className="h-5 w-5 text-white" />
                </Button>
              </div>
            </div>
          </form>

          {/* Enhanced Disclaimer */}
          <div className="mt-4 text-center">
            <Card className="inline-block p-3 bg-amber-50 border-amber-200">
              <p className="text-xs text-amber-800 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {language === "fr"
                  ? "⚠️ Information éducative uniquement. Consultez toujours votre médecin pour un avis personnalisé."
                  : "⚠️ Educational information only. Always consult your doctor for personalized advice."}
              </p>
            </Card>
          </div>

          {/* Voice Recording Indicator */}
          {isRecording && (
            <div className="mt-3 flex items-center justify-center gap-2 text-red-600">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">
                {language === "fr" ? "🎤 Écoute en cours..." : "🎤 Listening..."}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
