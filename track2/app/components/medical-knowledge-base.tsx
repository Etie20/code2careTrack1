"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, BookOpen, Pill, Activity, Users } from "lucide-react"

const knowledgeTranslations = {
  en: {
    title: "Medical Knowledge Base",
    description: "Search through curated medical information and educational resources",
    searchPlaceholder: "Search conditions, medications, treatments...",
    conditions: "Conditions",
    medications: "Medications",
    treatments: "Treatments",
    prevention: "Prevention",
    emergencies: "Emergencies",
    searchResults: "Search Results",
    noResults: "No results found",
    commonQueries: "Common Queries",
  },
  fr: {
    title: "Base de Connaissances Médicales",
    description: "Recherchez dans les informations médicales et ressources éducatives sélectionnées",
    searchPlaceholder: "Rechercher conditions, médicaments, traitements...",
    conditions: "Conditions",
    medications: "Médicaments",
    treatments: "Traitements",
    prevention: "Prévention",
    emergencies: "Urgences",
    searchResults: "Résultats de Recherche",
    noResults: "Aucun résultat trouvé",
    commonQueries: "Requêtes Communes",
  },
  douala: {
    title: "Mɛdikal Nolɛj Bɛs",
    description: "Sɛch tru kyurɛtɛd mɛdikal infɔmeshɔn na ɛdukeshɔn risɔs",
    searchPlaceholder: "Sɛch kɔndishɔn, mɛdisin, tritmɛnt...",
    conditions: "Kɔndishɔn",
    medications: "Mɛdisin",
    treatments: "Tritmɛnt",
    prevention: "Privɛnshɔn",
    emergencies: "Ɛmɛjɛnsi",
    searchResults: "Sɛch Risɔlt",
    noResults: "No risɔlt fayn",
    commonQueries: "Kɔmɔn Kwɛri",
  },
  bassa: {
    title: "Mɛ̀dìkàl Nòlɛ̀j Bɛ̀s",
    description: "Sɛ̀ch trù kyùrɛ̀tɛ̀d mɛ̀dìkàl ìnfɔ̀mɛ̀shɔ̀n nà ɛ̀dùkɛ̀shɔ̀n rìsɔ̀s",
    searchPlaceholder: "Sɛ̀ch kɔ̀ndìshɔ̀n, mɛ̀dìsìn, trìtmɛ̀nt...",
    conditions: "Kɔ̀ndìshɔ̀n",
    medications: "Mɛ̀dìsìn",
    treatments: "Trìtmɛ̀nt",
    prevention: "Prìvɛ̀nshɔ̀n",
    emergencies: "Ɛ̀mɛ̀jɛ̀nsì",
    searchResults: "Sɛ̀ch Rìsɔ̀lt",
    noResults: "Nò rìsɔ̀lt fàyn",
    commonQueries: "Kɔ̀mɔ̀n Kwɛ̀rì",
  },
  ewondo: {
    title: "Mɛ́dikál Nólɛ́j Bɛ́s",
    description: "Sɛ́ch trú kyúrɛ́tɛ́d mɛ́dikál ínfɔ́mɛ́shɔ́n ná ɛ́dúkɛ́shɔ́n rísɔ́s",
    searchPlaceholder: "Sɛ́ch kɔ́ndíshɔ́n, bílɔ́m, trítmɛ́nt...",
    conditions: "Kɔ́ndíshɔ́n",
    medications: "Bílɔ́m",
    treatments: "Trítmɛ́nt",
    prevention: "Prívɛ́nshɔ́n",
    emergencies: "Ɛ́mɛ́jɛ́nsí",
    searchResults: "Sɛ́ch Rísɔ́lt",
    noResults: "Ékɔ́k rísɔ́lt",
    commonQueries: "Kɔ́mɔ́n Kwɛ́rí",
  },
}

const medicalData = {
  conditions: [
    {
      name: "Diabetes Type 2",
      category: "Chronic",
      description: "A condition where the body doesn't use insulin properly",
      symptoms: ["Increased thirst", "Frequent urination", "Fatigue"],
      prevalence: "High",
    },
    {
      name: "Hypertension",
      category: "Chronic",
      description: "High blood pressure that can lead to heart disease",
      symptoms: ["Headaches", "Shortness of breath", "Nosebleeds"],
      prevalence: "Very High",
    },
    {
      name: "Malaria",
      category: "Infectious",
      description: "Parasitic disease transmitted by mosquitoes",
      symptoms: ["Fever", "Chills", "Sweating", "Fatigue"],
      prevalence: "High",
    },
  ],
  medications: [
    {
      name: "Metformin",
      type: "Oral",
      indication: "Type 2 Diabetes",
      dosage: "500mg-1000mg twice daily",
      sideEffects: ["Nausea", "Diarrhea", "Stomach upset"],
    },
    {
      name: "Lisinopril",
      type: "Oral",
      indication: "Hypertension",
      dosage: "10mg-20mg once daily",
      sideEffects: ["Dry cough", "Dizziness", "Headache"],
    },
    {
      name: "Artemether-Lumefantrine",
      type: "Oral",
      indication: "Malaria",
      dosage: "Based on weight",
      sideEffects: ["Nausea", "Vomiting", "Loss of appetite"],
    },
  ],
  treatments: [
    {
      name: "Lifestyle Modification",
      conditions: ["Diabetes", "Hypertension", "Obesity"],
      description: "Diet and exercise changes to improve health",
      effectiveness: "High",
    },
    {
      name: "Insulin Therapy",
      conditions: ["Diabetes Type 1", "Advanced Type 2"],
      description: "Injectable hormone replacement therapy",
      effectiveness: "Very High",
    },
  ],
}

