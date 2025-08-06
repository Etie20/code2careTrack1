"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Pill, Plus, Check } from "lucide-react"

const reminderTranslations = {
  en: {
    title: "Appointment & Medication Reminders",
    description: "Never miss an appointment or medication",
    upcomingAppointments: "Upcoming Appointments",
    medications: "Medications",
    addReminder: "Add Reminder",
    today: "Today",
    tomorrow: "Tomorrow",
    thisWeek: "This Week",
    taken: "Taken",
    pending: "Pending",
    overdue: "Overdue",
  },
  fr: {
    title: "Rappels de Rendez-vous et Médicaments",
    description: "Ne manquez jamais un rendez-vous ou un médicament",
    upcomingAppointments: "Rendez-vous à Venir",
    medications: "Médicaments",
    addReminder: "Ajouter Rappel",
    today: "Aujourd'hui",
    tomorrow: "Demain",
    thisWeek: "Cette Semaine",
    taken: "Pris",
    pending: "En Attente",
    overdue: "En Retard",
  },
  douala: {
    title: "Apɔ́intmɛnt na Mɛdisin Rimaynd",
    description: "No mis apɔ́intmɛnt ɔ mɛdisin",
    upcomingAppointments: "Apɔ́intmɛnt Wɛ Di Kɔm",
    medications: "Mɛdisin",
    addReminder: "Ad Rimaynd",
    today: "Tude",
    tomorrow: "Tumɔro",
    thisWeek: "Dis Wik",
    taken: "Dɔn Tek",
    pending: "Di Wet",
    overdue: "Dɔn Pas Taym",
  },
  bassa: {
    title: "Àpɔ̀yntmɛ̀nt Nì Mɛ̀dìsìn Rìmàynd",
    description: "Kàk mìs àpɔ̀yntmɛ̀nt ɔ̀ mɛ̀dìsìn",
    upcomingAppointments: "Àpɔ̀yntmɛ̀nt Bì Dì Kɔ̀m",
    medications: "Mɛ̀dìsìn",
    addReminder: "Àd Rìmàynd",
    today: "Lɛ̀lɔ̀",
    tomorrow: "Kìrì",
    thisWeek: "Sɔ̀ndɔ̀ Ì Nì",
    taken: "Dɔ̀n Tɛ̀k",
    pending: "Dì Wɛ̀t",
    overdue: "Dɔ̀n Pàs Tàym",
  },
  ewondo: {
    title: "Mɛ́sús Minkúm Sí Bílɔ́m",
    description: "Kɔ́k yɛ́n minkúm ɔ bílɔ́m",
    upcomingAppointments: "Minkúm Mí Ńkɔ́b",
    medications: "Bílɔ́m",
    addReminder: "Tíl Mɛ́sús",
    today: "Ándɔ́",
    tomorrow: "Kírí",
    thisWeek: "Sɔ́ndɔ́ Sí",
    taken: "À Mín",
    pending: "À Kɛ́l",
    overdue: "À Fán Ńtáŋ",
  },
}

const mockAppointments = [
  { id: 1, doctor: "Dr. Smith", time: "10:00 AM", date: "Today", type: "Checkup" },
  { id: 2, doctor: "Dr. Johnson", time: "2:30 PM", date: "Tomorrow", type: "Follow-up" },
  { id: 3, doctor: "Dr. Brown", time: "9:00 AM", date: "Friday", type: "Consultation" },
]

const mockMedications = [
  { id: 1, name: "Paracetamol", dosage: "500mg", time: "8:00 AM", status: "taken" },
  { id: 2, name: "Vitamin D", dosage: "1000 IU", time: "12:00 PM", status: "pending" },
  { id: 3, name: "Blood Pressure Med", dosage: "10mg", time: "6:00 PM", status: "overdue" },
]

interface ReminderSystemProps {
  language: keyof typeof reminderTranslations
}

export default function ReminderSystem({ language }: ReminderSystemProps) {
  const [medications, setMedications] = useState(mockMedications)
  const t = reminderTranslations[language]

  const markAsTaken = (id: number) => {
    setMedications((prev) => prev.map((med) => (med.id === id ? { ...med, status: "taken" } : med)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "taken":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "taken":
        return t.taken
      case "pending":
        return t.pending
      case "overdue":
        return t.overdue
      default:
        return status
    }
  }

  return (
    <div className="grid gap-6">
      {/* Appointments */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            {t.upcomingAppointments}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{appointment.doctor}</p>
                    <p className="text-sm text-gray-600">{appointment.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{appointment.time}</p>
                  <Badge variant="outline">{appointment.date}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Medications */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-green-500" />
            {t.medications}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {medications.map((medication) => (
              <div key={medication.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Pill className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">{medication.name}</p>
                    <p className="text-sm text-gray-600">
                      {medication.dosage} at {medication.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(medication.status)}>{getStatusText(medication.status)}</Badge>
                  {medication.status !== "taken" && (
                    <Button size="sm" onClick={() => markAsTaken(medication.id)} className="flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      {t.taken}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Reminder Button */}
      <Button className="flex items-center gap-2 w-full sm:w-auto">
        <Plus className="h-4 w-4" />
        {t.addReminder}
      </Button>
    </div>
  )
}
