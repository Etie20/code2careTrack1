export interface Donor {
    id:               number;
    fullName:         string;
    contactNumber:    string;
    bloodType:        string;
    gender:           string;
    dateOfBirth:      Date;
    email:            string;
    address:          string;
    occupation:       string;
    registrationDate: Date;
    lastDonationDate: Date;
    medicalNotes:     string;
}