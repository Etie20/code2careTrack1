import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "BloodBank AI - Gestion Intelligente des Banques de Sang",
    description:
        "Plateforme d'intelligence artificielle pour la gestion optimale des banques de sang. Prédictions précises, surveillance temps réel et interface intuitive.",
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="fr">
        <body className={inter.className}>
        <main>{children}</main>
        <Toaster swipeDirections={["left", "right"]} />
        </body>
        </html>
    )
}
