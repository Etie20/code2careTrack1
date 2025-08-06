export interface PatientModel {
  id?: number; // facultatif lors de la création
  fullName: string;
  age: number;
  department: string;
  phoneNumber: string;
  createdAt: string; // ISO string
  preferredLanguage: string;
  email: {
    value: string;
  };
}
