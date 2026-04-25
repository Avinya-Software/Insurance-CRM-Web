import { useEffect, useState } from "react";
import { X, ShieldCheck, Activity, Car, FileText, UploadCloud, UserPlus, Plus, AlertCircle, Trash2, ChevronRight, ChevronDown, Eye } from "lucide-react";
import toast from "react-hot-toast";

import { useCreateClaim } from "../../hooks/claim/useCreateClaim";
import { useClaimStatus, useClaimType, useClaimEventType, useDeathType } from "../../hooks/claim/useClaimMasters";
import { useCustomerDropdown } from "../../hooks/customer/useCustomerDropdown";
import { usePoliciesByCustomer } from "../../hooks/policy/usePoliciesByCustomer";
import { useDivisionDropdown } from "../../hooks/division/useDivisionDropdown";
import { useFamilyMemberDropdown } from "../../hooks/family-member/useFamilyMemberDropdown";
import { useUploadCustomerDocument } from "../../hooks/customer/useUploadCustomerDocument";
import { useKycFileActions } from "../../hooks/customer/useKycFileActions";
import Spinner from "../common/Spinner";
import SearchableComboBox from "../common/SearchableComboBox";

interface Props {
  open: boolean;
  onClose: () => void;
  claim?: any;
  onSuccess: () => void;
}

type TabType = "basic" | "additional" | "documents";

