"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Droplets,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  Users,
  Activity,
  RefreshCw,
  Bell,
} from "lucide-react"

import {useEffect, useState} from "react"
import AddStockModal from "./modals/add-stock-modal"
import AddDonorModal from "./modals/add-donor-modal"
import AddRequestModal from "./modals/add-request-modal"

export default function Dashboard() {
  const [showAddStockModal, setShowAddStockModal] = useState(false)
  const [showAddDonorModal, setShowAddDonorModal] = useState(false)
  const [showAddRequestModal, setShowAddRequestModal] = useState(false)

  const bloodInventory = [
    { type: "O+", units: 245, capacity: 300, status: "good", trend: "up", percentage: 82 },
    { type: "O-", units: 89, capacity: 150, status: "low", trend: "down", percentage: 59 },
    { type: "A+", units: 198, capacity: 250, status: "good", trend: "up", percentage: 79 },
    { type: "A-", units: 67, capacity: 120, status: "critical", trend: "down", percentage: 56 },
    { type: "B+", units: 134, capacity: 180, status: "good", trend: "stable", percentage: 74 },
    { type: "B-", units: 45, capacity: 100, status: "low", trend: "down", percentage: 45 },
    { type: "AB+", units: 78, capacity: 120, status: "good", trend: "up", percentage: 65 },
    { type: "AB-", units: 23, capacity: 80, status: "critical", trend: "down", percentage: 29 },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-700 bg-green-100 border-green-200"
      case "low":
        return "text-orange-700 bg-orange-100 border-orange-200"
      case "critical":
        return "text-red-700 bg-red-100 border-red-200"
      default:
        return "text-gray-700 bg-gray-100 border-gray-200"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3 text-green-600" />
      case "down":
        return <TrendingDown className="w-3 h-3 text-red-600" />
      default:
        return <Activity className="w-3 h-3 text-gray-600" />
    }
  }

  const alerts = [
    { type: "critical", message: "A- blood type critically low (67 units)", time: "2 min ago" },
    { type: "expiring", message: "12 units of B+ expiring today", time: "15 min ago" },
    { type: "forecast", message: "High demand predicted for O+ this weekend", time: "1 hour ago" },
    { type: "donor", message: "New donor registration: Marie Dubois (O-)", time: "2 hours ago" },
  ]

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "expiring":
        return <Clock className="w-4 h-4 text-orange-500" />
      case "forecast":
        return <TrendingUp className="w-4 h-4 text-blue-500" />
      case "donor":
        return <Users className="w-4 h-4 text-green-500" />
      default:
        return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const now = new Date()
    setCurrentTime(now.toLocaleTimeString())
  }, [])

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Total Units</p>
                <p className="text-3xl font-bold">2,847</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+5.2%</span>
                </div>
              </div>
              <Droplets className="w-8 h-8 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Critical Low</p>
                <p className="text-3xl font-bold">3</p>
                <div className="flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">Types</span>
                </div>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Active Donors</p>
                <p className="text-3xl font-bold">1,234</p>
                <div className="flex items-center gap-1 mt-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">+12 today</span>
                </div>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Requests Today</p>
                <p className="text-3xl font-bold">89</p>
                <div className="flex items-center gap-1 mt-1">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm">+8.1%</span>
                </div>
              </div>
              <Activity className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Blood Inventory Overview */}
        <div className="lg:col-span-2">
          <Card className="bg-white/90 backdrop-blur-sm border-red-100 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <Droplets className="w-5 h-5" />
                  Blood Inventory Overview
                </CardTitle>
                <Button variant="outline" size="sm" className="bg-white/60">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {bloodInventory.map((blood) => (
                  <div key={blood.type} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {blood.type}
                        </div>
                        {getTrendIcon(blood.trend)}
                      </div>
                      <Badge variant="outline" className={getStatusColor(blood.status)}>
                        {blood.status}
                      </Badge>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{blood.units} units</span>
                        <span className="text-xs text-gray-500">{blood.percentage}%</span>
                      </div>
                      <Progress
                        value={blood.percentage}
                        className={`h-2 ${
                          blood.status === "critical"
                            ? "[&>div]:bg-red-500"
                            : blood.status === "low"
                              ? "[&>div]:bg-orange-500"
                              : "[&>div]:bg-green-500"
                        }`}
                      />
                      <p className="text-xs text-gray-500 mt-1">of {blood.capacity} capacity</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Alerts */}
        <Card className="bg-white/90 backdrop-blur-sm border-orange-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Bell className="w-5 h-5" />
              Real-time Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-gray-100">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full bg-white/60">
              View All Alerts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="text-blue-800">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={() => setShowAddStockModal(true)}
              className="h-20 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
            >
              <div className="text-center">
                <Droplets className="w-6 h-6 mx-auto mb-1" />
                <span className="text-sm">Add Donation</span>
              </div>
            </Button>
            <Button
              onClick={() => setShowAddDonorModal(true)}
              className="h-20 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <div className="text-center">
                <Users className="w-6 h-6 mx-auto mb-1" />
                <span className="text-sm">Register Donor</span>
              </div>
            </Button>
            <Button
              onClick={() => setShowAddRequestModal(true)}
              className="h-20 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <div className="text-center">
                <Activity className="w-6 h-6 mx-auto mb-1" />
                <span className="text-sm">Process Request</span>
              </div>
            </Button>
            <Button className="h-20 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
              <div className="text-center">
                <AlertTriangle className="w-6 h-6 mx-auto mb-1" />
                <span className="text-sm">Emergency Order</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddStockModal open={showAddStockModal} onOpenChange={setShowAddStockModal} onSubmit={function (data: any): void {
        throw new Error("Function not implemented.")
      }} />
      <AddDonorModal open={showAddDonorModal} onOpenChange={setShowAddDonorModal}
      />
      <AddRequestModal open={showAddRequestModal} onOpenChange={setShowAddRequestModal}
                       onSubmit={function (data: any): void {
                         throw new Error("Function not implemented.")
                       }} />
    </div>
  )
}
