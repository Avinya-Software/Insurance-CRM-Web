import React, { useState, useEffect } from "react";
import {
  X, ChevronRight, ChevronDown, Plus, Trash2,
  AlertCircle, ShieldCheck, Car, Activity, CreditCard, Users, MapPin
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// --- Mock/Real Hooks ---
const useUpsertPolicy = () => ({ mutateAsync: async (d: any) => console.log("Payload:", d), isPending: false });

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  policy?: any;
}

type TabType = "customer" | "policy" | "premium";

/* ─── OPTION LISTS ──────────────────────────────────────────── */
const FAMILY_GROUP_OPTIONS   = [{ id: "1", name: "Family Group A" }];
const HOLDER_OPTIONS         = [{ id: "2", name: "Anant Jaiswal" }];
const GENDER_OPTIONS         = [{ id: "Male", name: "Male" }, { id: "Female", name: "Female" }, { id: "Other", name: "Other" }];
const RELATION_OPTIONS       = [{ id: "Self", name: "Self" }, { id: "Spouse", name: "Spouse" }, { id: "Son", name: "Son" }, { id: "Daughter", name: "Daughter" }, { id: "Father", name: "Father" }, { id: "Mother", name: "Mother" }];
const DIVISION_OPTIONS       = [{ id: "Health", name: "Health Insurance" }, { id: "OtherGeneral", name: "Other General Insurance" }, { id: "Vehicle", name: "Vehicle Insurance" }];
const SEGMENT_OPTIONS        = [{ id: "1", name: "Critical Illness" }, { id: "2", name: "Individual" }];
const POLICY_TYPE_OPTIONS    = [{ id: "FamilyFloter", name: "Family Floter" }, { id: "Package", name: "Package Policy" }];
const COMPANY_OPTIONS        = [{ id: "1", name: "Acko General Insurance Limited" }, { id: "2", name: "Bajaj General" }];
const BRANCH_OPTIONS         = [{ id: "1", name: "Althan" }];
const PRODUCT_OPTIONS        = [{ id: "1", name: "Product X" }];
const ZONE_OPTIONS           = [{ id: "Zone I", name: "Zone I" }, { id: "Zone II", name: "Zone II" }];
const POLICY_MODE_OPTIONS    = [{ id: "Yearly", name: "Yearly" }, { id: "HalfYearly", name: "Half Yearly" }, { id: "Quarterly", name: "Quarterly" }, { id: "Monthly", name: "Monthly" }];
const OPT_COVER_OPTIONS      = [{ id: "NoClaim", name: "No Claim Bonus Protection" }, { id: "PA", name: "Personal Accident" }];
const ADD_ON_OPTIONS         = [{ id: "ZeroDepreciation", name: "Zero Depreciation" }, { id: "RoadsideAssist", name: "Roadside Assistance" }];
const BROKER_OPTIONS         = [{ id: "1", name: "Rajeshbhai" }];
const AGENCY_OPTIONS         = [{ id: "1", name: "Jk" }];
const SUB_AGENT_OPTIONS      = [{ id: "1", name: "Seni" }];
const NOMINEE_OPTIONS        = [{ id: "1", name: "Anant Jaiswal" }];
const PAID_BY_OPTIONS        = [{ id: "Cash", name: "Cash" }, { id: "Online", name: "Online" }, { id: "Cheque", name: "Cheque" }];
const VEHICLE_USE_OPTIONS    = [{ id: "Private", name: "Private" }, { id: "Commercial", name: "Commercial" }];
const VEHICLE_CLASS_OPTIONS  = [{ id: "Misc", name: "Miscellaneous" }, { id: "2W", name: "Two Wheeler" }, { id: "4W", name: "Four Wheeler" }];
const FUEL_TYPE_OPTIONS      = [{ id: "Petrol", name: "Petrol" }, { id: "Diesel", name: "Diesel" }, { id: "Electric", name: "Electric" }, { id: "CNG", name: "CNG" }];
const RTO_OPTIONS            = [{ id: "GJ05", name: "GJ-05 Surat" }];
const NCB_OPTIONS            = [{ id: "0", name: "0%" }, { id: "20", name: "20%" }, { id: "25", name: "25%" }, { id: "35", name: "35%" }];
const TP_MODE_OPTIONS        = [{ id: "Yearly", name: "Yearly" }, { id: "2Year", name: "2 Years" }, { id: "3Year", name: "3 Years" }];
const BANK_OPTIONS           = [{ id: "1", name: "SBI Bank" }, { id: "2", name: "HDFC Bank" }];

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
const PolicyUpsertSheet = ({ open, onClose, onSuccess, policy }: Props) => {
  const [activeTab, setActiveTab]     = useState<TabType>("customer");
  const [form, setForm]               = useState(makeInitial());
  const [memberInput, setMemberInput] = useState("");
  const { mutateAsync, isPending }    = useUpsertPolicy();

  const isHealth  = form.detail.divisionType === "Health";
  const isVehicle = form.detail.divisionType === "Vehicle";
  const isOther   = form.detail.divisionType === "OtherGeneral";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [open]);

  useEffect(() => {
    if (!open) { setForm(makeInitial()); setActiveTab("customer"); }
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

  const handleSave = async () => {
    try { await mutateAsync(form); toast.success("Policy saved!"); onClose(); onSuccess(); }
    catch { toast.error("Error saving policy"); }
  };

  if (!open) return null;

  const TABS = [
    { id: "customer" as TabType, label: "Customer Information", icon: Users },
    { id: "policy"   as TabType, label: "Policy Details",       icon: ShieldCheck },
    { id: "premium"  as TabType, label: "Premium & Payment",    icon: CreditCard },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]" onClick={isPending ? undefined : onClose} />

      <div className="fixed top-0 right-0 w-full max-w-[82vw] h-screen bg-slate-50 z-[70] shadow-2xl flex flex-col">

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
              {/* Insurance Type */}
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

              {/* Transaction Date | Document Number */}
              <div className="grid grid-cols-2 gap-4">
                <Input label="Transaction Date" required type="date" value={form.transactionDate}
                  onChange={(v) => setForm(f => ({ ...f, transactionDate: v }))} />
                <Input label="Document Number" required value={form.documentNumber} placeholder="Document number"
                  onChange={(v) => setForm(f => ({ ...f, documentNumber: v }))} />
              </div>

              {/* Family Group + Add | Policy Holder + Add */}
              <div className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-5">
                  <Select label="Family Group" required options={FAMILY_GROUP_OPTIONS} value={form.familyGroupId}
                    onChange={(v) => setForm(f => ({ ...f, familyGroupId: v }))} />
                </div>
                <div className="col-span-1"><AddBtn onClick={() => toast.success("Add Family Group")} /></div>
                <div className="col-span-5">
                  <Select label="Policy Holder Name" required options={HOLDER_OPTIONS} value={form.policyHolderId}
                    onChange={(v) => setForm(f => ({ ...f, policyHolderId: v }))} />
                </div>
                <div className="col-span-1"><AddBtn onClick={() => toast.success("Add Policy Holder")} /></div>
              </div>

              {/* First / Middle / Last */}
              <div className="grid grid-cols-3 gap-4">
                <Input label="First Name" value={form.firstName} placeholder="First Name"
                  onChange={(v) => setForm(f => ({ ...f, firstName: v }))} />
                <Input label="Middle Name" value={form.middleName} placeholder="Middle name"
                  onChange={(v) => setForm(f => ({ ...f, middleName: v }))} />
                <Input label="Last Name" value={form.lastName} placeholder="Last name"
                  onChange={(v) => setForm(f => ({ ...f, lastName: v }))} />
              </div>

              {/* Address */}
              <div className="grid grid-cols-2 gap-4">
                <Input label="Address Line1" value={form.addressLine1} placeholder="Address Line 1"
                  onChange={(v) => setForm(f => ({ ...f, addressLine1: v }))} />
                <Input label="Address Line2" value={form.addressLine2} placeholder="Address line 2"
                  onChange={(v) => setForm(f => ({ ...f, addressLine2: v }))} />
              </div>

              {/* City / Area / Mobile / Gender */}
              <div className="grid grid-cols-4 gap-4">
                <Input label="City" value={form.city} placeholder="City"
                  onChange={(v) => setForm(f => ({ ...f, city: v }))} />
                <Input label="Area" value={form.area} placeholder="Area"
                  onChange={(v) => setForm(f => ({ ...f, area: v }))} />
                <Input label="Mobile Number" value={form.mobileNumber} placeholder="Mobile Number"
                  onChange={(v) => setForm(f => ({ ...f, mobileNumber: v }))} />
                <Select label="Gender" options={GENDER_OPTIONS} value={form.gender}
                  onChange={(v) => setForm(f => ({ ...f, gender: v }))} />
              </div>

              {/* Email / DOB / Relation */}
              <div className="grid grid-cols-3 gap-4">
                <Input label="Email Address" value={form.email} placeholder="Email address"
                  onChange={(v) => setForm(f => ({ ...f, email: v }))} />
                <Input label="DOB" type="date" value={form.dob} placeholder="dd-mm-yyyy"
                  onChange={(v) => setForm(f => ({ ...f, dob: v }))} />
                <Select label="Relation With Head" options={RELATION_OPTIONS} value={form.relationWithHead}
                  onChange={(v) => setForm(f => ({ ...f, relationWithHead: v }))} />
              </div>
            </Section>
          )}

          {/* ══ TAB 2: POLICY DETAILS ══ */}
          {activeTab === "policy" && (
            <div className="space-y-6">
              <Section icon={<ShieldCheck size={14} />} title="Policy Specifications">

                {/* ── ROW 1: Division + division-specific fields ── */}

                {/* HEALTH: Division | Segment + Add | Policy Type */}
                {isHealth && (
                  <div className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-3">
                      <Select label="Select Division" required options={DIVISION_OPTIONS} value={form.detail.divisionType}
                        onChange={(v) => patchDetail({ divisionType: v })} />
                    </div>
                    <div className="col-span-4">
                      <Select label="Select Segment" required options={SEGMENT_OPTIONS} value={form.detail.segmentId}
                        onChange={(v) => patchDetail({ segmentId: v })} />
                    </div>
                    <div className="col-span-1"><AddBtn onClick={() => toast.success("Add Segment")} /></div>
                    <div className="col-span-4">
                      <Select label="Policy Type" options={POLICY_TYPE_OPTIONS} value={form.detail.policyType}
                        onChange={(v) => patchDetail({ policyType: v })} clearable />
                    </div>
                  </div>
                )}

                {/* OTHER GENERAL: Division | Segment + Add | Policy Type */}
                {isOther && (
                  <div className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-3">
                      <Select label="Select Division" required options={DIVISION_OPTIONS} value={form.detail.divisionType}
                        onChange={(v) => patchDetail({ divisionType: v })} />
                    </div>
                    <div className="col-span-4">
                      <Select label="Select Segment" required options={SEGMENT_OPTIONS} value={form.detail.segmentId}
                        placeholder="Search for segment" onChange={(v) => patchDetail({ segmentId: v })} />
                    </div>
                    <div className="col-span-1"><AddBtn onClick={() => toast.success("Add Segment")} /></div>
                    <div className="col-span-4">
                      <Select label="Policy Type" options={POLICY_TYPE_OPTIONS} value={form.detail.policyType}
                        onChange={(v) => patchDetail({ policyType: v })} clearable />
                    </div>
                  </div>
                )}

                {/* VEHICLE: Division | Vehicle Uses | Vehicle Class | Segment + Add */}
                {isVehicle && (
                  <div className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-3">
                      <Select label="Select Division" required options={DIVISION_OPTIONS} value={form.detail.divisionType}
                        onChange={(v) => patchDetail({ divisionType: v })} />
                    </div>
                    <div className="col-span-2">
                      <Select label="Vehicle Uses" options={VEHICLE_USE_OPTIONS} value={form.detail.vehicleUse}
                        placeholder="Search for vehicle uses" onChange={(v) => patchDetail({ vehicleUse: v })} />
                    </div>
                    <div className="col-span-2">
                      <Select label="Vehicle Class" options={VEHICLE_CLASS_OPTIONS} value={form.detail.vehicleClass}
                        placeholder="Search for vehicle class" onChange={(v) => patchDetail({ vehicleClass: v })} />
                    </div>
                    <div className="col-span-4">
                      <Select label="Select Segment" required options={SEGMENT_OPTIONS} value={form.detail.segmentId}
                        placeholder="Search for segment" onChange={(v) => patchDetail({ segmentId: v })} />
                    </div>
                    <div className="col-span-1"><AddBtn onClick={() => toast.success("Add Segment")} /></div>
                  </div>
                )}

                {/* ── ROW 2: Insurance Company | Branch + Add ── */}
                <div className="grid grid-cols-12 gap-4 items-end">
                  <div className="col-span-6">
                    <Select label="Select Insurance Company" required options={COMPANY_OPTIONS}
                      value={form.detail.insuranceCompanyId}
                      onChange={(v) => patchDetail({ insuranceCompanyId: v })} />
                  </div>
                  <div className="col-span-4">
                    <Select label="Select Branch" options={BRANCH_OPTIONS} value={form.detail.branchId}
                      onChange={(v) => patchDetail({ branchId: v })} clearable />
                  </div>
                  <div className="col-span-2"><AddBtn onClick={() => toast.success("Add Branch")} /></div>
                </div>

                {/* ── ROW 3: Product Name + Add | Zone ── */}
                <div className="grid grid-cols-12 gap-4 items-end">
                  <div className="col-span-5">
                    <Select label="Product Name" options={PRODUCT_OPTIONS} value={form.detail.productId}
                      placeholder="Search for product name" onChange={(v) => patchDetail({ productId: v })} />
                  </div>
                  <div className="col-span-1"><AddBtn onClick={() => toast.success("Add Product")} /></div>
                  <div className="col-span-6">
                    <Select label="Zone" options={ZONE_OPTIONS} value={form.detail.zone}
                      onChange={(v) => patchDetail({ zone: v })} clearable />
                  </div>
                </div>

                {/* ── HEALTH ONLY: Optional Cover ── */}
                {isHealth && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Optional Cover</label>
                    <div className="border border-slate-200 rounded bg-white px-3 py-2 min-h-[42px] flex flex-wrap gap-2 items-center">
                      {form.detail.optionalCover.map(v => (
                        <span key={v} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded border border-blue-200">
                          × {OPT_COVER_OPTIONS.find(o => o.id === v)?.name ?? v}
                          <button onClick={() => toggleMulti("optionalCover", v)} className="ml-1 hover:text-red-500 text-slate-400">✕</button>
                        </span>
                      ))}
                      <select className="flex-1 min-w-[200px] text-sm outline-none bg-transparent text-slate-400"
                        value="" onChange={e => { if (e.target.value) toggleMulti("optionalCover", e.target.value); }}>
                        <option value="">Search for optional cover</option>
                        {OPT_COVER_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                      </select>
                      {form.detail.optionalCover.length > 0 && (
                        <button onClick={() => patchDetail({ optionalCover: [] })}
                          className="text-slate-400 hover:text-red-400 text-xs px-1">✕</button>
                      )}
                    </div>
                  </div>
                )}

                {/* ── VEHICLE ONLY: Add Ons ── */}
                {isVehicle && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Add Ons</label>
                    <div className="border border-slate-200 rounded bg-white px-3 py-2 min-h-[42px] flex flex-wrap gap-2 items-center">
                      {form.detail.addOns.map(v => (
                        <span key={v} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded border border-blue-200">
                          {ADD_ON_OPTIONS.find(o => o.id === v)?.name ?? v}
                          <button onClick={() => toggleMulti("addOns", v)} className="ml-1 hover:text-red-500 text-slate-400">✕</button>
                        </span>
                      ))}
                      <select className="flex-1 min-w-[200px] text-sm outline-none bg-transparent text-slate-400"
                        value="" onChange={e => { if (e.target.value) toggleMulti("addOns", e.target.value); }}>
                        <option value="">Search for add ons</option>
                        {ADD_ON_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {/* ── Is Policy Received + Current / Previous Policy Number ── */}
                <div className="grid grid-cols-12 gap-4 items-end">
                  <div className="col-span-2 flex items-center gap-2 pb-2.5">
                    <input type="checkbox" id="isPolicyReceived" checked={form.detail.isPolicyReceived}
                      onChange={e => patchDetail({ isPolicyReceived: e.target.checked })}
                      className="w-4 h-4 accent-blue-600 rounded" />
                    <label htmlFor="isPolicyReceived" className="text-sm text-slate-700 font-medium cursor-pointer whitespace-nowrap">
                      Is Policy Received
                    </label>
                  </div>
                  <div className="col-span-5">
                    <Input label="Current Policy Number" value={form.detail.currentPolicyNumber}
                      placeholder="Current policy number" onChange={(v) => patchDetail({ currentPolicyNumber: v })} />
                  </div>
                  <div className="col-span-5">
                    <Input label="Previous Policy Number" value={form.detail.previousPolicyNumber}
                      placeholder="Previous policy number" onChange={(v) => patchDetail({ previousPolicyNumber: v })} />
                  </div>
                </div>

                {/* ── Policy Documents ── */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Policy Documents{" "}
                    <span className="font-normal normal-case text-slate-400">(JPG, PNG, JPEG Or PDF)</span>
                  </label>
                  <div className="border border-slate-200 rounded bg-white flex items-center overflow-hidden">
                    <label className="px-4 py-2.5 bg-slate-100 border-r border-slate-200 text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-200 transition-colors whitespace-nowrap">
                      Choose Files
                      <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
                    </label>
                    <span className="px-4 text-sm text-slate-400">No file chosen</span>
                  </div>
                </div>

                {/* ── Policy Mode + Risk Start + Risk End ── */}
                <div className="grid grid-cols-3 gap-4">
                  <Select label="Select Policy Mode" required options={POLICY_MODE_OPTIONS} value={form.detail.policyModeId}
                    onChange={(v) => patchDetail({ policyModeId: v })} />
                  <Input label="Risk Start Date" required type="date" value={form.detail.riskStartDate}
                    onChange={(v) => patchDetail({ riskStartDate: v })} />
                  <Input label="Risk End Date" required type="date" value={form.detail.riskEndDate}
                    onChange={(v) => patchDetail({ riskEndDate: v })} />
                </div>

                {/* ── VEHICLE ONLY: TP Policy Mode + TP Due Date ── */}
                {isVehicle && (
                  <div className="grid grid-cols-2 gap-4">
                    <Select label="Select Tp Policy Mode" required options={TP_MODE_OPTIONS} value={form.detail.tpPolicyMode}
                      placeholder="Search for tp mode" onChange={(v) => patchDetail({ tpPolicyMode: v })} />
                    <Input label="TP Due Date" required type="date" value={form.detail.tpDueDate}
                      onChange={(v) => patchDetail({ tpDueDate: v })} />
                  </div>
                )}

                {/* ── OTHER GENERAL + VEHICLE: Select Bank Name + Add ── */}
                {(isOther || isVehicle) && (
                  <div className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-10">
                      <Select label="Select Bank Name" options={BANK_OPTIONS} value={form.detail.bankId}
                        placeholder="Search for bank" onChange={(v) => patchDetail({ bankId: v })} />
                    </div>
                    <div className="col-span-2"><AddBtn onClick={() => toast.success("Add Bank")} /></div>
                  </div>
                )}

                {/* ── HEALTH ONLY: Select Family Member + Add Member ── */}
                {isHealth && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-12 gap-4 items-end">
                      <div className="col-span-10">
                        <Input label="Select Family Member" value={memberInput}
                          placeholder="Search for family member" onChange={(v) => setMemberInput(v)} />
                      </div>
                      <div className="col-span-2">
                        <button onClick={addMember}
                          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded transition-colors">
                          + Add Member
                        </button>
                      </div>
                    </div>
                    {form.members.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {form.members.map((m, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-200">
                            {m.memberName}
                            <button onClick={() => setForm(f => ({ ...f, members: f.members.filter((_, idx) => idx !== i) }))}
                              className="hover:text-red-500 text-slate-400">✕</button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded text-center">
                      <p className="text-xs text-blue-600">
                        Selected members are displayed in the claim intimation under the patient name field.
                      </p>
                    </div>
                  </div>
                )}

                {/* ── OTHER GENERAL ONLY: Risk Location rows ── */}
                {isOther && (
                  <div className="space-y-3">
                    {/* header row with labels + Row button */}
                    <div className="grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-1">
                        <Input label="Sr. No." value="" disabled onChange={() => {}} />
                      </div>
                      <div className="col-span-3">
                        <Input label="Risk Location Sum Assured" value="" onChange={() => {}} />
                      </div>
                      <div className="col-span-6">
                        <Input label="Enter Risk Location Address" value="" onChange={() => {}} />
                      </div>
                      <div className="col-span-2">
                        <button onClick={addRiskRow}
                          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded transition-colors flex items-center justify-center gap-1">
                          <Plus size={14} /> Row
                        </button>
                      </div>
                    </div>
                    {form.riskLocations.map((loc, i) => (
                      <div key={i} className="grid grid-cols-12 gap-3 items-center">
                        <div className="col-span-1">
                          <Input label="" value={loc.srNo} disabled onChange={() => {}} />
                        </div>
                        <div className="col-span-3">
                          <Input label="" value={loc.sumAssured} type="number"
                            onChange={(v) => {
                              const updated = [...form.riskLocations];
                              updated[i].sumAssured = Number(v);
                              setForm(f => ({ ...f, riskLocations: updated }));
                            }} />
                        </div>
                        <div className="col-span-7">
                          <Input label="" value={loc.riskAddress}
                            onChange={(v) => {
                              const updated = [...form.riskLocations];
                              updated[i].riskAddress = v;
                              setForm(f => ({ ...f, riskLocations: updated }));
                            }} />
                        </div>
                        <div className="col-span-1 flex justify-center">
                          <button onClick={() => setForm(f => ({ ...f, riskLocations: f.riskLocations.filter((_, idx) => idx !== i) }))}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </Section>

              {/* ── VEHICLE DETAILS SECTION (shown only for Vehicle) ── */}
              {isVehicle && (
                <Section icon={<Car size={14} />} title="Vehicle Details">
                  {/* BH Series + Registration + Vehicle Name + Engine No + Chassis No */}
                  <div className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-1 flex items-center gap-1.5 pb-2.5">
                      <input type="checkbox" id="bhSeries" checked={form.vehicle.bhSeries}
                        onChange={e => patchVehicle({ bhSeries: e.target.checked })}
                        className="w-4 h-4 accent-blue-600" />
                      <label htmlFor="bhSeries" className="text-xs text-slate-700 font-medium cursor-pointer whitespace-nowrap">BH Series</label>
                    </div>
                    <div className="col-span-3">
                      <Input label="Vehicle Registration Number" required value={form.vehicle.vehicleNumber}
                        placeholder="EG. GJ-05-AB-1234" onChange={(v) => patchVehicle({ vehicleNumber: v })} />
                    </div>
                    <div className="col-span-2">
                      <Input label="Vehicle Name" required value={form.vehicle.vehicleName}
                        placeholder="Vehicle name" onChange={(v) => patchVehicle({ vehicleName: v })} />
                    </div>
                    <div className="col-span-3">
                      <Input label="Engine No" value={form.vehicle.engineNo}
                        placeholder="VEHICLE ENGINE NO" onChange={(v) => patchVehicle({ engineNo: v })} />
                    </div>
                    <div className="col-span-3">
                      <Input label="Chassis No" value={form.vehicle.chassisNo}
                        placeholder="Vehicle Chassis No" onChange={(v) => patchVehicle({ chassisNo: v })} />
                    </div>
                  </div>

                  {/* Brand + Fuel Type + Register Date + Year of Manufacture */}
                  <div className="grid grid-cols-4 gap-4">
                    <Input label="Vehicle Brand" value={form.vehicle.brand}
                      placeholder="Vehicle brand" onChange={(v) => patchVehicle({ brand: v })} />
                    <Select label="Vehicle Fuel Type" required options={FUEL_TYPE_OPTIONS} value={form.vehicle.fuelType}
                      placeholder="Search for fuel type" onChange={(v) => patchVehicle({ fuelType: v })} />
                    <Input label="Register Date" type="date" value={form.vehicle.registerDate}
                      onChange={(v) => patchVehicle({ registerDate: v })} />
                    <Input label="Year Of Manufacture" value={form.vehicle.manufactureYear}
                      placeholder="YYYY" onChange={(v) => patchVehicle({ manufactureYear: v })} />
                  </div>

                  {/* RTO + CC + GVW + NCB */}
                  <div className="grid grid-cols-4 gap-4">
                    <Select label="RTO" required options={RTO_OPTIONS} value={form.vehicle.rto}
                      placeholder="Search for RTO" onChange={(v) => patchVehicle({ rto: v })} />
                    <Input label="CC" required value={form.vehicle.cc}
                      placeholder="Enter cc" onChange={(v) => patchVehicle({ cc: v })} />
                    <Input label="GVW" required value={form.vehicle.gvw}
                      placeholder="Enter amount" onChange={(v) => patchVehicle({ gvw: v })} />
                    <Select label="NCB" required options={NCB_OPTIONS} value={form.vehicle.ncb}
                      placeholder="Search for ncb" onChange={(v) => patchVehicle({ ncb: v })} />
                  </div>

                  {/* Fitness Certificate */}
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="fitnessCert" checked={form.vehicle.fitnessCertificate}
                      onChange={e => patchVehicle({ fitnessCertificate: e.target.checked })}
                      className="w-4 h-4 accent-blue-600" />
                    <label htmlFor="fitnessCert" className="text-sm text-slate-700 font-medium cursor-pointer">
                      Fitness Certificate
                    </label>
                  </div>
                </Section>
              )}
            </div>
          )}

          {/* ══ TAB 3: PREMIUM & PAYMENT ══ */}
          {activeTab === "premium" && (
            <div className="space-y-6">

              <Section icon={<Activity size={14} />} title="Premium Details">

                {/* Row 1: IDV/Sum Assured | Basic Premium | TPA (vehicle) or empty | Tax Amount */}
                <div className="grid grid-cols-4 gap-4">
                  {isVehicle
                    ? <Input label="IDV Value" required type="number" value={form.premium.idvValue}
                        onChange={(v) => patchPremium({ idvValue: Number(v) })} />
                    : <Input label="Sum Assured" required type="number" value={form.premium.sumAssured}
                        onChange={(v) => patchPremium({ sumAssured: Number(v) })} />
                  }
                  <Input label="Basic Premium Amount" required type="number" value={form.premium.basicPremium}
                    onChange={(v) => patchPremium({ basicPremium: Number(v) })} />
                  {isVehicle
                    ? (
                      <div className="space-y-1">
                        <Input label="Tpa Premium Amt." required type="number" value={form.premium.tpaPremium}
                          onChange={(v) => patchPremium({ tpaPremium: Number(v) })} />
                        <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-600 font-medium mt-1">
                          <input type="checkbox" checked={form.premium.isCommission}
                            onChange={e => patchPremium({ isCommission: e.target.checked })}
                            className="w-3.5 h-3.5 accent-blue-600" />
                          Is Commi.?
                        </label>
                      </div>
                    )
                    : <div />
                  }
                  <Input label="Tax Amount" type="number" value={form.premium.taxAmount}
                    onChange={(v) => patchPremium({ taxAmount: Number(v) })} />
                </div>

                {/* Row 2: Total Premium | Commissionable | Commission Entry | Commitment */}
                <div className="grid grid-cols-4 gap-4">
                  <Input label="Total Premium Amount" required type="number" value={form.premium.totalPremium}
                    className="bg-slate-50" onChange={(v) => patchPremium({ totalPremium: Number(v) })} />
                  <Input label="Commissionable Amount" type="number" value={form.premium.commissionableAmount}
                    onChange={(v) => patchPremium({ commissionableAmount: Number(v) })} />
                  <Input label="Commission Entry(%)" type="number" value={form.premium.commissionEntry}
                    onChange={(v) => patchPremium({ commissionEntry: Number(v) })} />
                  <Input label="Commitment Amount" type="number" value={form.premium.commitmentAmount}
                    className="bg-slate-50" onChange={(v) => patchPremium({ commitmentAmount: Number(v) })} />
                </div>

                {/* Broker | Agency + Add | Sub Agent + Add */}
                <div className="grid grid-cols-12 gap-4 items-end">
                  <div className="col-span-3">
                    <Select label="Select Broker" required options={BROKER_OPTIONS} value={form.detail.brokerId}
                      onChange={(v) => patchDetail({ brokerId: v })} />
                  </div>
                  <div className="col-span-1"><AddBtn onClick={() => toast.success("Add Broker")} /></div>
                  <div className="col-span-3">
                    <Select label="Select Agency Name" required options={AGENCY_OPTIONS} value={form.detail.agencyId}
                      onChange={(v) => patchDetail({ agencyId: v })} />
                  </div>
                  <div className="col-span-1"><AddBtn onClick={() => toast.success("Add Agency")} /></div>
                  <div className="col-span-3">
                    <Select label="Select Sub Agent Name" options={SUB_AGENT_OPTIONS} value={form.detail.subAgentId}
                      onChange={(v) => patchDetail({ subAgentId: v })} clearable />
                  </div>
                  <div className="col-span-1"><AddBtn onClick={() => toast.success("Add Sub Agent")} /></div>
                </div>

                {/* Nominee Name + Contact */}
                <div className="grid grid-cols-2 gap-4">
                  <Select label="Nominee Name" options={NOMINEE_OPTIONS} value={form.detail.nomineeName}
                    placeholder="Search for nominee name" onChange={(v) => patchDetail({ nomineeName: v })} />
                  <Input label="Nominee Contact No." value={form.detail.nomineeContact}
                    placeholder="Nominee Contact" onChange={(v) => patchDetail({ nomineeContact: v })} />
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Remarks</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all resize-none"
                    placeholder="Remarks"
                    value={form.detail.remarks}
                    onChange={e => patchDetail({ remarks: e.target.value })}
                  />
                </div>
              </Section>

              {/* PAYMENT */}
              <Section icon={<CreditCard size={14} />} title="Payment Details">
                <div className="grid grid-cols-12 gap-4 items-end">
                  <div className="col-span-3">
                    <Select label="Paid By Client" options={PAID_BY_OPTIONS} value={form.payment.paidByClient}
                      onChange={(v) => patchPayment({ paidByClient: v })} clearable />
                  </div>
                  <div className="col-span-1"><AddBtn onClick={() => toast.success("Add Client Payment")} /></div>
                  <div className="col-span-3">
                    <Input label="Amount" type="number" value={form.payment.clientAmount}
                      onChange={(v) => patchPayment({ clientAmount: Number(v) })} />
                  </div>
                  <div className="col-span-3">
                    <Select label="Paid By Agent" options={PAID_BY_OPTIONS} value={form.payment.paidByAgent}
                      onChange={(v) => patchPayment({ paidByAgent: v })} clearable />
                  </div>
                  <div className="col-span-1"><AddBtn onClick={() => toast.success("Add Agent Payment")} /></div>
                  <div className="col-span-1">
                    <Input label="Amount" type="number" value={form.payment.agentAmount}
                      onChange={(v) => patchPayment({ agentAmount: Number(v) })} />
                  </div>
                </div>
              </Section>

            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-8 py-5 bg-white border-t flex justify-between items-center shrink-0">
          <div className="flex gap-3">
            <button disabled={isPending} onClick={handleSave}
              className="px-8 py-2.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded shadow-md disabled:opacity-50 transition-all">
              {isPending ? "Saving..." : "SAVE"}
            </button>
            <button onClick={onClose} disabled={isPending}
              className="px-8 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded shadow-md transition-all">
              CANCEL
            </button>
          </div>
          <div className="flex gap-3">
            {activeTab !== "customer" && (
              <button onClick={() => setActiveTab(activeTab === "premium" ? "policy" : "customer")}
                className="px-6 py-2.5 text-sm font-bold text-white bg-red-400 hover:bg-red-500 rounded transition-all">
                Previous
              </button>
            )}
            {activeTab !== "premium" && (
              <button onClick={() => setActiveTab(activeTab === "customer" ? "policy" : "premium")}
                className="px-6 py-2.5 text-sm font-bold text-white bg-blue-500 hover:bg-blue-600 rounded flex items-center gap-1.5 transition-all">
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

const Section = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <section className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
    <div className="flex items-center gap-2 bg-slate-800 px-6 py-3 text-white">
      <div className="p-1.5 bg-white/10 rounded">{icon}</div>
      <h3 className="font-bold uppercase tracking-wider text-[10px]">{title}</h3>
    </div>
    <div className="p-6 space-y-5">{children}</div>
  </section>
);

const AddBtn = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick}
    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded transition-colors">
    Add
  </button>
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
  <div className="space-y-1.5 w-full">
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
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {suffix}
        </div>
      )}
    </div>
    {error && <p className="text-[10px] font-medium text-red-500 mt-1">{error}</p>}
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
  <div className="space-y-1.5 w-full">
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
          <option key={o[valueKey]} value={o[valueKey]}>
            {o[labelKey]}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
    {error && <p className="text-[10px] font-medium text-red-500 mt-1">{error}</p>}
  </div>
);