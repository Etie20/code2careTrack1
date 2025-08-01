"use client"

import {Component, useState} from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Droplets,
  Brain,
  Shield,
  Users,
  TrendingUp,
  Heart,
  Activity,
  CheckCircle,
  ArrowRight,
  Star,
  Globe,
  Zap,
  Target,
  BarChart3,
  Clock,
} from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: Brain,
      title: "Intelligence Artificielle",
      description: "Prédictions précises de la demande avec 92% de précision",
      color: "from-purple-500 to-blue-600",
    },
    {
      icon: Activity,
      title: "Surveillance en Temps Réel",
      description: "Monitoring 24/7 des stocks avec alertes automatiques",
      color: "from-red-500 to-pink-600",
    },
    {
      icon: Users,
      title: "Gestion des Donneurs",
      description: "Base de données complète avec historique des donations",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: BarChart3,
      title: "Analytics Avancées",
      description: "Tableaux de bord interactifs et rapports détaillés",
      color: "from-orange-500 to-red-500",
    },
  ]

  const stats = [
    { number: "2,847", label: "Unités de Sang", icon: Droplets },
    { number: "1,234", label: "Donneurs Actifs", icon: Users },
    { number: "92%", label: "Précision IA", icon: Brain },
    { number: "24/7", label: "Surveillance", icon: Clock },
  ]

  const testimonials = [
    {
      name: "Dr. Marie Nkomo",
      role: "Directrice, Hôpital Central Yaoundé",
      content: "BloodBank AI a révolutionné notre gestion des stocks. Les prédictions sont remarquablement précises.",
      rating: 5,
    },
    {
      name: "Dr. Jean Fotso",
      role: "Chef de Service, Hôpital Laquintinie",
      content: "L'interface est intuitive et les alertes nous permettent d'anticiper les pénuries.",
      rating: 5,
    },
    {
      name: "Infirmière Alice Mballa",
      role: "Responsable Banque de Sang",
      content: "Un système complet qui simplifie énormément notre travail quotidien.",
      rating: 5,
    },
  ]


  class FeatureIcon extends Component<{ icon: any }> {
    render() {
      let {icon} = this.props;
      const IconComponent = icon
      return <IconComponent className="w-8 h-8 text-red-600 mx-auto mb-3"/>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-red-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 rounded-xl flex items-center justify-center">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                  BloodBank AI
                </h1>
                <p className="text-xs text-gray-600">Gestion Intelligente</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-600 hover:text-red-600 transition-colors">
                Fonctionnalités
              </a>
              <a href="#about" className="text-gray-600 hover:text-red-600 transition-colors">
                À Propos
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-red-600 transition-colors">
                Témoignages
              </a>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700">
                  Se Connecter
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-red-100 text-red-700 border-red-200">
              <Zap className="w-3 h-3 mr-1" />
              Nouvelle Génération de Gestion Sanguine
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
              BloodBank AI
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Révolutionnez la gestion de votre banque de sang avec l'intelligence artificielle.
              <br />
              <span className="text-red-600 font-semibold">
                Prédictions précises • Surveillance temps réel • Optimisation automatique
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-lg px-8 py-4"
                >
                  Commencer Maintenant
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-white/80 backdrop-blur-sm">
                Voir la Démo
                <Activity className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-white/80 backdrop-blur-sm border-red-100 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <stat.icon className="w-8 h-8 text-red-600 mx-auto mb-3" />
                    <p className="text-2xl font-bold text-gray-800">{stat.number}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
              <Target className="w-3 h-3 mr-1" />
              Fonctionnalités Avancées
            </Badge>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Tout ce dont vous avez besoin pour une gestion optimale
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Notre plateforme combine intelligence artificielle et interface intuitive pour révolutionner la gestion
              des banques de sang.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all duration-300 ${
                    activeFeature === index
                      ? "bg-white shadow-xl scale-105 border-red-200"
                      : "bg-white/80 hover:bg-white hover:shadow-lg"
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center`}
                      >
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="relative">
              <Card className="bg-gradient-to-br from-red-500 via-pink-500 to-rose-500 text-white shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      {features[activeFeature] && <FeatureIcon icon={features[activeFeature].icon} />}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{features[activeFeature]?.title}</h3>
                    <p className="text-red-100">{features[activeFeature]?.description}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-300" />
                      <span>Interface intuitive et moderne</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-300" />
                      <span>Alertes en temps réel</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-300" />
                      <span>Rapports automatisés</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-300" />
                      <span>Support multilingue</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-green-100 text-green-700 border-green-200">
                <Heart className="w-3 h-3 mr-1" />
                Notre Mission
              </Badge>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Sauver des vies grâce à la technologie</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                BloodBank AI est né de la volonté d'optimiser la gestion des banques de sang au Cameroun et en Afrique.
                Notre plateforme utilise l'intelligence artificielle pour prédire les besoins, réduire le gaspillage et
                assurer une disponibilité optimale du sang pour sauver des vies.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Sécurité et conformité médicale</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Globe className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Adapté au contexte africain</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700">Amélioration continue par IA</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-red-500 to-pink-600 text-white">
                <CardContent className="p-6 text-center">
                  <Droplets className="w-12 h-12 mx-auto mb-4" />
                  <p className="text-3xl font-bold">50K+</p>
                  <p className="text-red-100">Unités Gérées</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4" />
                  <p className="text-3xl font-bold">5K+</p>
                  <p className="text-blue-100">Donneurs Actifs</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                <CardContent className="p-6 text-center">
                  <Heart className="w-12 h-12 mx-auto mb-4" />
                  <p className="text-3xl font-bold">1K+</p>
                  <p className="text-green-100">Vies Sauvées</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
                <CardContent className="p-6 text-center">
                  <Activity className="w-12 h-12 mx-auto mb-4" />
                  <p className="text-3xl font-bold">99.9%</p>
                  <p className="text-orange-100">Disponibilité</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-yellow-100 text-yellow-700 border-yellow-200">
              <Star className="w-3 h-3 mr-1" />
              Témoignages
            </Badge>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Ce que disent nos utilisateurs</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des professionnels de santé qui font confiance à BloodBank AI pour optimiser leur gestion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Prêt à révolutionner votre banque de sang ?</h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Rejoignez les centaines d'établissements qui font déjà confiance à BloodBank AI pour optimiser leur gestion
            et sauver plus de vies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 text-lg px-8 py-4">
                Commencer Gratuitement
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-4 bg-transparent"
            >
              Planifier une Démo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">BloodBank AI</span>
              </div>
              <p className="text-gray-400">
                Révolutionner la gestion des banques de sang avec l'intelligence artificielle.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Tarifs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Formation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    À Propos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Carrières
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Presse
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BloodBank AI. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
