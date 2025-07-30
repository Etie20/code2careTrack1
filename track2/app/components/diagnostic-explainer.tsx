"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Pill, Heart, Brain, Stethoscope, AlertTriangle } from "lucide-react"

const diagnosticTranslations = {
  en: {
    title: "Diagnostic & Treatment Explainer",
    description: "Upload your medical report or enter diagnosis details for personalized explanations",
    uploadReport: "Upload Medical Report",
    enterDiagnosis: "Enter Diagnosis",
    medications: "Medications",
    lifestyle: "Lifestyle",
    followUp: "Follow-up Care",
    inputPlaceholder: "Enter your diagnosis, medication names, or medical terms...",
    explain: "Explain",
    commonConditions: "Common Conditions",
    sideEffects: "Side Effects",
    dosageInstructions: "Dosage Instructions",
    whenToTake: "When to Take",
    precautions: "Precautions",
  },
  fr: {
    title: "Explicateur de Diagnostic et Traitement",
    description:
      "Téléchargez votre rapport médical ou entrez les détails du diagnostic pour des explications personnalisées",
    uploadReport: "Télécharger Rapport Médical",
    enterDiagnosis: "Entrer Diagnostic",
    medications: "Médicaments",
    lifestyle: "Mode de Vie",
    followUp: "Suivi des Soins",
    inputPlaceholder: "Entrez votre diagnostic, noms de médicaments ou termes médicaux...",
    explain: "Expliquer",
    commonConditions: "Conditions Courantes",
    sideEffects: "Effets Secondaires",
    dosageInstructions: "Instructions de Dosage",
    whenToTake: "Quand Prendre",
    precautions: "Précautions",
  },
  douala: {
    title: "Dayagnɔstik na Tritmɛnt Ɛksplenɛ",
    description: "Aplod mɛdikal ripɔt na yɔ ɔ ɛntɛ dayagnɔsis ditel fɔ pɛsonalayz ɛkspleneshɔn",
    uploadReport: "Aplod Mɛdikal Ripɔt",
    enterDiagnosis: "Ɛntɛ Dayagnɔsis",
    medications: "Mɛdisin",
    lifestyle: "Layf Stayl",
    followUp: "Fɔlo-ap Kɛ",
    inputPlaceholder: "Ɛntɛ dayagnɔsis na yɔ, mɛdisin nem, ɔ mɛdikal tɛm...",
    explain: "Ɛksplen",
    commonConditions: "Kɔmɔn Kɔndishɔn",
    sideEffects: "Sayd Ɛfɛkt",
    dosageInstructions: "Dosɛj Instrɔkshɔn",
    whenToTake: "Wɛn Fɔ Tek",
    precautions: "Prikɔshɔn",
  },
  bassa: {
    title: "Dàyàgnɔ̀stìk nà Trìtmɛ̀nt Ɛ̀ksplenɛ̀",
    description: "Àplòd mɛ̀dìkàl rìpɔ̀t ì wɔ̀ ɔ̀ ɛ̀ntɛ̀ dàyàgnɔ̀sìs dìtɛ̀l fɔ̀ pɛ̀sònàlàyz ɛ̀ksplenɛ̀shɔ̀n",
    uploadReport: "Àplòd Mɛ̀dìkàl Rìpɔ̀t",
    enterDiagnosis: "Ɛ̀ntɛ̀ Dàyàgnɔ̀sìs",
    medications: "Mɛ̀dìsìn",
    lifestyle: "Làyf Stàyl",
    followUp: "Fɔ̀lò-àp Kɛ̀",
    inputPlaceholder: "Ɛ̀ntɛ̀ dàyàgnɔ̀sìs ì wɔ̀, mɛ̀dìsìn nɛ̀m, ɔ̀ mɛ̀dìkàl tɛ̀m...",
    explain: "Ɛ̀ksplen",
    commonConditions: "Kɔ̀mɔ̀n Kɔ̀ndìshɔ̀n",
    sideEffects: "Sàyd Ɛ̀fɛ̀kt",
    dosageInstructions: "Dòsɛ̀j Ìnstrɔ̀kshɔ̀n",
    whenToTake: "Wɛ̀n Fɔ̀ Tɛ̀k",
    precautions: "Prìkɔ̀shɔ̀n",
  },
  ewondo: {
    title: "Dáyágnɔ́stík sí Trítmɛ́nt Ɛ́ksplenɛ́",
    description: "Áplód mɛ́dikál rípɔ́t wɔ́ ɔ ɛ́ntɛ́ dáyágnɔ́sís dítɛ́l fɔ́ pɛ́sɔ́náláyz ɛ́ksplenɛ́shɔ́n",
    uploadReport: "Áplód Mɛ́dikál Rípɔ́t",
    enterDiagnosis: "Ɛ́ntɛ́ Dáyágnɔ́sís",
    medications: "Bílɔ́m",
    lifestyle: "Ńdɔ́l Ébé",
    followUp: "Fɔ́lò-áp Kɛ́",
    inputPlaceholder: "Ɛ́ntɛ́ dáyágnɔ́sís wɔ́, bílɔ́m dín, ɔ mɛ́dikál tɛ́m...",
    explain: "Ɛ́ksplen",
    commonConditions: "Kɔ́mɔ́n Kɔ́ndíshɔ́n",
    sideEffects: "Sáyd Ɛ́fɛ́kt",
    dosageInstructions: "Dósɛ́j Ínstrɔ́kshɔ́n",
    whenToTake: "Ńgɛ́ Fɔ́ Yɔ́",
    precautions: "Prík'ɔ́shɔ́n",
  },
}

