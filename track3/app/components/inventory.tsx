"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Filter,
  Plus,
  Droplets,
  Calendar,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Download,
} from "lucide-react"

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const inventoryData = [
    {
      id: "BB001",
      type: "O+",
      units: 245,
      capacity: 300,
      status: "good",
      expiryDate: "2024-02-15",
      daysToExpiry: 12,
      location: "Freezer A1",
      lastUpdated: "2024-01-28 14:30",
      trend: "up",
      weeklyChange: +8.2,
    },
    {
      id: "BB002",
      type: "O-",
      units: 89,
      capacity: 150,
      status: "low",
      expiryDate: "2024-02-10",
      daysToExpiry: 7,
      location: "Freezer A2",
      lastUpdated: "2024-01-28 14:25",
      trend: "down",
      weeklyChange: -12.5,
    },
    {
      id: "BB003",
      type: "A+",
      units: 198,
      capacity: 250,
      status: "good",
      expiryDate: "2024-02-18",
      daysToExpiry: 15,
      location: "Freezer B1",
      lastUpdated: "2024-01-28 14:20",
      trend: "up",
      weeklyChange: +5.7,
    },
    {
      id: "BB004",
      type: "A-",
      units: 67,
      capacity: 120,
      status: "critical",
      expiryDate: "2024-02-08",
      daysToExpiry: 5,
      location: "Freezer B2",
      lastUpdated: "2024-01-28 14:15",
      trend: "down",
      weeklyChange: -18.3,
    },
    {
      id: "BB005",
      type: "B+",
      units: 134,
      capacity: 180,
      status: "good",
      expiryDate: "2024-02-20",
      daysToExpiry: 17,
      location: "Freezer C1",
      lastUpdated: "2024-01-28 14:10",
      trend: "stable",
      weeklyChange: +2.1,
    },
    {
      id: "BB006",
      type: "B-",
      units: 45,
      capacity: 100,
      status: "low",
      expiryDate: "2024-02-12",
      daysToExpiry: 9,
      location: "Freezer C2",
      lastUpdated: "2024-01-28 14:05",
      trend: "down",
      weeklyChange: -8.9,
    },
    {
      id: "BB007",
      type: "AB+",
      units: 78,
      capacity: 120,
      status: "good",
      expiryDate: "2024-02-16",
      daysToExpiry: 13,
      location: "Freezer D1",
      lastUpdated: "2024-01-28 14:00",
      trend: "up",
      weeklyChange: +11.4,
    },
    {
      id: "BB008",
      type: "AB-",
      units: 23,
      capacity: 80,
      status: "critical",
      expiryDate: "2024-02-09",
      daysToExpiry: 6,
      location: "Freezer D2",
      lastUpdated: "2024-01-28 13:55",
      trend: "down",
      weeklyChange: -15.2,
    },
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

  const getExpiryColor = (days: number) => {
    if (days <= 5) return "text-red-700 bg-red-100"
    if (days <= 10) return "text-orange-700 bg-orange-100"
    return "text-green-700 bg-green-100"
  }

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === "up" || change > 0) return <TrendingUp className="w-4 h-4 text-green-600" />
    if (trend === "down" || change < 0) return <TrendingDown className="w-4 h-4 text-red-600" />
    return <BarChart3 className="w-4 h-4 text-gray-600" />
  }

  const filteredData = inventoryData.filter((item) => {
    const matchesSearch =
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === "all" || item.status === selectedFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="bg-white/90 backdrop-blur-sm border-red-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <Droplets className="w-5 h-5" />
            Blood Inventory Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by blood type, ID, or location..."
                className="pl-10 bg-white/80 border-red-200"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-red-200 rounded-md bg-white/80 text-sm"
              >
                <option value="all">All Status</option>
                <option value="good">Good</option>
                <option value="low">Low</option>
                <option value="critical">Critical</option>
              </select>
              <Button variant="outline" size="sm" className="bg-white/80">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="bg-white/80">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Stock
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Grid */}
      <div className="grid gap-4">
        {filteredData.map((item) => (
          <Card
            key={item.id}
            className="bg-white/90 backdrop-blur-sm border-gray-200 hover:shadow-lg transition-all duration-200"
          >
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 items-center">
                {/* Blood Type & ID */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {item.type}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.id}</h3>
                    <p className="text-sm text-gray-600">{item.location}</p>
                  </div>
                </div>

                {/* Stock Level */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Stock Level</span>
                    <Badge variant="outline" className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{item.units} units</span>
                      <span className="text-gray-500">{Math.round((item.units / item.capacity) * 100)}%</span>
                    </div>
                    <Progress
                      value={(item.units / item.capacity) * 100}
                      className={`h-2 ${
                        item.status === "critical"
                          ? "[&>div]:bg-red-500"
                          : item.status === "low"
                            ? "[&>div]:bg-orange-500"
                            : "[&>div]:bg-green-500"
                      }`}
                    />
                    <p className="text-xs text-gray-500">Capacity: {item.capacity} units</p>
                  </div>
                </div>

                {/* Expiry Information */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Expiry</span>
                  </div>
                  <div>
                    <Badge variant="outline" className={getExpiryColor(item.daysToExpiry)}>
                      {item.daysToExpiry} days
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{item.expiryDate}</p>
                  </div>
                </div>

                {/* Trend Analysis */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getTrendIcon(item.trend, item.weeklyChange)}
                    <span className="text-sm font-medium">Weekly Change</span>
                  </div>
                  <div>
                    <span
                      className={`text-sm font-bold ${
                        item.weeklyChange > 0
                          ? "text-green-600"
                          : item.weeklyChange < 0
                            ? "text-red-600"
                            : "text-gray-600"
                      }`}
                    >
                      {item.weeklyChange > 0 ? "+" : ""}
                      {item.weeklyChange}%
                    </span>
                    <p className="text-xs text-gray-500 mt-1">vs last week</p>
                  </div>
                </div>

                {/* Last Updated */}
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-600">Last Updated</span>
                  <p className="text-xs text-gray-500">{item.lastUpdated}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button size="sm" variant="outline" className="bg-white/60">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="bg-white/60">
                    Update Stock
                  </Button>
                  {item.status === "critical" && (
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Order Now
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredData.length === 0 && (
        <Card className="bg-white/90 backdrop-blur-sm border-gray-200">
          <CardContent className="p-12 text-center">
            <Droplets className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No inventory found</h3>
            <p className="text-gray-500">Try adjusting your search terms or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
