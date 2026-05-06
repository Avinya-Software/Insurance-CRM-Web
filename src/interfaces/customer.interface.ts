export interface CreateCustomerRequest {
  customerId?: string;
  title?: string;
  clientName: string;
  groupHeadName?: string;
  groupCode?: string;
  clientCategory?: string;
  fatherSpouseCompanyName?: string;
  primaryMobile: string;
  email: string;
  dob?: string;
  anniversaryDate?: string;
  age?: number;
  gender?: string;
  maritalStatus?: string;
  nationality?: string;
  birthPlace?: string;
  isPassedAway?: boolean;
  education?: string;
  referenceName?: string;
  notes?: string;
  remarks?: string;
  leadId?: string;

  occupation?: {
    occupationType?: string;
    designation?: string;
    grossIncome?: number;
    employerName?: string;
  };

  addresses?: {
    addressType?: string;
    isSameAsGroupHead?: boolean;
    houseFlatNumber?: string;
    buildingName?: string;
    street?: string;
    area?: string;
    landmark?: string;
    city?: string;
    cityId?: number;
    cityName?: string;
    pincode?: string;
    state?: string;
    stateId?: number;
    stateName?: string;
    country?: string;
    telephoneResidence?: string;
    telephoneOffice?: string;
    otherNumber?: string;
    mobileNumber?: string;
    email2?: string;
    website?: string;
  }[];

  identityDetails?: {
    aadharNumber?: string;
    panNumber?: string;
    gstNumber?: string;
    drivingLicenceNumber?: string;
    drivingLicenceExpDate?: string;
    ckycNumber?: string;
    eInsuranceNumber?: string;
    passportNumber?: string;
    passportExpDate?: string;
  };
}

export interface CustomerResponse {
  customerId: string;
  fullName: string;
  primaryMobile: string;
  email: string;
  address?: string;
  createdAt: string;
}
export interface CustomerDropdown {
  customerId: string;
  clientName: string;
  email: string | null;
  primaryMobile: string | null;
}
export interface Customer {
  customerId: string;
  title?: string;
  clientName: string;
  groupHeadName?: string;
  groupCode?: string;
  clientCategory?: string;
  fatherSpouseCompanyName?: string;

  primaryMobile: string;
  email: string;

  dob?: string | null;
  anniversary?: string | null;

  age?: number;
  gender?: string;
  maritalStatus?: string;
  nationality?: string;
  birthPlace?: string;

  isPassedAway?: boolean;
  education?: string;
  referenceName?: string;

  notes?: string;
  remarks?: string;

  address?: string;

  kycStatus?: string;
  kycFiles?: KycFile[] | null;

  occupation?: Occupation | null;
  identityDetails?: IdentityDetails | null;
  addresses?: Address[] | null;
  createdAt: string;
}

export interface Address {
  addressType: "RESIDENCE" | "OFFICE" | "OVERSEAS";
  houseFlatNumber?: string | null;
  buildingName?: string | null;
  street?: string | null;
  area?: string | null;
  landmark?: string | null;
  city?: string | null;
  cityId?: number | null;
  cityName?: string | null;
  pincode?: string | null;
  state?: string | null;
  stateId?: number | null;
  stateName?: string | null;
  country?: string | null;

  telephoneResidence?: string | null;
  telephoneOffice?: string | null;
  otherNumber?: string | null;
  mobileNumber?: string | null;

  email2?: string | null;
  website?: string | null;

  isSameAsGroupHead?: boolean;
}

export interface CustomerCampaign {
  CampaignCustomerId: string;
  CampaignId: string;
  Name: string;
  CampaignType: string;
  StartDate: string | null;
  EndDate: string | null;
}

export interface CustomerPagedResponse {
  data: any;
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  customers: Customer[];
}

export interface CustomerDetailsProps {
  customerId: string;
  onClose: () => void;
}

export interface CustomerDetailsResponse {
  statusCode: number;
  statusMessage: string;
  data: CustomerDetails;
}

export interface CustomerDetails {
  customerId: string;
  title: string;
  clientName: string;
  groupHeadName: string | null;
  groupCode: string | null;
  clientCategory: string | null;
  fatherSpouseCompanyName: string | null;
  primaryMobile: string;
  email: string | null;
  dob: string | null;
  age: number;
  anniversaryDate: string | null;
  gender: string | null;
  maritalStatus: string | null;
  nationality: string | null;
  birthPlace: string | null;
  kycStatusId: string | null;
  kycStatus: string | null;
  isPassedAway: boolean;
  education: string | null;
  referenceName: string | null;
  notes: string | null;
  remarks: string | null;
  createdAt: string;
  updatedAt: string | null;
  kycFiles: KycFile[];
  occupation: Occupation;
  addresses: Address[];
  identityDetails: IdentityDetails;
}

export interface IdentityDetails {
  aadharNumber?: string | null;
  panNumber?: string | null;
  gstNumber?: string | null;
  drivingLicenceNumber?: string | null;
  drivingLicenceExpDate?: string | null;
  ckycNumber?: string | null;
  eInsuranceNumber?: string | null;
  passportNumber?: string | null;
  passportExpDate?: string | null;
}

export interface Occupation {
  occupationType?: string | null;
  designation?: string | null;
  grossIncome?: number | null;
  employerName?: string | null;
}


export interface KycFile {
  id: string;
  fileName: string;
  url: string;
  uploadedAt?: string;
  documentName?: string | null;
}

