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
  Zap,
  Brain,
  Activity,
  Settings,
  Star,
  Headphones,
} from "lucide-react"
import MessageTime from "@/app/components/message-time";

interface UserProfile {
  age?: number
  gender?: "male" | "female" | "unknown"
  language: "fr" | "en" | "pi"
  medicalContext?: string[]
}

const getWelcomeMessage = (lang: "fr" | "en" | "pi") => {
  return lang === "fr"
      ? "👋 **Bonjour !** Je suis **Dr. Assistant**, votre compagnon médical intelligent.\n\n🏥 **Hôpital Général de Douala** - *Votre santé, notre priorité*\n\n✨ **Je peux vous aider avec :**\n• 🩺 Explications de diagnostics simples\n• 💊 Conseils sur vos médicaments\n• 🛡️ Prévention et conseils santé\n• ❤️ Support empathique 24/7\n\n💬 **Parlez-moi naturellement** - je vous comprends !"
      : "👋 **Hello!** I'm **Dr. Assistant**, your intelligent medical companion.\n\n🏥 **Douala General Hospital** - *Your health, our priority*\n\n✨ **I can help you with:**\n• 🩺 Simple diagnosis explanations\n• 💊 Medication advice\n• 🛡️ Prevention and health tips\n• ❤️ Empathetic 24/7 support\n\n💬 **Talk to me naturally** - I understand you!"
}

