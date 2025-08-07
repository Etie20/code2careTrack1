"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TestTube, CheckCircle, XCircle, BarChart3, Users, Clock, AlertTriangle } from "lucide-react"

const evaluationTranslations = {
  en: {
    title: "System Evaluation & Testing",
    description: "Evaluate chatbot responses and system performance",
    accuracyTest: "Accuracy Test",
    usabilityTest: "Usability Test",
    clinicalReview: "Clinical Review",
    performance: "Performance",
    testQuestion: "Test Question",
    expectedAnswer: "Expected Answer",
    actualAnswer: "Actual Answer",
    evaluate: "Evaluate Response",
    accuracy: "Accuracy",
    clarity: "Clarity",
    empathy: "Empathy",
    completeness: "Completeness",
    results: "Results",
    feedback: "Feedback",
    excellent: "Excellent",
    good: "Good",
    fair: "Fair",
    poor: "Poor",
  },
  fr: {
    title: "Évaluation et Tests du Système",
    description: "Évaluer les réponses du chatbot et les performances du système",
    accuracyTest: "Test de Précision",
    usabilityTest: "Test d'Utilisabilité",
    clinicalReview: "Révision Clinique",
    performance: "Performance",
    testQuestion: "Question de Test",
    expectedAnswer: "Réponse Attendue",
    actualAnswer: "Réponse Réelle",
    evaluate: "Évaluer la Réponse",
    accuracy: "Précision",
    clarity: "Clarté",
    empathy: "Empathie",
    completeness: "Complétude",
    results: "Résultats",
    feedback: "Commentaires",
    excellent: "Excellent",
    good: "Bon",
    fair: "Passable",
    poor: "Pauvre",
  },
  douala: {
    title: "Sistɛm Ɛvalueshɔn na Tɛstiŋ",
    description: "Ɛvaluɛt chatbɔt rispɔns na sistɛm pɛfɔmans",
    accuracyTest: "Akurasi Tɛst",
    usabilityTest: "Yuzabiliti Tɛst",
    clinicalReview: "Klinikal Rivyu",
    performance: "Pɛfɔmans",
    testQuestion: "Tɛst Kwɛshɔn",
    expectedAnswer: "Ɛkspɛktɛd Ansa",
    actualAnswer: "Aktual Ansa",
    evaluate: "Ɛvaluɛt Rispɔns",
    accuracy: "Akurasi",
    clarity: "Klɛriti",
    empathy: "Ɛmpati",
    completeness: "Kɔmplitnɛs",
    results: "Risɔlt",
    feedback: "Fídbak",
    excellent: "Ɛksɛlɛnt",
    good: "Gud",
    fair: "Fɛ",
    poor: "Pu",
  },
  bassa: {
    title: "Sìstɛ̀m Ɛ̀vàlùɛ̀shɔ̀n nà Tɛ̀stìŋ",
    description: "Ɛ̀vàlùɛ̀t chàtbɔ̀t rìspɔ̀ns nà sìstɛ̀m pɛ̀fɔ̀màns",
    accuracyTest: "Àkùràsì Tɛ̀st",
    usabilityTest: "Yùzàbìlìtì Tɛ̀st",
    clinicalReview: "Klìnìkàl Rìvyù",
    performance: "Pɛ̀fɔ̀màns",
    testQuestion: "Tɛ̀st Kwɛ̀shɔ̀n",
    expectedAnswer: "Ɛ̀kspɛ̀ktɛ̀d Ànsà",
    actualAnswer: "Àktùàl Ànsà",
    evaluate: "Ɛ̀vàlùɛ̀t Rìspɔ̀ns",
    accuracy: "Àkùràsì",
    clarity: "Klɛ̀rìtì",
    empathy: "Ɛ̀mpàtì",
    completeness: "Kɔ̀mplìtnɛ̀s",
    results: "Rìsɔ̀lt",
    feedback: "Fídbàk",
    excellent: "Ɛ̀ksɛ̀lɛ̀nt",
    good: "Gùd",
    fair: "Fɛ̀",
    poor: "Pù",
  },
  ewondo: {
    title: "Sístɛ́m Ɛ́váluɛ́shɔ́n ná Tɛ́stíŋ",
    description: "Ɛ́váluɛ́t chátbɔ́t ríspɔ́ns ná sístɛ́m pɛ́fɔ́máns",
    accuracyTest: "Ákúrásí Tɛ́st",
    usabilityTest: "Yúzábílítí Tɛ́st",
    clinicalReview: "Klíníkál Rívyú",
    performance: "Pɛ́fɔ́máns",
    testQuestion: "Tɛ́st Kwɛ́shɔ́n",
    expectedAnswer: "Ɛ́kspɛ́ktɛ́d Ánsá",
    actualAnswer: "Áktúál Ánsá",
    evaluate: "Ɛ́váluɛ́t Ríspɔ́ns",
    accuracy: "Ákúrásí",
    clarity: "Klɛ́rítí",
    empathy: "Ɛ́mpátí",
    completeness: "Kɔ́mplítnɛ́s",
    results: "Rísɔ́lt",
    feedback: "Fídbák",
    excellent: "Ɛ́ksɛ́lɛ́nt",
    good: "Gúd",
    fair: "Fɛ́",
    poor: "Pú",
  },
}