const ClaimUpsertSheet = ({ open, onClose, claim, onSuccess }: Props) => {
  const [activeTab, setActiveTab] = useState<TabType>("basic");

  /*   LOCK BODY SCROLL   */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  /*   API HOOKS   */
  const { mutateAsync: saveClaim, isPending: isSaving } = useCreateClaim();
  const { data: customers, isLoading: customersLoading } = useCustomerDropdown();
  const { data: divisions, isLoading: divisionLoading } = useDivisionDropdown(0);
  const { data: claimStatuses, isLoading: statusLoading } = useClaimStatus();
  const { data: claimTypes, isLoading: typeLoading } = useClaimType();
  const { data: eventTypes, isLoading: eventLoading } = useClaimEventType();
  const { data: deathTypes } = useDeathType();

  const { mutateAsync: uploadDocument, isPending: isUploading } = useUploadCustomerDocument();
  const [existingDocuments, setExistingDocuments] = useState<any[]>([]);
  const [confirmDeleteDoc, setConfirmDeleteDoc] = useState<any>(null);

  const { preview, download, remove } = useKycFileActions(
    (deletedId: string) => {
      setExistingDocuments((prev) =>
        prev.filter((f) => f.id !== deletedId)
      );
    }
  );

  /*   FORM STATE   */
  const initialForm = {
    id: null as string | null,
    policyId: "",
    customerId: "",
    memberId: "",
    divisionType: 0,
    claimNumber: "",
    claimDate: new Date().toISOString().split("T")[0],
    incidentDate: "",
    claimEventType: 0,
    claimType: 0,
    claimStatus: 0,
    claimAmount: 0,
    approvedAmount: 0,
    description: "",

    motorDetail: {
      vehicleNumber: "",
      garageName: "",
      garageAddress: "",
      accidentDescription: "",
      isFIRFiled: false,
      survey: {
        surveyorName: "",
        surveyorContact: "",
        surveyDate: "",
        remarks: "",
      },
    },
    healthDetail: {
      hospitalName: "",
      hospitalAddress: "",
      admissionDate: "",
      dischargeDate: "",
      illnessType: "",
      remarks: "",
    },
    riskDetail: {
      riskAddress: "",
      lossAmount: 0,
      damageDescription: "",
      survey: {
        surveyorName: "",
        surveyorContact: "",
        surveyDate: "",
        remarks: "",
      },
    },
    deathDetail: {
      id: null as string | null,
      dateOfDeath: "",
      deathType: 0,
      causeOfDeath: "",
      placeOfDeath: "",
      isPoliceCase: false,
      remarks: "",
    },
  };

  const [form, setForm] = useState(initialForm);
  const [originalForm, setOriginalForm] = useState<any>(null);
  const [files, setFiles] = useState<{ file: File; label: string }[]>([]);
  const [selectedDocName, setSelectedDocName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const documentOptions = [
    { id: "Invoices", name: "Invoices" },
    { id: "Medical Reports", name: "Medical Reports" },
    { id: "FIR Copy", name: "FIR Copy" },
    { id: "Death Certificate", name: "Death Certificate" },
    { id: "Photographs", name: "Photographs" },
    { id: "Others", name: "Others" },
  ];

  /*   DEPENDENT DATA   */
  const { data: policies, isLoading: policiesLoading } = usePoliciesByCustomer(form.customerId);
  const { data: members, isLoading: membersLoading } = useFamilyMemberDropdown(form.customerId);

  /*   AUTO-SELECT REGISTERED STATUS   */
  useEffect(() => {
    if (!open) return;
    if (claimStatuses?.length && !claim && form.claimStatus === 0) {
      const registered = claimStatuses.find((s: any) => s.name?.toLowerCase() === "registered");
      if (registered) {
        setForm(prev => ({ ...prev, claimStatus: registered.id }));
      }
    }
  }, [open, claimStatuses, claim]);

  /*   PREFILL   */
  useEffect(() => {
    if (!open) {
      setForm(initialForm);
      setOriginalForm(null);
      setFiles([]);
      setErrors({});
      setActiveTab("basic");
      return;
    }

    if (claim) {
      const mappedForm = {
        ...initialForm,
        id: claim.id || claim.claimId || null,
        policyId: claim.policyId || "",
        customerId: claim.customerId || "",
        memberId: claim.memberId || "",
        divisionType: claim.divisionType || 0,
        claimNumber: claim.claimNumber || "",
        claimDate: claim.claimDate ? claim.claimDate.split("T")[0] : "",
        incidentDate: claim.incidentDate ? claim.incidentDate.split("T")[0] : "",
        claimEventType: claim.claimEventType || 0,
        claimType: claim.claimType || 0,
        claimStatus: claim.claimStatus || 0,
        claimAmount: claim.claimAmount || 0,
        approvedAmount: claim.approvedAmount || 0,
        description: claim.description || "",
        
        motorDetail: claim.motor ? {
          ...initialForm.motorDetail,
          ...claim.motor,
          survey: (claim.survey || claim.motor.survey) ? {
            ...initialForm.motorDetail.survey,
            ...(claim.survey || claim.motor.survey),
            surveyDate: (claim.survey?.surveyDate || claim.motor.survey?.surveyDate) ? (claim.survey?.surveyDate || claim.motor.survey?.surveyDate).split("T")[0] : ""
          } : initialForm.motorDetail.survey
        } : initialForm.motorDetail,

        healthDetail: claim.health ? {
          ...initialForm.healthDetail,
          ...claim.health,
          admissionDate: claim.health.admissionDate ? claim.health.admissionDate.split("T")[0] : "",
          dischargeDate: claim.health.dischargeDate ? claim.health.dischargeDate.split("T")[0] : ""
        } : initialForm.healthDetail,

        riskDetail: claim.risk ? {
          ...initialForm.riskDetail,
          ...claim.risk,
          survey: (claim.survey || claim.risk.survey) ? {
            ...initialForm.riskDetail.survey,
            ...(claim.survey || claim.risk.survey),
            surveyDate: (claim.survey?.surveyDate || claim.risk.survey?.surveyDate) ? (claim.survey?.surveyDate || claim.risk.survey?.surveyDate).split("T")[0] : ""
          } : initialForm.riskDetail.survey
        } : initialForm.riskDetail,
        deathDetail: claim.death ? {
          ...initialForm.deathDetail,
          ...claim.death,
          dateOfDeath: claim.death.dateOfDeath ? claim.death.dateOfDeath.split("T")[0] : "",
          isPoliceCase: claim.death.isPoliceCase || false,
          remarks: claim.death.remarks || ""
        } : initialForm.deathDetail,
      };
      setForm(mappedForm);
      setOriginalForm(mappedForm);
      setExistingDocuments(claim.claimFiles || []);
    } else {
      setForm(initialForm);
      setOriginalForm(null);
      setFiles([]);
      setExistingDocuments([]);
    }
  }, [open, claim]);

  /*   VALIDATION   */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customerId) e.customerId = "Customer is required";
    if (!form.policyId) e.policyId = "Policy is required";
    if (!form.divisionType) e.divisionType = "Division is required";
    if (!form.claimNumber) e.claimNumber = "Claim number is required";
    if (!form.incidentDate) e.incidentDate = "Incident date is required";
    if (!form.memberId) e.memberId = "Claiming member is required";
    if (!form.claimType) e.claimType = "Claim type is required";
    if (!form.claimEventType) e.claimEventType = "Claim event type is required";
    if (form.claimAmount <= 0) e.claimAmount = "Claimed amount must be > 0";

    // DIVISION SPECIFIC VALIDATION
    if (form.divisionType === 1) { // Health
      if (!form.healthDetail.hospitalName) e.hospitalName = "Hospital name is required";
      if (!form.healthDetail.illnessType) e.illnessType = "Illness type is required";
      if (!form.healthDetail.admissionDate) e.admissionDate = "Admission date is required";
    }

    if (form.divisionType === 5) { // Motor
      if (!form.motorDetail.vehicleNumber) e.vehicleNumber = "Vehicle number is required";
      if (!form.motorDetail.garageName) e.garageName = "Garage name is required";
      if (!form.motorDetail.garageAddress) e.garageAddress = "Garage address is required";
    }

    if (form.divisionType === 2) { // Other/Risk
      if (!form.riskDetail.riskAddress) e.riskAddress = "Risk address is required";
      if (form.riskDetail.lossAmount <= 0) e.lossAmount = "Estimated loss amount is required";
    }

    // Death Validation (Only if "Death" event type is selected or any death field is partially filled)
    const isDeathEvent = eventTypes?.find((t: any) => t.id === form.claimEventType)?.name?.toLowerCase() === "death";
    const hasDeathInput = !!(form.deathDetail.dateOfDeath || form.deathDetail.causeOfDeath || form.deathDetail.placeOfDeath);

    if (isDeathEvent || hasDeathInput) {
      if (!form.deathDetail.dateOfDeath) e.dateOfDeath = "Date of death is required";
      if (!form.deathDetail.causeOfDeath) e.causeOfDeath = "Cause of death is required";
      if (!form.deathDetail.placeOfDeath) e.placeOfDeath = "Place of death is required";
    }

    setErrors(e);
    if (Object.keys(e).length) {
      toast.error("Please fill all required fields");
      return false;
    }
    return true;
  };

  /*   SAVE   */
  const checkClaimChanges = (current: any, original: any) => {
    if (!original) return true;
    
    // Check top level first
    const mainFields = [
      "policyId", "customerId", "memberId", "divisionType", "claimNumber",
      "claimDate", "incidentDate", "claimEventType", "claimType",
      "claimStatus", "claimAmount", "approvedAmount", "description"
    ];
    
    for (const field of mainFields) {
      if (current[field] !== original[field]) return true;
    }

    // Check nested details if applicable
    if (JSON.stringify(current.motorDetail) !== JSON.stringify(original.motorDetail)) return true;
    if (JSON.stringify(current.healthDetail) !== JSON.stringify(original.healthDetail)) return true;
    if (JSON.stringify(current.riskDetail) !== JSON.stringify(original.riskDetail)) return true;
    if (JSON.stringify(current.deathDetail) !== JSON.stringify(original.deathDetail)) return true;

    return false;
  };

  const handleSave = async () => {
    if (!validate()) return;
    
    try {
      let claimId = form.id;
      let claimUpdated = false;

      const hasClaimChanged = originalForm
        ? checkClaimChanges(form, originalForm)
        : true;

      if (hasClaimChanged) {
        const payload = JSON.parse(JSON.stringify(form));
        
        const cleanDate = (d: any) => (d === "" ? null : d);
        
        payload.claimDate = cleanDate(payload.claimDate);
        payload.incidentDate = cleanDate(payload.incidentDate);

        if (form.divisionType === 1) {
          payload.healthDetail.admissionDate = cleanDate(payload.healthDetail.admissionDate);
          payload.healthDetail.dischargeDate = cleanDate(payload.healthDetail.dischargeDate);
          payload.motorDetail = null;
          payload.riskDetail = null;
        } else if (form.divisionType === 5) {
          payload.motorDetail.survey.surveyDate = cleanDate(payload.motorDetail.survey.surveyDate);
          payload.healthDetail = null;
          payload.riskDetail = null;
        } else if (form.divisionType === 2) {
          payload.riskDetail.survey.surveyDate = cleanDate(payload.riskDetail.survey.surveyDate);
          payload.healthDetail = null;
          payload.motorDetail = null;
        }

        const isDeathEvent = eventTypes?.find((t: any) => t.id === form.claimEventType)?.name?.toLowerCase() === "death";
        if (isDeathEvent || payload.deathDetail.dateOfDeath) {
          payload.deathDetail.dateOfDeath = cleanDate(payload.deathDetail.dateOfDeath);
        } else {
          payload.deathDetail = null;
        }

        const res = await saveClaim(payload);
        claimId = res?.claimId || res?.data?.claimId || form.id;
        claimUpdated = true;

        if (res?.statusMessage) {
          toast.success(res.statusMessage);
        } else {
          toast.success(form.id ? "Claim updated successfully" : "Claim created successfully");
        }
      }

      if (files.length > 0 && claimId) {
        await Promise.all(
          files.map((item) => {
            const formData = new FormData();
            formData.append("Id", claimId); 
            formData.append("Type", "4");  
            formData.append("DocumentType", item.label);
            formData.append("PolicyType", "0"); 
            formData.append("Files", item.file);
            return uploadDocument(formData).then((docRes: any) => {
              // Only show document success toast if the claim details weren't updated
              if (!claimUpdated && docRes?.statusMessage) {
                toast.success(docRes.statusMessage);
              }
              return docRes;
            });
          })
        );
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Save error:", error.response?.data);
      const apiErrors = error.response?.data?.errors;
      if (apiErrors) {
        const firstError = Object.values(apiErrors)[0] as string[];
        toast.error(firstError[0] || "Validation failed");
      } else {
        toast.error(error.response?.data?.title || "Something went wrong");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !selectedDocName) return;
    const newFiles = Array.from(e.target.files).map(file => ({
      file,
      label: selectedDocName
    }));
    setFiles(prev => [...prev, ...newFiles]);
    setSelectedDocName("");
    e.target.value = "";
  };

  if (!open) return null;

  const isHealth = form.divisionType === 1;
  const isOther = form.divisionType === 2;
  const isMotor = form.divisionType === 5;
  const isLoading = isSaving;

  return (
    <>
      {/* OVERLAY */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]" onClick={isLoading ? undefined : onClose} />

      {/* SHEET */}
      <div className="fixed top-0 right-0 h-screen w-full max-w-[70vw] bg-slate-50 z-[70] shadow-2xl flex flex-col animate-slide-in-right">
        {/* HEADER */}
        <div className="px-8 py-6 bg-white border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{claim ? "Edit Claim" : "Add New Claim"}</h2>
            <p className="text-slate-500 text-sm mt-1">Manage claim records and division-specific information.</p>
          </div>
          <button onClick={onClose} disabled={isLoading} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* TABS */}
        <div className="px-8 bg-white border-b flex gap-8">
          {[
            { id: "basic", label: "Basic Claim Information", icon: UserPlus },
            { id: "additional", label: "Additional Field Details", icon: Activity },
            { id: "documents", label: "Claim Documents", icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-full mx-auto space-y-6">
            {activeTab === "basic" && (
              <Section icon={<ShieldCheck size={16} />} title="Basic Claim Information">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <SearchableComboBox
                    label="Customer"
                    required
                    items={(customers || []).map((c: any) => ({ value: c.customerId, label: c.clientName }))}
                    value={form.customerId}
                    placeholder="Search customer..."
                    error={errors.customerId}
                    onSelect={(item) => setForm({ ...form, customerId: item?.value || "", policyId: "", memberId: "" })}
                  />

                  <SearchableComboBox
                    label="Policy"
                    required
                    items={(policies || []).map((p: any) => ({ value: p.policyId, label: p.policyNumber, divisionId: p.divisionId }))}
                    value={form.policyId}
                    placeholder={policiesLoading ? "Loading..." : "Search policy..."}
                    error={errors.policyId}
                    onSelect={(item: any) => setForm({ ...form, policyId: item?.value || "", divisionType: item?.divisionId ? Number(item.divisionId) : form.divisionType })}
                  />

                  <SearchableComboBox
                    label="Claiming Member"
                    required
                    items={(members || []).map((m: any) => ({ value: m.familyMemberId, label: m.fullName }))}
                    value={form.memberId}
                    placeholder={membersLoading ? "Loading..." : "Search member..."}
                    error={errors.memberId}
                    onSelect={(item) => setForm({ ...form, memberId: item?.value || "" })}
                  />

                  <Select
                    label="Division"
                    required
                    value={form.divisionType}
                    options={divisions}
                    valueKey="divisionId"
                    labelKey="divisionName"
                    onChange={(v: any) => setForm({ ...form, divisionType: Number(v) })}
                    error={errors.divisionType}
                  />

                  <Input label="Claim Number" required value={form.claimNumber} onChange={(v: any) => setForm({ ...form, claimNumber: v })} error={errors.claimNumber} placeholder="Enter claim number" />
                  <Input label="Incident Date" required type="date" value={form.incidentDate} onChange={(v: any) => setForm({ ...form, incidentDate: v })} error={errors.incidentDate} />
                  <Input label="Claim Date" type="date" value={form.claimDate} onChange={(v: any) => setForm({ ...form, claimDate: v })} />
                  <Select label="Claim Type" required value={form.claimType} options={claimTypes} onChange={(v: any) => setForm({ ...form, claimType: Number(v) })} error={errors.claimType} />
                  <Select label="Claim Status" value={form.claimStatus} options={claimStatuses} onChange={(v: any) => setForm({ ...form, claimStatus: Number(v) })} />
                  <Select label="Claim Event Type" required value={form.claimEventType} options={eventTypes} onChange={(v: any) => setForm({ ...form, claimEventType: Number(v) })} error={errors.claimEventType} />
                  <Input label="Claimed Amount" required type="number" value={form.claimAmount} onChange={(v: any) => setForm({ ...form, claimAmount: Number(v) })} error={errors.claimAmount} placeholder="0.00" />
                  <Input label="Approved Amount" type="number" value={form.approvedAmount} onChange={(v: any) => setForm({ ...form, approvedAmount: Number(v) })} placeholder="0.00" />

                  <div className="lg:col-span-3">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">Description</label>
                    <textarea 
                      value={form.description} 
                      onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                      placeholder="Description"
                      className="w-full mt-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all h-24"
                    />
                  </div>
                </div>
              </Section>
            )}

            {activeTab === "additional" && (
              <div className="space-y-6">
                {!form.divisionType && (
                  <div className="bg-white rounded-lg border border-slate-200 p-12 text-center shadow-sm">
                    <Activity className="mx-auto text-slate-300 mb-4" size={48} />
                    <h3 className="text-slate-900 font-semibold text-lg">Select a Division First</h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto">Please select a division in the basic information tab to see category-specific fields.</p>
                  </div>
                )}
                {isMotor && (
                   <Section icon={<Car size={16} />} title="Motor claim details">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <Input label="Vehicle Number" required value={form.motorDetail.vehicleNumber} placeholder="GJ-01-XX-0000" onChange={(v: any) => setForm({ ...form, motorDetail: { ...form.motorDetail, vehicleNumber: v } })} error={errors.vehicleNumber} />
                      <Input label="Garage Name" required value={form.motorDetail.garageName} placeholder="Garage name" onChange={(v: any) => setForm({ ...form, motorDetail: { ...form.motorDetail, garageName: v } })} error={errors.garageName} />
                      <Input label="Garage Address" required value={form.motorDetail.garageAddress} placeholder="Address" onChange={(v: any) => setForm({ ...form, motorDetail: { ...form.motorDetail, garageAddress: v } })} error={errors.garageAddress} />
                      <div className="lg:col-span-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">Accident Description</label>
                        <textarea 
                          value={form.motorDetail.accidentDescription} 
                          onChange={(e) => setForm(p => ({ ...p, motorDetail: { ...p.motorDetail, accidentDescription: e.target.value } }))}
                          placeholder="Describe the incident..."
                          className="w-full mt-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all h-20"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <Toggle 
                          label="Is FIR Filed?" 
                          checked={form.motorDetail.isFIRFiled} 
                          onChange={(v: boolean) => setForm({ ...form, motorDetail: { ...form.motorDetail, isFIRFiled: v } })} 
                          activeColor="bg-blue-600"
                        />
                      </div>
                    </div>
                    <div className="border-t bg-slate-50 -mx-4 -mb-4 px-4 py-4 space-y-4">
                      <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Surveyor Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Input label="Surveyor Name" value={form.motorDetail.survey.surveyorName} onChange={(v: any) => setForm({ ...form, motorDetail: { ...form.motorDetail, survey: { ...form.motorDetail.survey, surveyorName: v } } })} />
                        <Input label="Contact" value={form.motorDetail.survey.surveyorContact} onChange={(v: any) => setForm({ ...form, motorDetail: { ...form.motorDetail, survey: { ...form.motorDetail.survey, surveyorContact: v } } })} />
                        <Input label="Survey Date" type="date" value={form.motorDetail.survey.surveyDate} onChange={(v: any) => setForm({ ...form, motorDetail: { ...form.motorDetail, survey: { ...form.motorDetail.survey, surveyDate: v } } })} />
                        <Input label="Remarks" value={form.motorDetail.survey.remarks} onChange={(v: any) => setForm({ ...form, motorDetail: { ...form.motorDetail, survey: { ...form.motorDetail.survey, remarks: v } } })} />
                      </div>
                    </div>
                  </Section>
                )}
                {isHealth && (
                  <>
                    <Section icon={<Activity size={16} />} title="Hospitalization Details">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Input label="Hospital Name" required value={form.healthDetail.hospitalName} onChange={(v: any) => setForm({ ...form, healthDetail: { ...form.healthDetail, hospitalName: v } })} error={errors.hospitalName} />
                        <Input label="Illness Type" required value={form.healthDetail.illnessType} onChange={(v: any) => setForm({ ...form, healthDetail: { ...form.healthDetail, illnessType: v } })} error={errors.illnessType} />
                        <Input label="Hospital Address" value={form.healthDetail.hospitalAddress} onChange={(v: any) => setForm({ ...form, healthDetail: { ...form.healthDetail, hospitalAddress: v } })} />
                        <Input label="Admission Date" required type="date" value={form.healthDetail.admissionDate} onChange={(v: any) => setForm({ ...form, healthDetail: { ...form.healthDetail, admissionDate: v } })} error={errors.admissionDate} />
                        <Input label="Discharge Date" type="date" value={form.healthDetail.dischargeDate} onChange={(v: any) => setForm({ ...form, healthDetail: { ...form.healthDetail, dischargeDate: v } })} />
                        <Input label="Medical Remarks" value={form.healthDetail.remarks} onChange={(v: any) => setForm({ ...form, healthDetail: { ...form.healthDetail, remarks: v } })} />
                      </div>
                    </Section>
                    <DeathSection form={form} setForm={setForm} errors={errors} deathTypes={deathTypes} />
                  </>
                )}
                {isOther && (
                  <>
                    <Section icon={<ShieldCheck size={16} />} title="Asset / risk loss details">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2"><Input label="Risk Address" required value={form.riskDetail.riskAddress} onChange={(v: any) => setForm({ ...form, riskDetail: { ...form.riskDetail, riskAddress: v } })} error={errors.riskAddress} /></div>
                        <Input label="Estimated Loss Amount" required type="number" value={form.riskDetail.lossAmount} onChange={(v: any) => setForm({ ...form, riskDetail: { ...form.riskDetail, lossAmount: Number(v) } })} error={errors.lossAmount} />
                        <div className="lg:col-span-3">
                          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">Damage Description</label>
                          <textarea 
                            value={form.riskDetail.damageDescription} 
                            onChange={(e) => setForm(p => ({ ...p, riskDetail: { ...p.riskDetail, damageDescription: e.target.value } }))}
                            placeholder="Describe damage..."
                            className="w-full mt-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded text-sm h-20 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
                          />
                        </div>
                      </div>
                      <div className="border-t bg-slate-50 -mx-4 -mb-4 px-4 py-4 space-y-4">
                        <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Surveyor Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          <Input label="Surveyor Name" value={form.riskDetail.survey.surveyorName} onChange={(v: any) => setForm({ ...form, riskDetail: { ...form.riskDetail, survey: { ...form.riskDetail.survey, surveyorName: v } } })} />
                          <Input label="Contact" value={form.riskDetail.survey.surveyorContact} onChange={(v: any) => setForm({ ...form, riskDetail: { ...form.riskDetail, survey: { ...form.riskDetail.survey, surveyorContact: v } } })} />
                          <Input label="Survey Date" type="date" value={form.riskDetail.survey.surveyDate} onChange={(v: any) => setForm({ ...form, riskDetail: { ...form.riskDetail, survey: { ...form.riskDetail.survey, surveyDate: v } } })} />
                          <Input label="Survey Remarks" value={form.riskDetail.survey.remarks} onChange={(v: any) => setForm({ ...form, riskDetail: { ...form.riskDetail, survey: { ...form.riskDetail.survey, remarks: v } } })} />
                        </div>
                      </div>
                    </Section>
                    <DeathSection form={form} setForm={setForm} errors={errors} deathTypes={deathTypes} />
                  </>
                )}
              </div>
            )}

            {activeTab === "documents" && (
              <div className="space-y-8">
                {!claim && (
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-3">
                    <AlertCircle size={16} className="text-amber-600 shrink-0" />
                    <p className="text-xs text-amber-700 leading-relaxed font-medium">Documents will be uploaded automatically when you click <strong>SAVE</strong>.</p>
                  </div>
                )}

                {/* UPLOAD SECTION */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-1 space-y-6">
                      <Select
                        label="Select Document"
                        value={selectedDocName}
                        options={documentOptions}
                        onChange={(v: string) => setSelectedDocName(v)}
                      />
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertCircle size={14} className="text-blue-600" />
                          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Settlement Verification</p>
                        </div>
                        <p className="text-xs text-blue-700 leading-relaxed">
                          Upload all necessary evidence and loss documentation to facilitate accurate verification and expedite your policy claim settlement.
                        </p>
                      </div>
                    </div>

                    <div className="lg:col-span-2 space-y-3">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-xs">Upload Files</label>
                      <div className="relative">
                        <input
                          id="kyc-upload"
                          type="file"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          disabled={!selectedDocName || isUploading}
                          onChange={handleFileChange}     
                        />
                        <label 
                          htmlFor="kyc-upload"
                          className={`
                            flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl transition-all group
                            ${!selectedDocName || isUploading
                              ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-50'
                              : 'bg-white border-blue-200 hover:bg-blue-50/50 hover:border-blue-400 shadow-sm cursor-pointer'
                            }
                          `}
                        >
                          <div className="flex items-center gap-6">
                            <div className={`p-4 rounded-2xl shadow-sm transition-all ${selectedDocName ? 'bg-blue-600 text-white group-hover:scale-110 group-hover:shadow-blue-200 group-hover:shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                              <UploadCloud size={28} />
                            </div>
                            <div className="text-left">
                              <p className="text-base font-bold text-slate-800">
                                {selectedDocName ? `Choose files for ${selectedDocName}` : "Select document type to enable"}
                              </p>
                              <p className="text-xs text-slate-400 font-medium mt-1">PDF, PNG, JPG (Max 10MB)</p>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FILE LISTS */}
                <div className="space-y-8">
                  {files.length > 0 && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                      <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-4">
                        <Plus size={18} className="text-blue-600" /> 
                        Selected Files
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {files.map((f, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm">
                                <FileText size={16} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-700 truncate">
                                  {f.label}
                                </p>
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                                  {f.file.name}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() =>
                                setFiles(prev => prev.filter((_, i) => i !== idx))
                              }
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
                                <p className="text-sm font-bold text-slate-700 truncate">{file.fileName}</p>
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{file.type}</p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <button onClick={() => preview(file.url)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                <Eye size={16} />
                              </button>
                              <button 
                                onClick={() => setConfirmDeleteDoc(file)}
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
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 bg-white border-t flex justify-between items-center">
          <div className="flex gap-4">
            <button
              disabled={isLoading || isUploading}
              className="px-8 py-2.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              onClick={handleSave}
            >
              {isLoading || isUploading ? <Spinner className="text-white" /> : "SAVE"}
            </button>
            <button
              className="px-8 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded flex items-center justify-center gap-2 shadow-lg transition-all"
              onClick={onClose}
              disabled={isLoading || isUploading}
            >
              CANCEL
            </button>
          </div>

          <div className="flex gap-4">
            {activeTab !== "basic" && (
              <button
                onClick={() => {
                  if (activeTab === "documents") {
                    setActiveTab("additional");
                  } else if (activeTab === "additional") {
                    setActiveTab("basic");
                  }
                }}
                className="px-6 py-2.5 text-sm font-bold text-white bg-red-400 hover:bg-red-500 rounded flex items-center gap-2 transition-all shadow"
              >
                Previous
              </button>
            )}
            {activeTab !== "documents" && (
              <button
                onClick={() => {
                  if (activeTab === "basic") {
                    setActiveTab("additional");
                  } else if (activeTab === "additional") {
                    setActiveTab("documents");
                  }
                }}
                className="px-6 py-2.5 text-sm font-bold text-white bg-blue-400 hover:bg-blue-500 rounded flex items-center gap-2 transition-all shadow"
              >
                Next <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CONFIRM DELETE DOCUMENT MODAL */}
      {confirmDeleteDoc && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                    <Trash2 size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Delete Document</h3>
                </div>
                <button 
                  onClick={() => setConfirmDeleteDoc(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-slate-600 leading-relaxed">
                  Are you sure you want to delete <span className="font-bold text-slate-800">"{confirmDeleteDoc.fileName}"</span>? 
                  This action will permanently remove the file from this claim record.
                </p>
                
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
                  <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 font-medium">
                    This file will be deleted immediately and cannot be recovered.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteDoc(null)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    // Adapt based on user's instruction to use all document references from CustomerUpsertSheet
                    // But for Claims, we might need a claimId?
                    // CustomerUpsertSheet uses (customer.customerId, docId)
                    // If the backend is unified, maybe it's (form.customerId, docId)?
                    // Actually, the user said "use all document refrence in CustomerUpsertSheet.tsx file only"
                   
                    await remove(form.customerId, confirmDeleteDoc.id);
                    setConfirmDeleteDoc(null);
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="px-6 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-lg shadow-red-200 transition-all flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Document
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/*   HELPERS   */

const Toggle = ({ label, checked, onChange, activeColor = "bg-blue-600" }: any) => (
  <div 
    className="flex items-center gap-4 py-2 cursor-pointer select-none group" 
    onClick={() => onChange(!checked)}
  >
    <span className="text-[10px] font-bold text-slate-600 tracking-wider group-hover:text-blue-600 transition-colors uppercase">{label}</span>
    <div
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-in-out ${checked ? activeColor : "bg-slate-200"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out ${checked ? "translate-x-6" : "translate-x-1"}`}
      />
    </div>
  </div>
);

const Section = ({ icon, title, children }: any) => (
  <section className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-visible mb-4">
    <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 text-white overflow-hidden rounded-t-lg">
      <div className="p-1 bg-white/10 rounded">{icon}</div>
      <h3 className="font-bold uppercase tracking-wider text-[10px] leading-none">{title}</h3>
    </div>
    <div className="p-4 space-y-3">{children}</div>
  </section>
);

const DeathSection = ({ form, setForm, errors, deathTypes }: any) => (
  <Section icon={<Activity size={16} />} title="Death information">
    <div className="flex flex-wrap items-start gap-6">
      <div className="flex-1 min-w-[180px]">
        <Input label="Date of Death" required type="date" value={form.deathDetail.dateOfDeath} onChange={(v: any) => setForm({ ...form, deathDetail: { ...form.deathDetail, dateOfDeath: v } })} error={errors.dateOfDeath} />
      </div>
      <div className="flex-1 min-w-[180px]">
        <Input label="Cause of Death" required placeholder="Cause" value={form.deathDetail.causeOfDeath} onChange={(v: any) => setForm({ ...form, deathDetail: { ...form.deathDetail, causeOfDeath: v } })} error={errors.causeOfDeath} />
      </div>
      <div className="flex-1 min-w-[180px]">
        <Input label="Place of Death" required placeholder="Place" value={form.deathDetail.placeOfDeath} onChange={(v: any) => setForm({ ...form, deathDetail: { ...form.deathDetail, placeOfDeath: v } })} error={errors.placeOfDeath} />
      </div>
      <div className="flex-1 min-w-[180px]">
        <Select 
          label="Death Type" 
          value={form.deathDetail.deathType} 
          options={deathTypes} 
          onChange={(v: any) => setForm({ ...form, deathDetail: { ...form.deathDetail, deathType: Number(v) } })} 
        />
      </div>
      <div className="flex-shrink-0 pt-7">
        <Toggle 
          label="Is Police Case?" 
          checked={form.deathDetail.isPoliceCase} 
          onChange={(v: boolean) => setForm({ ...form, deathDetail: { ...form.deathDetail, isPoliceCase: v } })} 
          activeColor="bg-slate-700"
        />
      </div>
      <div className="w-full">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">Death Remarks</label>
        <textarea 
          value={form.deathDetail.remarks} 
          onChange={(e) => setForm(p => ({ ...p, deathDetail: { ...p.deathDetail, remarks: e.target.value } }))}
          placeholder="Additional notes"
          className="w-full mt-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all h-20"
        />
      </div>
    </div>
  </Section>
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
  className = ""
}: any) => (
  <div className="space-y-1.5">
    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
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
        ${className}
      `}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
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
  <div className="space-y-1.5">
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

export default ClaimUpsertSheet;
