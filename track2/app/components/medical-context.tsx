"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface MedicalContextType {
  userProfile: {
    age?: number
    gender?: "male" | "female" | "unknown"
    language: "fr" | "en"
    medicalHistory?: string[]
    currentSymptoms?: string[]
  }
  updateProfile: (updates: Partial<MedicalContextType["userProfile"]>) => void
  conversationContext: {
    intent?: "diagnosis" | "treatment" | "medication" | "emergency" | "prevention"
    confidence?: number
    previousTopics?: string[]
  }
  updateContext: (updates: Partial<MedicalContextType["conversationContext"]>) => void
}

const MedicalContext = createContext<MedicalContextType | undefined>(undefined)

export function MedicalProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<MedicalContextType["userProfile"]>({
    language: "fr",
    gender: "unknown",
  })

  const [conversationContext, setConversationContext] = useState<MedicalContextType["conversationContext"]>({})

  const updateProfile = (updates: Partial<MedicalContextType["userProfile"]>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }))
  }

  const updateContext = (updates: Partial<MedicalContextType["conversationContext"]>) => {
    setConversationContext((prev) => ({ ...prev, ...updates }))
  }

  return (
    <MedicalContext.Provider
      value={{
        userProfile,
        updateProfile,
        conversationContext,
        updateContext,
      }}
    >
      {children}
    </MedicalContext.Provider>
  )
}

export function useMedicalContext() {
  const context = useContext(MedicalContext)
  if (context === undefined) {
    throw new Error("useMedicalContext must be used within a MedicalProvider")
  }
  return context
}
