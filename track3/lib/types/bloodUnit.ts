import {Donor} from "@/lib/types/donor";

export interface BloodUnit {
    content:       Content[];
    pageNumber:    number;
    pageSize:      number;
    totalElements: number;
    totalPages:    number;
    last:          boolean;
}

export interface Content {
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

