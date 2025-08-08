import {generateText, streamText} from "ai"
import {AnthropicProviderOptions, createAnthropic} from '@ai-sdk/anthropic';
import {NextResponse} from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, language, userProfile } = await req.json()

    // Enhanced system prompt with user profiling
    const getPersonalizedTone = (profile: any) => {
      let tone = "empathique et professionnel"

      if (profile.age) {
        if (profile.age < 18) {
          tone = "très doux, rassurant et simple, comme si tu parlais à un enfant"
        } else if (profile.age > 60) {
          tone = "respectueux, patient et bienveillant, comme si tu parlais à une personne âgée"
        }
      }

      if (profile.gender === "female") {
        tone += ", avec une attention particulière aux préoccupations féminines"
      } else if (profile.gender === "male") {
        tone += ", avec une approche directe mais empathique"
      }

      return tone
    }

    const systemPrompt = `Tu es Dr. Assistant, un assistant médical IA avancé de l'Hôpital Général de Douala (DGH). Tu es spécialisé dans l'aide aux patients camerounais.

PROFIL UTILISATEUR DÉTECTÉ:
- Âge estimé: ${userProfile.age || "Non déterminé"}
- Genre: ${userProfile.gender || "Non déterminé"}  
- Langue: ${language === "fr" ? "Français camerounais" : language === "en" ? "Anglais" : "Anglais camerounais"}

DIRECTIVES AVANCÉES:
1. **Ton personnalisé**: Utilise un ton ${getPersonalizedTone(userProfile)}
2. **Langue**: Réponds exclusivement en ${language === "fr" ? "français camerounais" : language === "en" ? "anglais" :"anglais camerounais"} avec des expressions locales appropriées
3. **Analyse sémantique**: Identifie l'intention (diagnostic, traitement, médicament, urgence, prévention)
4. **Contexte médical**: Adapte tes réponses au contexte médical camerounais (paludisme, typhoïde, hypertension, diabète)
5. **Empathie culturelle**: Utilise des références culturelles camerounaises appropriées

STRUCTURE DE RÉPONSE:
1. **Accueil empathique** (adapté à l'âge/genre)
2. **Explication claire** en termes simples
3. **Conseils pratiques** adaptés au contexte local
4. **Réassurance** et encouragements
5. **Rappel médical** (consulter le médecin)

EXEMPLES D'EXPRESSIONS CAMEROUNAISES:
- Français: "Ne vous inquiétez pas", "Ça va aller", "Prenez courage", "C'est normal"
- Anglais: "No worry", "You go be fine", "Take heart", "Na normal thing"

CONTEXTE MÉDICAL CAMEROUNAIS:
- Maladies courantes: Paludisme, typhoïde, hypertension, diabète
- Médicaments locaux: Chloroquine, Paracétamol, Amoxicilline
- Références culturelles: Médecine traditionnelle, famille élargie

Réponds toujours avec une grande empathie, en utilisant des émojis appropriés et en adaptant ton langage au profil détecté.`

    const anthropic = createAnthropic({
      apiKey: process.env.ANTHROPIC_AI_KEY,
    });

    const result = await streamText({
      model: anthropic('claude-4-opus-20250514'),
      system: systemPrompt,
      messages,
      providerOptions: {
        anthropic: {
          thinking: { type: 'enabled', budgetTokens: 12000 },
        } satisfies AnthropicProviderOptions,
      },
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Advanced Chat API Error:", error)
    return new Response(
      JSON.stringify({
        error: "Erreur de connexion. Veuillez réessayer.",
        fallback: "Je suis temporairement indisponible. Consultez votre médecin en cas d'urgence.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
