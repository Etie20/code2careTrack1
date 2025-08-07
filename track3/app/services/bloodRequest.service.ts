import {environment} from "@/app/environment";
import {BloodRequest, Content} from "@/lib/types/bloodRequest";
import {BloodRequestStat} from "@/lib/types/bloodRequestStat";
import {BloodRequestDepartments} from "@/lib/types/bloodRequestDepartment";

const API_URL = environment.apiURL + "/demand";

export async function submitBloodRequest(data: Content): Promise<void> {

    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(
            Object.entries(data).filter(([key]) => key !== "id")
        )),
    })

    if (!res.ok) {
        const error = await res.text()
        throw new Error(error || "Erreur lors de l'envoi des données")
    }
}

export async function getBloodRequests(): Promise<BloodRequest> {
    const res = await fetch(`${API_URL}/search?query=`, {
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

export async function getBloodRequestStats(): Promise<BloodRequestStat> {
    const res = await fetch(`${API_URL}/stats`, {
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

export async function getBloodRequestDepartments(): Promise<BloodRequestDepartments[]> {
    const res = await fetch(`${API_URL}/departments`, {
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