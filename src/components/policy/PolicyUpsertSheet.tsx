import React, { useState, useEffect } from "react";
import {
  X, ChevronRight, ChevronDown, Plus, Trash2,
  ShieldCheck, Car, Activity, CreditCard, Users
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useUpsertPolicy } from "../../hooks/policy/useUpsertPolicy";

type TabType = "customer" | "policy" | "premium";

/* ─── OPTION LISTS ──────────────────────────────────────────── */
const FAMILY_GROUP_OPTIONS   = [{ id: "7b5f1c5d-92b3-4a0d-9f5f-123456789abc", name: "Family Group A" }];
const HOLDER_OPTIONS         = [{ id: "7b5f1c5d-92b3-4a0d-9f5f-123456789abc", name: "Anant Jaiswal" }];
const GENDER_OPTIONS         = [{ id: "Male", name: "Male" }, { id: "Female", name: "Female" }, { id: "Other", name: "Other" }];
const RELATION_OPTIONS       = [{ id: "Self", name: "Self" }, { id: "Spouse", name: "Spouse" }, { id: "Son", name: "Son" }, { id: "Daughter", name: "Daughter" }, { id: "Father", name: "Father" }, { id: "Mother", name: "Mother" }];
const DIVISION_OPTIONS       = [{ id: "Health", name: "Health Insurance" }, { id: "OtherGeneral", name: "Other General Insurance" }, { id: "Vehicle", name: "Vehicle Insurance" }];
const SEGMENT_OPTIONS        = [{ id: "7b5f1c5d-92b3-4a0d-9f5f-123456789abc", name: "Critical Illness" }, { id: "7b5f1c5d-92b3-4a0d-9f5f-123456789abc", name: "Individual" }];
const POLICY_TYPE_OPTIONS    = [{ id: "FamilyFloter", name: "Family Floter" }, { id: "Package", name: "Package Policy" }];
const COMPANY_OPTIONS        = [{ id: "7b5f1c5d-92b3-4a0d-9f5f-123456789abc", name: "Acko General Insurance Limited" }, { id: "7b5f1c5d-92b3-4a0d-9f5f-123456789abc", name: "Bajaj General" }];
const BRANCH_OPTIONS         = [{ id: "7b5f1c5d-92b3-4a0d-9f5f-123456789abc", name: "Althan" }];
const PRODUCT_OPTIONS        = [{ id: "7b5f1c5d-92b3-4a0d-9f5f-123456789abc", name: "Product X" }];
const ZONE_OPTIONS           = [{ id: "Zone I", name: "Zone I" }, { id: "Zone II", name: "Zone II" }];
const POLICY_MODE_OPTIONS    = [{ id: "7b5f1c5d-92b3-4a0d-9f5f-123456789abc", name: "Yearly" }, { id: "7b5f1c5d-92b3-4a0d-9f5f-123456789abc", name: "Half Yearly" }, { id: "7b5f1c5d-92b3-4a0d-9f5f-123456789abc", name: "Quarterly" }, { id: "7b5f1c5d-92b3-4a0d-9f5f-123456789abc", name: "Monthly" }];
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

