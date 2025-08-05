// /app/donors/donor.service.ts
import type { DonorData } from "@/lib/types/donor"
import { environment } from "../environment";

export async function submitDonor(data: DonorData): Promise<void> {
    const API_URL = environment.apiURL + "/api/donor";

    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })

    if (!res.ok) {
        const error = await res.text()
        throw new Error(error || "Erreur lors de l'envoi des données")
    }
}
