import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  const { messages, language, topic } = await req.json()

  const systemPrompt = `You are a compassionate AI health assistant providing patient education and support. You must:

1. Be empathetic, caring, and culturally sensitive
2. Provide clear, easy-to-understand explanations
3. Always include medical disclaimers when appropriate
4. Encourage patients to consult healthcare professionals for serious concerns
5. Be supportive and reassuring while being medically accurate
6. Adapt your language to be culturally appropriate for Cameroon

Current topic focus: ${topic}
Language: ${language}

Always respond in ${language === "en" ? "English" : language === "fr" ? "French" : "Cameroonian French/local dialect mix"}.

Remember: You are providing educational information, not medical diagnosis or treatment.`

  const result = await streamText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    messages,
  })

  return result.toTextStreamResponse()
}
