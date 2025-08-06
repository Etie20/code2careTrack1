import { environment } from "../environment";
import {BloodUnit, Content} from "@/lib/types/bloodUnit";
import {BloodUnitSummary} from "@/lib/types/bloodUnitSummary";

const API_URL = environment.apiURL + "/api/bloodUnit";

export async function submitBloodUnit(data: Content): Promise<void> {

    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(
            Object.entries(data).filter(([key]) => key !== "unitId")
        )),
    })

    if (!res.ok) {
        const error = await res.text()
        throw new Error(error || "Erreur lors de l'envoi des données")
    }
}


export async function getBloodUnits(): Promise<BloodUnit> {
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
    return data
}

export async function getBloodUnitSummary(): Promise<BloodUnitSummary> {
    const res = await fetch(`${API_URL}/summary`, {
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
    console.log(data)
    return data
}
