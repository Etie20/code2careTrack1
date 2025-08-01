"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { User, Heart, Pill, AlertCircle, Edit, Save, X } from "lucide-react"

interface PatientProfileProps {
  selectedLanguage: string
}

export default function PatientProfile({ selectedLanguage }: PatientProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Marie Dubois",
    age: 45,
    conditions: ["Hypertension", "Type 2 Diabetes"],
    medications: ["Metformin 500mg", "Lisinopril 10mg"],
    allergies: ["Penicillin", "Shellfish"],
    emergencyContact: "+237 6XX XXX XXX",
    preferredLanguage: "French",
    lastVisit: "2024-01-15",
  })

  const translations = {
    en: {
      title: "Patient Profile",
      subtitle: "Your personal health information",
      personalInfo: "Personal Information",
      healthInfo: "Health Information",
      preferences: "Preferences",
      name: "Full Name",
      age: "Age",
      conditions: "Medical Conditions",
      medications: "Current Medications",
      allergies: "Allergies",
      emergencyContact: "Emergency Contact",
      preferredLanguage: "Preferred Language",
      lastVisit: "Last Visit",
      edit: "Edit Profile",
      save: "Save Changes",
      cancel: "Cancel",
      noConditions: "No medical conditions recorded",
      noMedications: "No medications recorded",
      noAllergies: "No allergies recorded",
    },
    fr: {
      title: "Profil Patient",
      subtitle: "Vos informations de santé personnelles",
      personalInfo: "Informations Personnelles",
      healthInfo: "Informations de Santé",
      preferences: "Préférences",
      name: "Nom Complet",
      age: "Âge",
      conditions: "Conditions Médicales",
      medications: "Médicaments Actuels",
      allergies: "Allergies",
      emergencyContact: "Contact d'Urgence",
      preferredLanguage: "Langue Préférée",
      lastVisit: "Dernière Visite",
      edit: "Modifier le Profil",
      save: "Sauvegarder",
      cancel: "Annuler",
      noConditions: "Aucune condition médicale enregistrée",
      noMedications: "Aucun médicament enregistré",
      noAllergies: "Aucune allergie enregistrée",
    },
    douala: {
      title: "Profil Malade",
      subtitle: "Information santé personnel na yo",
      personalInfo: "Information Personnel",
      healthInfo: "Information Santé",
      preferences: "Préférence",
      name: "Nom Complet",
      age: "Âge",
      conditions: "Condition Médical",
      medications: "Médicament Actuel",
      allergies: "Allergie",
      emergencyContact: "Contact Urgence",
      preferredLanguage: "Langue Préféré",
      lastVisit: "Visite Dernier",
      edit: "Modifier Profil",
      save: "Sauvegarder",
      cancel: "Annuler",
      noConditions: "Pas condition médical enregistré",
      noMedications: "Pas médicament enregistré",
      noAllergies: "Pas allergie enregistré",
    },
  }

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en

  const handleSave = () => {
    setIsEditing(false)
    // Save profile logic would go here
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset profile to original state
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Personal Information */}
      <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <User className="w-5 h-5" />
              {t.personalInfo}
            </CardTitle>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                {t.edit}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  {t.cancel}
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  {t.save}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-10 h-10 text-white" />
            </div>
            {isEditing ? (
              <Input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="text-center font-semibold"
              />
            ) : (
              <h3 className="text-xl font-semibold text-gray-800">{profile.name}</h3>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">{t.age}</label>
              {isEditing ? (
                <Input
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: Number.parseInt(e.target.value) })}
                  className="mt-1"
                />
              ) : (
                <p className="text-gray-800">{profile.age} years</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">{t.emergencyContact}</label>
              {isEditing ? (
                <Input
                  value={profile.emergencyContact}
                  onChange={(e) => setProfile({ ...profile, emergencyContact: e.target.value })}
                  className="mt-1"
                />
              ) : (
                <p className="text-gray-800">{profile.emergencyContact}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">{t.preferredLanguage}</label>
              <p className="text-gray-800">{profile.preferredLanguage}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">{t.lastVisit}</label>
              <p className="text-gray-800">{new Date(profile.lastVisit).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Information */}
      <div className="lg:col-span-2 space-y-6">
        {/* Medical Conditions */}
        <Card className="bg-white/90 backdrop-blur-sm border-red-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              {t.conditions}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile.conditions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.conditions.map((condition, index) => (
                  <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    {condition}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">{t.noConditions}</p>
            )}
          </CardContent>
        </Card>

        {/* Current Medications */}
        <Card className="bg-white/90 backdrop-blur-sm border-green-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Pill className="w-5 h-5" />
              {t.medications}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile.medications.length > 0 ? (
              <div className="space-y-2">
                {profile.medications.map((medication, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
                  >
                    <Pill className="w-4 h-4 text-green-600" />
                    <span className="text-green-800 font-medium">{medication}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">{t.noMedications}</p>
            )}
          </CardContent>
        </Card>

        {/* Allergies */}
        <Card className="bg-white/90 backdrop-blur-sm border-orange-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="w-5 h-5" />
              {t.allergies}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile.allergies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.allergies.map((allergy, index) => (
                  <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {allergy}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">{t.noAllergies}</p>
            )}
          </CardContent>
        </Card>

        {/* Health Metrics */}
        <Card className="bg-white/90 backdrop-blur-sm border-purple-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Heart className="w-5 h-5" />
              Health Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-800">120/80</p>
                <p className="text-xs text-purple-600">Blood Pressure</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-800">98</p>
                <p className="text-xs text-blue-600">Heart Rate</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-800">7.2</p>
                <p className="text-xs text-green-600">Blood Sugar</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-800">68kg</p>
                <p className="text-xs text-orange-600">Weight</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
