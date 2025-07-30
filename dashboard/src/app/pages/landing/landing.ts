import {Component, inject} from '@angular/core';
import {
  ArrowRight,
  Badge,
  Bell,
  Globe,
  Heart,
  LucideAngularModule,
  MessageSquare, Play,
  Shield,
  Star,
  Users
} from 'lucide-angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [
    LucideAngularModule
  ],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {
  router = inject(Router);

  features = [
    {
      icon: MessageSquare,
      title: "Patient Feedback System",
      description:
        "Collect and analyze patient feedback with multilingual support including local Cameroonian languages.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Bell,
      title: "Smart Reminders",
      description: "Automated appointment and medication reminders via SMS, voice calls, and email.",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Users,
      title: "Patient Management",
      description: "Comprehensive dashboard for managing patient information and healthcare workflows.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Support for English, French, and local Cameroonian languages (Duálá, Bassa, Ewondo).",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "HIPAA-compliant security measures to protect sensitive patient information.",
      color: "from-red-500 to-red-600",
    },
    {
      icon: Star,
      title: "Analytics Dashboard",
      description: "Real-time insights and analytics to improve healthcare service quality.",
      color: "from-yellow-500 to-yellow-600",
    },
  ]

  testimonials = [
    {
      name: "Dr. Sarah Mbeki",
      role: "Chief Medical Officer",
      hospital: "Yaoundé General Hospital",
      content:
        "This system has revolutionized how we collect patient feedback. The multilingual support is particularly valuable for our diverse patient population.",
      rating: 5,
    },
    {
      name: "Dr. Jean-Paul Kamga",
      role: "Cardiologist",
      hospital: "Douala Medical Center",
      content:
        "The reminder system has significantly improved our appointment attendance rates. Patients love the voice reminders in their local language.",
      rating: 5,
    },
    {
      name: "Nurse Marie Nkomo",
      role: "Head Nurse",
      hospital: "Bamenda Regional Hospital",
      content: "Easy to use interface and the analytics help us identify areas for improvement in patient care.",
      rating: 5,
    },
  ]

  stats = [
    { number: "10,000+", label: "Patients Served" },
    { number: "50+", label: "Healthcare Facilities" },
    { number: "95%", label: "Patient Satisfaction" },
    { number: "24/7", label: "System Availability" },
  ]
  protected readonly Heart = Heart;
  protected readonly Badge = Badge;
  protected readonly ArrowRight = ArrowRight;
  protected readonly Play = Play;

  createRange(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  protected readonly Star = Star;
}
