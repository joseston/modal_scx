export type Gender = 'female' | 'male';

export interface PatientFormData {
  historyNumber: string;
  documentType: 'DNI' | 'CE' | 'Pasaporte';
  documentNumber: string;
  names: string;
  lastNames: string;
  birthDate: string;
  sex: Gender;
  phone: string;
  email: string;
  occupation: string;
  maritalStatus: string;
  race: string;
  ethnicity: string;
  city: string;
  district: string;
  address: string;
}
