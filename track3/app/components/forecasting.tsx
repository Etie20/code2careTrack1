"use client"

import {useEffect, useState} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  Target,
  BarChart3,
  RefreshCw,
  Zap, Loader2,
} from "lucide-react"
import {BloodForecast} from "@/lib/types/forecast";
import {getForecast} from "@/app/services/forecast.service";

export default function Forecasting() {
  const [selectedPeriod, setSelectedPeriod] = useState("7")
  const [isGenerating, setIsGenerating] = useState(false)

  const forecastData = [
    {
      bloodType: "O+",
      currentStock: 245,
      predictedDemand: 180,
      recommendedOrder: 50,
      confidence: 92,
      trend: "stable",
      riskLevel: "low",
      factors: ["Seasonal patterns", "Hospital requests", "Emergency reserves"],
    },
    {
      bloodType: "O-",
      currentStock: 89,
      predictedDemand: 120,
      recommendedOrder: 80,
      confidence: 88,
      trend: "increasing",
      riskLevel: "high",
      factors: ["Universal donor", "Emergency demand", "Low current stock"],
    },
    {
      bloodType: "A+",
      currentStock: 198,
      predictedDemand: 140,
      recommendedOrder: 30,
      confidence: 85,
      trend: "stable",
      riskLevel: "medium",
      factors: ["Regular demand", "Scheduled surgeries", "Donor availability"],
    },
    {
      bloodType: "A-",
      currentStock: 67,
      predictedDemand: 95,
      recommendedOrder: 60,
      confidence: 90,
      trend: "increasing",
      riskLevel: "high",
      factors: ["Critical stock level", "Upcoming surgeries", "Limited donors"],
    },
    {
      bloodType: "B+",
      currentStock: 134,
      predictedDemand: 85,
      recommendedOrder: 20,
      confidence: 82,
      trend: "decreasing",
      riskLevel: "low",
      factors: ["Stable demand", "Good stock level", "Regular donations"],
    },
    {
      bloodType: "B-",
      currentStock: 45,
      predictedDemand: 70,
      recommendedOrder: 50,
      confidence: 87,
      trend: "stable",
      riskLevel: "medium",
      factors: ["Moderate demand", "Limited supply", "Donor campaigns needed"],
    },
    {
      bloodType: "AB+",
      currentStock: 78,
      predictedDemand: 45,
      recommendedOrder: 15,
      confidence: 79,
      trend: "stable",
      riskLevel: "low",
      factors: ["Low demand", "Adequate stock", "Universal recipient"],
    },
    {
      bloodType: "AB-",
      currentStock: 23,
      predictedDemand: 35,
      recommendedOrder: 25,
      confidence: 84,
      trend: "stable",
      riskLevel: "medium",
      factors: ["Rare type", "Specialized demand", "Limited donors"],
    },
  ]

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-700 bg-green-100 border-green-200"
      case "medium":
        return "text-orange-700 bg-orange-100 border-orange-200"
      case "high":
        return "text-red-700 bg-red-100 border-red-200"
      default:
        return "text-gray-700 bg-gray-100 border-gray-200"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="w-4 h-4 text-red-600" />
      case "decreasing":
        return <TrendingDown className="w-4 h-4 text-green-600" />
      default:
        return <BarChart3 className="w-4 h-4 text-gray-600" />
    }
  }

  const generateForecast = () => {
    setIsGenerating(true)
    setLoadingForecast(true)
    getForecast(Number(selectedPeriod)).then(data => {
      setForecasts(data);
      setLoadingForecast(false);
    });
    setIsGenerating(false)
    //setTimeout(() => setIsGenerating(false), 3000)
  }

  /*
  const totalRecommendedOrder = forecastData.reduce((sum, item) => sum + item.recommendedOrder, 0)
  const averageConfidence = Math.round(
    forecastData.reduce((sum, item) => sum + item.confidence, 0) / forecastData.length,
  )

   */
  const highRiskTypes = forecastData.filter((item) => item.riskLevel === "high").length

  const [forecast, setForecasts] = useState<BloodForecast>({
    "B+": {
      predicted_demand: null,
      min_forecast: null,
      max_forecast: null,
      confidence: null, forecast_days: 7 },
    "O-": {
      predicted_demand: null,
      min_forecast: null,
      max_forecast: null,
      confidence: null,
      forecast_days: 7 },
    "AB-": {
      predicted_demand: null,
      min_forecast: null,
      max_forecast: null,
      confidence: null,
      forecast_days: 7 },
    "O+": {
      predicted_demand: null,
      min_forecast: null,
      max_forecast: null,
      confidence: null,
      forecast_days: 7 },
    "B-": {
      predicted_demand: null,
      min_forecast: null,
      max_forecast: null,
      confidence: null,
      forecast_days: 7 },
    "A+": {
      predicted_demand: null,
      min_forecast: null,
      max_forecast: null,
      confidence: null,
      forecast_days: 7 },
    "A-": {
      predicted_demand: null,
      min_forecast: null,
      max_forecast: null,
      confidence: null,
      forecast_days: 7 },
    "AB+": {
      predicted_demand: null,
      min_forecast: null,
      max_forecast: null,
      confidence: null,
      forecast_days: 7 },
  });
  const [loadingForecast, setLoadingForecast] = useState(true);

  const values = Object.values(forecast);