const commonQueries = [
  "What is diabetes?",
  "How to lower blood pressure?",
  "Malaria prevention",
  "Side effects of metformin",
  "Insulin injection technique",
  "Hypertension diet",
]

interface Condition {
  name: string
  category: string
  description: string
  symptoms: string[]
  prevalence: string
}

interface Medication {
  name: string
  type: string
  indication: string
  dosage: string
  sideEffects: string[]
}

interface Treatment {
  name: string
  conditions: string[]
  description: string
  effectiveness: string
}

type SearchResult =
  | (Condition & { type: "condition" })
  | (Medication & { type: "medication" })
  | (Treatment & { type: "treatment" })

interface MedicalKnowledgeBaseProps {
  language: keyof typeof knowledgeTranslations
}

export default function MedicalKnowledgeBase({ language }: MedicalKnowledgeBaseProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [activeTab, setActiveTab] = useState("conditions")

  const t = knowledgeTranslations[language]

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    const results: SearchResult[] = []

    // Search conditions
    medicalData.conditions.forEach((condition) => {
      if (
        condition.name.toLowerCase().includes(query) ||
        condition.description.toLowerCase().includes(query) ||
        condition.symptoms.some((symptom) => symptom.toLowerCase().includes(query))
      ) {
        results.push({ ...condition, type: "condition" })
      }
    })

    // Search medications
    medicalData.medications.forEach((medication) => {
      if (medication.name.toLowerCase().includes(query) || medication.indication.toLowerCase().includes(query)) {
        results.push({ ...medication, type: "medication" })
      }
    })

    // Search treatments
    medicalData.treatments.forEach((treatment) => {
      if (
        treatment.name.toLowerCase().includes(query) ||
        treatment.description.toLowerCase().includes(query) ||
        treatment.conditions.some((condition) => condition.toLowerCase().includes(query))
      ) {
        results.push({ ...treatment, type: "treatment" })
      }
    })

    setSearchResults(results)
  }

  const handleCommonQuery = (query: string) => {
    setSearchQuery(query)
    setSearchResults([])
  }

  const getPrevalenceColor = (prevalence: string) => {
    switch (prevalence) {
      case "Very High":
        return "bg-red-100 text-red-800"
      case "High":
        return "bg-orange-100 text-orange-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="grid gap-6">
      {/* Search Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            {t.title}
          </CardTitle>
          <p className="text-gray-600">{t.description}</p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Common Queries */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">{t.commonQueries}</h4>
            <div className="flex flex-wrap gap-2">
              {commonQueries.map((query, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleCommonQuery(query)}
                  className="h-8"
                >
                  {query}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-green-600" />
              {t.searchResults} ({searchResults.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.map((result, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{result.name}</h4>
                    <Badge variant="outline">{result.type}</Badge>
                  </div>
                  <p className="text-gray-600 mb-2">{result.description}</p>
                  {result.symptoms && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {result.symptoms.map((symptom: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {result.prevalence && (
                    <Badge className={getPrevalenceColor(result.prevalence)}>{result.prevalence} Prevalence</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Knowledge Base Tabs */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="conditions" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                {t.conditions}
              </TabsTrigger>
              <TabsTrigger value="medications" className="flex items-center gap-2">
                <Pill className="h-4 w-4" />
                {t.medications}
              </TabsTrigger>
              <TabsTrigger value="treatments" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t.treatments}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="conditions" className="p-6">
              <div className="grid gap-4">
                {medicalData.conditions.map((condition, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{condition.name}</h4>
                      <Badge variant="outline">{condition.category}</Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{condition.description}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {condition.symptoms.map((symptom, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                    <Badge className={getPrevalenceColor(condition.prevalence)}>
                      {condition.prevalence} Prevalence
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="medications" className="p-6">
              <div className="grid gap-4">
                {medicalData.medications.map((medication, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{medication.name}</h4>
                      <Badge variant="outline">{medication.type}</Badge>
                    </div>
                    <p className="text-gray-600 mb-2">For: {medication.indication}</p>
                    <p className="text-sm text-gray-600 mb-2">Dosage: {medication.dosage}</p>
                    <div className="flex flex-wrap gap-1">
                      {medication.sideEffects.map((effect, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {effect}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="treatments" className="p-6">
              <div className="grid gap-4">
                {medicalData.treatments.map((treatment, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{treatment.name}</h4>
                      <Badge className="bg-green-100 text-green-800">{treatment.effectiveness} Effectiveness</Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{treatment.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {treatment.conditions.map((condition, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
