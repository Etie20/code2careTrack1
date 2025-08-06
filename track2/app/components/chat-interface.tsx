"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Mic, MicOff, Bot, User, Loader2 } from "lucide-react"

const chatTranslations = {
  en: {
    title: "AI Medical Assistant Chat",
    placeholder: "Ask me about your health, medications, or symptoms...",
    speaking: "Speaking...",
    listening: "Listening...",
    processing: "Processing...",
    medicalDisclaimer: "This is for educational purposes only. Always consult your healthcare provider.",
    exampleQuestions: [
      "What does my diabetes diagnosis mean?",
      "How should I take my blood pressure medication?",
      "What are the side effects of ibuprofen?",
      "How can I manage my hypertension?",
    ],
  },
  fr: {
    title: "Chat Assistant Médical IA",
    placeholder: "Demandez-moi sur votre santé, médicaments ou symptômes...",
    speaking: "Parle...",
    listening: "Écoute...",
    processing: "Traitement...",
    medicalDisclaimer: "Ceci est à des fins éducatives uniquement. Consultez toujours votre professionnel de santé.",
    exampleQuestions: [
      "Que signifie mon diagnostic de diabète?",
      "Comment dois-je prendre mon médicament contre l'hypertension?",
      "Quels sont les effets secondaires de l'ibuprofène?",
      "Comment puis-je gérer mon hypertension?",
    ],
  },
  douala: {
    title: "AI Mɛdikal Asistant Chat",
    placeholder: "Aks mi abawt hɛlɛt na yɔ, mɛdisin, ɔ simptɔm...",
    speaking: "Di tɔk...",
    listening: "Di lisɛn...",
    processing: "Di prɔsɛs...",
    medicalDisclaimer: "Dis na fɔ ɛdukeshɔn nɔmɔ. Alwez kɔnsɔlt hɛlɛt prɔvaydɛ na yɔ.",
    exampleQuestions: [
      "Wetin diabɛtis dayagnɔsis na mi min?",
      "Haw a fɔ tek blɔd prɛshɛ mɛdisin na mi?",
      "Wetin na sayd ɛfɛkt fɔ ibuprofɛn?",
      "Haw a fit manɛj haypɛtɛnshɔn na mi?",
    ],
  },
  bassa: {
    title: "AI Mɛ̀dìkàl Àsìstànt Chàt",
    placeholder: "Àsk mì àbàwt hɛ̀lɛ̀t ì wɔ̀, mɛ̀dìsìn, ɔ̀ sìmptɔ̀m...",
    speaking: "Dì tɔ̀k...",
    listening: "Dì lìsɛ̀n...",
    processing: "Dì prɔ̀sɛ̀s...",
    medicalDisclaimer: "Dìs nà fɔ̀ ɛ̀dùkɛ̀shɔ̀n nɔ̀mɔ̀. Àlwɛ̀z kɔ̀nsɔ̀lt hɛ̀lɛ̀t prɔ̀vàydɛ̀ ì wɔ̀.",
    exampleQuestions: [
      "Wɛ̀tìn dìàbɛ̀tìs dàyàgnɔ̀sìs ì mì mìn?",
      "Hàw à fɔ̀ tɛ̀k blɔ̀d prɛ̀shɛ̀ mɛ̀dìsìn ì mì?",
      "Wɛ̀tìn nà sàyd ɛ̀fɛ̀kt fɔ̀ ìbùpròfɛ̀n?",
      "Hàw à fìt mànɛ̀j hàypɛ̀tɛ̀nshɔ̀n ì mì?",
    ],
  },
  ewondo: {
    title: "AI Mɛ́dikál Asístánt Chát",
    placeholder: "Bí mɛ́ ayɔ́s akɔ́s wɔ́, bílɔ́m, ɔ sík...",
    speaking: "À tɔ́b...",
    listening: "À yɔ́ŋ...",
    processing: "À sál...",
    medicalDisclaimer: "Éné á nɛ́ fɔ́k mínyɔ́ɔ́ kɛ́kɛ́. Zé áyɔ́s àkɔ́s wɔ́ mɛ́di.",
    exampleQuestions: [
      "Ndé sík súkà á tɔ́b?",
      "Ndé má yɔ́ bílɔ́m bá nt'áŋgá?",
      "Ndé mɛ́bɛ́ bílɔ́m ibuprofɛ́n?",
      "Ndé má kɛ́ sɔ́ŋ áŋgá?",
    ],
  },
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isTyping?: boolean
}

