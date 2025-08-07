// services/api/user.ts
import axios from 'axios';
import {BloodStat} from "@/lib/types/bloodStat";
import {BloodBanckSummaryStat} from "@/lib/types/bloodBanckSummaryStat";
import {BloodUnitSummary} from "@/lib/types/bloodUnitSummary";
import {BloodUnit} from "@/lib/types/bloodUnit";


const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://code2caretrack1.onrender.com/api';
export const getBloodStats = async () : Promise<BloodStat[]> => {
    try {
        const response = await axios.get<BloodStat[]>(`${BASE_URL}/bloodUnit/stat`);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || 'Failed to fetch BloodUnit Summary');
    }
}

export const getBloodBanckStats = async () : Promise<BloodBanckSummaryStat> => {
    try {
        const response = await axios.get<BloodBanckSummaryStat>(`${BASE_URL}/bloodUnit/banckSummary`);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || 'Failed to fetch BloodUnit Summary');
    }
}

export const getBloodUnitSummary = async () : Promise<BloodUnitSummary> => {
    try {
        const response = await axios.get(`${BASE_URL}/bloodUnit/summary`);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || 'Failed to fetch BloodUnit Summary');
    }
}

export const getBloodUnits = async () : Promise<BloodUnit> => {
    try {
        const response = await axios.get(`${BASE_URL}/bloodUnit/search?query=`);
        console.log(response.data);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || 'Failed to fetch BloodUnits');
    }
}
