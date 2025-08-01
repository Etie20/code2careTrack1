"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Droplets } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface AddStockModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddStockModal({ open, onOpenChange }: AddStockModalProps) {
  const [formData, setFormData] = useState({
    bloodType: "",
    units: "",
    donorId: "",
    collectionDate: undefined as Date | undefined,
    expiryDate: undefined as Date | undefined,
    location: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const bloodTypes = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]
  const locations = [
    "Freezer A1",
    "Freezer A2",
    "Freezer B1",
    "Freezer B2",
    "Freezer C1",
    "Freezer C2",
    "Freezer D1",
    "Freezer D2",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulation d'ajout de stock
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Nouveau stock ajouté:", formData)
    setIsSubmitting(false)
    onOpenChange(false)

    // Reset form
    setFormData({
      bloodType: "",
      units: "",
      donorId: "",
      collectionDate: undefined,
      expiryDate: undefined,
      location: "",
      notes: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-800">
            <Plus className="w-5 h-5" />
            Ajouter du Stock de Sang
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Type de Sang */}
            <div className="space-y-2">
              <Label htmlFor="bloodType">Type de Sang *</Label>
              <Select
                value={formData.bloodType}
                onValueChange={(value) => setFormData({ ...formData, bloodType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  {bloodTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {type}
                        </div>
                        {type}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Nombre d'Unités */}
            <div className="space-y-2">
              <Label htmlFor="units">Nombre d'Unités *</Label>
              <Input
                id="units"
                type="number"
                min="1"
                value={formData.units}
                onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                placeholder="Ex: 5"
                required
              />
            </div>

            {/* ID Donneur */}
            <div className="space-y-2">
              <Label htmlFor="donorId">ID Donneur</Label>
              <Input
                id="donorId"
                value={formData.donorId}
                onChange={(e) => setFormData({ ...formData, donorId: e.target.value })}
                placeholder="Ex: D001"
              />
            </div>

            {/* Emplacement */}
            <div className="space-y-2">
              <Label htmlFor="location">Emplacement *</Label>
              <Select
                value={formData.location}
                onValueChange={(value) => setFormData({ ...formData, location: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner l'emplacement" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date de Collecte */}
            <div className="space-y-2">
              <Label>Date de Collecte *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.collectionDate
                      ? format(formData.collectionDate, "PPP", { locale: fr })
                      : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.collectionDate}
                    onSelect={(date) => setFormData({ ...formData, collectionDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date d'Expiration */}
            <div className="space-y-2">
              <Label>Date d'Expiration *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expiryDate ? format(formData.expiryDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.expiryDate}
                    onSelect={(date) => setFormData({ ...formData, expiryDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optionnel)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Informations supplémentaires..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.bloodType || !formData.units || !formData.location}
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Ajout en cours...
                </div>
              ) : (
                <>
                  <Droplets className="w-4 h-4 mr-2" />
                  Ajouter le Stock
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