const testQuestions = [
  {
    question: "What is diabetes and how is it managed?",
    expectedAnswer:
      "Diabetes is a condition where blood sugar levels are too high. It's managed through medication, diet, exercise, and regular monitoring.",
    category: "Condition Explanation",
  },
  {
    question: "How should I take my blood pressure medication?",
    expectedAnswer:
      "Take blood pressure medication exactly as prescribed, usually at the same time daily. Don't stop without consulting your doctor.",
    category: "Medication Guidance",
  },
  {
    question: "What are the side effects of metformin?",
    expectedAnswer:
      "Common side effects include nausea, diarrhea, and stomach upset. These often improve over time. Contact your doctor if severe.",
    category: "Side Effects",
  },
]

const mockPerformanceData = {
  responseTime: 2.3,
  accuracy: 87,
  userSatisfaction: 4.2,
  completionRate: 94,
  multilingual: 5,
  dailyUsers: 1247,
}

interface EvaluationToolsProps {
  language: keyof typeof evaluationTranslations
}

export default function EvaluationTools({ language }: EvaluationToolsProps) {
  const [currentTest, setCurrentTest] = useState(0)
  const [testResponse, setTestResponse] = useState("")
  interface EvaluationScores {
    accuracy: number
    clarity: number
    empathy: number
    completeness: number
    overall: number
  }
  const [evaluationScores, setEvaluationScores] = useState<EvaluationScores | null>(null)
  const [isEvaluating, setIsEvaluating] = useState(false)

  const t = evaluationTranslations[language]

  const handleEvaluate = async () => {
    setIsEvaluating(true)

    // Simulate evaluation process
    setTimeout(() => {
      const scores = {
        accuracy: Math.floor(Math.random() * 30) + 70, // 70-100%
        clarity: Math.floor(Math.random() * 30) + 70,
        empathy: Math.floor(Math.random() * 30) + 65,
        completeness: Math.floor(Math.random() * 25) + 75,
        overall: Math.floor(Math.random() * 20) + 75,
      }
      setEvaluationScores(scores)
      setIsEvaluating(false)
    }, 2000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 75) return "text-blue-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return t.excellent
    if (score >= 75) return t.good
    if (score >= 60) return t.fair
    return t.poor
  }

  return (
    <div className="grid gap-6">
      {/* Performance Dashboard */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            System Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{mockPerformanceData.responseTime}s</p>
              <p className="text-sm text-gray-600">Avg Response Time</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{mockPerformanceData.accuracy}%</p>
              <p className="text-sm text-gray-600">{t.accuracy}</p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{mockPerformanceData.dailyUsers}</p>
              <p className="text-sm text-gray-600">Daily Users</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evaluation Tabs */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-purple-600" />
            {t.title}
          </CardTitle>
          <p className="text-gray-600">{t.description}</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="accuracy" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="accuracy">{t.accuracyTest}</TabsTrigger>
              <TabsTrigger value="usability">{t.usabilityTest}</TabsTrigger>
              <TabsTrigger value="clinical">{t.clinicalReview}</TabsTrigger>
            </TabsList>

            <TabsContent value="accuracy" className="space-y-6">
              <div className="grid gap-4">
                <div>
                  <h4 className="font-semibold mb-2">{t.testQuestion}</h4>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p>{testQuestions[currentTest].question}</p>
                    <Badge variant="outline" className="mt-2">
                      {testQuestions[currentTest].category}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">{t.expectedAnswer}</h4>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800">{testQuestions[currentTest].expectedAnswer}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">{t.actualAnswer}</h4>
                  <Textarea
                    value={testResponse}
                    onChange={(e) => setTestResponse(e.target.value)}
                    placeholder="Enter the AI's response to evaluate..."
                    className="min-h-[100px]"
                  />
                </div>

                <Button onClick={handleEvaluate} disabled={!testResponse.trim() || isEvaluating} className="w-full">
                  {isEvaluating ? "Evaluating..." : t.evaluate}
                </Button>

                {evaluationScores && (
                  <div className="space-y-4 mt-6">
                    <h4 className="font-semibold">{t.results}</h4>

                    <div className="grid gap-3">
                      {[
                        { key: "accuracy", label: t.accuracy },
                        { key: "clarity", label: t.clarity },
                        { key: "empathy", label: t.empathy },
                        { key: "completeness", label: t.completeness },
                      ].map(({ key, label }) => (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{label}</span>
                            <span className={`text-sm font-bold ${getScoreColor(evaluationScores[key])}`}>
                              {evaluationScores[key]}% ({getScoreLabel(evaluationScores[key])})
                            </span>
                          </div>
                          <Progress value={evaluationScores[key]} className="h-2" />
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h5 className="font-semibold text-blue-800 mb-2">Overall Score</h5>
                      <div className="flex items-center justify-between">
                        <span className={`text-2xl font-bold ${getScoreColor(evaluationScores.overall)}`}>
                          {evaluationScores.overall}%
                        </span>
                        <Badge className="bg-blue-100 text-blue-800">{getScoreLabel(evaluationScores.overall)}</Badge>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentTest(Math.max(0, currentTest - 1))}
                    disabled={currentTest === 0}
                  >
                    Previous Question
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentTest(Math.min(testQuestions.length - 1, currentTest + 1))}
                    disabled={currentTest === testQuestions.length - 1}
                  >
                    Next Question
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="usability" className="space-y-4">
              <div className="grid gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">User Experience Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Task Completion Rate</span>
                      <span className="font-bold text-green-600">{mockPerformanceData.completionRate}%</span>
                    </div>
                    <Progress value={mockPerformanceData.completionRate} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span>User Satisfaction</span>
                      <span className="font-bold text-blue-600">{mockPerformanceData.userSatisfaction}/5.0</span>
                    </div>
                    <Progress value={mockPerformanceData.userSatisfaction * 20} className="h-2" />
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Accessibility Features</h4>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Multilingual Support ({mockPerformanceData.multilingual} languages)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Voice Input/Output</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Low Bandwidth Optimization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Mobile Responsive Design</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="clinical" className="space-y-4">
              <div className="grid gap-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <h4 className="font-semibold text-amber-800">Clinical Validation Status</h4>
                  </div>
                  <p className="text-amber-700">
                    This system requires clinical review and validation before deployment in healthcare settings.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Review Checklist</h4>
                  <div className="space-y-2">
                    {[
                      { item: "Medical accuracy verification", status: "completed" },
                      { item: "Cultural appropriateness review", status: "completed" },
                      { item: "Safety disclaimers validation", status: "completed" },
                      { item: "Healthcare professional approval", status: "pending" },
                      { item: "Regulatory compliance check", status: "pending" },
                    ].map((check, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span>{check.item}</span>
                        {check.status === "completed" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Clinical Feedback</h4>
                  <Textarea
                    placeholder="Enter clinical review feedback and recommendations..."
                    className="min-h-[100px]"
                  />
                  <Button className="mt-2">Submit Clinical Review</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