/* ─── COMPONENT ─────────────────────────────────────────────── */
const PolicyUpsertSheet = ({ open, onClose, onSuccess, policy }: any) => {
  const [activeTab, setActiveTab]     = useState<TabType>("customer");
  const [form, setForm]               = useState(makeInitial());
  const [memberInput, setMemberInput] = useState("");
  const [errors, setErrors] = useState<any>({});

  const { mutateAsync, isPending } = useUpsertPolicy();

  const isHealth  = form.detail.divisionType === "Health";
  const isVehicle = form.detail.divisionType === "Vehicle";
  const isOther   = form.detail.divisionType === "OtherGeneral";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setForm(makeInitial());
      setErrors({});
      setMemberInput("");
      setActiveTab("customer");
    }
  }, [open]);

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
    if (!memberInput.trim()) return;
    setForm(f => ({ ...f, members: [...f.members, { memberId: null, memberName: memberInput.trim() }] }));
    setMemberInput("");
  };

  const addRiskRow = () => {
    setForm(f => ({ ...f, riskLocations: [...f.riskLocations, { srNo: f.riskLocations.length + 1, sumAssured: 0, riskAddress: "" }] }));
  };

  const validateForm = () => {
    const newErrors: any = {};
  
    // Common validations
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

      const payload = {
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
          divisionType: form.detail.divisionType || "",
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
                memberId: m.memberId || STATIC_GUID,
                memberName: m.memberName || ""
              }))
            : [],

        riskLocations:
          division === "OtherGeneral"
            ? form.riskLocations.map((loc: any, index: number) => ({
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

      const response = await mutateAsync(payload);

      toast.success(response?.statusMessage || "Policy saved successfully!");

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
              <h2 className="text-xl font-bold text-slate-900">{policy ? "Edit General Policy" : "Add General Policy"}</h2>
              <p className="text-slate-500 text-xs mt-0.5">Fill in the details to {policy ? "update" : "create"} the insurance policy.</p>
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
        <div className="flex-1 overflow-y-auto p-8">

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
                      <input type="radio" checked={form.type === t}
                        onChange={() => setForm(f => ({ ...f, type: t }))}
                        className="w-4 h-4 accent-blue-600" />{t}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Transaction Date" required type="date" value={form.transactionDate}
                  onChange={(v:any) => setForm(f => ({ ...f, transactionDate: v }))} />
                <Input label="Document Number" value={form.documentNumber} placeholder="Document number"
                  onChange={(v:any) => setForm(f => ({ ...f, documentNumber: v }))} />
              </div>

              <div className="grid grid-cols-12 gap-4 items-start">
                <div className="col-span-5">
                  <Select
                    label="Family Group"
                    required
                    options={FAMILY_GROUP_OPTIONS}
                    value={form.familyGroupId}
                    error={errors.familyGroupId}
                    onChange={(v:any) => setForm(f => ({ ...f, familyGroupId: v }))}
                  />
                </div>
                <div className="col-span-1"><AddBtn onClick={() => {}} /></div>
                <div className="col-span-5">
                  <Select label="Policy Holder Name" required options={HOLDER_OPTIONS} value={form.policyHolderId} error={errors.policyHolderId}
                    onChange={(v:any) => setForm(f => ({ ...f, policyHolderId: v }))} />
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
                    <Select label="Select Division" required options={DIVISION_OPTIONS} value={form.detail.divisionType} error={errors.divisionType}
                      onChange={(v:any) => patchDetail({ divisionType: v })} />
                  </div>
                </div>

                {isHealth && (
                  <div className="grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-6">
                      <Select label="Select Segment" required options={SEGMENT_OPTIONS} value={form.detail.segmentId} error={errors.segmentId}
                        onChange={(v:any) => patchDetail({ segmentId: v })} />
                    </div>
                    <div className="col-span-1"><AddBtn onClick={() => {}} /></div>
                    <div className="col-span-5">
                      <Select label="Policy Type" options={POLICY_TYPE_OPTIONS} value={form.detail.policyType}
                        onChange={(v:any) => patchDetail({ policyType: v })} />
                    </div>
                  </div>
                )}

                {isOther && (
                  <div className="grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-6">
                      <Select label="Select Segment" required options={SEGMENT_OPTIONS} value={form.detail.segmentId} error={errors.segmentId}
                        onChange={(v:any) => patchDetail({ segmentId: v })} />
                    </div>
                    <div className="col-span-1"><AddBtn onClick={() => {}} /></div>
                    <div className="col-span-5">
                      <Select label="Policy Type" options={POLICY_TYPE_OPTIONS} value={form.detail.policyType}
                        onChange={(v:any) => patchDetail({ policyType: v })} />
                    </div>
                  </div>
                )}

                {isVehicle && (
                  <div className="grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-3">
                      <Select label="Vehicle Uses" options={VEHICLE_USE_OPTIONS} value={form.detail.vehicleUse}   error={errors.vehicleUse}
                        onChange={(v:any) => patchDetail({ vehicleUse: v })} />
                    </div>
                    <div className="col-span-3">
                      <Select label="Vehicle Class" options={VEHICLE_CLASS_OPTIONS} value={form.detail.vehicleClass}  error={errors.vehicleClass}
                        onChange={(v:any) => patchDetail({ vehicleClass: v })} />
                    </div>
                    <div className="col-span-5">
                      <Select label="Select Segment" required options={SEGMENT_OPTIONS} value={form.detail.segmentId} error={errors.segmentId}
                        onChange={(v:any) => patchDetail({ segmentId: v })} />
                    </div>
                    <div className="col-span-1"><AddBtn onClick={() => {}} /></div>
                  </div>
                )}

                <div className="grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-6">
                    <Select label="Select Insurance Company" required options={COMPANY_OPTIONS}
                      value={form.detail.insuranceCompanyId} error={errors.insuranceCompanyId} onChange={(v:any) => patchDetail({ insuranceCompanyId: v })} />
                  </div>
                  <div className="col-span-4">
                    <Select label="Select Branch" options={BRANCH_OPTIONS} value={form.detail.branchId}
                      onChange={(v:any) => patchDetail({ branchId: v })} />
                  </div>
                  <div className="col-span-2"><AddBtn onClick={() => {}} /></div>
                </div>

                <div className="grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-5">
                    <Select label="Product Name" options={PRODUCT_OPTIONS} value={form.detail.productId}
                      onChange={(v:any) => patchDetail({ productId: v })} />
                  </div>
                  <div className="col-span-1"><AddBtn onClick={() => {}} /></div>
                  <div className="col-span-6">
                    <Select label="Zone" options={ZONE_OPTIONS} value={form.detail.zone}
                      onChange={(v:any) => patchDetail({ zone: v })} />
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-4">
                    <Select
                      label="Select Broker"
                      required
                      options={BROKER_OPTIONS}
                      value={form.detail.brokerId}
                      error={errors.brokerId}
                      onChange={(v: any) => patchDetail({ brokerId: v })}
                    />
                  </div>

                  <div className="col-span-4">
                    <Select
                      label="Select Agency Name"
                      required
                      options={AGENCY_OPTIONS}
                      value={form.detail.agencyId}
                      error={errors.agencyId}
                      onChange={(v: any) => patchDetail({ agencyId: v })}
                    />
                  </div>

                  <div className="col-span-4">
                    <Select
                      label="Select Sub Agent Name"
                      options={SUB_AGENT_OPTIONS}
                      value={form.detail.subAgentId}
                      onChange={(v: any) => patchDetail({ subAgentId: v })}
                    />
                  </div>
                </div>
                
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
                      <select className="flex-1 min-w-[200px] text-sm outline-none bg-transparent"
                        value="" onChange={e => { if (e.target.value) toggleMulti("optionalCover", e.target.value); }}>
                        <option value="">Search for optional cover</option>
                        {OPT_COVER_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                      </select>
                    </div>
                    {/* Always reserve error space — same as Input/Select */}
                    <p className="text-[10px] font-medium text-red-500">
                      {errors.optionalCover || ""}
                    </p>
                  </div>
                )}

                {/* ── OPTIONAL COVER (Health) ── FIXED: label now matches Input/Select exactly */}
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
                      <select className="flex-1 min-w-[200px] text-sm outline-none bg-transparent"
                        value="" onChange={e => { if (e.target.value) toggleMulti("optionalCover", e.target.value); }}>
                        <option value="">Search for optional cover</option>
                        {OPT_COVER_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                      </select>
                    </div>
                    {/* Always reserve error space — same as Input/Select */}
                    <p className="text-[10px] font-medium text-red-500">
                      {errors.optionalCover || ""}
                    </p>
                  </div>
                )}

                {/* ── ADD ONS (Vehicle) ── FIXED: label now matches Input/Select exactly */}
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
                    {/* Always reserve error space — same as Input/Select */}
                    <p className="text-[10px] font-medium text-red-500">
                      {errors.addOns || ""}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-2 flex items-center gap-2 pb-2.5">
                    <input type="checkbox" id="isPolicyReceived" checked={form.detail.isPolicyReceived}
                      onChange={e => patchDetail({ isPolicyReceived: e.target.checked })}
                      className="w-4 h-4 accent-blue-600 rounded" />
                    <label htmlFor="isPolicyReceived" className="text-sm font-medium">Is Received</label>
                  </div>
                  <div className="col-span-5">
                    <Input label="Current Policy Number" value={form.detail.currentPolicyNumber} onChange={(v:any) => patchDetail({ currentPolicyNumber: v })} />
                  </div>
                  <div className="col-span-5">
                    <Input label="Previous Policy Number" value={form.detail.previousPolicyNumber} onChange={(v:any) => patchDetail({ previousPolicyNumber: v })} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Select label="Policy Mode" required options={POLICY_MODE_OPTIONS} value={form.detail.policyModeId} error={errors.policyModeId}
                    onChange={(v:any) => patchDetail({ policyModeId: v })} />
                  <Input label="Risk Start Date" required type="date" value={form.detail.riskStartDate} error={errors.riskStartDate}
                    onChange={(v:any) => patchDetail({ riskStartDate: v })} />
                  <Input label="Risk End Date" required type="date" value={form.detail.riskEndDate} error={errors.riskEndDate}
                    onChange={(v:any) => patchDetail({ riskEndDate: v })} />
                </div>

                {isVehicle && (
                  <div className="grid grid-cols-2 gap-4">
                    <Select label="TP Policy Mode" required options={TP_MODE_OPTIONS} value={form.detail.tpPolicyMode}  error={errors.tpPolicyMode}
                      onChange={(v:any) => patchDetail({ tpPolicyMode: v })} />
                    <Input label="TP Due Date" required type="date" value={form.detail.tpDueDate}   error={errors.tpDueDate}
                      onChange={(v:any) => patchDetail({ tpDueDate: v })} />
                  </div>
                )}

                {(isOther || isVehicle) && (
                  <div className="grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-10">
                      <Select label="Select Bank Name" options={BANK_OPTIONS} value={form.detail.bankId}
                        onChange={(v:any) => patchDetail({ bankId: v })} />
                    </div>
                    <div className="col-span-2"><AddBtn onClick={() => {}} /></div>
                  </div>
                )}

                {isHealth && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-12 gap-4 items-start">
                      <div className="col-span-10">
                        <Input label="Select Family Member" value={memberInput} onChange={(v:any) => setMemberInput(v)} />
                      </div>
                      <div className="col-span-2">
                        <button onClick={addMember} className="w-full py-2.5 bg-blue-600 text-white text-sm font-bold rounded">+ Add</button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.members.map((m, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-200">
                          {m.memberName}
                          <button onClick={() => setForm(f => ({ ...f, members: f.members.filter((_, idx) => idx !== i) }))} className="hover:text-red-500">✕</button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {isOther && (
                  <div className="space-y-3">
                    <button onClick={addRiskRow} className="py-2 px-4 bg-blue-600 text-white text-sm font-bold rounded flex items-center gap-2"><Plus size={14}/> Add Risk Row</button>
                    {form.riskLocations.map((loc, i) => (
                      <div key={i} className="grid grid-cols-12 gap-3 items-center">
                        <div className="col-span-1"><Input label="No" value={loc.srNo} disabled onChange={()=>{}}/></div>
                        <div className="col-span-3"><Input label="Sum Assured" value={loc.sumAssured} error={errors.sumAssured} type="number" onChange={(v:any)=> {
                          const updated = [...form.riskLocations]; updated[i].sumAssured = Number(v); setForm(f=>({...f, riskLocations: updated}))
                        }}/></div>
                        <div className="col-span-7"><Input label="Address" value={loc.riskAddress} onChange={(v:any)=>{
                          const updated = [...form.riskLocations]; updated[i].riskAddress = v; setForm(f=>({...f, riskLocations: updated}))
                        }}/></div>
                        <div className="col-span-1 flex justify-center pt-5">
                          <button onClick={() => setForm(f => ({ ...f, riskLocations: f.riskLocations.filter((_, idx) => idx !== i) }))} className="text-red-500"><Trash2 size={16} /></button>
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
                    ? <Input label="IDV Value" required type="number" value={form.premium.idvValue} onChange={(v:any) => patchPremium({ idvValue: Number(v) })} />
                    : <Input label="Sum Assured" required type="number" value={form.premium.sumAssured} error={errors.sumAssured} onChange={(v:any) => patchPremium({ sumAssured: Number(v) })} />
                  }
                  <Input label="Basic Premium" required type="number" value={form.premium.basicPremium} error={errors.basicPremium} onChange={(v:any) => patchPremium({ basicPremium: Number(v) })} />
                  {isVehicle && <Input label="Tpa Premium" type="number" value={form.premium.tpaPremium} onChange={(v:any) => patchPremium({ tpaPremium: Number(v) })} />}
                  <Input label="Tax Amount" type="number" value={form.premium.taxAmount} onChange={(v:any) => patchPremium({ taxAmount: Number(v) })} />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <Input label="Total Premium" required type="number" value={form.premium.totalPremium} error={errors.totalPremium} onChange={(v:any) => patchPremium({ totalPremium: Number(v) })} />
                  <Input label="Comm. Amount" type="number" value={form.premium.commissionableAmount} onChange={(v:any) => patchPremium({ commissionableAmount: Number(v) })} />
                  <Input label="Entry (%)" type="number" value={form.premium.commissionEntry} onChange={(v:any) => patchPremium({ commissionEntry: Number(v) })} />
                  <Input label="Commitment" type="number" value={form.premium.commitmentAmount} onChange={(v:any) => patchPremium({ commitmentAmount: Number(v) })} />
                </div>
              </Section>

              <Section icon={<CreditCard size={14} />} title="Payment Details">
                <div className="grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-3"><Select label="Paid By Client" options={PAID_BY_OPTIONS} value={form.payment.paidByClient} onChange={(v:any) => patchPayment({ paidByClient: v })} /></div>
                  <div className="col-span-3"><Input label="Client Amount" type="number" value={form.payment.clientAmount} onChange={(v:any) => patchPayment({ clientAmount: Number(v) })} /></div>
                  <div className="col-span-3"><Select label="Paid By Agent" options={PAID_BY_OPTIONS} value={form.payment.paidByAgent} onChange={(v:any) => patchPayment({ paidByAgent: v })} /></div>
                  <div className="col-span-3"><Input label="Agent Amount" type="number" value={form.payment.agentAmount} onChange={(v:any) => patchPayment({ agentAmount: Number(v) })} /></div>
                </div>
              </Section>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-8 py-5 bg-white border-t flex justify-between shrink-0">
          <div className="flex gap-3">
            <button disabled={isPending} onClick={handleSave} className="px-8 py-2.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded disabled:opacity-50 transition-all">
              {isPending ? "Saving..." : "SAVE"}
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
              <button onClick={() => setActiveTab(activeTab === "premium" ? "policy" : "customer")} className="px-6 py-2.5 text-sm font-bold text-white bg-red-400 rounded">Previous</button>
            )}
            {activeTab !== "premium" && (
              <button onClick={() => setActiveTab(activeTab === "customer" ? "policy" : "premium")} className="px-6 py-2.5 text-sm font-bold text-white bg-blue-500 rounded flex items-center gap-1.5">Next <ChevronRight size={16} /></button>
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
  <section className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-4">
    <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 text-white">
      <div className="p-1 bg-white/10 rounded">{icon}</div>
      <h3 className="font-bold uppercase tracking-wider text-[10px] leading-none">{title}</h3>
    </div>
    <div className="p-4 space-y-3">{children}</div>
  </section>
);

const AddBtn = ({ onClick }: any) => (
  <div className="space-y-1.5 w-full">
    <label className="text-[10px] font-bold uppercase invisible">Add</label>
    <button
      onClick={onClick}
      className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded"
    >
      Add
    </button>
    <p className="h-4 text-[10px] invisible">error</p>
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