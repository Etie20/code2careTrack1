import {environment} from "@/app/environment";
import {BloodForecast} from "@/lib/types/forecast";

const API_URL = environment.analysisURL + "blood-forecast/";

export async function getForecast(): Promise<BloodForecast> {
    const res = await fetch(API_URL, {
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
