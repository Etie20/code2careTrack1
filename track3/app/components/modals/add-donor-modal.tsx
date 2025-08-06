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
import { CalendarIcon, Users, Loader2, User, Heart, MapPin } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {submitDonor} from "@/app/services/donor.service";
import {DonorData} from "@/lib/types/donor";

interface AddDonorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddDonorModal({ open, onOpenChange }: AddDonorModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] =  useState<DonorData>({
    fullName: "",
    contactNumber: "",
    bloodType: "",
    gender: "",
    dateOfBirth: undefined,
    email: "",
    address: "",
    occupation: "",
    registrationDate: new Date(),
    lastDonationDate : undefined,
    medicalNotes: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await submitDonor(formData as DonorData)
      onOpenChange(false)
      // Reset form
      setFormData({
        fullName: "",
        contactNumber: "",
        bloodType: "",
        gender: "",
        dateOfBirth: undefined,
        email: "",
        address: "",
        occupation: "",
        registrationDate: new Date(),
        lastDonationDate: undefined,
        medicalNotes: "",
      })

      console.log("valeurs du formulaire, ", formData )
      alert("✅Nouveau Donneur crée avec succès .😄")
    } catch (error) {
      console.error("Erreur lors de l'ajout du donneur :", error)
      alert("⚠️Une erreur est survenue. Veuillez réessayer.😔")
    } finally {
      setLoading(false)
    }
  }



  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Ajouter un Nouveau Donneur
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="personal" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal" className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Personnel
                </TabsTrigger>
                <TabsTrigger value="medical" className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  Médical
                </TabsTrigger>
                <TabsTrigger value="address" className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Adresse
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom Complet</Label>
                  <Input
                      id="lastName"
                      placeholder="Jean Dupont"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date de Naissance *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !formData.dateOfBirth && "text-muted-foreground",
                            )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.dateOfBirth ? (
                              format(formData.dateOfBirth, "PPP", { locale: fr })
                          ) : (
                              <span>Sélectionner</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={formData.dateOfBirth}
                            onSelect={(date) => setFormData({ ...formData, dateOfBirth: date })}
                            initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Genre *</Label>
                    <Select
                        value={formData.gender}
                        onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                        id="phone"
                        placeholder="+33 1 23 45 67 89"
                        value={formData.contactNumber}
                        onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                        required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="jean.dupont@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                </div>
              </TabsContent>

              <TabsContent value="medical" className="space-y-4">

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
                    <Label htmlFor="medicalConditions">Note médicale</Label>
                    <Input
                        id="medicalConditions"
                        placeholder="En excellente santé, etc."
                        value={formData.medicalNotes}
                        onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date Enregistrement</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !formData.registrationDate && "text-muted-foreground",
                            )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.registrationDate ? (
                              format(formData.registrationDate, "PPP", { locale: fr })
                          ) : (
                              <span>Non enregistré</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={formData.registrationDate}
                            onSelect={(date) => setFormData({ ...formData, registrationDate: date })}
                            initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Dernière Donation</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !formData.lastDonationDate && "text-muted-foreground",
                            )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.lastDonationDate ? (
                              format(formData.lastDonationDate, "PPP", { locale: fr })
                          ) : (
                              <span>Aucune donation</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={formData.lastDonationDate}
                            onSelect={(date) => setFormData({ ...formData, lastDonationDate: date })}
                            initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>


                </div>

              </TabsContent>

              <TabsContent value="address" className="space-y-4">


                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse *</Label>
                    <Input
                        id="address"
                        placeholder="123 Rue de la Paix"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Profession *</Label>
                    <Input
                        id="city"
                        placeholder="Etudiant"
                        value={formData.occupation}
                        onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                        required
                    />
                  </div>

                </div>

              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button
                  type="submit"
                  disabled={loading || !formData.fullName || !formData.bloodType}
              >
                {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Ajout en cours...
                    </>
                ) : (
                    "Ajouter le Donneur"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  )
}
