// /app/donors/donor.service.ts
import type { DonorData } from "@/lib/types/donor"
import { environment } from "../environment";

const API_URL = environment.apiURL + "/api/donor";

export async function submitDonor(data: DonorData): Promise<void> {

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


export async function getDonors(): Promise<DonorData[]> {
    const res = await fetch(`${API_URL}/search`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!res.ok) {
        const error = await res.text()
        throw new Error(error || "Erreur lors de la récupération des donneurs")
    }

    const data = await res.json()
    return data.content
}