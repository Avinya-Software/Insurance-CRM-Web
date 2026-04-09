import React, { useState, useEffect } from "react";
import {
  X, ChevronRight, ChevronDown, Plus, Trash2,
  ShieldCheck, Car, Activity, CreditCard, Users,
  UploadCloud, FileText, Eye, Download, AlertCircle
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Spinner from "../common/Spinner";
import { useUpsertPolicy } from "../../hooks/policy/useUpsertPolicy";
import { useUpdateGeneralPolicy } from "../../hooks/policy/useUpdateGeneralPolicy";
import { useCustomerDropdown } from "../../hooks/customer/useCustomerDropdown";
import { useFamilyMemberDropdown } from "../../hooks/family-member/useFamilyMemberDropdown";
import { useDivisionDropdown } from "../../hooks/division/useDivisionDropdown";
import { useGeneralPolicyById } from "../../hooks/policy/usePolicies";
import { useSegmentDropdown } from "../../hooks/segment/useSegmentDropdown";
import { useUploadPolicyDocument } from "../../hooks/LifePolicy/useUploadPolicyDocument";
import { usePolicyDocumentActions } from "../../hooks/LifePolicy/usePolicyDocumentActions";
import SearchableComboBox from "../common/SearchableComboBox";

type TabType = "customer" | "policy" | "premium" | "documents";

/* ─── OPTION LISTS ──────────────────────────────────────────── */
const FAMILY_GROUP_OPTIONS   = [{ id: "7b5f1c5d-92b3-4a0d-9f5f-123456789abc", name: "Family Group A" }];
const HOLDER_OPTIONS         = [{ id: "7b5f1c5d-92b3-4a0d-9f5f-123456789abc", name: "Anant Jaiswal" }];
const GENDER_OPTIONS         = [{ id: "Male", name: "Male" }, { id: "Female", name: "Female" }, { id: "Other", name: "Other" }];
const RELATION_OPTIONS       = [{ id: "Self", name: "Self" }, { id: "Spouse", name: "Spouse" }, { id: "Son", name: "Son" }, { id: "Daughter", name: "Daughter" }, { id: "Father", name: "Father" }, { id: "Mother", name: "Mother" }];
const DIVISION_OPTIONS       = [{ id: "Health", name: "Health Insurance" }, { id: "OtherGeneral", name: "Other General Insurance" }, { id: "Vehicle", name: "Vehicle Insurance" }];
const POLICY_TYPE_OPTIONS    = [{ id: "FamilyFloter", name: "Family Floter" }, { id: "Package", name: "Package Policy" }];
const COMPANY_OPTIONS        = [{ id: "7b5f1c5d-92b3-4a0d-9f5f-123456789abc", name: "Acko General Insurance Limited" }, { id: "7b5f1c5d-92b3-4a0d-9f5f-123456789abc", name: "Bajaj General" }];
const BRANCH_OPTIONS         = [{ id: "7b5f1c5d-92b3-4a0d-9f5f-123456789abc", name: "Althan" }];
const PRODUCT_OPTIONS        = [{ id: "7b5f1c5d-92b3-4a0d-9f5f-123456789abc", name: "Product X" }];
const ZONE_OPTIONS           = [{ id: "Zone I", name: "Zone I" }, { id: "Zone II", name: "Zone II" }];
const POLICY_MODE_OPTIONS    = [
  { id: "7b5f1c5d-92b3-4a0d-9f5f-123456789abc", name: "Yearly" },
  { id: "7b5f1c5d-92b3-4a0d-9f5f-123456789abd", name: "Half Yearly" },
  { id: "7b5f1c5d-92b3-4a0d-9f5f-123456789abe", name: "Quarterly" },
  { id: "7b5f1c5d-92b3-4a0d-9f5f-123456789abf", name: "Monthly" }
];
const OPT_COVER_OPTIONS      = [{ id: "NoClaim", name: "No Claim Bonus Protection" }, { id: "PA", name: "Personal Accident" }];
const ADD_ON_OPTIONS         = [{ id: "ZeroDepreciation", name: "Zero Depreciation" }, { id: "RoadsideAssist", name: "Roadside Assistance" }];
const BROKER_OPTIONS         = [{ id: "7b5f1c5d-92b3-4a0d-9f5f-123456789abc", name: "Rajeshbhai" }];
const AGENCY_OPTIONS         = [{ id: "7b5f1c5d-92b3-4a0d-9f5f-123456789abc", name: "Jk" }];
const SUB_AGENT_OPTIONS      = [{ id: "7b5f1c5d-92b3-4a0d-9f5f-123456789abc", name: "Seni" }];
const NOMINEE_OPTIONS        = [{ id: "7b5f1c5d-92b3-4a0d-9f5f-123456789abc", name: "Anant Jaiswal" }];
const PAID_BY_OPTIONS        = [{ id: "Cash", name: "Cash" }, { id: "Online", name: "Online" }, { id: "Cheque", name: "Cheque" }];
const VEHICLE_USE_OPTIONS    = [{ id: "Private", name: "Private" }, { id: "Commercial", name: "Commercial" }];
const VEHICLE_CLASS_OPTIONS  = [{ id: "Misc", name: "Miscellaneous" }, { id: "2W", name: "Two Wheeler" }, { id: "4W", name: "Four Wheeler" }];
const FUEL_TYPE_OPTIONS      = [{ id: "Petrol", name: "Petrol" }, { id: "Diesel", name: "Diesel" }, { id: "Electric", name: "Electric" }, { id: "CNG", name: "CNG" }];
const RTO_OPTIONS            = [{ id: "GJ05", name: "GJ-05 Surat" }];
const NCB_OPTIONS            = [{ id: "0", name: "0%" }, { id: "20", name: "20%" }, { id: "25", name: "25%" }, { id: "35", name: "35%" }];
const TP_MODE_OPTIONS        = [{ id: "Yearly", name: "Yearly" }, { id: "2Year", name: "2 Years" }, { id: "3Year", name: "3 Years" }];
const BANK_OPTIONS           = [{ id: "7b5f1c5d-92b3-4a0d-9f5f-123456789abc", name: "SBI Bank" }, { id: "7b5f1c5d-92b3-4a0d-9f5f-123456789abc", name: "HDFC Bank" }];
const DOCUMENT_OPTIONS = [
  { id: "Policy Copy", name: "Policy Copy" },
  { id: "Proposal Form", name: "Proposal Form" },
  { id: "Aadhar Card", name: "Aadhar Card" },
  { id: "PAN Card", name: "PAN Card" },
  { id: "Previous Policy", name: "Previous Policy" },
  { id: "RC Copy", name: "RC Copy" },
  { id: "Driving License", name: "Driving License" },
  { id: "Others", name: "Others" },
];

/* ─── INITIAL FORM ──────────────────────────────────────────── */
const makeInitial = () => ({
  type: "Fresh",
  transactionDate: new Date().toISOString().split("T")[0],
  documentNumber: "",
  familyGroupId: "",
  policyHolderId: "",
  firstName: "",
  middleName: "",
  lastName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  area: "",
  mobileNumber: "",
  gender: "",
  email: "",
  dob: "",
  relationWithHead: "Self",
  detail: {
    divisionType: "Health",
    divisionId: "",
    segmentId: "",
    policyType: "",
    insuranceCompanyId: "",
    branchId: "",
    productId: "",
    zone: "",
    optionalCover: [] as string[],
    addOns: [] as string[],
    isPolicyReceived: false,
    currentPolicyNumber: "",
    previousPolicyNumber: "",
    policyModeId: "",
    riskStartDate: "",
    riskEndDate: "",
    brokerId: "",
    agencyId: "",
    subAgentId: "",
    nomineeName: "",
    nomineeContact: "",
    remarks: "",
    vehicleUse: "",
    vehicleClass: "",
    tpPolicyMode: "",
    tpDueDate: "",
    bankId: "",
  },
  members: [] as { memberId: string | null; memberName: string }[],
  riskLocations: [] as { srNo: number; sumAssured: number; riskAddress: string }[],
  vehicle: {
    vehicleNumber: "",
    vehicleName: "",
    engineNo: "",
    chassisNo: "",
    brand: "",
    fuelType: "",
    registerDate: "",
    manufactureYear: "",
    rto: "",
    cc: "",
    gvw: "",
    ncb: "",
    fitnessCertificate: false,
    bhSeries: false,
  },
  premium: {
    sumAssured: 0,
    idvValue: 0,
    basicPremium: 0,
    tpaPremium: 0,
    taxAmount: 0,
    totalPremium: 0,
    isCommission: false,
    commissionableAmount: 0,
    commissionEntry: 0,
    commitmentAmount: 0,
  },
  payment: {
    paidByClient: "",
    clientAmount: 0,
    paidByAgent: "",
    agentAmount: 0,
  },
});

/* ─── HELPER: merge real API id+name into a static option list ── */
const mergeOption = (
  staticList: { id: string; name: string }[],
  realId?: string,
  realName?: string
) => {
  if (!realId || !realName) return staticList;
  const already = staticList.some((o) => o.id === realId);
  if (already) return staticList;
  return [{ id: realId, name: realName }, ...staticList];
};

/* ─── COMPONENT ─────────────────────────────────────────────── */
const PolicyUpsertSheet = ({ open, onClose, onSuccess, policy, renewalId }: any) => {
  const [activeTab, setActiveTab]     = useState<TabType>("customer");
  const [form, setForm]               = useState(makeInitial());
  const [originalForm, setOriginalForm] = useState<any>(null);
  const [memberInput, setMemberInput] = useState("");
  const [errors, setErrors] = useState<any>({});

  const [files, setFiles] = useState<{ file: File; type: string; label: string }[]>([]);
  const [selectedDocName, setSelectedDocName] = useState("");
  const [existingDocuments, setExistingDocuments] = useState<
    { fileName: string; url: string; id: string; documentName: string; uploadedAt?: string }[]
  >([]);

  const { mutateAsync: addPolicy, isPending: isAdding } = useUpsertPolicy();
  const { mutateAsync: updatePolicy, isPending: isUpdating } = useUpdateGeneralPolicy();
  const { mutateAsync: uploadPolicyDocument, isPending: isUploading } = useUploadPolicyDocument();
  
  const { preview, download, remove } = usePolicyDocumentActions(
    (deletedId: string) => {
      setExistingDocuments((prev) =>
        prev.filter((f) => f.id !== deletedId)
      );
    }
  );

  const { data: customerDropdown } = useCustomerDropdown();
  const { data: memberDropdown } = useFamilyMemberDropdown(form.familyGroupId);
  const { data: divisionData } = useDivisionDropdown(0);

  const selectedDivisionId = Number(form.detail.divisionId) || 0;
  const { data: segmentData } = useSegmentDropdown(selectedDivisionId);

  const { data: fetchedPolicy, isLoading: isLoadingFetched } = useGeneralPolicyById(renewalId || null);
  const isRenewal = !!renewalId;
  const currentPolicy = isRenewal ? (fetchedPolicy || policy) : policy;

  const checkPolicyChanges = (curr: any, orig: any) => {
    if (!orig) return true;
    const cleanOrig = { ...orig, files: undefined };
    const cleanCurr = { ...curr, files: undefined };
    
    // Specifically exclude fields that might be auto-calculated on mount
    // to avoid false positives in change detection
    if (cleanOrig.detail) {
      // Add other fields to exclude if necessary
    }
    if (cleanCurr.detail) {
      // Add other fields to exclude if necessary
    }

    return JSON.stringify(cleanCurr) !== JSON.stringify(cleanOrig);
  };

  const isPending = isAdding || isUpdating || isLoadingFetched || isUploading;

  const isHealth  = form.detail.divisionType === "Health";
  const isVehicle = form.detail.divisionType === "Vehicle";
  const isOther   = form.detail.divisionType === "OtherGeneral";

  /* ─── DYNAMIC OPTION LISTS (inject real API ids so selects can match) ─── */
  const dynamicDivisions = mergeOption(
    divisionData?.map(d => ({ 
      id: d.divisionId.toString(), 
      name: d.divisionName 
    })) || [],
    currentPolicy?.detail?.divisionId?.toString(),
    currentPolicy?.detail?.divisionName
  );

  const dynamicFamilyGroups = mergeOption(
    customerDropdown?.map(c => ({ id: c.customerId, name: c.clientName })) || [],
    currentPolicy?.familyGroupId,
    currentPolicy?.familyGroupName
  );

  const dynamicHolders = mergeOption(
    memberDropdown?.map(m => ({ id: m.familyMemberId, name: m.fullName })) || [],
    currentPolicy?.policyHolderId,
    currentPolicy?.policyHolderName ||
      `${currentPolicy?.firstName || ""} ${currentPolicy?.lastName || ""}`.trim() || undefined
  );

  const dynamicSegments = mergeOption(
    segmentData?.map(s => ({ id: s.segmentId.toString(), name: s.segmentName })) || [],
    currentPolicy?.detail?.segmentId,
    currentPolicy?.detail?.segmentName
  );

  const dynamicCompanies = mergeOption(
    COMPANY_OPTIONS,
    currentPolicy?.detail?.insuranceCompanyId,
    currentPolicy?.detail?.insuranceCompanyName
  );

  const dynamicBranches = mergeOption(
    BRANCH_OPTIONS,
    currentPolicy?.detail?.branchId,
    currentPolicy?.detail?.branchName
  );

  const dynamicProducts = mergeOption(
    PRODUCT_OPTIONS,
    currentPolicy?.detail?.productId,
    currentPolicy?.detail?.productName
  );

  const dynamicPolicyModes = mergeOption(
    POLICY_MODE_OPTIONS,
    currentPolicy?.detail?.policyModeId,
    currentPolicy?.detail?.policyModeName
  );

  const dynamicBrokers = mergeOption(
    BROKER_OPTIONS,
    currentPolicy?.detail?.brokerId,
    currentPolicy?.detail?.brokerName
  );

  const dynamicAgencies = mergeOption(
    AGENCY_OPTIONS,
    currentPolicy?.detail?.agencyId,
    currentPolicy?.detail?.agencyName
  );

  const dynamicSubAgents = mergeOption(
    SUB_AGENT_OPTIONS,
    currentPolicy?.detail?.subAgentId,
    currentPolicy?.detail?.subAgentName
  );

  const dynamicBanks = mergeOption(
    BANK_OPTIONS,
    currentPolicy?.detail?.bankId,
    currentPolicy?.detail?.bankName
  );

  /* ─── EFFECTS ───────────────────────────────────────────────── */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setForm(makeInitial());
      setOriginalForm(null);
      setErrors({});
      setMemberInput("");
      setFiles([]);
      setSelectedDocName("");
      setExistingDocuments([]);
      setActiveTab("customer");
    }
  }, [open]);

  /* ─── PREFILL FORM WHEN EDITING ─────────────────────────────── */
  useEffect(() => {
    if (currentPolicy && open) {
      const newForm = {
        type: isRenewal ? "Renewal" : (currentPolicy.type || "Fresh"),
        transactionDate: currentPolicy.transactionDate?.split("T")[0] || "",
        documentNumber: currentPolicy.documentNumber || "",
        familyGroupId: currentPolicy.familyGroupId || "",
        policyHolderId: currentPolicy.policyHolderId || "",
        firstName: currentPolicy.firstName || "",
        middleName: currentPolicy.middleName || "",
        lastName: currentPolicy.lastName || "",
        addressLine1: currentPolicy.addressLine1 || "",
        addressLine2: currentPolicy.addressLine2 || "",
        city: currentPolicy.city || "",
        area: currentPolicy.area || "",
        mobileNumber: currentPolicy.mobileNumber || "",
        gender: currentPolicy.gender || "",
        email: currentPolicy.email || "",
        dob: currentPolicy.dob?.split("T")[0] || "",
        relationWithHead: currentPolicy.relationWithHead || "Self",
        detail: {
          divisionType: (() => {
            const dt = currentPolicy.detail?.divisionType || currentPolicy.divisionType;
            const dtn = currentPolicy.detail?.divisionTypeName;
            if (dtn === "Health Insurance" || dt === 1 || dt === "1") return "Health";
            if (dtn === "Vehicle Insurance" || dt === 3 || dt === "3") return "Vehicle"; // IDs from usual mapping
            if (dtn === "Other General Insurance" || dt === 2 || dt === "2") return "OtherGeneral";
            return dt || "Health";
          })(),
          divisionId: currentPolicy.detail?.divisionId || "",
          segmentId: currentPolicy.detail?.segmentId || "",
          policyType: currentPolicy.detail?.policyType || "",
          insuranceCompanyId: currentPolicy.detail?.insuranceCompanyId || "",
          branchId: currentPolicy.detail?.branchId || "",
          productId: currentPolicy.detail?.productId || "",
          zone: currentPolicy.detail?.zone || "",
          optionalCover:
            typeof currentPolicy.detail?.optionalCover === "string"
              ? currentPolicy.detail.optionalCover.split(",").filter(Boolean)
              : Array.isArray(currentPolicy.detail?.optionalCover)
              ? currentPolicy.detail.optionalCover
              : [],
          addOns:
            typeof currentPolicy.detail?.addOns === "string"
              ? currentPolicy.detail.addOns.split(",").filter(Boolean)
              : Array.isArray(currentPolicy.detail?.addOns)
              ? currentPolicy.detail.addOns
              : [],
          isPolicyReceived: Boolean(currentPolicy.detail?.isPolicyReceived),
          currentPolicyNumber: currentPolicy.detail?.currentPolicyNumber || "",
          previousPolicyNumber: isRenewal 
            ? currentPolicy.documentNumber || ""
            : currentPolicy.detail?.previousPolicyNumber || "",
          policyModeId: currentPolicy.detail?.policyModeId || "",
          riskStartDate: isRenewal 
            ? currentPolicy.detail?.riskEndDate?.split("T")[0] || ""
            : currentPolicy.detail?.riskStartDate?.split("T")[0] || "",
          riskEndDate: isRenewal 
            ? "" // Will be auto-calculated by the other useEffect
            : currentPolicy.detail?.riskEndDate?.split("T")[0] || "",
          brokerId: currentPolicy.detail?.brokerId || "",
          agencyId: currentPolicy.detail?.agencyId || "",
          subAgentId: currentPolicy.detail?.subAgentId || "",
          nomineeName: currentPolicy.detail?.nomineeName || "",
          nomineeContact: currentPolicy.detail?.nomineeContact || "",
          remarks: currentPolicy.detail?.remarks || "",
          vehicleUse: currentPolicy.detail?.vehicleUse || "",
          vehicleClass: currentPolicy.detail?.vehicleClass || "",
          tpPolicyMode: currentPolicy.detail?.tpPolicyMode || "",
          tpDueDate: currentPolicy.detail?.tpDueDate?.split("T")[0] || "",
          bankId: currentPolicy.detail?.bankId || "",
        },
        members:
          currentPolicy.members?.map((m: any) => {
            // Ensure we don't double-add the date part if it's already in memberName
            const cleanName = m.memberName?.split(" -> ")[0] || "";
            let dobStr = "-";
            if (m.dob) {
              const parts = m.dob.split("T")[0].split("-");
              dobStr = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : m.dob.split("T")[0];
            }
            return {
              id: m.id,
              memberId: m.memberId,
              memberName: `${cleanName} -> ${dobStr}`,
            };
          }) || [],
        riskLocations: currentPolicy.riskLocations || [],
        vehicle: currentPolicy.vehicle
          ? {
              vehicleNumber: currentPolicy.vehicle.vehicleNumber || "",
              vehicleName: currentPolicy.vehicle.vehicleName || "",
              engineNo: currentPolicy.vehicle.engineNo || "",
              chassisNo: currentPolicy.vehicle.chassisNo || "",
              brand: currentPolicy.vehicle.brand || "",
              fuelType: currentPolicy.vehicle.fuelType || "",
              registerDate: currentPolicy.vehicle.registerDate?.split("T")[0] || "",
              manufactureYear: String(currentPolicy.vehicle.manufactureYear || ""),
              rto: currentPolicy.vehicle.rto || "",
              cc: currentPolicy.vehicle.cc || "",
              gvw: currentPolicy.vehicle.gvw || "",
              ncb: currentPolicy.vehicle.ncb || "",
              fitnessCertificate: Boolean(currentPolicy.vehicle.fitnessCertificate),
              bhSeries: Boolean(currentPolicy.vehicle.bhSeries),
            }
          : makeInitial().vehicle,
        premium: {
          sumAssured: currentPolicy.premium?.sumAssured || 0,
          idvValue: currentPolicy.premium?.idvValue || 0,
          basicPremium: currentPolicy.premium?.basicPremium || 0,
          tpaPremium: currentPolicy.premium?.tpaPremium || 0,
          taxAmount: currentPolicy.premium?.taxAmount || 0,
          totalPremium: currentPolicy.premium?.totalPremium || 0,
          isCommission: Boolean(currentPolicy.premium?.isCommission),
          commissionableAmount: currentPolicy.premium?.commissionableAmount || 0,
          commissionEntry: currentPolicy.premium?.commissionEntry || 0,
          commitmentAmount: currentPolicy.premium?.commitmentAmount || 0,
        },
        payment: {
          paidByClient: currentPolicy.payment?.paidByClient || "",
          clientAmount: currentPolicy.payment?.clientAmount || 0,
          paidByAgent: currentPolicy.payment?.paidByAgent || "",
          agentAmount: currentPolicy.payment?.agentAmount || 0,
        },
      };
      setForm(newForm);
      setOriginalForm(JSON.parse(JSON.stringify(newForm)));

      const mappedDocs = (currentPolicy.documents || []).map((d: any) => ({
        id: d.id,
        fileName: d.fileName,
        url: d.url,
        documentName: d.documentName || "Policy",
        uploadedAt: d.uploadedAt
      }));
      setExistingDocuments(mappedDocs);
    }
  }, [currentPolicy, open, isRenewal]);
  
  useEffect(() => {
    if (divisionData && form.detail.divisionType && !form.detail.divisionId) {
      const division = divisionData.find(d => {
        const mappedType = d.divisionName === "Health Insurance" ? "Health" : 
                           d.divisionName === "Other General Insurance" ? "OtherGeneral" : 
                           d.divisionName === "Vehicle Insurance" ? "Vehicle" : d.divisionName;
        return mappedType === form.detail.divisionType;
      });
      if (division) {
        patchDetail({ divisionId: division.divisionId.toString() });
      }
    }
  }, [divisionData, form.detail.divisionType, form.detail.divisionId]);
  
  useEffect(() => {
    const { riskStartDate, policyModeId, riskEndDate } = form.detail;
    if (!riskStartDate || !policyModeId) return;
    if (originalForm?.detail) {
      const startChanged = riskStartDate !== originalForm.detail.riskStartDate;
      const modeChanged = policyModeId !== originalForm.detail.policyModeId;
      if (!startChanged && !modeChanged && riskEndDate) {
        return;
      }
    }

    const selectedMode = dynamicPolicyModes.find(m => m.id === policyModeId);
    if (!selectedMode) return;

    const start = new Date(riskStartDate);
    if (isNaN(start.getTime())) return;

    let monthsToAdd = 0;
    const modeName = selectedMode.name.toLowerCase();
    
    if (modeName.includes("yearly") && !modeName.includes("half")) monthsToAdd = 12;
    else if (modeName.includes("half")) monthsToAdd = 6;
    else if (modeName.includes("quarterly")) monthsToAdd = 3;
    else if (modeName.includes("monthly")) monthsToAdd = 1;

    if (monthsToAdd > 0) {
      const end = new Date(start);
      end.setMonth(end.getMonth() + monthsToAdd);
      
      const res = end.toISOString().split("T")[0];
      if (res !== riskEndDate) {
        patchDetail({ riskEndDate: res });
      }
    }
  }, [form.detail.riskStartDate, form.detail.policyModeId, dynamicPolicyModes, originalForm]);

  const patchDetail  = (patch: any) => setForm(f => ({ ...f, detail:  { ...f.detail,  ...patch } }));
  const patchVehicle = (patch: any) => setForm(f => ({ ...f, vehicle: { ...f.vehicle, ...patch } }));
  const patchPremium = (patch: any) => setForm(f => ({ ...f, premium: { ...f.premium, ...patch } }));
  const patchPayment = (patch: any) => setForm(f => ({ ...f, payment: { ...f.payment, ...patch } }));

  const toggleMulti = (field: "optionalCover" | "addOns", val: string) => {
    setForm(f => {
      const arr = f.detail[field] as string[];
      return { ...f, detail: { ...f.detail, [field]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] } };
    });
  };

  const addMember = () => {
    if (!memberInput) return;
    const selected = memberDropdown?.find((m: any) => m.familyMemberId === memberInput);
    if (!selected) return;
    
    let dobStr = "-";
    if (selected.dob) {
      const parts = selected.dob.split("T")[0].split("-");
      dobStr = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : selected.dob.split("T")[0];
    }
    const memberName = `${selected.fullName} -> ${dobStr}`;

    setForm(f => {
      if (f.members.some(m => m.memberId === selected.familyMemberId)) return f;
      return { ...f, members: [...f.members, { id: null, memberId: selected.familyMemberId, memberName }] };
    });
    setMemberInput("");
  };

  const addRiskRow = () => {
    setForm(f => ({ ...f, riskLocations: [...f.riskLocations, { srNo: f.riskLocations.length + 1, sumAssured: 0, riskAddress: "" }] }));
  };

  const validateForm = () => {
    const newErrors: any = {};
  
    // Common validations
    if (!form.documentNumber) newErrors.documentNumber = "Policy Number is required";
    if (!form.familyGroupId) newErrors.familyGroupId = "Family Group is required";
    if (!form.policyHolderId) newErrors.policyHolderId = "Policy Holder Name is required";
  
    if (!form.detail.divisionType) {
      newErrors.divisionType = "Select Division is required";
    }
  
    if (!form.detail.segmentId) {
      newErrors.segmentId = "Select Segment is required";
    }
  
    if (!form.detail.insuranceCompanyId) {
      newErrors.insuranceCompanyId = "Insurance Company is required";
    }
  
    if (!form.detail.policyModeId) {
      newErrors.policyModeId = "Policy Mode is required";
    }
  
    if (!form.detail.riskStartDate) {
      newErrors.riskStartDate = "Risk Start Date is required";
    }
  
    if (!form.detail.riskEndDate) {
      newErrors.riskEndDate = "Risk End Date is required";
    }

    if (!form.detail.brokerId) {
      newErrors.brokerId = "Broker is required";
    }
    
    if (!form.detail.agencyId) {
      newErrors.agencyId = "Agency is required";
    }

    // Health Validation
    if (isHealth) {
  
      if (form.members.length === 0) {
        newErrors.members = "At least one family member is required";
      }
  
      if (!form.premium.sumAssured || form.premium.sumAssured <= 0) {
        newErrors.sumAssured = "Sum Assured is required";
      }
  
      if (!form.premium.basicPremium || form.premium.basicPremium <= 0) {
        newErrors.basicPremium = "Basic Premium is required";
      }
  
      if (!form.premium.totalPremium || form.premium.totalPremium <= 0) {
        newErrors.totalPremium = "Total Premium is required";
      }
    }
  
    // Other General Validation
    if (isOther) {
      if (!form.detail.policyType) {
        newErrors.policyType = "Policy Type is required";
      }
  
      if (form.riskLocations.length === 0) {
        newErrors.riskLocations = "At least one risk location is required";
      }
  
      form.riskLocations.forEach((loc, index) => {
        if (!loc.sumAssured || loc.sumAssured <= 0) {
          newErrors[`riskSumAssured_${index}`] = "Sum Assured is required";
        }
  
        if (!loc.riskAddress) {
          newErrors[`riskAddress_${index}`] = "Risk Address is required";
        }
      });
  
      if (!form.premium.sumAssured || form.premium.sumAssured <= 0) {
        newErrors.sumAssured = "Sum Assured is required";
      }
  
      if (!form.premium.basicPremium || form.premium.basicPremium <= 0) {
        newErrors.basicPremium = "Basic Premium is required";
      }
  
      if (!form.premium.totalPremium || form.premium.totalPremium <= 0) {
        newErrors.totalPremium = "Total Premium is required";
      }
    }
  
    // Vehicle Validation
    if (isVehicle) {
      if (!form.detail.vehicleUse) {
        newErrors.vehicleUse = "Vehicle Use is required";
      }
  
      if (!form.detail.vehicleClass) {
        newErrors.vehicleClass = "Vehicle Class is required";
      }
  
      if (!form.vehicle.vehicleNumber) {
        newErrors.vehicleNumber = "Vehicle Registration Number is required";
      }
  
      if (!form.vehicle.vehicleName) {
        newErrors.vehicleName = "Vehicle Name is required";
      }
  
      if (!form.vehicle.fuelType) {
        newErrors.fuelType = "Fuel Type is required";
      }
  
      if (!form.vehicle.rto) {
        newErrors.rto = "RTO is required";
      }
  
      if (!form.vehicle.cc) {
        newErrors.cc = "CC is required";
      }
  
      if (!form.vehicle.gvw) {
        newErrors.gvw = "GVW is required";
      }
  
      if (!form.vehicle.ncb) {
        newErrors.ncb = "NCB is required";
      }
  
      if (!form.detail.tpPolicyMode) {
        newErrors.tpPolicyMode = "TP Policy Mode is required";
      }
  
      if (!form.detail.tpDueDate) {
        newErrors.tpDueDate = "TP Due Date is required";
      }
  
      if (!form.premium.idvValue || form.premium.idvValue <= 0) {
        newErrors.idvValue = "IDV Value is required";
      }
  
      if (!form.premium.basicPremium || form.premium.basicPremium <= 0) {
        newErrors.basicPremium = "Basic Premium is required";
      }
  
      if (!form.premium.tpaPremium || form.premium.tpaPremium <= 0) {
        newErrors.tpaPremium = "TPA Premium is required";
      }
  
      if (!form.premium.totalPremium || form.premium.totalPremium <= 0) {
        newErrors.totalPremium = "Total Premium is required";
      }
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    const isValid = validateForm();

    if (!isValid) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const STATIC_GUID = "88888888-8888-8888-8888-888888888888";
      const division = form.detail.divisionType;

      const payload: any = {
        policyId: (policy?.policyId && !isRenewal) ? policy.policyId : undefined,
        type: form.type,
        transactionDate: form.transactionDate || null,
        documentNumber: form.documentNumber || "",

        familyGroupId: form.familyGroupId || STATIC_GUID,
        policyHolderId: form.policyHolderId || STATIC_GUID,

        firstName: form.firstName || "",
        middleName: form.middleName || "",
        lastName: form.lastName || "",
        addressLine1: form.addressLine1 || "",
        addressLine2: form.addressLine2 || "",
        city: form.city || "",
        area: form.area || "",
        mobileNumber: form.mobileNumber || "",
        gender: form.gender || "",
        email: form.email || "",
        dob: form.dob || null,
        relationWithHead: form.relationWithHead || "",

        detail: {
          divisionType: Number(form.detail.divisionId) || 0,
          divisionId: Number(form.detail.divisionId) || 0,
          vehicleUse: division === "Vehicle" ? form.detail.vehicleUse || "" : null,
          vehicleClass: division === "Vehicle" ? form.detail.vehicleClass || "" : null,

          segmentId: form.detail.segmentId || STATIC_GUID,
          policyType: form.detail.policyType || "",
          insuranceCompanyId: form.detail.insuranceCompanyId || STATIC_GUID,
          branchId: form.detail.branchId || STATIC_GUID,
          productId: form.detail.productId || STATIC_GUID,
          zone: form.detail.zone || "",

          optionalCover:
            division === "Health" || division === "OtherGeneral"
              ? form.detail.optionalCover || []
              : [],

          addOns:
            division === "Vehicle"
              ? form.detail.addOns || []
              : [],

          isPolicyReceived: form.detail.isPolicyReceived || false,
          currentPolicyNumber: form.detail.currentPolicyNumber || "",
          previousPolicyNumber: form.detail.previousPolicyNumber || "",

          policyModeId: form.detail.policyModeId || STATIC_GUID,
          riskStartDate: form.detail.riskStartDate || null,
          riskEndDate: form.detail.riskEndDate || null,

          tpPolicyMode:
            division === "Vehicle"
              ? form.detail.tpPolicyMode || ""
              : null,

          tpDueDate:
            division === "Vehicle"
              ? form.detail.tpDueDate || null
              : null,

          bankId:
            division === "OtherGeneral" || division === "Vehicle"
              ? form.detail.bankId || STATIC_GUID
              : null,

          brokerId: form.detail.brokerId || STATIC_GUID,
          agencyId: form.detail.agencyId || STATIC_GUID,
          subAgentId: form.detail.subAgentId || STATIC_GUID,

          nomineeName: form.detail.nomineeName || "",
          nomineeContact: form.detail.nomineeContact || "",
          remarks: form.detail.remarks || ""
        },

        members:
          division === "Health"
            ? form.members.map((m: any) => ({
                id: m.id || null,
                memberId: m.memberId || STATIC_GUID,
                memberName: m.memberName?.split(" -> ")[0] || ""
              }))
            : [],

        riskLocations:
          division === "OtherGeneral"
            ? form.riskLocations.map((loc: any, index: number) => ({
                id: loc.id || null,
                srNo: loc.srNo || index + 1,
                sumAssured: Number(loc.sumAssured) || 0,
                riskAddress: loc.riskAddress || ""
              }))
            : [],

        vehicle:
          division === "Vehicle"
            ? {
                vehicleNumber: form.vehicle.vehicleNumber || "",
                vehicleName: form.vehicle.vehicleName || "",
                engineNo: form.vehicle.engineNo || "",
                chassisNo: form.vehicle.chassisNo || "",
                brand: form.vehicle.brand || "",
                fuelType: form.vehicle.fuelType || "",
                registerDate: form.vehicle.registerDate || null,
                manufactureYear: Number(form.vehicle.manufactureYear) || 0,
                rto: form.vehicle.rto || "",
                cc: form.vehicle.cc,
                gvw: form.vehicle.gvw,
                ncb: form.vehicle.ncb || "",
                fitnessCertificate: Boolean(form.vehicle.fitnessCertificate),
                bhSeries: Boolean(form.vehicle.bhSeries)
              }
            : null,

        premium: {
          sumAssured:
            division !== "Vehicle"
              ? Number(form.premium.sumAssured) || 0
              : 0,

          idvValue:
            division === "Vehicle"
              ? Number(form.premium.idvValue) || 0
              : 0,

          basicPremium: Number(form.premium.basicPremium) || 0,
          tpaPremium:
            division === "Vehicle"
              ? Number(form.premium.tpaPremium) || 0
              : 0,

          isCommission: Boolean(form.premium.isCommission),
          taxAmount: Number(form.premium.taxAmount) || 0,
          totalPremium: Number(form.premium.totalPremium) || 0,
          commissionableAmount: Number(form.premium.commissionableAmount) || 0,
          commissionEntry: Number(form.premium.commissionEntry) || 0,
          commitmentAmount: Number(form.premium.commitmentAmount) || 0
        },

        payment: {
          paidByClient: form.payment.paidByClient || "",
          clientAmount: Number(form.payment.clientAmount) || 0,
          paidByAgent: form.payment.paidByAgent || "",
          agentAmount: Number(form.payment.agentAmount) || 0
        }
      };

      console.log("Final Payload => ", payload);

      let policyId = policy?.policyId || undefined;
      let policyUpdated = false;
      const hasPolicyChanged = originalForm ? checkPolicyChanges(form, originalForm) : true;

      // 🔥 FIX: For renewal, we should always create a new record if there are files or changes
      if (hasPolicyChanged || isRenewal) {
        if (policy?.policyId && !isRenewal) {
          const response = await updatePolicy({ policyId: policy.policyId, payload });
          toast.success(response?.statusMessage || "Policy updated successfully!");
          policyUpdated = true;
        } else {
          const response = await addPolicy(payload);
          policyId = response?.data?.policyId || response?.policyId;
          toast.success(response?.statusMessage || "Policy saved successfully!");
          policyUpdated = true;
        }
      }

      if (files.length > 0 && policyId) {
        await Promise.all(
          files.map((f) => {
            const formData = new FormData();
            formData.append("Id", policyId);
            formData.append("Type", "3");
            formData.append("PolicyType", "0");
            formData.append("DocumentType", f.label);
            formData.append("Files", f.file);
            return uploadPolicyDocument(formData);
          })
        );
        if (!policyUpdated) {
          toast.success("Documents uploaded successfully!");
        }
      }

      onClose();
      onSuccess();
    } catch (error: any) {
      console.error("Save Policy Error => ", error);

      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        "Error saving policy";

      toast.error(errorMsg);
    }
  };

  if (!open) return null;

  const TABS = [
    { id: "customer" as TabType, label: "Customer Information", icon: Users },
    { id: "policy"   as TabType, label: "Policy Details",       icon: ShieldCheck },
    { id: "premium"  as TabType, label: "Premium & Payment",    icon: CreditCard },
    { id: "documents" as TabType, label: "Document Upload",     icon: UploadCloud },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]" onClick={onClose} />

      <div className="fixed top-0 right-0 w-full max-w-[82vw] h-screen bg-slate-50 z-[70] shadow-2xl flex flex-col animate-slide-in-right">

        {/* HEADER */}
        <div className="px-8 py-5 bg-white border-b flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg"><ShieldCheck size={20} className="text-white" /></div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {isRenewal ? "Create Renewal" : policy ? "Edit General Policy" : "Add General Policy"}
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">
                Fill in the details to {isRenewal ? "renew" : policy ? "update" : "create"} the insurance policy.
              </p>
            </div>
          </div>
          <button onClick={onClose} disabled={isPending} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={22} className="text-slate-400" />
          </button>
        </div>

        {/* TABS */}
        <div className="px-8 bg-white border-b flex gap-6 shrink-0">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-all ${activeTab === t.id ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200"}`}>
              <t.icon size={16} />{t.label}
            </button>
          ))}
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-8 pb-56">

          {/* ══ TAB 1: CUSTOMER ══ */}
          {activeTab === "customer" && (
            <Section icon={<Users size={14} />} title="Customer Information">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Insurance Type <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-8">
                  {["Fresh","Prospect","Renewal","Endorsement"].map(t => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                      <input
                        type="radio"
                        checked={form.type === t}
                        onChange={() => setForm(f => ({ ...f, type: t }))}
                        className="w-4 h-4 accent-blue-600"
                      />
                      {t}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Input label="Transaction Date" required type="date" value={form.transactionDate}
                  onChange={(v:any) => setForm(f => ({ ...f, transactionDate: v }))} />
                <Input 
                  label="Policy Number" 
                  required
                  value={form.documentNumber} 
                  error={errors.documentNumber}
                  placeholder="Policy number"
                  disabled={isRenewal}
                  onChange={(v:any) => {
                    setForm(f => ({ ...f, documentNumber: v }));
                    patchDetail({ currentPolicyNumber: v });
                  }} 
                />
              </div>

              <div className="grid grid-cols-12 gap-4 items-start">
                <div className="col-span-5">
                   <SearchableComboBox
                    label="Family Group"
                    required
                    items={dynamicFamilyGroups.map(g => ({ label: g.name, value: g.id }))}
                    value={form.familyGroupId}
                    error={errors.familyGroupId}
                    disabled={isRenewal}
                    placeholder="Search family group..."
                    onSelect={(item: any) =>
                      setForm(f => ({ 
                        ...f, 
                        familyGroupId: item?.value ?? "",
                        policyHolderId: "" 
                      }))
                    }
                  />
                </div>
                <div className="col-span-1"><AddBtn onClick={() => {}} /></div>
                <div className="col-span-5">
                   <SearchableComboBox
                    label="Policy Holder Name"
                    required
                    items={dynamicHolders.map(h => ({ label: h.name, value: h.id }))}
                    value={form.policyHolderId}
                    error={errors.policyHolderId}
                    placeholder={form.familyGroupId ? "Search policy holder..." : "Select family group first"}
                    onSelect={(item: any) =>
                      setForm(p => ({ ...p, policyHolderId: item?.value ?? "" }))
                    }
                  />
                </div>
                <div className="col-span-1"><AddBtn onClick={() => {}} /></div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Input label="First Name" value={form.firstName} onChange={(v:any) => setForm(f => ({ ...f, firstName: v }))} />
                <Input label="Middle Name" value={form.middleName} onChange={(v:any) => setForm(f => ({ ...f, middleName: v }))} />
                <Input label="Last Name" value={form.lastName} onChange={(v:any) => setForm(f => ({ ...f, lastName: v }))} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Address Line1" value={form.addressLine1} onChange={(v:any) => setForm(f => ({ ...f, addressLine1: v }))} />
                <Input label="Address Line2" value={form.addressLine2} onChange={(v:any) => setForm(f => ({ ...f, addressLine2: v }))} />
              </div>

              <div className="grid grid-cols-4 gap-4">
                <Input label="City" value={form.city} onChange={(v:any) => setForm(f => ({ ...f, city: v }))} />
                <Input label="Area" value={form.area} onChange={(v:any) => setForm(f => ({ ...f, area: v }))} />
                <Input label="Mobile Number" value={form.mobileNumber} onChange={(v:any) => setForm(f => ({ ...f, mobileNumber: v }))} />
                <Select label="Gender" options={GENDER_OPTIONS} value={form.gender} onChange={(v:any) => setForm(f => ({ ...f, gender: v }))} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Input label="Email Address" value={form.email} onChange={(v:any) => setForm(f => ({ ...f, email: v }))} />
                <Input label="DOB" type="date" value={form.dob} onChange={(v:any) => setForm(f => ({ ...f, dob: v }))} />
                <Select label="Relation With Head" options={RELATION_OPTIONS} value={form.relationWithHead} onChange={(v:any) => setForm(f => ({ ...f, relationWithHead: v }))} />
              </div>
            </Section>
          )}

          {/* ══ TAB 2: POLICY DETAILS ══ */}
          {activeTab === "policy" && (
            <div className="space-y-6">
              <Section icon={<ShieldCheck size={14} />} title="Policy Specifications">

                 <div className="grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-4">
                    <SearchableComboBox
                      label="Select Division"
                      required
                      items={dynamicDivisions.map(d => ({ label: d.name, value: d.id }))}
                      value={form.detail.divisionId?.toString()}
                      error={errors.divisionType}
                      disabled={isRenewal}
                      placeholder="Search division..."
                      onSelect={(item: any) => {
                        const division = divisionData?.find(d => d.divisionId.toString() === item?.value);
                        const mappedType = division?.divisionName === "Health Insurance" ? "Health" : 
                                           division?.divisionName === "Other General Insurance" ? "OtherGeneral" : 
                                           division?.divisionName === "Vehicle Insurance" ? "Vehicle" : (division?.divisionName || "");
                        patchDetail({ divisionId: item?.value ?? "", divisionType: mappedType, segmentId: "" });
                      }}
                    />
                  </div>
                </div>

                {isHealth && (
                  <div className="grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-6">
                      <SearchableComboBox
                        label="Select Segment"
                        required
                        items={dynamicSegments.map((s: any) => ({ label: s.name, value: s.id }))}
                        value={form.detail.segmentId}
                        error={errors.segmentId}
                        placeholder="Search segment..."
                        onSelect={(item: any) => patchDetail({ segmentId: item?.value ?? "" })}
                      />
                    </div>
                    <div className="col-span-1"><AddBtn onClick={() => {}} /></div>
                    <div className="col-span-5">
                      <Select
                        label="Policy Type"
                        options={POLICY_TYPE_OPTIONS}
                        value={form.detail.policyType}
                        onChange={(v:any) => patchDetail({ policyType: v })}
                      />
                    </div>
                  </div>
                )}

                {isOther && (
                  <div className="grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-6">
                      <SearchableComboBox
                        label="Select Segment"
                        required
                        items={dynamicSegments.map((s: any) => ({ label: s.name, value: s.id }))}
                        value={form.detail.segmentId}
                        error={errors.segmentId}
                        placeholder="Search segment..."
                        onSelect={(item: any) => patchDetail({ segmentId: item?.value ?? "" })}
                      />
                    </div>
                    <div className="col-span-1"><AddBtn onClick={() => {}} /></div>
                    <div className="col-span-5">
                      <Select
                        label="Policy Type"
                        options={POLICY_TYPE_OPTIONS}
                        value={form.detail.policyType}
                        onChange={(v:any) => patchDetail({ policyType: v })}
                      />
                    </div>
                  </div>
                )}

                {isVehicle && (
                  <div className="grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-3">
                      <Select
                        label="Vehicle Uses"
                        options={VEHICLE_USE_OPTIONS}
                        value={form.detail.vehicleUse}
                        error={errors.vehicleUse}
                        onChange={(v:any) => patchDetail({ vehicleUse: v })}
                      />
                    </div>
                    <div className="col-span-3">
                      <Select
                        label="Vehicle Class"
                        options={VEHICLE_CLASS_OPTIONS}
                        value={form.detail.vehicleClass}
                        error={errors.vehicleClass}
                        onChange={(v:any) => patchDetail({ vehicleClass: v })}
                      />
                    </div>
                    <div className="col-span-5">
                      <SearchableComboBox
                        label="Select Segment"
                        required
                        items={dynamicSegments.map(s => ({ label: s.name, value: s.id }))}
                        value={form.detail.segmentId}
                        error={errors.segmentId}
                        placeholder="Search segment..."
                        onSelect={(item: any) => patchDetail({ segmentId: item?.value ?? "" })}
                      />
                    </div>
                    <div className="col-span-1"><AddBtn onClick={() => {}} /></div>
                  </div>
                )}

                <div className="grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-6">
                    <Select
                      label="Select Insurance Company"
                      required
                      options={dynamicCompanies}
                      value={form.detail.insuranceCompanyId}
                      error={errors.insuranceCompanyId}
                      onChange={(v:any) => patchDetail({ insuranceCompanyId: v })}
                    />
                  </div>
                  <div className="col-span-4">
                    <Select
                      label="Select Branch"
                      options={dynamicBranches}
                      value={form.detail.branchId}
                      onChange={(v:any) => patchDetail({ branchId: v })}
                    />
                  </div>
                  <div className="col-span-2"><AddBtn onClick={() => {}} /></div>
                </div>

                <div className="grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-5">
                    <Select
                      label="Product Name"
                      options={dynamicProducts}
                      value={form.detail.productId}
                      onChange={(v:any) => patchDetail({ productId: v })}
                    />
                  </div>
                  <div className="col-span-1"><AddBtn onClick={() => {}} /></div>
                  <div className="col-span-6">
                    <Select
                      label="Zone"
                      options={ZONE_OPTIONS}
                      value={form.detail.zone}
                      onChange={(v:any) => patchDetail({ zone: v })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-3">
                    <Select
                      label="Select Broker"
                      required
                      options={dynamicBrokers}
                      value={form.detail.brokerId}
                      error={errors.brokerId}
                      onChange={(v: any) => patchDetail({ brokerId: v })}
                    />
                  </div>
                  <div className="col-span-1"><AddBtn onClick={() => {}} /></div>

                  <div className="col-span-3">
                    <Select
                      label="Select Agency Name"
                      required
                      options={dynamicAgencies}
                      value={form.detail.agencyId}
                      error={errors.agencyId}
                      onChange={(v: any) => patchDetail({ agencyId: v })}
                    />
                  </div>
                  <div className="col-span-1"><AddBtn onClick={() => {}} /></div>

                  <div className="col-span-3">
                    <Select
                      label="Select Sub Agent Name"
                      options={dynamicSubAgents}
                      value={form.detail.subAgentId}
                      onChange={(v: any) => patchDetail({ subAgentId: v })}
                    />
                  </div>
                  <div className="col-span-1"><AddBtn onClick={() => {}} /></div>
                </div>

                {/* ── OPTIONAL COVER (OtherGeneral) ── */}
                {isOther && (
                  <div className="space-y-0.5 w-full">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                      Optional Cover
                    </label>
                    <div
                      className={`
                        border rounded bg-white px-3 py-2 min-h-[42px] flex flex-wrap gap-2 items-center
                        ${errors.optionalCover
                          ? "border-red-500 ring-2 ring-red-50"
                          : "border-slate-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50"}
                      `}
                    >
                      {form.detail.optionalCover.map(v => (
                        <span key={v} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded border border-blue-200">
                          {OPT_COVER_OPTIONS.find(o => o.id === v)?.name ?? v}
                          <button onClick={() => toggleMulti("optionalCover", v)} className="ml-1 text-slate-400 hover:text-red-500">✕</button>
                        </span>
                      ))}
                      <select
                        className="flex-1 min-w-[200px] text-sm outline-none bg-transparent"
                        value=""
                        onChange={e => { if (e.target.value) toggleMulti("optionalCover", e.target.value); }}
                      >
                        <option value="">Search for optional cover</option>
                        {OPT_COVER_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                      </select>
                    </div>
                    <p className="text-[10px] font-medium text-red-500">
                      {errors.optionalCover || ""}
                    </p>
                  </div>
                )}

                {/* ── OPTIONAL COVER (Health) ── */}
                {isHealth && (
                  <div className="space-y-0.5 w-full">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                      Optional Cover
                    </label>
                    <div
                      className={`
                        border rounded bg-white px-3 py-2 min-h-[42px] flex flex-wrap gap-2 items-center
                        ${errors.optionalCover
                          ? "border-red-500 ring-2 ring-red-50"
                          : "border-slate-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50"}
                      `}
                    >
                      {form.detail.optionalCover.map(v => (
                        <span key={v} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded border border-blue-200">
                          {OPT_COVER_OPTIONS.find(o => o.id === v)?.name ?? v}
                          <button onClick={() => toggleMulti("optionalCover", v)} className="ml-1 text-slate-400 hover:text-red-500">✕</button>
                        </span>
                      ))}
                      <select
                        className="flex-1 min-w-[200px] text-sm outline-none bg-transparent"
                        value=""
                        onChange={e => { if (e.target.value) toggleMulti("optionalCover", e.target.value); }}
                      >
                        <option value="">Search for optional cover</option>
                        {OPT_COVER_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                      </select>
                    </div>
                    <p className="text-[10px] font-medium text-red-500">
                      {errors.optionalCover || ""}
                    </p>
                  </div>
                )}

                {/* ── ADD ONS (Vehicle) ── */}
                {isVehicle && (
                  <div className="space-y-0.5 w-full">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                      Add Ons
                    </label>
                    <div
                      className={`
                        border rounded bg-white px-3 py-2 min-h-[42px]
                        flex flex-wrap gap-1.5 items-center
                        ${errors.addOns
                          ? "border-red-500 ring-2 ring-red-50"
                          : "border-slate-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50"}
                      `}
                    >
                      {form.detail.addOns.map((v: string) => (
                        <span
                          key={v}
                          className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-200"
                        >
                          {ADD_ON_OPTIONS.find(o => o.id === v)?.name ?? v}
                          <button
                            onClick={() => toggleMulti("addOns", v)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                      <select
                        className="flex-1 min-w-[120px] text-sm outline-none bg-transparent"
                        value=""
                        onChange={(e) => {
                          if (e.target.value) toggleMulti("addOns", e.target.value);
                        }}
                      >
                        <option value="">Select add ons</option>
                        {ADD_ON_OPTIONS.map(o => (
                          <option key={o.id} value={o.id}>{o.name}</option>
                        ))}
                      </select>
                    </div>
                    <p className="text-[10px] font-medium text-red-500">
                      {errors.addOns || ""}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-2 flex items-center gap-2 pb-2.5">
                    <input
                      type="checkbox"
                      id="isPolicyReceived"
                      checked={form.detail.isPolicyReceived}
                      onChange={e => patchDetail({ isPolicyReceived: e.target.checked })}
                      className="w-4 h-4 accent-blue-600 rounded"
                    />
                    <label htmlFor="isPolicyReceived" className="text-sm font-medium">Is Received</label>
                  </div>
                  <div className="col-span-5">
                    <Input
                      label="Current Policy Number"
                      value={form.detail.currentPolicyNumber}
                      onChange={(v:any) => patchDetail({ currentPolicyNumber: v })}
                    />
                  </div>
                  <div className="col-span-5">
                    <Input
                      label="Previous Policy Number"
                      value={form.detail.previousPolicyNumber}
                      onChange={(v:any) => patchDetail({ previousPolicyNumber: v })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Select
                    label="Policy Mode"
                    required
                    options={dynamicPolicyModes}
                    value={form.detail.policyModeId}
                    error={errors.policyModeId}
                    onChange={(v:any) => patchDetail({ policyModeId: v })}
                  />
                  <Input
                    label="Risk Start Date"
                    required
                    type="date"
                    value={form.detail.riskStartDate}
                    error={errors.riskStartDate}
                    onChange={(v:any) => patchDetail({ riskStartDate: v })}
                  />
                   <Input
                    label="Risk End Date"
                    required
                    type="date"
                    value={form.detail.riskEndDate}
                    error={errors.riskEndDate}
                    onChange={(v:any) => patchDetail({ riskEndDate: v })}
                  />
                </div>

                {isVehicle && (
                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="TP Policy Mode"
                      required
                      options={TP_MODE_OPTIONS}
                      value={form.detail.tpPolicyMode}
                      error={errors.tpPolicyMode}
                      onChange={(v:any) => patchDetail({ tpPolicyMode: v })}
                    />
                    <Input
                      label="TP Due Date"
                      required
                      type="date"
                      value={form.detail.tpDueDate}
                      error={errors.tpDueDate}
                      onChange={(v:any) => patchDetail({ tpDueDate: v })}
                    />
                  </div>
                )}

                {(isOther || isVehicle) && (
                  <div className="grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-10">
                      <Select
                        label="Select Bank Name"
                        options={dynamicBanks}
                        value={form.detail.bankId}
                        onChange={(v:any) => patchDetail({ bankId: v })}
                      />
                    </div>
                    <div className="col-span-2"><AddBtn onClick={() => {}} /></div>
                  </div>
                )}

                {isHealth && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-12 gap-4 items-start">
                      <div className="col-span-10">
                        <SearchableComboBox
                          label="Select Family Member"
                          items={memberDropdown?.map((m: any) => {
                            let dobStr = "-";
                            if (m.dob) {
                              const parts = m.dob.split("T")[0].split("-");
                              dobStr = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : m.dob.split("T")[0];
                            }
                            return {
                              label: `${m.fullName} -> ${dobStr}`,
                              value: m.familyMemberId
                            };
                          }) || []}
                          value={memberInput}
                          placeholder={form.familyGroupId ? "Search Family Member..." : "Select Family Group first"}
                          onSelect={(item: any) => setMemberInput(item?.value ?? "")}
                        />
                      </div>
                      <div className="col-span-2">
                        <div className="space-y-0.5 w-full">
                          <label className="text-sm font-bold uppercase tracking-wider text-[10px] invisible block">Spacer</label>
                          <button
                            onClick={addMember}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded transition-all h-[42px] flex items-center justify-center shadow-sm"
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    </div>
                    {form.members.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {form.members.map((m, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-200"
                          >
                            {m.memberName}
                            <button
                              onClick={() => setForm(f => ({ ...f, members: f.members.filter((_, idx) => idx !== i) }))}
                              className="hover:text-red-500"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {isOther && (
                  <div className="space-y-3">
                    <div className="flex items-end gap-3">
                      <button
                        onClick={addRiskRow}
                        className="h-[42px] px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded flex items-center gap-2 transition-all shadow-sm"
                      >
                        <Plus size={14}/> Add Risk Row
                      </button>
                    </div>
                    {errors.riskLocations && (
                      <p className="text-[10px] font-medium text-red-500">{errors.riskLocations}</p>
                    )}
                    {form.riskLocations.map((loc, i) => (
                      <div key={i} className="grid grid-cols-12 gap-3 items-center">
                        <div className="col-span-1">
                          <Input label="No" value={loc.srNo} disabled onChange={()=>{}}/>
                        </div>
                        <div className="col-span-3">
                          <Input
                            label="Sum Assured"
                            value={loc.sumAssured}
                            error={errors[`riskSumAssured_${i}`]}
                            type="number"
                            onChange={(v:any)=> {
                              const updated = [...form.riskLocations];
                              updated[i].sumAssured = Number(v);
                              setForm(f=>({...f, riskLocations: updated}));
                            }}
                          />
                        </div>
                        <div className="col-span-7">
                          <Input
                            label="Address"
                            value={loc.riskAddress}
                            error={errors[`riskAddress_${i}`]}
                            onChange={(v:any)=>{
                              const updated = [...form.riskLocations];
                              updated[i].riskAddress = v;
                              setForm(f=>({...f, riskLocations: updated}));
                            }}
                          />
                        </div>
                        <div className="col-span-1 flex justify-center pt-5">
                          <button
                            onClick={() => setForm(f => ({ ...f, riskLocations: f.riskLocations.filter((_, idx) => idx !== i) }))}
                            className="text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>

              {isVehicle && (
                <Section icon={<Car size={14} />} title="Vehicle Details">
                  <div className="grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-1 flex items-center gap-1.5 pb-2.5">
                      <input
                        type="checkbox"
                        checked={form.vehicle.bhSeries}
                        onChange={e => patchVehicle({ bhSeries: e.target.checked })}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <label className="text-xs font-bold">BH Series</label>
                    </div>

                    <div className="col-span-3">
                      <Input
                        label="Vehicle Registration Number"
                        required
                        value={form.vehicle.vehicleNumber}
                        error={errors.vehicleNumber}
                        onChange={(v: any) => patchVehicle({ vehicleNumber: v })}
                      />
                    </div>

                    <div className="col-span-2">
                      <Input
                        label="Vehicle Name"
                        required
                        value={form.vehicle.vehicleName}
                        error={errors.vehicleName}
                        onChange={(v: any) => patchVehicle({ vehicleName: v })}
                      />
                    </div>

                    <div className="col-span-3">
                      <Input
                        label="Engine No"
                        value={form.vehicle.engineNo}
                        onChange={(v: any) => patchVehicle({ engineNo: v })}
                      />
                    </div>

                    <div className="col-span-3">
                      <Input
                        label="Chassis No"
                        value={form.vehicle.chassisNo}
                        onChange={(v: any) => patchVehicle({ chassisNo: v })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <Input
                      label="Vehicle Brand"
                      value={form.vehicle.brand}
                      error={errors.brand}
                      onChange={(v: any) => patchVehicle({ brand: v })}
                    />
                    <Select
                      label="Vehicle Fuel Type"
                      required
                      options={FUEL_TYPE_OPTIONS}
                      value={form.vehicle.fuelType}
                      error={errors.fuelType}
                      onChange={(v: any) => patchVehicle({ fuelType: v })}
                    />
                    <Input
                      label="Register Date"
                      type="date"
                      value={form.vehicle.registerDate}
                      onChange={(v: any) => patchVehicle({ registerDate: v })}
                    />
                    <Input
                      label="Year Of Manufacture"
                      value={form.vehicle.manufactureYear}
                      onChange={(v: any) => patchVehicle({ manufactureYear: v })}
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-4 mt-4">
                    <Input
                      label="RTO"
                      required
                      value={form.vehicle.rto}
                      error={errors.rto}
                      onChange={(v: any) => patchVehicle({ rto: v })}
                    />
                    <Input
                      label="CC"
                      required
                      type="number"
                      value={form.vehicle.cc}
                      error={errors.cc}
                      onChange={(v: any) => patchVehicle({ cc: v })}
                    />
                    <Input
                      label="GVW"
                      required
                      type="number"
                      value={form.vehicle.gvw}
                      error={errors.gvw}
                      onChange={(v: any) => patchVehicle({ gvw: v })}
                    />
                    <Input
                      label="NCB"
                      required
                      value={form.vehicle.ncb}
                      error={errors.ncb}
                      onChange={(v: any) => patchVehicle({ ncb: v })}
                    />
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.vehicle.fitnessCertificate}
                      onChange={e => patchVehicle({ fitnessCertificate: e.target.checked })}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <label className="text-sm font-medium">Fitness Certificate</label>
                  </div>
                </Section>
              )}
            </div>
          )}

          {/* ══ TAB 3: PREMIUM & PAYMENT ══ */}
          {activeTab === "premium" && (
            <div className="space-y-6">
              <Section icon={<Activity size={14} />} title="Premium Details">
                <div className="grid grid-cols-4 gap-4">
                  {isVehicle
                    ? <Input
                        label="IDV Value"
                        required
                        type="number"
                        value={form.premium.idvValue}
                        error={errors.idvValue}
                        onChange={(v:any) => patchPremium({ idvValue: Number(v) })}
                      />
                    : <Input
                        label="Sum Assured"
                        required
                        type="number"
                        value={form.premium.sumAssured}
                        error={errors.sumAssured}
                        onChange={(v:any) => patchPremium({ sumAssured: Number(v) })}
                      />
                  }
                  <Input
                    label="Basic Premium"
                    required
                    type="number"
                    value={form.premium.basicPremium}
                    error={errors.basicPremium}
                    onChange={(v:any) => patchPremium({ basicPremium: Number(v) })}
                  />
                  {isVehicle && (
                    <Input
                      label="Tpa Premium"
                      type="number"
                      value={form.premium.tpaPremium}
                      error={errors.tpaPremium}
                      onChange={(v:any) => patchPremium({ tpaPremium: Number(v) })}
                    />
                  )}
                  <Input
                    label="Tax Amount"
                    type="number"
                    value={form.premium.taxAmount}
                    onChange={(v:any) => patchPremium({ taxAmount: Number(v) })}
                  />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <Input
                    label="Total Premium"
                    required
                    type="number"
                    value={form.premium.totalPremium}
                    error={errors.totalPremium}
                    onChange={(v:any) => patchPremium({ totalPremium: Number(v) })}
                  />
                  <Input
                    label="Comm. Amount"
                    type="number"
                    value={form.premium.commissionableAmount}
                    onChange={(v:any) => patchPremium({ commissionableAmount: Number(v) })}
                  />
                  <Input
                    label="Entry (%)"
                    type="number"
                    value={form.premium.commissionEntry}
                    onChange={(v:any) => patchPremium({ commissionEntry: Number(v) })}
                  />
                  <Input
                    label="Commitment"
                    type="number"
                    value={form.premium.commitmentAmount}
                    onChange={(v:any) => patchPremium({ commitmentAmount: Number(v) })}
                  />
                </div>
              </Section>

              <Section icon={<CreditCard size={14} />} title="Payment Details">
                <div className="grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-3">
                    <Select
                      label="Paid By Client"
                      options={PAID_BY_OPTIONS}
                      value={form.payment.paidByClient}
                      onChange={(v:any) => patchPayment({ paidByClient: v })}
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      label="Client Amount"
                      type="number"
                      value={form.payment.clientAmount}
                      onChange={(v:any) => patchPayment({ clientAmount: Number(v) })}
                    />
                  </div>
                  <div className="col-span-3">
                    <Select
                      label="Paid By Agent"
                      options={PAID_BY_OPTIONS}
                      value={form.payment.paidByAgent}
                      onChange={(v:any) => patchPayment({ paidByAgent: v })}
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      label="Agent Amount"
                      type="number"
                      value={form.payment.agentAmount}
                      onChange={(v:any) => patchPayment({ agentAmount: Number(v) })}
                    />
                  </div>
                </div>
              </Section>
            </div>
          )}

          {/* ══ TAB 4: DOCUMENTS ══ */}
          {activeTab === "documents" && (
            <div className="space-y-8">
              {!policy && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-3">
                  <AlertCircle size={16} className="text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Documents will be uploaded automatically when you click <strong>SAVE</strong>.
                  </p>
                </div>
              )}

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  <div className="lg:col-span-1 space-y-6">
                    <Select
                      label="Document Name"
                      required
                      value={selectedDocName}
                      options={DOCUMENT_OPTIONS}
                      onChange={(v: string) => setSelectedDocName(v)}
                    />
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle size={14} className="text-blue-600" />
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Quick Tip</p>
                      </div>
                      <p className="text-xs text-blue-700 leading-relaxed">
                        Select the document type first, then click or drag files to the upload area.
                      </p>
                    </div>
                  </div>

                  <div className="lg:col-span-2 space-y-3">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-xs">Select Document</label>
                    <div className="relative">
                      <input
                        id="policy-upload"
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        disabled={isPending}
                        onChange={(e) => {
                          if (!e.target.files) return;
                          if (!selectedDocName) {
                            toast.error("Please select a document name first");
                            return;
                          }
                          const newFiles = Array.from(e.target.files).map(f => ({ 
                            file: f, 
                            type: "GeneralPolicy", 
                            label: selectedDocName
                          }));
                          setFiles(prev => [...prev, ...newFiles]);
                          setSelectedDocName(""); 
                          e.target.value = ""; 
                        }}                  
                      />
                      <label 
                        htmlFor="policy-upload"
                        className={`
                          flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl transition-all cursor-pointer group
                          ${!selectedDocName ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-50' : 'bg-white border-blue-200 hover:bg-blue-50/50 hover:border-blue-400 shadow-sm'}
                        `}
                      >
                        <div className="flex items-center gap-6">
                          <div className={`p-4 rounded-2xl shadow-sm transition-all ${selectedDocName ? 'bg-blue-600 text-white group-hover:scale-110 group-hover:shadow-blue-200 group-hover:shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                            <UploadCloud size={28} />
                          </div>
                          <div className="text-left">
                            <p className="text-base font-bold text-slate-800">
                              {selectedDocName ? `Click to upload ${selectedDocName}` : "Select name to enable upload"}
                            </p>
                            <p className="text-xs text-slate-400 font-medium mt-1">Supports PDF, PNG, JPG (Max 10MB per file)</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {files.length > 0 && (
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-4">
                      <Plus size={18} className="text-blue-600" /> New Attachments
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {files.map((f, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm">
                              <FileText size={16} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-700 truncate">{f.label}</p>
                              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{f.file.name}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setFiles(prev => prev.filter((_, i) => i !== idx))}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {existingDocuments.length > 0 && (
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-4">
                      <ShieldCheck size={18} className="text-emerald-600" /> Existing Documents
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {existingDocuments.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm">
                              <FileText size={16} />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-slate-700 truncate">{file.documentName}</p>
                                {file.uploadedAt && (
                                  <span className="text-[9px] px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded font-bold">
                                    {new Date(file.uploadedAt).toLocaleDateString('en-GB')}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider truncate">{file.fileName}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => preview(file.url)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                              <Eye size={16} />
                            </button>
                            <button onClick={() => download(file.url, file.fileName)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                              <Download size={16} />
                            </button>
                            <button 
                              onClick={async () => {
                                if (!confirm("Delete this document?")) return;
                                try {
                                  await remove(policy?.policyId || renewalId || "", file.id);
                                } catch (e) {
                                  console.error(e);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-8 py-5 bg-white border-t flex justify-between shrink-0">
          <div className="flex gap-3">
            <button
              disabled={isPending}
              onClick={handleSave}
              className="px-8 py-2.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded disabled:opacity-50 transition-all"
            >
              {isAdding || isUpdating ? "Saving..." : isLoadingFetched ? "Loading..." : "SAVE"}
            </button>
            <button
              onClick={() => {
                setErrors({});
                setForm(makeInitial());
                setMemberInput("");
                onClose();
              }}
              className="px-8 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded"
            >
              CANCEL
            </button>
          </div>
          <div className="flex gap-3">
            {activeTab !== "customer" && (
              <button
                onClick={() => {
                  const tabs: TabType[] = ["customer", "policy", "premium", "documents"];
                  const idx = tabs.indexOf(activeTab);
                  if (idx > 0) setActiveTab(tabs[idx - 1]);
                }}
                className="px-6 py-2.5 text-sm font-bold text-white bg-red-400 rounded"
              >
                Previous
              </button>
            )}
            {activeTab !== "documents" && (
              <button
                onClick={() => {
                  const tabs: TabType[] = ["customer", "policy", "premium", "documents"];
                  const idx = tabs.indexOf(activeTab);
                  if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1]);
                }}
                className="px-6 py-2.5 text-sm font-bold text-white bg-blue-500 rounded flex items-center gap-1.5"
              >
                Next <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PolicyUpsertSheet;

/* ─── SHARED HELPERS ─────────────────────────────────────────── */
const Section = ({ icon, title, children }: any) => (
  <section className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-visible mb-4">
    <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 text-white overflow-hidden rounded-t-lg">
      <div className="p-1 bg-white/10 rounded">{icon}</div>
      <h3 className="font-bold uppercase tracking-wider text-[10px] leading-none">{title}</h3>
    </div>
    <div className="p-4 space-y-3">{children}</div>
  </section>
);

const AddBtn = ({ onClick }: any) => (
  <div className="space-y-0.5 w-full">
    <label className="text-sm font-bold uppercase tracking-wider text-[10px] invisible block">Spacer</label>
    <button
      onClick={onClick}
      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded shadow-sm transition-all h-[42px] flex items-center justify-center"
    >
      Add
    </button>
  </div>
);

const Input = ({
  label,
  required,
  value,
  error,
  type = "text",
  onChange,
  placeholder,
  min,
  max,
  disabled,
  className = "",
  suffix
}: any) => (
  <div className="space-y-0.5 w-full">
    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        type={type}
        disabled={disabled}
        min={min}
        max={max}
        placeholder={placeholder}
        className={`
          w-full px-4 py-2.5 bg-white border rounded text-sm transition-all outline-none
          ${error ? "border-red-500 ring-2 ring-red-50" : "border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"}
          ${disabled ? "bg-slate-50 cursor-not-allowed opacity-60" : ""}
          ${suffix ? "pr-14" : ""}
          ${className}
        `}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
      {suffix && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">{suffix}</div>
      )}
    </div>
    <p className="text-[10px] font-medium text-red-500">{error || ""}</p>
  </div>
);

const Select = ({
  label,
  required,
  options,
  value,
  onChange,
  disabled = false,
  valueKey = "id",
  labelKey = "name",
  error,
}: any) => (
  <div className="space-y-0.5 w-full">
    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <select
        disabled={disabled}
        className={`
          w-full px-4 py-2.5 bg-white border rounded text-sm transition-all outline-none appearance-none
          ${error ? "border-red-500 ring-2 ring-red-50" : "border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"}
          ${disabled ? "bg-slate-50 cursor-not-allowed opacity-60" : ""}
        `}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select</option>
        {options?.map((o: any) => (
          <option key={o[valueKey]} value={o[valueKey]}>{o[labelKey]}</option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
    <p className="text-[10px] font-medium text-red-500">{error || ""}</p>
  </div>
);