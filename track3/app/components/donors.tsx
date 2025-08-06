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
import {Filters} from "@/lib/types/filter"

export default function Donors() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const [showAddDonorModal, setShowAddDonorModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  const [donors, setDonors] = useState<DonorData[]>([])
  const [filteredDonors, setFilteredDonors] = useState<DonorData[]>([])

  const [monthlyDonationCount, setMonthlyDonationCount] = useState(0)

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const data = await getDonors()
        setDonors(data)
        setFilteredDonors(data)

        //Donneurs du mois actuel
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()

        console.log("hello:, ", currentMonth)

        const donationsThisMonth = data.filter((donor) => {
          if (!donor.lastDonationDate) return false;

          const donationDate = new Date(donor.lastDonationDate)
          console.log("month:, ", donationDate.getMonth())
          return (
              donationDate.getMonth() === currentMonth &&
              donationDate.getFullYear() === currentYear
          )
        })

        setMonthlyDonationCount(donationsThisMonth.length)
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

  const handleFilterApply = (appliedFilters: Filters) => {
    let filtered = donors

    if (appliedFilters.bloodTypes.length > 0) {
      filtered = filtered.filter((donor) =>
          appliedFilters.bloodTypes.includes(donor.bloodType)
      )
    }

    // Tu peux compléter avec les autres filtres si tu les implémentes
    // ex: status, location, etc.

    setFilteredDonors(filtered)
  }






  const getDonationLevel = (count: number) => {
    if (count >= 20) return { level: "Gold", color: "text-yellow-600", icon: "🏆" }
    if (count >= 10) return { level: "Silver", color: "text-gray-600", icon: "🥈" }
    if (count >= 5) return { level: "Bronze", color: "text-orange-600", icon: "🥉" }
    return { level: "New", color: "text-blue-600", icon: "⭐" }
  }


  const totalDonors = donors.length
  const eligibleDonors = donors.filter((d) => d.medicalNotes == "En Bonne Santé").length
  const totalDonations = donors.length

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
                <p className="text-2xl font-bold">{monthlyDonationCount}</p>
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
        {filteredDonors.map((donor, index) => {
          const donationLevel = getDonationLevel(totalDonations)
          // @ts-ignore
          return (
            <Card
                key={index}
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
                        {donor.lastDonationDate
                            ? new Date(donor.lastDonationDate).toLocaleDateString()
                            : "—"
                        }
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
                   onApplyFilters={handleFilterApply}
      />
      <ExportModal open={showExportModal} onOpenChange={setShowExportModal} dataType="donors"
                   onExport={function (config: any): void {
                     throw new Error("Function not implemented.")
                   }} />
    </div>
  )
}
