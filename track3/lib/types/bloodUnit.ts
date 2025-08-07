import {Donor} from "@/lib/types/donor";

export interface BloodUnit {
    unitId:           number;
    donor:            Donor;
    bloodType:        string;
    collectionDate:   Date;
    expirationDate:   Date;
    volumeMl:         number;
    componentType:    string;
    storageLocation:  string;
    currentStatus:    string;
    screening:        null;
    collectionCenter: string;
}

