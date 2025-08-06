"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar, Pill, Clock, Plus, Bell, Phone } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ReminderSystemProps {
  selectedLanguage: string
}

export default function ReminderSystem({ selectedLanguage }: ReminderSystemProps) {
  const [newReminder, setNewReminder] = useState({
    type: "",
    title: "",
    time: "",
    frequency: "",
  })

  const translations = {
    en: {
      title: "Reminder Management",
      subtitle: "Manage appointment and medication reminders",
      addReminder: "Add New Reminder",
      reminderType: "Reminder Type",
      appointment: "Appointment",
      medication: "Medication",
      reminderTitle: "Reminder Title",
      time: "Time",
      frequency: "Frequency",
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      create: "Create Reminder",
      activeReminders: "Active Reminders",
      upcoming: "Upcoming",
    },
    fr: {
      title: "Gestion des Rappels",
      subtitle: "Gérer les rappels de rendez-vous et de médicaments",
      addReminder: "Ajouter un Nouveau Rappel",
      reminderType: "Type de Rappel",
      appointment: "Rendez-vous",
      medication: "Médicament",
      reminderTitle: "Titre du Rappel",
      time: "Heure",
      frequency: "Fréquence",
      daily: "Quotidien",
      weekly: "Hebdomadaire",
      monthly: "Mensuel",
      create: "Créer un Rappel",
      activeReminders: "Rappels Actifs",
      upcoming: "À venir",
    },
    douala: {
      title: "Gestion Rappel",
      subtitle: "Gérer rappel rendez-vous na médicament",
      addReminder: "Ajouter Rappel Nouveau",
      reminderType: "Type Rappel",
      appointment: "Rendez-vous",
      medication: "Médicament",
      reminderTitle: "Titre Rappel",
      time: "Heure",
      frequency: "Fréquence",
      daily: "Chaque jour",
      weekly: "Chaque semaine",
      monthly: "Chaque mois",
      create: "Créer Rappel",
      activeReminders: "Rappel Actif",
      upcoming: "Na venir",
    },
  }

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en

  const reminders = [
    {
      id: 1,
      type: "medication",
      title: "Take Blood Pressure Medication",
      time: "08:00",
      frequency: "daily",
      nextDue: "Tomorrow 8:00 AM",
    },
    {
      id: 2,
      type: "appointment",
      title: "Cardiology Checkup",
      time: "14:30",
      frequency: "monthly",
      nextDue: "Dec 15, 2:30 PM",
    },
    {
      id: 3,
      type: "medication",
      title: "Diabetes Medication",
      time: "12:00",
      frequency: "daily",
      nextDue: "Today 12:00 PM",
    },
  ]

  const handleCreateReminder = () => {
    console.log("Creating reminder:", newReminder)
    setNewReminder({ type: "", title: "", time: "", frequency: "" })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Add New Reminder */}
      <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Plus className="w-5 h-5" />
            {t.addReminder}
          </CardTitle>
          <CardDescription>{t.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">{t.reminderType}</label>
            <Select value={newReminder.type} onValueChange={(value) => setNewReminder({ ...newReminder, type: value })}>
              <SelectTrigger className="bg-white/60 border-purple-200">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="appointment">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {t.appointment}
                  </div>
                </SelectItem>
                <SelectItem value="medication">
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4" />
                    {t.medication}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">{t.reminderTitle}</label>
            <Input
              value={newReminder.title}
              onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
              placeholder="Enter reminder title"
              className="bg-white/60 border-purple-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">{t.time}</label>
              <Input
                type="time"
                value={newReminder.time}
                onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                className="bg-white/60 border-purple-200"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">{t.frequency}</label>
              <Select
                value={newReminder.frequency}
                onValueChange={(value) => setNewReminder({ ...newReminder, frequency: value })}
              >
                <SelectTrigger className="bg-white/60 border-purple-200">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">{t.daily}</SelectItem>
                  <SelectItem value="weekly">{t.weekly}</SelectItem>
                  <SelectItem value="monthly">{t.monthly}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleCreateReminder}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t.create}
          </Button>
        </CardContent>
      </Card>

      {/* Active Reminders */}
      <Card className="bg-white/80 backdrop-blur-sm border-orange-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Bell className="w-5 h-5" />
            {t.activeReminders}
          </CardTitle>
          <CardDescription>Your scheduled reminders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="p-4 bg-white/60 rounded-lg border border-orange-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {reminder.type === "medication" ? (
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Pill className="w-5 h-5 text-blue-600" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-gray-800">{reminder.title}</h4>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {reminder.time} • {reminder.frequency}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {t.upcoming}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Next: {reminder.nextDue}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs bg-transparent">
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs bg-transparent">
                    <Bell className="w-3 h-3 mr-1" />
                    SMS
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