// Calculate total predicted_demand
  const totalPredictedDemand = values.reduce((sum, item) => {
    return sum + (item.predicted_demand ?? 0);
  }, 0);

// Calculate average confidence (excluding nulls)
  const confidenceValues = values
      .map(item => item.confidence)
      .filter(conf => conf !== null) as number[];

  const averageConfidence =
      confidenceValues.length > 0
          ? confidenceValues.reduce((sum, c) => sum + c, 0) / confidenceValues.length
          : 0;

  useEffect(() => {
    getForecast(7).then(data => {
      setForecasts(data);
      setLoadingForecast(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* AI Forecasting Header */}
      <Card className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Brain className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">AI-Powered Demand Forecasting</h2>
                <p className="text-purple-100">Intelligent predictions for optimal inventory management</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4" />
                <span className="text-sm">AI Confidence</span>
              </div>
              <p className="text-2xl font-bold">{averageConfidence.toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls and Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
          <CardContent className="p-4">
            <div className="text-center">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-800">
                {selectedPeriod}
              </p>
              <p className="text-sm text-gray-600">Days Forecast</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-green-100">
          <CardContent className="p-4">
            <div className="text-center">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-800">{Math.round(totalPredictedDemand)}</p>
              <p className="text-sm text-gray-600">Units to Order</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-orange-100">
          <CardContent className="p-4">
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-800">{highRiskTypes}</p>
              <p className="text-sm text-gray-600">High Risk Types</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-purple-100">
          <CardContent className="p-4">
            <div className="flex flex-col gap-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-purple-200 rounded-md bg-white/80 text-sm"
              >
                <option value="7">7 Days</option>
                <option value="30">30 Days</option>
              </select>
              <Button
                onClick={generateForecast}
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forecast Results */}
      {loadingForecast ? (
          <div className="flex items-center justify-center py-10 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="text-sm text-blue-500">Chargement...</span>
          </div>
      ) : (
          <div className="grid gap-4">
            {Object.entries(forecast).map(([bloodType, details]) => {
              const match = forecastData.find(item => item.bloodType === bloodType);
                return(
                <Card
                    key={bloodType}
                    className="bg-white/90 backdrop-blur-sm border-gray-200 hover:shadow-lg transition-all duration-200"
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 items-center">
                      {/* Blood Type */}
                      <div className="flex items-center gap-4">
                        <div
                            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {bloodType}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">Blood Type {bloodType}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {getTrendIcon(match?.trend ?? 'Not available')}
                            <span className="text-sm text-gray-600 capitalize">{match?.trend ?? 'Not available'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Current vs Predicted */}
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Current Stock</p>
                          <p className="text-xl font-bold text-gray-800">{match?.currentStock}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Predicted Demand</p>
                          <p className="text-xl font-bold text-blue-600">{details.predicted_demand==null ?0 : Math.round(details.predicted_demand)}</p>
                        </div>
                      </div>

                      {/* Recommendation */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Recommended Order</p>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-green-600">{details.predicted_demand==null ?0 :Math.round(details.predicted_demand)+10}</span>
                          <span className="text-sm text-gray-500">units</span>
                        </div>
                        <Badge variant="outline" className={getRiskColor(match?.riskLevel ?? 'Not')}>
                          {match?.riskLevel} risk
                        </Badge>
                      </div>

                      {/* AI Confidence */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Brain className="w-4 h-4 text-purple-600"/>
                          <span className="text-sm font-medium">AI Confidence</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{details.confidence==null ? 0 :(details.confidence * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={Number((details.confidence==null ? 0 :details.confidence * 100).toFixed(1))} className="h-2 [&>div]:bg-purple-500"/>
                        </div>
                      </div>

                      {/* Key Factors */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Key Factors</p>
                        <div className="space-y-1">
                          {match?.factors.slice(0, 2).map((factor, index) => (
                              <p key={index} className="text-xs text-gray-500">
                                • {factor}
                              </p>
                          ))}
                          {match?.factors.length == undefined ? 0 : match?.factors.length > 2 && (
                              <p className="text-xs text-blue-600 cursor-pointer">+{match?.factors.length - 2} more</p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline" className="bg-white/60">
                          View Details
                        </Button>
                        {details.predicted_demand==null ?0 :Math.round(details.predicted_demand)+10 > 0 && (
                            <Button
                                size="sm"
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                            >
                              Order {details.predicted_demand==null ?0 :Math.round(details.predicted_demand)+10} Units
                            </Button>
                        )}
                        {match?.riskLevel === "high" && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-red-300 text-red-700 hover:bg-red-50 bg-transparent"
                            >
                              <AlertTriangle className="w-3 h-3 mr-1"/>
                              Priority Order
                            </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
            )})}
          </div>
      )}

      {/* AI Insights */}
      <Card className="bg-white/90 backdrop-blur-sm border-indigo-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-800">
            <Brain className="w-5 h-5"/>
            AI Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Key Predictions</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5"/>
                  <div>
                    <p className="text-sm font-medium text-blue-800">High O- Demand Expected</p>
                    <p className="text-xs text-blue-600">Emergency procedures likely to increase demand by 35%</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5"/>
                  <div>
                    <p className="text-sm font-medium text-orange-800">A- Stock Critical</p>
                    <p className="text-xs text-orange-600">Current stock will last only 5 days at predicted demand</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <Target className="w-5 h-5 text-green-600 mt-0.5"/>
                  <div>
                    <p className="text-sm font-medium text-green-800">Optimal Ordering Window</p>
                    <p className="text-xs text-green-600">Place orders within next 48 hours for best cost efficiency</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Recommended Actions</h4>
              <div className="space-y-2">
                <Button
                    className="w-full justify-start bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700">
                  <AlertTriangle className="w-4 h-4 mr-2"/>
                  Emergency Order: A- (60 units)
                </Button>
                <Button
                    className="w-full justify-start bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                  <Target className="w-4 h-4 mr-2"/>
                  Priority Order: O- (80 units)
                </Button>
                <Button variant="outline" className="w-full justify-start bg-white/60">
                  <Calendar className="w-4 h-4 mr-2"/>
                  Schedule Donor Campaign: B-
                </Button>
                <Button variant="outline" className="w-full justify-start bg-white/60">
                  <Brain className="w-4 h-4 mr-2"/>
                  Review Forecast Settings
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
