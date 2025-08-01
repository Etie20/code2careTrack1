"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Filter, X } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

interface FilterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplyFilters: (filters: any) => void
  filterType: "inventory" | "donors" | "requests" | "analytics"
}

export default function FilterModal({ open, onOpenChange, onApplyFilters, filterType }: FilterModalProps) {
  const [filters, setFilters] = useState({
    bloodTypes: [] as string[],
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
    status: "all", // Updated default value
    location: "all", // Updated default value
    urgency: "all", // Updated default value
    hospital: "all", // Updated default value
    quantity: { min: "", max: "" },
  })

  const bloodTypes = [
    { value: "A+", label: "A+", color: "bg-red-500" },
    { value: "A-", label: "A-", color: "bg-red-400" },
    { value: "B+", label: "B+", color: "bg-blue-500" },
    { value: "B-", label: "B-", color: "bg-blue-400" },
    { value: "AB+", label: "AB+", color: "bg-purple-500" },
    { value: "AB-", label: "AB-", color: "bg-purple-400" },
    { value: "O+", label: "O+", color: "bg-green-500" },
    { value: "O-", label: "O-", color: "bg-green-400" },
  ]

  const handleBloodTypeToggle = (bloodType: string) => {
    setFilters((prev) => ({
      ...prev,
      bloodTypes: prev.bloodTypes.includes(bloodType)
          ? prev.bloodTypes.filter((bt) => bt !== bloodType)
          : [...prev.bloodTypes, bloodType],
    }))
  }

  const handleApplyFilters = () => {
    onApplyFilters(filters)
    onOpenChange(false)
  }

  const handleClearFilters = () => {
    setFilters({
      bloodTypes: [],
      dateFrom: undefined,
      dateTo: undefined,
      status: "all", // Updated default value
      location: "all", // Updated default value
      urgency: "all", // Updated default value
      hospital: "all", // Updated default value
      quantity: { min: "", max: "" },
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.bloodTypes.length > 0) count++
    if (filters.dateFrom || filters.dateTo) count++
    if (filters.status !== "all") count++
    if (filters.location !== "all") count++
    if (filters.urgency !== "all") count++
    if (filters.hospital !== "all") count++
    if (filters.quantity.min || filters.quantity.max) count++
    return count
  }

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-500" />
              Filtres Avancés
              {getActiveFiltersCount() > 0 && <Badge variant="secondary">{getActiveFiltersCount()} actif(s)</Badge>}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Groupes Sanguins */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Groupes Sanguins</Label>
              <div className="grid grid-cols-4 gap-2">
                {bloodTypes.map((type) => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <Checkbox
                          id={type.value}
                          checked={filters.bloodTypes.includes(type.value)}
                          onCheckedChange={() => handleBloodTypeToggle(type.value)}
                      />
                      <label
                          htmlFor={type.value}
                          className="flex items-center gap-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                        {type.label}
                      </label>
                    </div>
                ))}
              </div>
              {filters.bloodTypes.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {filters.bloodTypes.map((bt) => (
                        <Badge key={bt} variant="secondary" className="text-xs">
                          {bt}
                          <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => handleBloodTypeToggle(bt)} />
                        </Badge>
                    ))}
                  </div>
              )}
            </div>

            {/* Plage de Dates */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Période</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500">Du</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                          variant="outline"
                          className={cn(
                              "w-full justify-start text-left font-normal",
                              !filters.dateFrom && "text-muted-foreground",
                          )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateFrom ? (
                            format(filters.dateFrom, "dd/MM/yyyy", { locale: fr })
                        ) : (
                            <span>Date début</span>
                        )}
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
                  <Label className="text-xs text-gray-500">Au</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                          variant="outline"
                          className={cn(
                              "w-full justify-start text-left font-normal",
                              !filters.dateTo && "text-muted-foreground",
                          )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateTo ? format(filters.dateTo, "dd/MM/yyyy", { locale: fr }) : <span>Date fin</span>}
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

            {/* Filtres spécifiques selon le type */}
            {filterType === "inventory" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les statuts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="available">Disponible</SelectItem>
                        <SelectItem value="reserved">Réservé</SelectItem>
                        <SelectItem value="expired">Expiré</SelectItem>
                        <SelectItem value="critical">Critique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Emplacement</Label>
                    <Select value={filters.location} onValueChange={(value) => setFilters({ ...filters, location: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les emplacements" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les emplacements</SelectItem>
                        <SelectItem value="refrigerator-1">Réfrigérateur 1</SelectItem>
                        <SelectItem value="refrigerator-2">Réfrigérateur 2</SelectItem>
                        <SelectItem value="freezer-1">Congélateur 1</SelectItem>
                        <SelectItem value="storage-a">Stockage A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
            )}

            {filterType === "requests" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgence</Label>
                    <Select value={filters.urgency} onValueChange={(value) => setFilters({ ...filters, urgency: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les niveaux" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les niveaux</SelectItem>
                        <SelectItem value="critical">Critique</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="routine">Routine</SelectItem>
                        <SelectItem value="scheduled">Planifié</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hospital">Hôpital</Label>
                    <Select value={filters.hospital} onValueChange={(value) => setFilters({ ...filters, hospital: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les hôpitaux" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les hôpitaux</SelectItem>
                        <SelectItem value="saint-louis">Hôpital Saint-Louis</SelectItem>
                        <SelectItem value="pitie">CHU Pitié-Salpêtrière</SelectItem>
                        <SelectItem value="cochin">Hôpital Cochin</SelectItem>
                        <SelectItem value="necker">Hôpital Necker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
            )}
          </div>

          <DialogFooter className="flex justify-between">
            <Button type="button" variant="ghost" onClick={handleClearFilters}>
              Effacer tout
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="button" onClick={handleApplyFilters}>
                Appliquer les Filtres
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  )
}
