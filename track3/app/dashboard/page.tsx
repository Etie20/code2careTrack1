"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Droplets, TrendingUp, AlertTriangle, Users, Calendar, Brain, Activity } from "lucide-react"
import Dashboard from "../components/dashboard"
import Inventory from "../components/inventory"
import Forecasting from "../components/forecasting"
import Donors from "../components/donors"
import Requests from "../components/requests"
import Analytics from "../components/analytics"

export default function BloodBankSystem() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  const totalUnits = 2847
  const criticalLow = 3
  const expiringToday = 12

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-red-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Droplets className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                  BloodBank AI
                </h1>
                <p className="text-sm text-gray-600">Intelligent Blood Stock Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">
                  {currentTime.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-xs text-gray-600">{currentTime.toLocaleTimeString()}</p>
              </div>
              <div className="flex gap-2">
                {criticalLow > 0 && (
                  <Badge variant="destructive" className="animate-pulse">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {criticalLow} Critique
                  </Badge>
                )}
                {expiringToday > 0 && (
                  <Badge variant="outline" className="border-orange-300 text-orange-700">
                    <Calendar className="w-3 h-3 mr-1" />
                    {expiringToday} Expirent
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Stats Bar */}
      <div className="bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 text-white py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                <span className="font-medium">{totalUnits} Unités Totales</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span>8 Groupes Sanguins Surveillés</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>Prévisions IA Actives</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs">Système En Ligne</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/80 backdrop-blur-sm shadow-sm">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Tableau de Bord
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Droplets className="w-4 h-4" />
              Inventaire
            </TabsTrigger>
            <TabsTrigger value="forecasting" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Prévisions IA
            </TabsTrigger>
            <TabsTrigger value="donors" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Donneurs
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Demandes
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analyses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="inventory">
            <Inventory />
          </TabsContent>

          <TabsContent value="forecasting">
            <Forecasting />
          </TabsContent>

          <TabsContent value="donors">
            <Donors />
          </TabsContent>

          <TabsContent value="requests">
            <Requests />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
