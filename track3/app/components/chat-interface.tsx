"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Mic, MicOff, Bot, User, Heart, AlertTriangle, Volume2 } from "lucide-react"
import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

interface ChatInterfaceProps {
  selectedLanguage: string
  currentTopic: string
  welcomeMessage: string
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  topic?: string
}

export default function ChatInterface({ selectedLanguage, currentTopic, welcomeMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: welcomeMessage,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const translations = {
    en: {
      typePlaceholder: "Ask me about your health...",
      disclaimer:
        "This AI assistant provides general health information only. Always consult healthcare professionals for medical advice.",
      speaking: "Speaking...",
      listening: "Listening...",
      medicalDisclaimer: "Medical Disclaimer",
    },
    fr: {
      typePlaceholder: "Posez-moi des questions sur votre santé...",
      disclaimer:
        "Cet assistant IA fournit uniquement des informations générales sur la santé. Consultez toujours des professionnels de la santé pour des conseils médicaux.",
      speaking: "En train de parler...",
      listening: "En écoute...",
      medicalDisclaimer: "Avertissement Médical",
    },
    douala: {
      typePlaceholder: "Tuna moi question sur santé na yo...",
      disclaimer:
        "Assistant IA-ci na donner seulement information général sur santé. Toujours consulter professionnel santé pour conseil médical.",
      speaking: "Na parler...",
      listening: "Na écouter...",
      medicalDisclaimer: "Avertissement Médical",
    },
  }

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getSystemPrompt = (language: string, topic: string) => {
    const basePrompt = `You are a compassionate AI health assistant providing patient education and support. You must:

1. Be empathetic, caring, and culturally sensitive
2. Provide clear, easy-to-understand explanations
3. Always include medical disclaimers when appropriate
4. Encourage patients to consult healthcare professionals for serious concerns
5. Be supportive and reassuring while being medically accurate
6. Adapt your language to be culturally appropriate for Cameroon

Current topic focus: ${topic}
Language: ${language}

Always respond in ${language === "en" ? "English" : language === "fr" ? "French" : "Cameroonian French/local dialect mix"}.

Remember: You are providing educational information, not medical diagnosis or treatment.`

    return basePrompt
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
      topic: currentTopic,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const result = await streamText({
        model: openai("gpt-4o"),
        system: getSystemPrompt(selectedLanguage, currentTopic),
        messages: [...messages.map((m) => ({ role: m.role, content: m.content })), { role: "user", content: input }],
      })

      let assistantContent = ""
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
        topic: currentTopic,
      }

      setMessages((prev) => [...prev, assistantMessage])

      for await (const delta of result.textStream) {
        assistantContent += delta
        setMessages((prev) =>
          prev.map((msg) => (msg.id === assistantMessage.id ? { ...msg, content: assistantContent } : msg)),
        )
      }
    } catch (error) {
      console.error("Error generating response:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // Voice recording implementation would go here
  }

  const speakMessage = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = selectedLanguage === "en" ? "en-US" : selectedLanguage === "fr" ? "fr-FR" : "fr-FR"
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
      {/* Chat Messages */}
      <div className="lg:col-span-3">
        <Card className="h-full bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">AI Health Assistant</h3>
                  <p className="text-xs text-gray-500">Online • Ready to help</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {currentTopic}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col h-full p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                      {message.role === "assistant" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => speakMessage(message.content)}
                          className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                        >
                          <Volume2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t.typePlaceholder}
                    className="pr-12 bg-white/80 border-blue-200 focus:border-blue-400"
                    disabled={isLoading}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={toggleRecording}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 ${
                      isRecording ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Medical Disclaimer */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 text-sm mb-1">{t.medicalDisclaimer}</h4>
                <p className="text-xs text-amber-700 leading-relaxed">{t.disclaimer}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
          <CardContent className="p-4">
            <h4 className="font-medium text-gray-800 mb-3">Quick Questions</h4>
            <div className="space-y-2">
              {[
                "What are the side effects of my medication?",
                "How should I prepare for my surgery?",
                "What symptoms should I watch for?",
                "When should I take my medicine?",
              ].map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInput(question)}
                  className="w-full text-left p-2 text-xs bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors duration-200 text-gray-700 hover:text-blue-700"
                >
                  {question}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Health Tips */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-4 h-4 text-green-600" />
              <h4 className="font-medium text-green-800">Daily Health Tip</h4>
            </div>
            <p className="text-xs text-green-700 leading-relaxed">
              Remember to stay hydrated! Drinking 8 glasses of water daily helps maintain good health and supports your
              body's natural functions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