const commonConditions = [
  { name: "Diabetes Type 2", icon: "🩺", severity: "chronic" },
  { name: "Hypertension", icon: "❤️", severity: "chronic" },
  { name: "Asthma", icon: "🫁", severity: "chronic" },
  { name: "Upper Respiratory Infection", icon: "🤧", severity: "acute" },
  { name: "Gastritis", icon: "🫃", severity: "acute" },
  { name: "Migraine", icon: "🧠", severity: "episodic" },
]

const commonMedications = [
  { name: "Metformin", condition: "Diabetes", dosage: "500mg twice daily" },
  { name: "Lisinopril", condition: "Hypertension", dosage: "10mg once daily" },
  { name: "Albuterol", condition: "Asthma", dosage: "2 puffs as needed" },
  { name: "Omeprazole", condition: "Gastritis", dosage: "20mg once daily" },
]

interface DiagnosticExplainerProps {
  language: keyof typeof diagnosticTranslations
}

export default function DiagnosticExplainer({ language }: DiagnosticExplainerProps) {
  const [input, setInput] = useState("")
  const [explanation, setExplanation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const t = diagnosticTranslations[language]

  const handleExplain = async () => {
    if (!input.trim()) return

    setIsLoading(true)

    // Simulate AI explanation generation
    setTimeout(() => {
      const mockExplanation = {
        condition: "Type 2 Diabetes",
        description:
          "Type 2 diabetes is a condition where your body doesn't use insulin properly, leading to high blood sugar levels. It's a chronic condition that requires ongoing management.",
        causes: ["Genetics", "Lifestyle factors", "Age", "Weight"],
        symptoms: ["Increased thirst", "Frequent urination", "Fatigue", "Blurred vision"],
        treatment: {
          medications: [
            { name: "Metformin", purpose: "Helps lower blood sugar", dosage: "500mg twice daily" },
            { name: "Glyburide", purpose: "Stimulates insulin production", dosage: "5mg once daily" },
          ],
          lifestyle: [
            "Regular exercise (30 minutes daily)",
            "Balanced diet with limited sugar",
            "Monitor blood sugar levels",
            "Maintain healthy weight",
          ],
          followUp: [
            "Check blood sugar levels daily",
            "Visit doctor every 3 months",
            "Annual eye and foot exams",
            "Monitor for complications",
          ],
        },
        sideEffects: ["Nausea", "Diarrhea", "Low blood sugar"],
        precautions: ["Take with food", "Monitor blood sugar", "Avoid alcohol"],
      }
      setExplanation(mockExplanation)
      setIsLoading(false)
    }, 2000)
  }

  const handleConditionClick = (condition: string) => {
    setInput(condition)
  }

  return (
    <div className="grid gap-6">
      {/* Input Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            {t.title}
          </CardTitle>
          <p className="text-gray-600">{t.description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.inputPlaceholder}
            className="min-h-[100px]"
          />
          <Button onClick={handleExplain} disabled={!input.trim() || isLoading} className="w-full">
            {isLoading ? "Processing..." : t.explain}
          </Button>
        </CardContent>
      </Card>

      {/* Common Conditions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-green-600" />
            {t.commonConditions}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {commonConditions.map((condition, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start text-left h-auto p-4 bg-transparent"
                onClick={() => handleConditionClick(condition.name)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{condition.icon}</span>
                  <div>
                    <p className="font-medium">{condition.name}</p>
                    <Badge variant={condition.severity === "chronic" ? "destructive" : "secondary"}>
                      {condition.severity}
                    </Badge>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Explanation Result */}
      {explanation && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              {explanation.condition}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="medications">{t.medications}</TabsTrigger>
                <TabsTrigger value="lifestyle">{t.lifestyle}</TabsTrigger>
                <TabsTrigger value="followup">{t.followUp}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-700">{explanation.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Common Symptoms</h4>
                  <div className="flex flex-wrap gap-2">
                    {explanation.symptoms.map((symptom: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="medications" className="space-y-4">
                {explanation.treatment.medications.map((med: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Pill className="h-4 w-4 text-blue-600" />
                      <h4 className="font-semibold">{med.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{med.purpose}</p>
                    <Badge variant="outline">{med.dosage}</Badge>
                  </div>
                ))}

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <h4 className="font-semibold text-amber-800">{t.sideEffects}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {explanation.sideEffects.map((effect: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {effect}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="lifestyle" className="space-y-4">
                <div className="grid gap-3">
                  {explanation.treatment.lifestyle.map((item: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Heart className="h-4 w-4 text-green-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="followup" className="space-y-4">
                <div className="grid gap-3">
                  {explanation.treatment.followUp.map((item: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
