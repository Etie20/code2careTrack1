"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Filter, RotateCcw } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface FilterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "inventory" | "donors" | "requests" | "analytics"
}

export default function FilterModal({ open, onOpenChange, type }: FilterModalProps) {
  const [filters, setFilters] = useState({
    bloodTypes: [] as string[],
    status: "all",
    location: "all",
    urgency: "all",
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
    healthStatus: "all",
    eligibility: "all",
    city: "all",
  })

  const bloodTypes = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]
  const locations = ["Freezer A1", "Freezer A2", "Freezer B1", "Freezer B2", "Freezer C1", "Freezer C2"]
  const cities = ["Yaoundé", "Douala", "Bafoussam", "Bamenda", "Garoua", "Maroua"]

  const handleBloodTypeChange = (bloodType: string, checked: boolean) => {
    if (checked) {
      setFilters({ ...filters, bloodTypes: [...filters.bloodTypes, bloodType] })
    } else {
      setFilters({ ...filters, bloodTypes: filters.bloodTypes.filter((t) => t !== bloodType) })
    }
  }

  const resetFilters = () => {
    setFilters({
      bloodTypes: [],
      status: "all",
      location: "all",
      urgency: "all",
      dateFrom: undefined,
      dateTo: undefined,
      healthStatus: "all",
      eligibility: "all",
      city: "all",
    })
  }

  const applyFilters = () => {
    console.log("Filtres appliqués:", filters)
    onOpenChange(false)
  }

  const getFilterTitle = () => {
    switch (type) {
      case "inventory":
        return "Filtrer l'Inventaire"
      case "donors":
        return "Filtrer les Donneurs"
      case "requests":
        return "Filtrer les Demandes"
      case "analytics":
        return "Filtrer les Analytics"
      default:
        return "Filtres"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-800">
            <Filter className="w-5 h-5" />
            {getFilterTitle()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Types de Sang */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Types de Sang</Label>
            <div className="grid grid-cols-4 gap-3">
              {bloodTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={filters.bloodTypes.includes(type)}
                    onCheckedChange={(checked) => handleBloodTypeChange(type, checked as boolean)}
                  />
                  <label htmlFor={type} className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <div className="w-5 h-5 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {type}
                    </div>
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Filtres spécifiques selon le type */}
          {type === "inventory" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Statut du Stock</Label>
                  <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="good">Bon</SelectItem>
                      <SelectItem value="low">Faible</SelectItem>
                      <SelectItem value="critical">Critique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Emplacement</Label>
                  <Select
                    value={filters.location}
                    onValueChange={(value) => setFilters({ ...filters, location: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les emplacements" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les emplacements</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {type === "donors" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Éligibilité</Label>
                  <Select
                    value={filters.eligibility}
                    onValueChange={(value) => setFilters({ ...filters, eligibility: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="eligible">Éligible</SelectItem>
                      <SelectItem value="not_eligible">Non Éligible</SelectItem>
                      <SelectItem value="pending">En Attente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>État de Santé</Label>
                  <Select
                    value={filters.healthStatus}
                    onValueChange={(value) => setFilters({ ...filters, healthStatus: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les états" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les états</SelectItem>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Bon</SelectItem>
                      <SelectItem value="fair">Correct</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Ville</Label>
                  <Select value={filters.city} onValueChange={(value) => setFilters({ ...filters, city: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les villes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les villes</SelectItem>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {type === "requests" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Statut de la Demande</Label>
                  <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="pending">En Attente</SelectItem>
                      <SelectItem value="approved">Approuvée</SelectItem>
                      <SelectItem value="fulfilled">Satisfaite</SelectItem>
                      <SelectItem value="rejected">Rejetée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Niveau d'Urgence</Label>
                  <Select value={filters.urgency} onValueChange={(value) => setFilters({ ...filters, urgency: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les niveaux" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les niveaux</SelectItem>
                      <SelectItem value="emergency">Urgence</SelectItem>
                      <SelectItem value="high">Élevée</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="low">Faible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {/* Plage de Dates */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Plage de Dates</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date de Début</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateFrom ? format(filters.dateFrom, "PPP", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateFrom}
                      onSelect={(date) => setFilters({ ...filters, dateFrom: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Date de Fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateTo ? format(filters.dateTo, "PPP", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateTo}
                      onSelect={(date) => setFilters({ ...filters, dateTo: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button type="button" variant="outline" onClick={resetFilters}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button
                onClick={applyFilters}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Filter className="w-4 h-4 mr-2" />
                Appliquer les Filtres
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
