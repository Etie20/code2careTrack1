"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, CalendarIcon as CalendarLucide, Loader2, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

interface AddRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export default function AddRequestModal({ open, onOpenChange, onSubmit }: AddRequestModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    hospital: "",
    bloodType: "",
    quantity: "",
    urgency: "",
    procedure: "",
    patientId: "",
    requestedBy: "",
    deadline: undefined as Date | undefined,
    notes: "",
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

  const urgencyLevels = [
    { value: "critical", label: "Critique", color: "bg-red-500", description: "Urgence vitale - < 1h" },
    { value: "urgent", label: "Urgent", color: "bg-orange-500", description: "Urgent - < 4h" },
    { value: "routine", label: "Routine", color: "bg-blue-500", description: "Programmé - < 24h" },
    { value: "scheduled", label: "Planifié", color: "bg-green-500", description: "Planifié - < 72h" },
  ]

  const hospitals = [
    "Hôpital Saint-Louis",
    "CHU Pitié-Salpêtrière",
    "Hôpital Cochin",
    "Hôpital Necker",
    "Hôpital Bichat",
    "Hôpital Tenon",
    "Hôpital Lariboisière",
  ]

  const procedures = [
    "Chirurgie cardiaque",
    "Chirurgie orthopédique",
    "Transplantation",
    "Oncologie",
    "Traumatologie",
    "Obstétrique",
    "Pédiatrie",
    "Autre",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    onSubmit(formData)
    setLoading(false)
    onOpenChange(false)

    // Reset form
    setFormData({
      hospital: "",
      bloodType: "",
      quantity: "",
      urgency: "",
      procedure: "",
      patientId: "",
      requestedBy: "",
      deadline: undefined,
      notes: "",
    })
  }

  const selectedUrgency = urgencyLevels.find((u) => u.value === formData.urgency)

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarLucide className="w-5 h-5 text-blue-500" />
              Nouvelle Demande de Sang
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hospital">Hôpital *</Label>
                <Select
                    value={formData.hospital}
                    onValueChange={(value) => setFormData({ ...formData, hospital: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner l'hôpital" />
                  </SelectTrigger>
                  <SelectContent>
                    {hospitals.map((hospital) => (
                        <SelectItem key={hospital} value={hospital}>
                          {hospital}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requestedBy">Demandé par *</Label>
                <Input
                    id="requestedBy"
                    placeholder="Dr. Martin Dubois"
                    value={formData.requestedBy}
                    onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
                    required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bloodType">Groupe Sanguin *</Label>
                <Select
                    value={formData.bloodType}
                    onValueChange={(value) => setFormData({ ...formData, bloodType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                            {type.label}
                          </div>
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantité (unités) *</Label>
                <Input
                    id="quantity"
                    type="number"
                    placeholder="2"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Niveau d'Urgence *</Label>
              <Select value={formData.urgency} onValueChange={(value) => setFormData({ ...formData, urgency: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le niveau d'urgence" />
                </SelectTrigger>
                <SelectContent>
                  {urgencyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${level.color}`}></div>
                          <div>
                            <div className="font-medium">{level.label}</div>
                            <div className="text-xs text-gray-500">{level.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedUrgency && (
                  <Badge variant="outline" className={`${selectedUrgency.color} text-white border-0`}>
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {selectedUrgency.label} - {selectedUrgency.description}
                  </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="procedure">Type de Procédure</Label>
                <Select
                    value={formData.procedure}
                    onValueChange={(value) => setFormData({ ...formData, procedure: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {procedures.map((procedure) => (
                        <SelectItem key={procedure} value={procedure}>
                          {procedure}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="patientId">ID Patient</Label>
                <Input
                    id="patientId"
                    placeholder="PAT-2024-001"
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Date Limite *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                      variant="outline"
                      className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.deadline && "text-muted-foreground",
                      )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.deadline ? (
                        format(formData.deadline, "PPP 'à' HH:mm", { locale: fr })
                    ) : (
                        <span>Sélectionner la date limite</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                      mode="single"
                      selected={formData.deadline}
                      onSelect={(date) => setFormData({ ...formData, deadline: date })}
                      initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes Additionnelles</Label>
              <Textarea
                  id="notes"
                  placeholder="Informations complémentaires sur la demande..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button
                  type="submit"
                  disabled={loading || !formData.hospital || !formData.bloodType || !formData.quantity || !formData.urgency}
              >
                {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création en cours...
                    </>
                ) : (
                    "Créer la Demande"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  )
}
