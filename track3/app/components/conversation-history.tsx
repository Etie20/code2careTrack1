"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, MessageSquare, Clock, Download } from "lucide-react"

interface ConversationHistoryProps {
  selectedLanguage: string
}

export default function ConversationHistory({ selectedLanguage }: ConversationHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const translations = {
    en: {
      title: "Conversation History",
      subtitle: "Your past interactions with the AI assistant",
      search: "Search conversations...",
      filter: "Filter",
      all: "All",
      diagnosis: "Diagnosis",
      medication: "Medication",
      care: "Care Instructions",
      export: "Export History",
      messages: "messages",
      today: "Today",
      yesterday: "Yesterday",
      thisWeek: "This Week",
    },
    fr: {
      title: "Historique des Conversations",
      subtitle: "Vos interactions passées avec l'assistant IA",
      search: "Rechercher des conversations...",
      filter: "Filtrer",
      all: "Tout",
      diagnosis: "Diagnostic",
      medication: "Médicament",
      care: "Instructions de Soins",
      export: "Exporter l'Historique",
      messages: "messages",
      today: "Aujourd'hui",
      yesterday: "Hier",
      thisWeek: "Cette Semaine",
    },
    douala: {
      title: "Histoire Conversation",
      subtitle: "Interaction passé na yo avec assistant IA",
      search: "Chercher conversation...",
      filter: "Filtrer",
      all: "Tout",
      diagnosis: "Diagnostic",
      medication: "Médicament",
      care: "Instruction Soins",
      export: "Exporter Histoire",
      messages: "message",
      today: "Aujourd'hui",
      yesterday: "Hier",
      thisWeek: "Semaine-ci",
    },
  }

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en

  const conversations = [
    {
      id: 1,
      title: "Blood Pressure Medication Questions",
      topic: "medication",
      date: new Date(),
      messageCount: 12,
      summary: "Discussed side effects and proper timing for blood pressure medication",
      satisfaction: 5,
    },
    {
      id: 2,
      title: "Post-Surgery Care Instructions",
      topic: "care",
      date: new Date(Date.now() - 86400000), // Yesterday
      messageCount: 8,
      summary: "Reviewed wound care and recovery timeline after appendectomy",
      satisfaction: 4,
    },
    {
      id: 3,
      title: "Diabetes Symptoms Discussion",
      topic: "diagnosis",
      date: new Date(Date.now() - 172800000), // 2 days ago
      messageCount: 15,
      summary: "Explained diabetes symptoms and when to seek medical attention",
      satisfaction: 5,
    },
    {
      id: 4,
      title: "Heart Health Questions",
      topic: "general",
      date: new Date(Date.now() - 259200000), // 3 days ago
      messageCount: 6,
      summary: "General questions about maintaining heart health and exercise",
      satisfaction: 4,
    },
  ]

  const getTopicColor = (topic: string) => {
    switch (topic) {
      case "medication":
        return "bg-green-100 text-green-800 border-green-200"
      case "diagnosis":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "care":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getRelativeDate = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return t.today
    if (diffDays === 2) return t.yesterday
    if (diffDays <= 7) return t.thisWeek
    return date.toLocaleDateString()
  }

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === "all" || conv.topic === selectedFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <MessageSquare className="w-5 h-5" />
            {t.title}
          </CardTitle>
          <CardDescription>{t.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.search}
                className="pl-10 bg-white/80 border-blue-200"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-blue-200 rounded-md bg-white/80 text-sm"
              >
                <option value="all">{t.all}</option>
                <option value="diagnosis">{t.diagnosis}</option>
                <option value="medication">{t.medication}</option>
                <option value="care">{t.care}</option>
              </select>
              <Button variant="outline" size="sm" className="bg-white/80">
                <Download className="w-4 h-4 mr-2" />
                {t.export}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversation List */}
      <div className="grid gap-4">
        {filteredConversations.map((conversation) => (
          <Card
            key={conversation.id}
            className="bg-white/90 backdrop-blur-sm border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-800">{conversation.title}</h3>
                    <Badge variant="outline" className={getTopicColor(conversation.topic)}>
                      {conversation.topic}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{conversation.summary}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {getRelativeDate(conversation.date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {conversation.messageCount} {t.messages}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {conversation.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        i < conversation.satisfaction ? "bg-yellow-400" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" size="sm" className="bg-white/60">
                  View Conversation
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredConversations.length === 0 && (
        <Card className="bg-white/90 backdrop-blur-sm border-gray-200">
          <CardContent className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No conversations found</h3>
            <p className="text-gray-500">Try adjusting your search terms or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
