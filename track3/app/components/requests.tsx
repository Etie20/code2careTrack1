"use client"

import {useEffect, useState} from "react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Search,
  Plus,
  Clock,
  MapPin,
  Droplets,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
  Hospital, Loader2, Thermometer,
} from "lucide-react"

import AddRequestModal from "./modals/add-request-modal"
import FilterModal from "./modals/filter-modal"
import ExportModal from "./modals/export-modal"
import {BloodUnit} from "@/lib/types/bloodUnit";
import {BloodUnitSummary} from "@/lib/types/bloodUnitSummary";
import {BloodRequest} from "@/lib/types/bloodRequest";
import {BloodRequestDepartments} from "@/lib/types/bloodRequestDepartment";
import {BloodRequestStat} from "@/lib/types/bloodRequestStat";
import {getBloodUnits, getBloodUnitSummary} from "@/app/services/bloodUnit.service";
import {getBloodRequestDepartments, getBloodRequests, getBloodRequestStats} from "@/app/services/bloodRequest.service";
import {Progress} from "@/components/ui/progress";

export default function Requests() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const [showAddRequestModal, setShowAddRequestModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)

  const requestsData = [
    {
      id: "REQ001",
      hospital: "Hôpital Central de Yaoundé",
      bloodType: "O-",
      unitsRequested: 8,
      urgency: "emergency",
      status: "pending",
      requestDate: "2024-01-28 09:30",
      requiredBy: "2024-01-28 15:00",
      purpose: "Emergency Surgery",
      contact: "Dr. Marie Nkomo",
      phone: "+237 6XX XXX XXX",
      location: "Yaoundé",
    },
    {
      id: "REQ002",
      hospital: "Hôpital Laquintinie Douala",
      bloodType: "A+",
      unitsRequested: 4,
      urgency: "high",
      status: "approved",
      requestDate: "2024-01-28 08:15",
      requiredBy: "2024-01-29 10:00",
      purpose: "Scheduled Surgery",
      contact: "Dr. Jean Fotso",
      phone: "+237 6XX XXX XXX",
      location: "Douala",
    },
    {
      id: "REQ003",
      hospital: "Centre Hospitalier d'Essos",
      bloodType: "B+",
      unitsRequested: 2,
      urgency: "medium",
      status: "fulfilled",
      requestDate: "2024-01-27 14:20",
      requiredBy: "2024-01-28 08:00",
      purpose: "Blood Transfusion",
      contact: "Dr. Alice Mballa",
      phone: "+237 6XX XXX XXX",
      location: "Yaoundé",
    },
    {
      id: "REQ004",
      hospital: "Hôpital Régional de Bafoussam",
      bloodType: "AB-",
      unitsRequested: 3,
      urgency: "high",
      status: "pending",
      requestDate: "2024-01-28 11:45",
      requiredBy: "2024-01-29 14:00",
      purpose: "Cancer Treatment",
      contact: "Dr. Pierre Kamga",
      phone: "+237 6XX XXX XXX",
      location: "Bafoussam",
    },
    {
      id: "REQ005",
      hospital: "Clinique des Spécialités",
      bloodType: "O+",
      unitsRequested: 6,
      urgency: "emergency",
      status: "rejected",
      requestDate: "2024-01-28 07:00",
      requiredBy: "2024-01-28 12:00",
      purpose: "Trauma Care",
      contact: "Dr. Samuel Biya",
      phone: "+237 6XX XXX XXX",
      location: "Douala",
    },
    {
      id: "REQ006",
      hospital: "Hôpital Gynéco-Obstétrique",
      bloodType: "A-",
      unitsRequested: 5,
      urgency: "high",
      status: "approved",
      requestDate: "2024-01-28 10:30",
      requiredBy: "2024-01-29 16:00",
      purpose: "Maternity Care",
      contact: "Dr. Grace Fotso",
      phone: "+237 6XX XXX XXX",
      location: "Yaoundé",
    },
  ]

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return "text-red-700 bg-red-100 border-red-200 animate-pulse"
      case "high":
        return "text-orange-700 bg-orange-100 border-orange-200"
      case "medium":
        return "text-yellow-700 bg-yellow-100 border-yellow-200"
      case "low":
        return "text-green-700 bg-green-100 border-green-200"
      default:
        return "text-gray-700 bg-gray-100 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-blue-700 bg-blue-100 border-blue-200"
      case "approved":
        return "text-green-700 bg-green-100 border-green-200"
      case "fulfilled":
        return "text-emerald-700 bg-emerald-100 border-emerald-200"
      case "rejected":
        return "text-red-700 bg-red-100 border-red-200"
      default:
        return "text-gray-700 bg-gray-100 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "approved":
        return <CheckCircle className="w-4 h-4" />
      case "fulfilled":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getTimeRemaining = (requiredBy: string | Date) => {
    const now = new Date()
    const required = new Date(requiredBy)
    const diff = required.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (hours < 0) return "Overdue"
    if (hours < 1) return "< 1 hour"
    if (hours < 24) return `${hours} hours`
    return `${Math.floor(hours / 24)} days`
  }

  const totalRequests = requestsData.length
  const pendingRequests = requestsData.filter((r) => r.status === "pending").length
  const emergencyRequests = requestsData.filter((r) => r.urgency === "emergency").length
  const totalUnitsRequested = requestsData.reduce((sum, r) => sum + r.unitsRequested, 0)

  const [bloodRequests, setBloodRequests] = useState<BloodRequest>({
    content: [],
    last: false,
    pageNumber: 0,
    pageSize: 0,
    totalElements: 0,
    totalPages: 0
  });
  const [bloodRequestDepartments, setBloodRequestDepartments] = useState<BloodRequestDepartments[]>([]);
  const [bloodRequestStat, setBloodRequestStat] = useState<BloodRequestStat>({
    emergencyRequests: 0, pendingRequests: 0, totalRequests: 0, unitsRequested: 0
  });
  const [loadingBloodRequest, setLoadingBloodRequest] = useState(true);
  const [loadingBloodRequestDepartments, setLoadingBloodRequestDepartments] = useState(true);

  const filteredRequests = bloodRequests.content.filter((request) => {
    const matchesSearch =
        request.department.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.bloodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.note.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === "all" || request.status === selectedFilter
    return matchesSearch && matchesFilter
  })

  useEffect(() => {
    getBloodRequests().then(data => {
      setBloodRequests(data);
      setLoadingBloodRequest(false);
    });
    getBloodRequestStats().then(data => {
      setBloodRequestStat(data);
    });
    getBloodRequestDepartments().then(data => {
      setBloodRequestDepartments(data);
      setLoadingBloodRequestDepartments(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Requests</p>
                <p className="text-2xl font-bold">{bloodRequestStat.totalRequests}</p>
              </div>
              <Calendar className="w-6 h-6 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold">{bloodRequestStat.pendingRequests}</p>
              </div>
              <Clock className="w-6 h-6 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Emergency</p>
                <p className="text-2xl font-bold">{bloodRequestStat.emergencyRequests}</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Units Requested</p>
                <p className="text-2xl font-bold">{bloodRequestStat.unitsRequested}</p>
              </div>
              <Droplets className="w-6 h-6 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="bg-white/90 backdrop-blur-sm border-indigo-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-800">
            <Calendar className="w-5 h-5" />
            Blood Request Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by hospital, blood type, or contact..."
                className="pl-10 bg-white/80 border-indigo-200"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-indigo-200 rounded-md bg-white/80 text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="fulfilled">Fulfilled</option>
                <option value="rejected">Rejected</option>
              </select>
              <Button variant="outline" size="sm" className="bg-white/80" onClick={() => setShowFilterModal(true)}>
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button
                onClick={() => setShowAddRequestModal(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Request
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      {loadingBloodRequest ? (
          <div className="flex items-center justify-center py-10 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="text-sm text-blue-500">Chargement...</span>
          </div>
      ) : (
          <div className="grid gap-4">
            {filteredRequests.map((request) => (
                <Card
                    key={request.id}
                    className="bg-white/90 backdrop-blur-sm border-gray-200 hover:shadow-lg transition-all duration-200"
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 items-center">
                      {/* Request Info */}
                      <div className="flex items-center gap-4">
                        <div
                            className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          <Hospital className="w-8 h-8"/>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{request.id}</h3>
                          <p className="text-sm text-gray-600">{request.department.departmentName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="w-3 h-3 text-gray-500"/>
                            <span className="text-xs text-gray-500">{request.department.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Blood Type & Units */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div
                              className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {request.bloodType}
                          </div>
                          <span className="text-sm font-medium">Blood Type</span>
                        </div>
                        <div>
                          <p className="text-xl font-bold text-gray-800">{request.volumeNeeded}</p>
                          <p className="text-xs text-gray-500">units requested</p>
                        </div>
                      </div>

                      {/* Urgency & Purpose */}
                      <div className="space-y-2">
                        <Badge variant="outline" className={getUrgencyColor(request.demandType.toLowerCase())}>
                          {request.demandType.toLowerCase() === "emergency" &&
                              <AlertTriangle className="w-3 h-3 mr-1"/>}
                          {request.demandType.toUpperCase()}
                        </Badge>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{request.note}</p>
                          <p className="text-xs text-gray-500">{request.personnel.fullName}</p>
                        </div>
                      </div>

                      {/* Timing */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500"/>
                          <span className="text-sm font-medium">Time Remaining</span>
                        </div>
                        <div>
                          <p
                              className={`text-sm font-bold ${
                                  getTimeRemaining(request.dueDate) === "Overdue"
                                      ? "text-red-600"
                                      : getTimeRemaining(request.dueDate).includes("hour")
                                          ? "text-orange-600"
                                          : "text-gray-800"
                              }`}
                          >
                            {getTimeRemaining(request.dueDate)}
                          </p>
                          <p className="text-xs text-gray-500">Due: {new Date(request.dueDate).toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(request.status)}
                          <span className="text-sm font-medium">Status</span>
                        </div>
                        <Badge variant="outline" className={getStatusColor(request.status)}>
                          {request.status.toUpperCase()}
                        </Badge>
                        <p className="text-xs text-gray-500">Requested: {new Date(request.requestedDate).toLocaleString()}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline" className="bg-white/60">
                          View Details
                        </Button>
                        {request.status.toLowerCase() === "pending" && (
                            <>
                              <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                              >
                                <CheckCircle className="w-3 h-3 mr-1"/>
                                Approve
                              </Button>
                              <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-300 text-red-700 hover:bg-red-50 bg-transparent"
                              >
                                <XCircle className="w-3 h-3 mr-1"/>
                                Reject
                              </Button>
                            </>
                        )}
                        {request.status.toLowerCase() === "approved" && (
                            <Button
                                size="sm"
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                            >
                              <Droplets className="w-3 h-3 mr-1"/>
                              Fulfill
                            </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>
      )}

      {filteredRequests.length === 0 && (
          <Card className="bg-white/90 backdrop-blur-sm border-gray-200">
            <CardContent className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4"/>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No requests found</h3>
              <p className="text-gray-500">Try adjusting your search terms or filters</p>
            </CardContent>
          </Card>
      )}

      {/* Modals */}
      <AddRequestModal open={showAddRequestModal} onOpenChange={setShowAddRequestModal}
                       onSubmit={function (data: any): void {
                         throw new Error("Function not implemented.")
                       }}/>
      <FilterModal open={showFilterModal} onOpenChange={setShowFilterModal} filterType="requests"
                   onApplyFilters={function (filters: any): void {
                     throw new Error("Function not implemented.")
                   }}/>
    </div>
  )
}