export default function PremiumMedicalChatbot() {
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [language, setLanguage] = useState<"fr" | "en" | "pi">("en")
  const [userProfile, setUserProfile] = useState<UserProfile>({ language: "en" })
  const [isTyping, setIsTyping] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"online" | "offline" | "connecting">("online")
  const [showSettings, setShowSettings] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: "/api/chat",
    body: { language, userProfile },
    onResponse: () => setIsTyping(false),
    onFinish: (message) => {
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

  // Smooth auto-scroll with easing
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollElement) {
        const scrollToBottom = () => {
          scrollElement.scrollTo({
            top: scrollElement.scrollHeight,
            behavior: "smooth",
          })
        }
        // Delay for smooth animation
        setTimeout(scrollToBottom, 100)
      }
    }
  }, [messages])

  // Dynamic textarea with smooth resize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      const newHeight = Math.min(textareaRef.current.scrollHeight, 160)
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
    // Enhanced semantic analysis
    const ageKeywords = {
      child: ["enfant", "bébé", "child", "baby", "petit", "petite", "ans", "year"],
      adult: ["adulte", "adult", "travail", "work", "mari", "femme", "husband", "wife"],
      elderly: ["âgé", "vieux", "elderly", "old", "retraite", "retirement", "grand"],
    }

    const genderKeywords = {
      male: ["monsieur", "homme", "mr", "man", "père", "father", "papa", "dad", "garçon", "boy"],
      female: ["madame", "femme", "mrs", "woman", "mère", "mother", "maman", "mom", "fille", "girl"],
    }

    let detectedAge: number | undefined
    let detectedGender: "male" | "female" | "unknown" = "unknown"

    // Age detection with regex
    const ageMatch = content.match(/(\d+)\s*(ans|year|old)/i)
    if (ageMatch) {
      detectedAge = Number.parseInt(ageMatch[1])
    } else if (ageKeywords.child.some((word) => content.toLowerCase().includes(word))) {
      detectedAge = 12
    } else if (ageKeywords.elderly.some((word) => content.toLowerCase().includes(word))) {
      detectedAge = 65
    } else {
      detectedAge = 35
    }

    // Gender detection
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

          if (event.results[event.results.length - 1].isFinal) {
            handleInputChange({ target: { value: transcript } } as any)
            setIsRecording(false)
            setConnectionStatus("online")
          }
        }

        recognition.onerror = () => {
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
        // Enhanced fallback with contextual examples
        const medicalExamples =
            language === "fr"
                ? [
                  "Docteur, j'ai de la fièvre depuis 3 jours avec des maux de tête",
                  "Pouvez-vous m'expliquer mon diagnostic de paludisme ?",
                  "Comment dois-je prendre mes médicaments contre l'hypertension ?",
                  "Quels sont les effets secondaires de la chloroquine ?",
                  "J'ai des douleurs abdominales, que faire ?",
                ]
                : [
                  "Doctor, I've had fever for 3 days with headaches",
                  "Can you explain my malaria diagnosis?",
                  "How should I take my hypertension medications?",
                  "What are the side effects of chloroquine?",
                  "I have abdominal pain, what should I do?",
                ]

        const randomExample = medicalExamples[Math.floor(Math.random() * medicalExamples.length)]

        setTimeout(() => {
          handleInputChange({ target: { value: randomExample } } as any)
          setIsRecording(false)
        }, 2500)
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

          // Clean text for speech
          const cleanText = text.replace(/[*#`]/g, "").replace(/\n/g, " ")

          const utterance = new SpeechSynthesisUtterance(cleanText)
          utterance.lang = language === "fr" ? "fr-FR" : "en-US"
          utterance.rate = 0.85
          utterance.pitch = 1.0
          utterance.volume = 0.9

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
            { text: "Expliquer diagnostic", icon: "🩺", color: "from-blue-500 to-cyan-500" },
            { text: "Posologie médicaments", icon: "💊", color: "from-green-500 to-emerald-500" },
            { text: "Prévention santé", icon: "🛡️", color: "from-purple-500 to-violet-500" },
          ]
          : [
            { text: "Explain diagnosis", icon: "🩺", color: "from-blue-500 to-cyan-500" },
            { text: "Medication dosage", icon: "💊", color: "from-green-500 to-emerald-500" },
            { text: "Health prevention", icon: "🛡️", color: "from-purple-500 to-violet-500" },
          ]

  return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Premium Header */}
        <div className="relative z-10 border-b border-white/20 bg-white/80 backdrop-blur-xl sticky top-0 shadow-lg shadow-black/5">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl">
                    <Stethoscope className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-white animate-pulse shadow-lg"></div>
                </div>

                <div className="sm:block hidden space-y-1">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent flex items-center gap-2">
                    Dr. Assistant
                    <Sparkles className="h-5 w-5 text-blue-600 animate-pulse" />
                  </h1>
                  <p className="text-sm text-gray-600 flex items-center gap-2 font-medium">
                    <Heart className="h-3.5 w-3.5 text-red-500" />
                    {language === "fr" ? "Hôpital Général de Douala" : "Douala General Hospital"}
                    <Badge
                        variant="secondary"
                        className="text-xs px-2 py-0.5 bg-green-100 text-green-700 border-green-200"
                    >
                      <Activity className="h-3 w-3 mr-1" />
                      {language === "fr" ? "En ligne" : "Online"}
                    </Badge>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">

                {/* Language Switcher */}
                <div className="flex bg-white/60 backdrop-blur-sm rounded-xl p-1 border border-white/40 shadow-sm">
                  <Button
                      variant={language === "en" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setLanguage("en")}
                      className={`text-xs h-8 px-4 rounded-lg font-medium transition-all duration-200 ${
                          language === "en"
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                              : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                      }`}
                  >
                    🇬🇧 English
                  </Button>
                  <Button
                      variant={language === "fr" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setLanguage("fr")}
                      className={`text-xs h-8 px-4 rounded-lg font-medium transition-all duration-200 ${
                          language === "fr"
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                              : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                      }`}
                  >
                    🇫🇷 Français
                  </Button>
                  <Button
                      variant={language === "pi" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setLanguage("pi")}
                      className={`text-xs h-8 px-4 rounded-lg font-medium transition-all duration-200 ${
                          language === "pi"
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                              : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                      }`}
                  >
                    🇬🇧 Pidgin
                  </Button>
                </div>

                {/* Control Buttons */}
                <div className="flex gap-1">
                  {/*<Button*/}
                  {/*    variant="ghost"*/}
                  {/*    size="sm"*/}
                  {/*    onClick={toggleSpeech}*/}
                  {/*    className="h-9 w-9 p-0 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40 hover:bg-white/80 transition-all duration-200 shadow-sm"*/}
                  {/*    title={language === "fr" ? "Écouter la réponse" : "Listen to response"}*/}
                  {/*>*/}
                  {/*  {isSpeaking ? (*/}
                  {/*      <VolumeX className="h-4 w-4 text-red-600" />*/}
                  {/*  ) : (*/}
                  {/*      <Volume2 className="h-4 w-4 text-blue-600" />*/}
                  {/*  )}*/}
                  {/*</Button>*/}
                  <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearChat}
                      className="cursor-pointer hover:h-10 hover:w-10 h-9 w-9 p-0 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40 hover:bg-white/80 transition-all duration-200 shadow-sm"
                      title={language === "fr" ? "Nouvelle conversation" : "New conversation"}
                  >
                    <RotateCcw className="h-4 w-4 text-gray-600" />
                  </Button>
                  {/*<Button*/}
                  {/*    variant="ghost"*/}
                  {/*    size="sm"*/}
                  {/*    onClick={() => setShowSettings(!showSettings)}*/}
                  {/*    className="h-9 w-9 p-0 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40 hover:bg-white/80 transition-all duration-200 shadow-sm"*/}
                  {/*    title={language === "fr" ? "Paramètres" : "Settings"}*/}
                  {/*>*/}
                  {/*  <Settings className="h-4 w-4 text-gray-600" />*/}
                  {/*</Button>*/}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Chat Messages */}
        <div className="flex-1 overflow-hidden relative z-10">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="max-w-4xl mx-auto px-6 py-8">
              {messages.map((message, index) => (
                  <div
                      key={message.id}
                      className={`group relative mb-8 animate-fadeIn ${
                          message.role === "user" ? "flex justify-end" : "flex justify-start"
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`flex gap-4 max-w-4xl ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      {/* Enhanced Avatar */}
                      <div className="relative shrink-0">
                        <Avatar className="h-12 w-12 shadow-xl border-2 border-white/50">
                          <AvatarFallback
                              className={
                                message.role === "user"
                                    ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white"
                                    : "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
                              }
                          >
                            {message.role === "user" ? <User className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
                          </AvatarFallback>
                        </Avatar>
                        {message.role === "assistant" && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                              <Zap className="h-2.5 w-2.5 text-white" />
                            </div>
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div className="flex-1 min-w-0">
                        <div
                            className={`flex items-center gap-3 mb-3 ${
                                message.role === "user" ? "justify-end" : "justify-start"
                            }`}
                        >
                          <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {message.role === "user" ? (language === "fr" ? "Vous" : "You") : "Dr. Assistant"}
                        </span>
                            <MessageTime timestamp={message.createdAt} />
                            {message.role === "assistant" && (
                                <Badge className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-sm">
                                  <Shield className="h-3 w-3 mr-1" />
                                  {language === "fr" ? "Vérifié" : "Verified"}
                                </Badge>
                            )}
                          </div>
                        </div>

                        <Card
                            className={`p-6 shadow-xl border-0 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl ${
                                message.role === "user"
                                    ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white ml-8"
                                    : "bg-white/80 text-gray-900 mr-8"
                            }`}
                        >
                          <div className="prose prose-sm max-w-none">
                            <div className="whitespace-pre-wrap leading-relaxed">
                              {message.content.split("**").map((part, i) =>
                                  i % 2 === 1 ? (
                                      <strong key={i} className="font-bold">
                                        {part}
                                      </strong>
                                  ) : (
                                      part
                                  ),
                              )}
                            </div>
                          </div>

                          {message.role === "assistant" && (
                              <div className="mt-4 flex gap-2 pt-4 border-t border-gray-100">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => speakMessage(message.content)}
                                    className="h-8 px-3 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg transition-all duration-200"
                                >
                                  <Headphones className="h-3 w-3 mr-1" />
                                  {language === "fr" ? "Écouter" : "Listen"}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-3 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg transition-all duration-200"
                                >
                                  <Star className="h-3 w-3 mr-1" />
                                  {language === "fr" ? "Utile" : "Helpful"}
                                </Button>
                              </div>
                          )}
                        </Card>
                      </div>
                    </div>
                  </div>
              ))}

              {/* Enhanced Loading State */}
              {(isLoading || isTyping) && (
                  <div className="group relative mb-8 animate-fadeIn flex justify-start">
                    <div className="flex gap-4 max-w-4xl">
                      <div className="relative shrink-0">
                        <Avatar className="h-12 w-12 shadow-xl border-2 border-white/50">
                          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                            <Bot className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-pulse">
                          <Brain className="h-2.5 w-2.5 text-white" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-semibold text-gray-900">Dr. Assistant</span>
                          <Badge className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 animate-pulse">
                            <Sparkles className="h-3 w-3 mr-1" />
                            {language === "fr" ? "Analyse en cours..." : "Analyzing..."}
                          </Badge>
                        </div>

                        <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl border-0 mr-8">
                          <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"></div>
                            </div>
                            <span className="text-sm text-gray-600 font-medium">
                          {language === "fr"
                              ? "Je réfléchis à votre question médicale..."
                              : "I'm thinking about your medical question..."}
                        </span>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Premium Input Area */}
        <div className="relative z-10 border-t border-white/20 bg-white/80 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto p-6">
            {/* Quick Actions */}
            {messages.length <= 1 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">
                  {language === "fr" ? "Actions rapides" : "Quick actions"}
                </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {quickActions.map((action, index) => (
                        <Button
                            key={index}
                            variant="outline"
                            onClick={() => handleInputChange({ target: { value: action.text } } as any)}
                            className="group relative h-auto p-4 bg-white/60 backdrop-blur-sm border border-white/40 hover:bg-white/80 transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-2xl overflow-hidden"
                            disabled={isLoading}
                        >
                          <div
                              className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                          ></div>
                          <div className="relative flex items-center gap-3">
                            <span className="text-2xl">{action.icon}</span>
                            <span className="text-sm font-medium text-gray-900">{action.text}</span>
                          </div>
                        </Button>
                    ))}
                  </div>
                </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-20 group-focus-within:opacity-30 transition duration-300"></div>
                <div className="relative flex items-end gap-4 bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl focus-within:shadow-3xl transition-all duration-300 p-2">
                  <div className="flex-1 relative">
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
                        className="min-h-[56px] max-h-[160px] overflow-y-hidden max-w-2xl resize-none border-0 bg-transparent p-4 text-base focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 font-medium"
                        rows={1}
                        disabled={isLoading}
                    />
                  </div>

                  <div className="flex items-center gap-2 p-2">
                    {/* Voice Button */}
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleAdvancedVoiceToggle}
                        className={`h-12 w-12 p-0 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl ${
                            isRecording
                                ? "bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse hover:from-red-600 hover:to-pink-600"
                                : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 hover:from-blue-500 hover:to-purple-500 hover:text-white"
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
                        className="h-12 w-12 p-0 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
                        title={language === "fr" ? "Envoyer le message" : "Send message"}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            {/* Enhanced Disclaimer */}
            <div className="mt-6 text-center">
              <div className="inline-block">
                <p className="text-sm text-amber-800 flex items-center gap-2 font-medium">
                  <Shield className="h-4 w-4" />
                  {language === "fr"
                      ? "⚠️ Information éducative uniquement. Consultez toujours votre médecin pour un avis personnalisé."
                      : "⚠️ Educational information only. Always consult your doctor for personalized advice."}
                </p>
              </div>
              {/*<Card className="inline-block p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 backdrop-blur-sm shadow-lg rounded-2xl">*/}
              {/*</Card>*/}
            </div>

            {/* Voice Recording Indicator */}
            {isRecording && (
                <div className="mt-4 flex items-center justify-center">
                  <Card className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 backdrop-blur-sm shadow-lg rounded-2xl">
                    <div className="flex items-center gap-3 text-red-600">
                      <div className="relative">
                        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                      </div>
                      <span className="text-sm font-medium">
                    {language === "fr" ? "🎤 Écoute en cours..." : "🎤 Listening..."}
                  </span>
                      <div className="flex gap-1">
                        <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse"></div>
                        <div className="w-1 h-6 bg-red-500 rounded-full animate-pulse delay-75"></div>
                        <div className="w-1 h-3 bg-red-500 rounded-full animate-pulse delay-150"></div>
                        <div className="w-1 h-5 bg-red-500 rounded-full animate-pulse delay-300"></div>
                      </div>
                    </div>
                  </Card>
                </div>
            )}
          </div>
        </div>
      </div>
  )
}
