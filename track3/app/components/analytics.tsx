"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, BarChart3, PieChart, Calendar, Download, RefreshCw, Target } from "lucide-react"

export default function Analytics() {
  const monthlyData = [
    { month: "Jan", donations: 245, requests: 198, efficiency: 81 },
    { month: "Feb", donations: 267, requests: 223, efficiency: 84 },
    { month: "Mar", donations: 289, requests: 245, efficiency: 85 },
    { month: "Apr", donations: 234, requests: 267, efficiency: 88 },
    { month: "May", donations: 298, requests: 234, efficiency: 78 },
    { month: "Jun", donations: 312, requests: 289, efficiency: 93 },
  ]

  const bloodTypeDistribution = [
    { type: "O+", percentage: 38, color: "bg-red-500" },
    { type: "A+", percentage: 28, color: "bg-blue-500" },
    { type: "B+", percentage: 15, color: "bg-green-500" },
    { type: "AB+", percentage: 8, color: "bg-purple-500" },
    { type: "O-", percentage: 6, color: "bg-orange-500" },
    { type: "A-", percentage: 3, color: "bg-pink-500" },
    { type: "B-", percentage: 1.5, color: "bg-indigo-500" },
    { type: "AB-", percentage: 0.5, color: "bg-yellow-500" },
  ]

  const kpiData = [
    {
      title: "Collection Efficiency",
      value: "87.3%",
      change: "+5.2%",
      trend: "up",
      description: "Donations vs. Scheduled",
    },
    {
      title: "Wastage Rate",
      value: "2.1%",
      change: "-0.8%",
      trend: "down",
      description: "Expired Units",
    },
    {
      title: "Fulfillment Rate",
      value: "94.7%",
      change: "+2.1%",
      trend: "up",
      description: "Requests Fulfilled",
    },
    {
      title: "Average Response Time",
      value: "2.4h",
      change: "-0.3h",
      trend: "down",
      description: "Emergency Requests",
    },
  ]

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    )
  }

  const getTrendColor = (trend: string) => {
    return trend === "up" ? "text-green-600" : "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">{kpi.title}</h3>
                {getTrendIcon(kpi.trend)}
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-800">{kpi.value}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${getTrendColor(kpi.trend)}`}>{kpi.change}</span>
                  <span className="text-xs text-gray-500">{kpi.description}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <BarChart3 className="w-5 h-5" />
                Monthly Trends
              </CardTitle>
              <Button variant="outline" size="sm" className="bg-white/60">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{data.month}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-green-600">↑{data.donations}</span>
                      <span className="text-blue-600">↓{data.requests}</span>
                      <Badge variant="outline" className="text-xs">
                        {data.efficiency}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={data.efficiency} className="h-2" />
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Legend:</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs">Donations</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs">Requests</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blood Type Distribution */}
        <Card className="bg-white/90 backdrop-blur-sm border-red-100 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-red-800">
                <PieChart className="w-5 h-5" />
                Blood Type Distribution
              </CardTitle>
              <Button variant="outline" size="sm" className="bg-white/60">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bloodTypeDistribution.map((blood, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {blood.type}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{blood.type}</span>
                      <span className="text-sm text-gray-600">{blood.percentage}%</span>
                    </div>
                    <Progress value={blood.percentage} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Forecasting Accuracy */}
        <Card className="bg-white/90 backdrop-blur-sm border-purple-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Target className="w-5 h-5" />
              AI Forecasting Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-purple-800 mb-2">92.3%</p>
                <p className="text-sm text-gray-600">Overall Accuracy</p>
              </div>
              <div className="space-y-3">
                {[
                  { period: "7-day forecast", accuracy: 95 },
                  { period: "30-day forecast", accuracy: 89 },
                  { period: "90-day forecast", accuracy: 84 },
                ].map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{item.period}</span>
                      <span className="font-medium">{item.accuracy}%</span>
                    </div>
                    <Progress value={item.accuracy} className="h-2 [&>div]:bg-purple-500" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white/90 backdrop-blur-sm border-green-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Calendar className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Emergency request fulfilled", time: "5 min ago", type: "success" },
                { action: "Low stock alert: A-", time: "12 min ago", type: "warning" },
                { action: "New donor registered", time: "1 hour ago", type: "info" },
                { action: "Forecast updated", time: "2 hours ago", type: "info" },
                { action: "Batch expired: B+", time: "3 hours ago", type: "error" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "success"
                        ? "bg-green-500"
                        : activity.type === "warning"
                          ? "bg-orange-500"
                          : activity.type === "error"
                            ? "bg-red-500"
                            : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
