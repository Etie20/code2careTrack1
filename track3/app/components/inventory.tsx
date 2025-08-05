"use client"

import {useEffect, useState} from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Droplets,
  Plus,
  Search,
  Filter,
  Download,
  AlertTriangle,
  Calendar,
  MapPin,
  Thermometer,
  Clock,
} from "lucide-react"
import AddStockModal from "./modals/add-stock-modal"
import FilterModal from "./modals/filter-modal"
import ExportModal from "./modals/export-modal"
import {BloodUnit} from "@/app/models/bloodUnit";
import {getBloodUnits, getBloodUnitSummary} from "@/app/api/bloodUnit/route";
import {BloodUnitSummary} from "@/app/models/bloodUnitSummary";

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  const [bloodUnits, setBloodUnits] = useState<BloodUnit>({
    content: [],
    last: false,
    pageNumber: 0,
    pageSize: 0,
    totalElements: 0,
    totalPages: 0
  });
  const [bloodUnitSummary, setBloodUnitSummary] = useState<BloodUnitSummary>({
    criticalStocks: 0,
    expiringSoonStocks: 0,
    normalStocks: 0,
    totalUnits: 0
  });
  const [loadingBloodUnit, setLoadingBloodUnit] = useState(true);
  const [loadingBloodUnitSummary, setLoadingBloodUnitSummary] = useState(true);

  useEffect(() => {
    getBloodUnits().then(data => {
      setBloodUnits(data);
      setLoadingBloodUnit(false);
    });
    getBloodUnitSummary().then(data => {
      setBloodUnitSummary(data);
      setLoadingBloodUnitSummary(false);
    });
  }, []);

  const bloodStock = [
    {
      id: "BS001",
      type: "A+",
      quantity: 45,
      capacity: 60,
      location: "Réfrigérateur 1",
      temperature: "4°C",
      expirationDate: "2024-02-15",
      status: "normal",
      donorId: "DON-2024-001",
      collectionDate: "2024-01-10",
    },
    {
      id: "BS002",
      type: "O-",
      quantity: 12,
      capacity: 50,
      location: "Réfrigérateur 2",
      temperature: "4°C",
      expirationDate: "2024-02-08",
      status: "critical",
      donorId: "DON-2024-002",
      collectionDate: "2024-01-05",
    },
    {
      id: "BS003",
      type: "B+",
      quantity: 38,
      capacity: 45,
      location: "Stockage A",
      temperature: "4°C",
      expirationDate: "2024-02-20",
      status: "normal",
      donorId: "DON-2024-003",
      collectionDate: "2024-01-12",
    },
    {
      id: "BS004",
      type: "AB-",
      quantity: 8,
      capacity: 25,
      location: "Réfrigérateur 1",
      temperature: "4°C",
      expirationDate: "2024-02-05",
      status: "expiring",
      donorId: "DON-2024-004",
      collectionDate: "2024-01-02",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Expired":
        return "bg-red-500"
      case "expiring":
        return "bg-orange-500"
      case "Available":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Expired":
        return "Critique"
      case "expiring":
        return "Expire Bientôt"
      case "Available":
        return "Normal"
      default:
        return "Inconnu"
    }
  }

  function isExpiringSoon(expirationDate: string | Date): boolean {
    const now = new Date();
    const expireDate = new Date(expirationDate);

    const diffTime = expireDate.getTime() - now.getTime(); // en ms
    const diffDays = diffTime / (1000 * 60 * 60 * 24); // en jours

    return diffDays > 0 && diffDays < 7;
  }

  const getBloodTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      "A+": "bg-red-500",
      "A-": "bg-red-400",
      "B+": "bg-blue-500",
      "B-": "bg-blue-400",
      "AB+": "bg-purple-500",
      "AB-": "bg-purple-400",
      "O+": "bg-green-500",
      "O-": "bg-green-400",
    }
    return colors[type] || "bg-gray-500"
  }

  const handleAddStock = (data: any) => {
    console.log("Nouveau stock ajouté:", data)
    // Ici vous ajouteriez la logique pour sauvegarder le nouveau stock
  }

  const handleApplyFilters = (filters: any) => {
    console.log("Filtres appliqués:", filters)
    // Ici vous ajouteriez la logique pour filtrer les données
  }

  const handleExport = (config: any) => {
    console.log("Export configuré:", config)
    // Ici vous ajouteriez la logique pour exporter les données
  }

  /*
  const filteredStock = bloodUnits.filter(
      (item) =>
          item.bloodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.storageLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.donor.id.toString().toLowerCase().includes(searchTerm.toLowerCase()),
  )

   */

  return (
      <div className="space-y-6">
        {/* Header avec Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestion de l'Inventaire</h2>
            <p className="text-gray-600">Surveillance en temps réel des stocks de sang</p>
          </div>
          <div className="flex gap-2">
            <Button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter Stock
            </Button>
            <Button variant="outline" onClick={() => setShowFilterModal(true)}>
              <Filter className="w-4 h-4 mr-2" />
              Filtrer
            </Button>
            <Button variant="outline" onClick={() => setShowExportModal(true)}>
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Barre de Recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
              placeholder="Rechercher par groupe sanguin, emplacement ou ID donneur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
          />
        </div>

        {/* Grille des Stocks */}
        {loadingBloodUnit ? (
            <p> Chargement...</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bloodUnits.content.map((item) => (
                  <Card key={item.unitId} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${getBloodTypeColor(item.bloodType)}`}></div>
                          <CardTitle className="text-lg">{item.bloodType}</CardTitle>
                        </div>
                        <Badge variant="outline" className={`${getStatusColor(isExpiringSoon(item.expirationDate) ? 'expiring' : item.currentStatus)} text-white border-0`}>
                          {getStatusLabel(isExpiringSoon(item.expirationDate) ? 'expiring' : item.currentStatus)}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs text-gray-500">ID: {item.unitId}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Quantité et Progression */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Quantité</span>
                          <span className="font-medium">
                  {item.volumeMl}/{item.volumeMl} unités
                </span>
                        </div>
                        <Progress value={(item.volumeMl / item.volumeMl) * 100} className="h-2"/>
                      </div>

                      {/* Informations Détaillées */}
                      <div className="space-y-2 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3"/>
                          <span>{item.storageLocation}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Thermometer className="w-3 h-3"/>
                          <span>{item.componentType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3"/>
                          <span>Expire: {new Date(item.expirationDate).toLocaleDateString("fr-FR")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3"/>
                          <span>Collecté: {new Date(item.collectionDate).toLocaleDateString("fr-FR")}</span>
                        </div>
                      </div>

                      {/* Alertes */}
                      {item.currentStatus === "Expired" && (
                          <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                            <AlertTriangle className="w-4 h-4 text-red-500"/>
                            <span className="text-xs text-red-700">Stock critique - Réapprovisionnement urgent</span>
                          </div>
                      )}

                      {isExpiringSoon(item.expirationDate) && (
                          <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                            <Clock className="w-4 h-4 text-orange-500"/>
                            <span className="text-xs text-orange-700">Expire dans moins de 7 jours</span>
                          </div>
                      )}

                      {/* Actions Rapides */}
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1 text-xs bg-transparent">
                          Réserver
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 text-xs bg-transparent">
                          Détails
                        </Button>
                      </div>
                    </CardContent>

                    {/* Indicateur de Statut */}
                    <div
                        className={`absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] ${getStatusColor(item.currentStatus)}`}
                    ></div>
                  </Card>
              ))}
            </div>
        )}


        {/* Résumé des Stocks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-red-500" />
              Résumé de l'Inventaire
            </CardTitle>
          </CardHeader>
          {loadingBloodUnitSummary ? (
              <p>Chargement...</p>
          ) : (
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {bloodUnitSummary.totalUnits}
                    </div>
                    <div className="text-sm text-gray-600">Unités Totales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {bloodUnitSummary.criticalStocks}
                    </div>
                    <div className="text-sm text-gray-600">Stocks Critiques</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {bloodUnitSummary.expiringSoonStocks}
                    </div>
                    <div className="text-sm text-gray-600">Expirent Bientôt</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {bloodUnitSummary.normalStocks}
                    </div>
                    <div className="text-sm text-gray-600">Stocks Normaux</div>
                  </div>
                </div>
              </CardContent>
          )}
        </Card>

        {/* Modals */}
        <AddStockModal open={showAddModal} onOpenChange={setShowAddModal} onSubmit={handleAddStock} />

        <FilterModal
            open={showFilterModal}
            onOpenChange={setShowFilterModal}
            onApplyFilters={handleApplyFilters}
            filterType="inventory"
        />

        <ExportModal
            open={showExportModal}
            onOpenChange={setShowExportModal}
            onExport={handleExport}
            dataType="inventory"
        />
      </div>
  )
}
