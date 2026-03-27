export type KycStatus = 'unverified' | 'pending_review' | 'approved';

export interface KycFormValues {
  fullName: string;
  nicNumber: string;
  dateOfBirth: string;
  gender: string;
  propertyName: string;
  fullAddress: string;
  mapsLink: string;
  parkingType: string;
  numberOfSlots: string;
  supportedVehicleTypes: string[];
  ownershipDocumentType: string;
  agreementAccepted: boolean;
}

export interface KycDocumentFiles {
  nicFront: File | null;
  nicBack: File | null;
  selfie: File | null;
  legalDocument: File | null;
  utilityBill: File | null;
}

export const initialKycFormValues: KycFormValues = {
  fullName: '',
  nicNumber: '',
  dateOfBirth: '',
  gender: '',
  propertyName: '',
  fullAddress: '',
  mapsLink: '',
  parkingType: '',
  numberOfSlots: '',
  supportedVehicleTypes: [],
  ownershipDocumentType: '',
  agreementAccepted: false,
};

export const initialKycDocumentFiles: KycDocumentFiles = {
  nicFront: null,
  nicBack: null,
  selfie: null,
  legalDocument: null,
  utilityBill: null,
};