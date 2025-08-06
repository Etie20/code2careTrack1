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
import { CalendarIcon, Droplets, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import {BloodUnit, Content} from "@/app/models/bloodUnit";
import {Donor} from "@/app/models/donor";

interface AddStockModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export default function AddStockModal({ open, onOpenChange, onSubmit }: AddStockModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Content>({
    bloodType: "",
    collectionCenter: "",
    collectionDate: new Date(),
    componentType: "",
    currentStatus: "",
    donor: {
      id: 0,
      fullName: "",
      contactNumber: "",
      bloodType: "",
      gender: "",
      dateOfBirth: undefined,
      email: "",
      address: "",
      occupation: "",
      registrationDate: undefined,
      lastDonationDate: undefined,
      medicalNotes: ""
    },
    expirationDate: new Date(),
    screening: null,
    storageLocation: "",
    unitId: 0,
    volumeMl: 0

  })
  const [selectedDonorId, setSelectedDonorId] = useState<number>(0);
  const [donors, setDonors] = useState<Donor[]>([]);
  const selectedDonor = donors.find((donor) => donor.id === selectedDonorId);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulation d'une requête API
    await new Promise((resolve) => setTimeout(resolve, 2000))

    onSubmit(formData)
    setLoading(false)
    onOpenChange(false)

    // Reset form
    setFormData({
      bloodType: "",
      collectionCenter: "",
      collectionDate: new Date(),
      componentType: "",
      currentStatus: "",
      donor: {
        id: 0,
        fullName: "",
        contactNumber: "",
        bloodType: "",
        gender: "",
        dateOfBirth: undefined,
        email: "",
        address: "",
        occupation: "",
        registrationDate: undefined,
        lastDonationDate: undefined,
        medicalNotes: ""
      },
      expirationDate: new Date(),
      screening: null,
      storageLocation: "",
      unitId: 0,
      volumeMl: 0
    })
  }

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-red-500" />
              Ajouter du Stock de Sang
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="quantity">Quantité (ml) *</Label>
                <Input
                    id="quantity"
                    type="number"
                    placeholder="450"
                    value={formData.volumeMl}
                    onChange={(e) => setFormData({ ...formData, volumeMl: Number(e.target.value) })}
                    required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="donorId">Donneur</Label>
              <select
                  value={formData.donor.id}
                  onChange={(e) => setFormData(
                      {...formData,
                        donor: donors.filter(d => d.id === Number(e.target.value))[0]
                      })}
                  className="border rounded px-4 py-2 w-full"
              >
                <option value="">-- Select Donor --</option>
                {donors.map((donor) => (
                    <option key={donor.id} value={donor.id}>
                      {donor.fullName}
                    </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date de Collecte *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full justify-start text-left font-normal",
                        !formData.collectionDate && "text-muted-foreground",
                        )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.collectionDate ? (
                          format(formData.collectionDate, "PPP", { locale: fr })
                      ) : (
                          <span>Sélectionner une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={formData.collectionDate}
                        onSelect={(date) => setFormData({ ...formData, collectionDate: date == undefined ? new Date() : date })}
                        initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Date d'Expiration *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.expirationDate && "text-muted-foreground",
                        )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.expirationDate ? (
                          format(formData.expirationDate, "PPP", { locale: fr })
                      ) : (
                          <span>Sélectionner une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={formData.expirationDate}
                        onSelect={(date) => setFormData({ ...formData, expirationDate: date == undefined ? new Date() : date })}
                        initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Emplacement</Label>
              <Select value={formData.storageLocation} onValueChange={(value) => setFormData({ ...formData, storageLocation: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner l'emplacement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="refrigerator-1">Réfrigérateur 1</SelectItem>
                  <SelectItem value="refrigerator-2">Réfrigérateur 2</SelectItem>
                  <SelectItem value="freezer-1">Congélateur 1</SelectItem>
                  <SelectItem value="storage-a">Stockage A</SelectItem>
                  <SelectItem value="storage-b">Stockage B</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Composant Sanguin</Label>
              <Input
                  id="notes"
                  placeholder="composant..."
                  value={formData.componentType}
                  onChange={(e) => setFormData({ ...formData, componentType: e.target.value })}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading || !formData.bloodType || !formData.volumeMl}>
                {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Ajout en cours...
                    </>
                ) : (
                    "Ajouter le Stock"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  )
}
