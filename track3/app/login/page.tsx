"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Droplets,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Users,
  Activity,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginType, setLoginType] = useState("admin") // admin, doctor, technician
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulation de connexion
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard") // Redirection vers le dashboard
    }, 2000)
  }

  const loginTypes = [
    {
      id: "admin",
      title: "Administrateur",
      description: "Accès complet au système",
      icon: Shield,
      color: "from-red-500 to-pink-600",
    },
    {
      id: "doctor",
      title: "Médecin",
      description: "Gestion des demandes et patients",
      icon: Users,
      color: "from-blue-500 to-purple-600",
    },
    {
      id: "technician",
      title: "Technicien",
      description: "Gestion des stocks et inventaire",
      icon: Activity,
      color: "from-green-500 to-emerald-600",
    },
  ]

  const features = [
    "Surveillance temps réel des stocks",
    "Prédictions IA avec 92% de précision",
    "Gestion complète des donneurs",
    "Alertes automatiques critiques",
    "Rapports et analytics avancés",
    "Interface multilingue",
  ]

  // @ts-ignore
  // @ts-ignore
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              href="/landing"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à l'accueil
            </Link>

            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Droplets className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                  BloodBank AI
                </h1>
                <p className="text-sm text-gray-600">Connexion Sécurisée</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-2">Bienvenue</h2>
            <p className="text-gray-600">Connectez-vous pour accéder à votre tableau de bord</p>
          </div>

          {/* Login Type Selection */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Type de compte</p>
            <div className="grid grid-cols-3 gap-2">
              {loginTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setLoginType(type.id)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    loginType === type.id
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <type.icon
                    className={`w-5 h-5 mx-auto mb-1 ${loginType === type.id ? "text-red-600" : "text-gray-500"}`}
                  />
                  <p className={`text-xs font-medium ${loginType === type.id ? "text-red-700" : "text-gray-600"}`}>
                    {type.title}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <Card className="bg-white/80 backdrop-blur-sm border-red-100 shadow-lg">
            <CardContent className="p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Adresse email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="pl-10 bg-white/80 border-red-200 focus:border-red-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-white/80 border-red-200 focus:border-red-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember"
                              checked={rememberMe}
                              onCheckedChange={setRememberMe}/>
                    <label htmlFor="remember" className="text-sm text-gray-600">
                      Se souvenir de moi
                    </label>
                  </div>
                  <a href="#" className="text-sm text-red-600 hover:text-red-700">
                    Mot de passe oublié ?
                  </a>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 py-3"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Connexion en cours...
                    </div>
                  ) : (
                    "Se connecter"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Demo Accounts */}
          <Card className="mt-6 bg-blue-50/80 backdrop-blur-sm border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Comptes de démonstration</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-blue-700">Admin:</span>
                  <span className="text-blue-600">admin@bloodbank.ai / admin123</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Médecin:</span>
                  <span className="text-blue-600">doctor@bloodbank.ai / doctor123</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Technicien:</span>
                  <span className="text-blue-600">tech@bloodbank.ai / tech123</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{" "}
              <a href="#" className="text-red-600 hover:text-red-700 font-medium">
                Demander un accès
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Features & Info */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-red-500 via-pink-500 to-rose-500 text-white p-8 items-center">
        <div className="max-w-lg">
          <div className="mb-8">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <CheckCircle className="w-3 h-3 mr-1" />
              Plateforme Certifiée
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Gestion Intelligente des Banques de Sang</h2>
            <p className="text-red-100 text-lg leading-relaxed">
              Optimisez votre gestion avec notre plateforme alimentée par l'IA. Prédictions précises, surveillance temps
              réel et interface intuitive.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-red-100">{feature}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold">2,847</p>
              <p className="text-red-200 text-sm">Unités Gérées</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">92%</p>
              <p className="text-red-200 text-sm">Précision IA</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">24/7</p>
              <p className="text-red-200 text-sm">Surveillance</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Sécurité Maximale</span>
            </div>
            <p className="text-red-100 text-sm">
              Chiffrement de bout en bout, authentification multi-facteurs et conformité aux normes médicales
              internationales.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
