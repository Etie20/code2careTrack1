import {BloodRequestDepartments} from "@/lib/types/bloodRequestDepartment";

export interface BloodRequest {
    content:       Content[];
    pageNumber:    number;
    pageSize:      number;
    totalElements: number;
    totalPages:    number;
    last:          boolean;
}

export interface Content {
    id:            number;
    department:    BloodRequestDepartments;
    personnel:     Personnel;
    bloodType:     string;
    demandType:    string;
    componentType: string;
    status:        string;
    note:          string;
    volumeNeeded:  number;
    requestedDate: Date;
    dueDate:       Date;
}

export interface Personnel {
    id:           number;
    username:     string;
    passwordHash: string;
    fullName:     string;
    email:        string;
    role:         string;
    department:   BloodRequestDepartments;
}