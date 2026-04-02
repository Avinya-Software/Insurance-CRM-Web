export interface FamilyMemberDocument {
  familyMemberDocumentId: string;
  familyMemberId: string;
  documentType: string;
  filePath: string;
  originalFileName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface IFamilyMember {
  familyMemberId: string;
  familyHeadId: string;
  relationWithFamilyHead: string;
  firstName: string;
  middleName: string;
  lastName: string;
  mobileNumber: string;
  whatsappNumber: string;
  gender: string;
  dob: string;
  anniversaryDate: string;
  businessType: number;
  aadhaarCardNumber: string;
  panCardNumber: string;
  gstNumber: string;
  marriageStatus: string;
  createdAt: string;
  updatedAt: string;
  documents: FamilyMemberDocument[];
}

export interface FamilyMemberFilterParams {
  familyHeadId?: string;
  search?: string;
  relationWithFamilyHead?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export interface FamilyMemberResponse {
  statusCode: number;
  statusMessage: string;
  data: {
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    data: IFamilyMember[];
  };
}

export interface AddFamilyMemberRequest {
  FamilyHeadId: string;
  RelationWithFamilyHead: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  MobileNumber: string;
  WhatsappNumber: string;
  Gender: string;
  DOB: string;
  AnniversaryDate: string;
  BusinessType: number;
  AadhaarCardNumber: string;
  PanCardNumber: string;
  GSTNumber: string;
  MarriageStatus: string;
  AadhaarCardDocument?: File | null;
  PanCardDocument?: File | null;
  GSTDocument?: File | null;
  ProfilePhoto?: File | null;
}

export interface FamilyMemberDropdownItem {
  familyMemberId: string;
  fullName: string;
  dob: string;
}

export interface FamilyMemberDropdownResponse {
  statusCode: number;
  statusMessage: string;
  data: FamilyMemberDropdownItem[];
}
