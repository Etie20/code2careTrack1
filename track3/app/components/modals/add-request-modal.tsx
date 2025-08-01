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
import { CalendarIcon, Plus, CalendarPlus2Icon as CalendarIcon2, Hospital, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface AddRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddRequestModal({ open, onOpenChange }: AddRequestModalProps) {
  const [formData, setFormData] = useState({
    hospital: "",
    bloodType: "",
    unitsRequested: "",
    urgency: "",
    purpose: "",
    contactName: "",
    contactPhone: "",
    requiredBy: undefined as Date | undefined,
    patientInfo: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const bloodTypes = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]
  const hospitals = [
    "Hôpital Central de Yaoundé",
    "Hôpital Laquintinie Douala",
    "Centre Hospitalier d'Essos",
    "Hôpital Régional de Bafoussam",
    "Clinique des Spécialités",
    "Hôpital Gynéco-Obstétrique",
  ]
  const urgencyLevels = [
    { value: "emergency", label: "Urgence", color: "text-red-600" },
    { value: "high", label: "Élevée", color: "text-orange-600" },
    { value: "medium", label: "Moyenne", color: "text-yellow-600" },
    { value: "low", label: "Faible", color: "text-green-600" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Nouvelle demande créée:", formData)
    setIsSubmitting(false)
    onOpenChange(false)

    // Reset form
    setFormData({
      hospital: "",
      bloodType: "",
      unitsRequested: "",
      urgency: "",
      purpose: "",
      contactName: "",
      contactPhone: "",
      requiredBy: undefined,
      patientInfo: "",
      notes: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-indigo-800">
            <Plus className="w-5 h-5" />
            Nouvelle Demande de Sang
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de l'Hôpital */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Informations de l'Établissement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hospital">Hôpital/Clinique *</Label>
                <Select
                  value={formData.hospital}
                  onValueChange={(value) => setFormData({ ...formData, hospital: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner l'établissement" />
                  </SelectTrigger>
                  <SelectContent>
                    {hospitals.map((hospital) => (
                      <SelectItem key={hospital} value={hospital}>
                        <div className="flex items-center gap-2">
                          <Hospital className="w-4 h-4" />
                          {hospital}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactName">Nom du Contact *</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  placeholder="Dr. Marie Nkomo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Téléphone du Contact *</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="+237 6XX XXX XXX"
                  required
                />
              </div>
            </div>
          </div>

          {/* Détails de la Demande */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Détails de la Demande</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="unitsRequested">Unités Demandées *</Label>
                <Input
                  id="unitsRequested"
                  type="number"
                  min="1"
                  value={formData.unitsRequested}
                  onChange={(e) => setFormData({ ...formData, unitsRequested: e.target.value })}
                  placeholder="Ex: 5"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="urgency">Niveau d'Urgence *</Label>
                <Select
                  value={formData.urgency}
                  onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner l'urgence" />
                  </SelectTrigger>
                  <SelectContent>
                    {urgencyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="flex items-center gap-2">
                          {level.value === "emergency" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                          <span className={level.color}>{level.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purpose">Objectif/Procédure *</Label>
                <Select
                  value={formData.purpose}
                  onValueChange={(value) => setFormData({ ...formData, purpose: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner l'objectif" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emergency_surgery">Chirurgie d'Urgence</SelectItem>
                    <SelectItem value="scheduled_surgery">Chirurgie Programmée</SelectItem>
                    <SelectItem value="blood_transfusion">Transfusion Sanguine</SelectItem>
                    <SelectItem value="cancer_treatment">Traitement du Cancer</SelectItem>
                    <SelectItem value="trauma_care">Soins de Traumatologie</SelectItem>
                    <SelectItem value="maternity_care">Soins de Maternité</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date Limite *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.requiredBy
                        ? format(formData.requiredBy, "PPP 'à' HH:mm", { locale: fr })
                        : "Sélectionner date et heure"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.requiredBy}
                      onSelect={(date) => setFormData({ ...formData, requiredBy: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Informations Patient */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Informations Patient (Optionnel)</h3>
            <div className="space-y-2">
              <Label htmlFor="patientInfo">Informations Patient</Label>
              <Textarea
                id="patientInfo"
                value={formData.patientInfo}
                onChange={(e) => setFormData({ ...formData, patientInfo: e.target.value })}
                placeholder="Âge, sexe, diagnostic, etc."
                rows={2}
              />
            </div>
          </div>

          {/* Notes Supplémentaires */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes Supplémentaires</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Informations complémentaires, instructions spéciales..."
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
              disabled={
                isSubmitting ||
                !formData.hospital ||
                !formData.bloodType ||
                !formData.unitsRequested ||
                !formData.urgency
              }
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Création en cours...
                </div>
              ) : (
                <>
                  <CalendarIcon2 className="w-4 h-4 mr-2" />
                  Créer la Demande
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
