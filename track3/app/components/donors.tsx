"use client"

import {useEffect, useState} from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Plus, Phone, Mail, Calendar, Droplets, Heart, Award, MapPin, Filter } from "lucide-react"
import AddDonorModal from "./modals/add-donor-modal"
import FilterModal from "./modals/filter-modal"
import ExportModal from "./modals/export-modal"
import {DonorData} from "@/lib/types/donor";
import {getDonors} from "@/app/services/donor.service";

export default function Donors() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const [showAddDonorModal, setShowAddDonorModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  const [donors, setDonors] = useState<DonorData[]>([])
  const [filteredDonors, setFilteredDonors] = useState<DonorData[]>([])

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const data = await getDonors()
        setDonors(data)
        setFilteredDonors(data)
      } catch (error) {
        console.error("Erreur lors du chargement des donneurs :", error)
      }
    }
    fetchDonors().then(r => console.log(r))
  }, [])

  useEffect(() => {
    let filtered = donors

    if (searchTerm) {
      filtered = filtered.filter((donor) =>
          donor.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedFilter !== "all") {
      filtered = filtered.filter((donor) => donor.bloodType === selectedFilter)
    }

    setFilteredDonors(filtered)
  }, [searchTerm, selectedFilter, donors])

  filteredDonors.map((donor) => {
    const name = donor.fullName
    const location = donor.address || "Unknown"
    const bloodType = donor.bloodType
    const healthStatus = donor.medicalNotes || "N/A"
    const lastDonation = donor.lastDonationDate || "Aucune donation précédente"
    const weight = 70 // ou à remplacer si présent dans l'API
    const status = "eligible" // logiques de calcul personnalisées
  })


  const donorsData = [
    {
      id: "D001",
      name: "Marie Dubois",
      bloodType: "O-",
      phone: "+237 6XX XXX XXX",
      email: "marie.dubois@email.com",
      lastDonation: "2024-01-15",
      totalDonations: 12,
      status: "eligible",
      nextEligible: "2024-03-15",
      location: "Douala",
      age: 28,
      weight: 65,
      healthStatus: "excellent",
    },
    {
      id: "D002",
      name: "Jean Paul Kamga",
      bloodType: "A+",
      phone: "+237 6XX XXX XXX",
      email: "jean.kamga@email.com",
      lastDonation: "2024-01-20",
      totalDonations: 8,
      status: "eligible",
      nextEligible: "2024-03-20",
      location: "Yaoundé",
      age: 35,
      weight: 78,
      healthStatus: "good",
    },
    {
      id: "D003",
      name: "Alice Mballa",
      bloodType: "B+",
      phone: "+237 6XX XXX XXX",
      email: "alice.mballa@email.com",
      lastDonation: "2024-01-28",
      totalDonations: 15,
      status: "not_eligible",
      nextEligible: "2024-03-28",
      location: "Douala",
      age: 42,
      weight: 58,
      healthStatus: "good",
    },
    {
      id: "D004",
      name: "Pierre Nkomo",
      bloodType: "AB+",
      phone: "+237 6XX XXX XXX",
      email: "pierre.nkomo@email.com",
      lastDonation: "2023-12-10",
      totalDonations: 22,
      status: "eligible",
      nextEligible: "2024-02-10",
      location: "Bafoussam",
      age: 38,
      weight: 82,
      healthStatus: "excellent",
    },
    {
      id: "D005",
      name: "Grace Fotso",
      bloodType: "O+",
      phone: "+237 6XX XXX XXX",
      email: "grace.fotso@email.com",
      lastDonation: "2024-01-05",
      totalDonations: 6,
      status: "eligible",
      nextEligible: "2024-03-05",
      location: "Douala",
      age: 31,
      weight: 62,
      healthStatus: "good",
    },
    {
      id: "D006",
      name: "Samuel Biya",
      bloodType: "A-",
      phone: "+237 6XX XXX XXX",
      email: "samuel.biya@email.com",
      lastDonation: "2024-01-12",
      totalDonations: 18,
      status: "eligible",
      nextEligible: "2024-03-12",
      location: "Yaoundé",
      age: 45,
      weight: 75,
      healthStatus: "excellent",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "eligible":
        return "text-green-700 bg-green-100 border-green-200"
      case "not_eligible":
        return "text-red-700 bg-red-100 border-red-200"
      case "pending":
        return "text-orange-700 bg-orange-100 border-orange-200"
      default:
        return "text-gray-700 bg-gray-100 border-gray-200"
    }
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case "excellent":
        return "text-green-600"
      case "good":
        return "text-blue-600"
      case "fair":
        return "text-orange-600"
      default:
        return "text-gray-600"
    }
  }

  const getDonationLevel = (count: number) => {
    if (count >= 20) return { level: "Gold", color: "text-yellow-600", icon: "🏆" }
    if (count >= 10) return { level: "Silver", color: "text-gray-600", icon: "🥈" }
    if (count >= 5) return { level: "Bronze", color: "text-orange-600", icon: "🥉" }
    return { level: "New", color: "text-blue-600", icon: "⭐" }
  }


  const totalDonors = donorsData.length
  const eligibleDonors = donorsData.filter((d) => d.status === "eligible").length
  const totalDonations = donorsData.reduce((sum, d) => sum + d.totalDonations, 0)

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Donors</p>
                <p className="text-2xl font-bold">{totalDonors}</p>
              </div>
              <Users className="w-6 h-6 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Eligible Now</p>
                <p className="text-2xl font-bold">{eligibleDonors}</p>
              </div>
              <Heart className="w-6 h-6 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Total Donations</p>
                <p className="text-2xl font-bold">{totalDonations}</p>
              </div>
              <Droplets className="w-6 h-6 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">This Month</p>
                <p className="text-2xl font-bold">47</p>
              </div>
              <Calendar className="w-6 h-6 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Users className="w-5 h-5" />
            Donor Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, blood type, or location..."
                  className="pl-10 bg-white/80 border-blue-200"
              />
            </div>
            <div className="flex gap-2">
              <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-3 py-2 border border-blue-200 rounded-md bg-white/80 text-sm"
              >
                <option value="all">All Status</option>
                <option value="eligible">Eligible</option>
                <option value="not_eligible">Not Eligible</option>
                <option value="pending">Pending</option>
              </select>
              <Button variant="outline" size="sm" className="bg-white/80" onClick={() => setShowFilterModal(true)}>
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button
                  onClick={() => setShowAddDonorModal(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Donor
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Donors List */}
      <div className="grid gap-4">
        {filteredDonors.map((donor) => {
          const donationLevel = getDonationLevel(totalDonations)
          return (
            <Card
              className="bg-white/90 backdrop-blur-sm border-gray-200 hover:shadow-lg transition-all duration-200"
            >
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                  {/* Donor Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {donor.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{donor.fullName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-500">{donor.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Blood Type & Health */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {donor.bloodType}
                      </div>
                      <span className="text-sm font-medium">Blood Type</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Health Status</p>
                      <p className={`text-sm font-medium capitalize`}>
                        {donor.medicalNotes}
                      </p>
                    </div>
                  </div>

                  {/* Donation History */}


                  {/* Last Donation */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">Last Donation</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        {donor.lastDonationDate? donor.medicalNotes : "Aucune donation précédante"}
                      </p>
                    </div>
                  </div>

                  {/* Status */}


                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline" className="bg-white/60">
                      <Phone className="w-3 h-3 mr-1" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline" className="bg-white/60">
                      <Mail className="w-3 h-3 mr-1" />
                      Email
                    </Button>

                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredDonors.length === 0 && (
        <Card className="bg-white/90 backdrop-blur-sm border-gray-200">
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No donors found</h3>
            <p className="text-gray-500">Try adjusting your search terms or filters</p>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <AddDonorModal open={showAddDonorModal} onOpenChange={setShowAddDonorModal} />
      <FilterModal open={showFilterModal} onOpenChange={setShowFilterModal} filterType="donors"
                   onApplyFilters={function (filters: any): void {
                     throw new Error("Function not implemented.")
                   }} />
      <ExportModal open={showExportModal} onOpenChange={setShowExportModal} dataType="donors"
                   onExport={function (config: any): void {
                     throw new Error("Function not implemented.")
                   }} />
    </div>
  )
}
