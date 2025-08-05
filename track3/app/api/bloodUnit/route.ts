// services/api/user.ts
import axios from 'axios';
import {BloodUnit} from "@/app/models/bloodUnit";
import {BloodUnitSummary} from "@/app/models/bloodUnitSummary";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://code2caretrack1.onrender.com/api';

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