interface ChatInterfaceProps {
  language: keyof typeof chatTranslations
}

export default function ChatInterface({ language }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI Medical Assistant. I can help explain medical conditions, medications, and provide health guidance. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const t = chatTranslations[language]

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsProcessing(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateMedicalResponse(input, language),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsProcessing(false)
    }, 2000)
  }

  const generateMedicalResponse = (query: string, lang: string): string => {
    // Simulate medical AI response based on query
    const responses = {
      en: {
        diabetes:
          "Diabetes is a condition where your body has trouble managing blood sugar levels. Type 2 diabetes means your body doesn't use insulin effectively. Management includes monitoring blood sugar, taking prescribed medications, maintaining a healthy diet, and regular exercise. Always follow your doctor's specific recommendations.",
        medication:
          "It's important to take medications exactly as prescribed by your healthcare provider. For blood pressure medications, typically take them at the same time each day, with or without food as directed. Never stop taking them without consulting your doctor, even if you feel better.",
        default:
          "I understand you're asking about a health-related topic. While I can provide general educational information, it's important to consult with your healthcare provider for personalized medical advice. Could you be more specific about what you'd like to know?",
      },
      fr: {
        diabetes:
          "Le diabète est une condition où votre corps a du mal à gérer les niveaux de sucre dans le sang. Le diabète de type 2 signifie que votre corps n'utilise pas l'insuline efficacement. La gestion comprend la surveillance de la glycémie, la prise de médicaments prescrits, le maintien d'une alimentation saine et l'exercice régulier.",
        medication:
          "Il est important de prendre les médicaments exactement comme prescrit par votre professionnel de santé. Pour les médicaments contre l'hypertension, prenez-les généralement à la même heure chaque jour, avec ou sans nourriture selon les directives.",
        default:
          "Je comprends que vous posez une question sur un sujet de santé. Bien que je puisse fournir des informations éducatives générales, il est important de consulter votre professionnel de santé pour des conseils médicaux personnalisés.",
      },
    }

    const langResponses = responses[lang as keyof typeof responses] || responses.en

    if (query.toLowerCase().includes("diabetes") || query.toLowerCase().includes("diabète")) {
      return langResponses.diabetes
    } else if (query.toLowerCase().includes("medication") || query.toLowerCase().includes("médicament")) {
      return langResponses.medication
    } else {
      return langResponses.default
    }
  }

  const handleExampleQuestion = (question: string) => {
    setInput(question)
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // Simulate voice recording
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false)
        setInput("What are the side effects of my medication?")
      }, 3000)
    }
  }

  return (
    <div className="grid gap-6">
      {/* Chat Card */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            {t.title}
          </CardTitle>
          <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">⚠️ {t.medicalDisclaimer}</div>
        </CardHeader>
        <CardContent>
          {/* Messages */}
          <ScrollArea className="h-[400px] w-full pr-4 mb-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={message.role === "user" ? "bg-blue-100" : "bg-green-100"}>
                      {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-green-100">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">{t.processing}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button
              onClick={toggleRecording}
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              className="shrink-0"
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button onClick={handleSendMessage} disabled={!input.trim()} className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Example Questions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Example Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {t.exampleQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start text-left h-auto p-3 bg-transparent"
                onClick={() => handleExampleQuestion(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
