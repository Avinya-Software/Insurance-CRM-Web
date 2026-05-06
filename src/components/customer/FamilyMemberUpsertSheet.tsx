import React, { useEffect, useState } from "react";
import { X, Save, User, FileText, ShieldCheck, Landmark, Eye, Trash2, Download, AlertCircle } from "lucide-react";
import { useAddFamilyMember } from "../../hooks/family-member/useAddFamilyMember";
import { useUpdateFamilyMember } from "../../hooks/family-member/useUpdateFamilyMember";
import { useCustomerDropdown } from "../../hooks/customer/useCustomerDropdown";
import { IFamilyMember, FamilyMemberDocument } from "../../interfaces/family-member.interface";
import { useFamilyMemberDocumentActions } from "../../hooks/family-member/useFamilyMemberDocumentActions";

interface Props {
  open: boolean;
  item: IFamilyMember | null;
  onClose: () => void;
  onSuccess: (id?: string) => void;
  initialFamilyHeadId?: string;
  disableFamilyHead?: boolean;
}

type TabType = "personal" | "additional";

const initialForm = {
  FamilyMemberId: "",
  FamilyHeadId: "",
  RelationWithFamilyHead: "",
  FirstName: "",
  MiddleName: "",
  LastName: "",
  MobileNumber: "",
  WhatsappNumber: "",
  Gender: "male",
  DOB: "",
  AnniversaryDate: "",
  BusinessType: "1",
  AadhaarCardNumber: "",
  PanCardNumber: "",
  GSTNumber: "",
  MarriageStatus: "Unmarried",
};

const FamilyMemberUpsertSheet = ({ open, item, onClose, onSuccess, initialFamilyHeadId, disableFamilyHead }: Props) => {
  const [activeTab, setActiveTab] = useState<TabType>("personal");
  const [formData, setFormData] = useState<any>(initialForm);
  const [files, setFiles] = useState<Record<string, File | null>>({
    AadhaarCardDocument: null,
    PanCardDocument: null,
    GSTDocument: null,
    ProfilePhoto: null,
  });
  const [existingDocs, setExistingDocs] = useState<Record<string, { path: string, name: string, updatedAt: string, id: string }>>({
    AadhaarCardDocument: { path: "", name: "", updatedAt: "", id: "" },
    PanCardDocument: { path: "", name: "", updatedAt: "", id: "" },
    GSTDocument: { path: "", name: "", updatedAt: "", id: "" },
    ProfilePhoto: { path: "", name: "", updatedAt: "", id: "" },
  });
  const [confirmDeleteDoc, setConfirmDeleteDoc] = useState<any>(null);
  
  const { preview, download, remove } = useFamilyMemberDocumentActions((deletedId) => {
      // Clear from state
      setExistingDocs(prev => {
          const next = { ...prev };
          Object.keys(next).forEach(key => {
              if (next[key].id === deletedId) {
                  next[key] = { path: "", name: "", updatedAt: "", id: "" };
              }
          });
          return next;
      });
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: customers = [] } = useCustomerDropdown();

  const { mutate: addMember, isPending: isAdding } = useAddFamilyMember();
  const { mutate: updateMember, isPending: isUpdating } = useUpdateFamilyMember();

  const isPending = isAdding || isUpdating;

  useEffect(() => {
    if (item) {
      setFormData({
        FamilyMemberId: item.familyMemberId || "",
        FamilyHeadId: item.familyHeadId,
        RelationWithFamilyHead: item.relationWithFamilyHead,
        FirstName: item.firstName,
        MiddleName: item.middleName || "",
        LastName: item.lastName,
        MobileNumber: item.mobileNumber,
        WhatsappNumber: item.whatsappNumber || "",
        Gender: item.gender,
        DOB: item.dob ? item.dob.split("T")[0] : "",
        AnniversaryDate: item.anniversaryDate ? item.anniversaryDate.split("T")[0] : "",
        BusinessType: item.businessType ? item.businessType.toString() : "1",
        AadhaarCardNumber: item.aadhaarCardNumber || "",
        PanCardNumber: item.panCardNumber || "",
        GSTNumber: item.gstNumber || "",
        MarriageStatus: item.marriageStatus || "Unmarried",
      });

      // Handle Existing Documents
      const docs: Record<string, { path: string, name: string, updatedAt: string, id: string }> = {
        AadhaarCardDocument: { path: "", name: "", updatedAt: "", id: "" },
        PanCardDocument: { path: "", name: "", updatedAt: "", id: "" },
        GSTDocument: { path: "", name: "", updatedAt: "", id: "" },
        ProfilePhoto: { path: "", name: "", updatedAt: "", id: "" },
      };
      
      item.documents?.forEach((doc: FamilyMemberDocument) => {
        const time = doc.updatedAt || doc.createdAt;
        if (doc.documentType === "Aadhaar") docs.AadhaarCardDocument = { path: doc.filePath, name: doc.originalFileName, updatedAt: time, id: doc.familyMemberDocumentId };
        if (doc.documentType === "PAN") docs.PanCardDocument = { path: doc.filePath, name: doc.originalFileName, updatedAt: time, id: doc.familyMemberDocumentId };
        if (doc.documentType === "GST") docs.GSTDocument = { path: doc.filePath, name: doc.originalFileName, updatedAt: time, id: doc.familyMemberDocumentId };
        if (doc.documentType === "ProfilePhoto") docs.ProfilePhoto = { path: doc.filePath, name: doc.originalFileName, updatedAt: time, id: doc.familyMemberDocumentId };
      });
      setExistingDocs(docs);
    } else {
      setFormData({ ...initialForm, FamilyHeadId: initialFamilyHeadId || "" });
      setExistingDocs({
        AadhaarCardDocument: { path: "", name: "", updatedAt: "", id: "" },
        PanCardDocument: { path: "", name: "", updatedAt: "", id: "" },
        GSTDocument: { path: "", name: "", updatedAt: "", id: "" },
        ProfilePhoto: { path: "", name: "", updatedAt: "", id: "" },
      });
    }
    setFiles({
      AadhaarCardDocument: null,
      PanCardDocument: null,
      GSTDocument: null,
      ProfilePhoto: null,
    });
    setErrors({});
    setActiveTab("personal");
  }, [item, open, initialFamilyHeadId]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (name: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [name]: file }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.FamilyHeadId) newErrors.FamilyHeadId = "Family Head is required";
    if (!formData.RelationWithFamilyHead) newErrors.RelationWithFamilyHead = "Relation is required";
    if (!formData.FirstName) newErrors.FirstName = "First Name is required";
    if (!formData.LastName) newErrors.LastName = "Last Name is required";
    if (!formData.MobileNumber) newErrors.MobileNumber = "Mobile Number is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });

    Object.keys(files).forEach((key) => {
      if (files[key]) {
        data.append(key, files[key] as File);
      } else if (item && existingDocs[key].path) {
        // Find the matching document to get originalFileName instead of filePath
        const docTypeMap: Record<string, string> = {
          AadhaarCardDocument: "Aadhaar",
          PanCardDocument: "PAN",
          GSTDocument: "GST",
          ProfilePhoto: "ProfilePhoto",
        };
        const doc = item.documents?.find(d => d.documentType === docTypeMap[key]);
        if (doc) {
          data.append(key, doc.originalFileName);
        }
      }
    });

    if (item) {
      updateMember(data, {
        onSuccess: (res: any) => {
          onSuccess(item.familyMemberId || res?.data?.familyMemberId || res?.data?.memberId || res?.memberId);
          onClose();
        },
      });
    } else {
      addMember(data, {
        onSuccess: (res: any) => {
          onSuccess(res?.data?.familyMemberId || res?.data?.memberId || res?.memberId);
          onClose();
        },
      });
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]" onClick={onClose} />

      <div className="fixed top-0 right-0 w-full max-w-[800px] h-screen bg-slate-50 z-[70] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden text-black">
        {/* HEADER */}
        <div className="px-8 py-6 bg-white border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {item ? "Edit Family Member" : "Add New Family Member"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">Manage family member details and documents.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* TABS */}
        <div className="px-8 bg-white border-b flex gap-8">
          {[
            { id: "personal", label: "Personal Info", icon: User },
            { id: "additional", label: "Additional & Docs", icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`
                flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-all
                ${activeTab === tab.id 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200"}
              `}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="space-y-10">
            {activeTab === "personal" && (
              <section className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="flex items-center gap-2 bg-slate-800 px-6 py-3 text-white">
                  <div className="p-1.5 bg-white/10 text-white rounded">
                    <ShieldCheck size={16} />
                  </div>
                  <h3 className="font-bold uppercase tracking-wider text-[10px]">Basic Details</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Family Head"
                      required
                      value={formData.FamilyHeadId}
                      options={customers}
                      valueKey="customerId"
                      labelKey="clientName"
                      onChange={(v: string) => handleChange("FamilyHeadId", v)}
                      error={errors.FamilyHeadId}
                      disabled={disableFamilyHead}
                    />
                    <Select
                      label="Relation With Head"
                      required
                      value={formData.RelationWithFamilyHead}
                      options={[
                        { id: "Self", name: "Self" },
                        { id: "Husband", name: "Husband" },
                        { id: "Wife", name: "Wife" },
                        { id: "Father", name: "Father" },
                        { id: "Mother", name: "Mother" },
                        { id: "Son", name: "Son" },
                        { id: "Daughter", name: "Daughter" },
                        { id: "Brother", name: "Brother" },
                        { id: "Sister", name: "Sister" },
                      ]}
                      onChange={(v: string) => handleChange("RelationWithFamilyHead", v)}
                      error={errors.RelationWithFamilyHead}
                    />
                    <Input
                      label="First Name"
                      required
                      value={formData.FirstName}
                      onChange={(v: string) => handleChange("FirstName", v)}
                      error={errors.FirstName}
                    />
                    <Input
                      label="Middle Name"
                      value={formData.MiddleName}
                      onChange={(v: string) => handleChange("MiddleName", v)}
                      error={errors.MiddleName}
                    />
                    <Input
                      label="Last Name"
                      required
                      value={formData.LastName}
                      onChange={(v: string) => handleChange("LastName", v)}
                      error={errors.LastName}
                    />
                    <Input
                      label="Mobile Number"
                      required
                      value={formData.MobileNumber}
                      onChange={(v: string) => handleChange("MobileNumber", v)}
                      error={errors.MobileNumber}
                    />
                    <Input
                      label="Whatsapp Number"
                      value={formData.WhatsappNumber}
                      onChange={(v: string) => handleChange("WhatsappNumber", v)}
                      error={errors.WhatsappNumber}
                    />
                    <RadioGroup
                      label="Gender"
                      name="Gender"
                      value={formData.Gender}
                      options={[
                        { label: "Male", value: "male" },
                        { label: "Female", value: "female" },
                        { label: "Transgender", value: "transgender" },
                      ]}
                      onChange={(v: string) => handleChange("Gender", v)}
                      error={errors.Gender}
                    />
                    <Input
                      label="DOB"
                      type="date"
                      value={formData.DOB}
                      onChange={(v: string) => handleChange("DOB", v)}
                      error={errors.DOB}
                    />
                    <Input
                      label="Anniversary Date"
                      type="date"
                      value={formData.AnniversaryDate}
                      onChange={(v: string) => handleChange("AnniversaryDate", v)}
                      error={errors.AnniversaryDate}
                    />
                    <div className="md:col-span-2">
                        <RadioGroup
                            label="Marriage Status"
                            name="MarriageStatus"
                            value={formData.MarriageStatus}
                            options={[
                            { label: "Married", value: "Married" },
                            { label: "Unmarried", value: "Unmarried" },
                            { label: "Single", value: "Single" },
                            { label: "X-Marragial", value: "X-Marragial Status" },
                            ]}
                            onChange={(v: string) => handleChange("MarriageStatus", v)}
                            error={errors.MarriageStatus}
                            inline
                        />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "additional" && (
              <div className="space-y-6">
                <section className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                  <div className="flex items-center gap-2 bg-slate-800 px-6 py-3 text-white">
                    <div className="p-1.5 bg-white/10 text-white rounded">
                      <Landmark size={16} />
                    </div>
                    <h3 className="font-bold uppercase tracking-wider text-[10px]">Business & Identification</h3>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Select
                        label="Business Type"
                        value={formData.BusinessType}
                        options={[
                          { id: "1", name: "Type 1" },
                          { id: "2", name: "Type 2" },
                          { id: "3", name: "Type 3" },
                        ]}
                        onChange={(v: string) => handleChange("BusinessType", v)}
                      />
                      <Input
                        label="Aadhaar Card Number"
                        value={formData.AadhaarCardNumber}
                        onChange={(v: string) => handleChange("AadhaarCardNumber", v)}
                      />
                      <Input
                        label="PAN Card Number"
                        value={formData.PanCardNumber}
                        onChange={(v: string) => handleChange("PanCardNumber", v)}
                      />
                      <Input
                        label="GST Number"
                        value={formData.GSTNumber}
                        onChange={(v: string) => handleChange("GSTNumber", v)}
                      />
                    </div>
                  </div>
                </section>

                <section className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                  <div className="flex items-center gap-2 bg-slate-800 px-6 py-3 text-white">
                    <div className="p-1.5 bg-white/10 text-white rounded">
                      <FileText size={16} />
                    </div>
                    <h3 className="font-bold uppercase tracking-wider text-[10px]">Documents</h3>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FileInput
                        label="Aadhaar Document"
                        value={files.AadhaarCardDocument}
                        existingPath={existingDocs.AadhaarCardDocument.path}
                        existingName={existingDocs.AadhaarCardDocument.name}
                        updatedAt={existingDocs.AadhaarCardDocument.updatedAt}
                        onChange={(f) => handleFileChange("AadhaarCardDocument", f)}
                      />
                      <FileInput
                        label="PAN Document"
                        value={files.PanCardDocument}
                        existingPath={existingDocs.PanCardDocument.path}
                        existingName={existingDocs.PanCardDocument.name}
                        updatedAt={existingDocs.PanCardDocument.updatedAt}
                        onChange={(f) => handleFileChange("PanCardDocument", f)}
                      />
                      <FileInput
                        label="GST Document"
                        value={files.GSTDocument}
                        existingPath={existingDocs.GSTDocument.path}
                        existingName={existingDocs.GSTDocument.name}
                        updatedAt={existingDocs.GSTDocument.updatedAt}
                        onChange={(f) => handleFileChange("GSTDocument", f)}
                      />
                      <FileInput
                        label="Profile Photo"
                        value={files.ProfilePhoto}
                        existingPath={existingDocs.ProfilePhoto.path}
                        existingName={existingDocs.ProfilePhoto.name}
                        updatedAt={existingDocs.ProfilePhoto.updatedAt}
                        onChange={(f) => handleFileChange("ProfilePhoto", f)}
                      />
                    </div>
                  </div>
                </section>

                {/* EXISTING DOCUMENTS LIST */}
                {item && Object.values(existingDocs).some(d => d.path) && (
                  <section className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="flex items-center gap-2 bg-slate-800 px-6 py-3 text-white">
                      <div className="p-1.5 bg-white/10 text-white rounded">
                        <ShieldCheck size={16} />
                      </div>
                      <h3 className="font-bold uppercase tracking-wider text-[10px]">Existing Documents</h3>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(existingDocs).filter(([_, d]) => d.path).map(([key, d]) => (
                          <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm">
                                <FileText size={16} />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-bold text-slate-700 truncate">{d.name}</p>
                                  {d.updatedAt && (
                                    <span className="text-[9px] px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded font-bold">
                                      {new Date(d.updatedAt).toLocaleDateString('en-GB')}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider truncate">
                                  {key.replace("Document", "").replace("Card", " Card")}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <button onClick={() => preview(d.path)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View">
                                <Eye size={16} />
                              </button>
                              <button onClick={() => download(d.path, d.name)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Download">
                                <Download size={16} />
                              </button>
                              <button 
                                onClick={() => setConfirmDeleteDoc({ id: d.id, name: d.name })}
                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 bg-white border-t flex gap-4 justify-end">
          <button
            className="px-8 py-2.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-all"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? (
               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                null
            )}
            {isPending ? "SAVING..." : "SAVE"}
          </button>
          <button
            className="px-8 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded flex items-center justify-center gap-2 shadow-lg transition-all"
            onClick={onClose}
          >
            CANCEL
          </button>
        </div>
      </div>

      {/* CONFIRM DELETE DOCUMENT MODAL */}
      {confirmDeleteDoc && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300">
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
                  Are you sure you want to delete <span className="font-bold text-slate-800">"{confirmDeleteDoc.name}"</span>? 
                  This action will permanently remove the file from this family member.
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
                    await remove(formData.FamilyMemberId, confirmDeleteDoc.id);
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

export default FamilyMemberUpsertSheet;

/* HELPERS */

const Input = ({ label, required, value, onChange, type = "text", error }: any) => (
  <div className="space-y-1.5 w-full">
    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      className={`w-full px-4 py-2.5 bg-white border rounded text-sm outline-none transition-all ${
        error ? "border-red-500 focus:ring-red-50" : "border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
      }`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
  </div>
);

const Select = ({ label, required, value, options, onChange, valueKey = "id", labelKey = "name", error, disabled }: any) => (
  <div className="space-y-1.5 w-full">
    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <select
        disabled={disabled}
        className={`w-full px-4 py-2.5 border rounded text-sm outline-none appearance-none transition-all ${
            disabled ? "bg-slate-100/50 cursor-not-allowed opacity-80" : "bg-white"
        } ${
            error ? "border-red-500 focus:ring-red-50" : "border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select Option</option>
        {options.map((o: any) => (
          <option key={o[valueKey]} value={o[valueKey]}>{o[labelKey]}</option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
    {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
  </div>
);

const RadioGroup = ({ label, name, value, options, onChange, error, inline = false }: any) => (
  <div className="space-y-1.5 w-full">
    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
      {label}
    </label>
    <div className={`flex flex-wrap gap-x-6 gap-y-2 mt-2 ${inline ? "flex-row" : "flex-col md:flex-row"}`}>
      {options.map((o: any) => (
        <label key={o.value} className="flex items-center gap-2 cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={(e) => onChange(e.target.value)}
              className="peer appearance-none w-4 h-4 border-2 border-slate-300 rounded-full checked:border-blue-600 transition-all cursor-pointer"
            />
            <div className="absolute w-2 h-2 bg-blue-600 rounded-full scale-0 peer-checked:scale-100 transition-transform pointer-events-none" />
          </div>
          <span className="text-xs font-medium text-slate-600 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{o.label}</span>
        </label>
      ))}
    </div>
    {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
  </div>
);

const FileInput = ({ label, onChange, error, existingPath, existingName, updatedAt, value }: any) => {
    const [fileName, setFileName] = useState<string>("");

    useEffect(() => {
        if (value) {
            setFileName(value.name);
        } else {
            setFileName("");
        }
    }, [value]);
    
    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(null);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div className="space-y-1.5 w-full">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                {label}
            </label>
            
            <div className={`relative group border rounded-lg overflow-hidden transition-all duration-200 ${
                value ? "border-blue-300 bg-blue-50/10" : 
                existingPath ? "border-green-300 bg-green-50/10" : 
                "border-slate-300 bg-white border-dashed"
            }`}>
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => {
                        const file = e.target.files ? e.target.files[0] : null;
                        onChange(file);
                    }}
                />
                
                <div className={`flex items-center gap-3 px-4 py-3 ${
                    error ? "border-red-500 bg-red-50/30" : ""
                }`}>
                    {/* ICON / PREVIEW */}
                    <div className="relative w-10 h-10 flex-shrink-0">
                        {value ? (
                             <div className="w-full h-full bg-blue-100 rounded flex items-center justify-center text-blue-600 shadow-sm">
                                <FileText size={20} />
                             </div>
                        ) : existingPath ? (
                            <img 
                                src={existingPath} 
                                alt="document" 
                                className="w-full h-full object-cover rounded border border-green-200 shadow-sm"
                                onError={(e: any) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://placehold.co/100x100?text=File";
                                }}
                            />
                        ) : (
                            <div className="w-full h-full bg-slate-100 rounded flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                                <FileText size={20} />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col">
                            <p className={`text-xs font-bold truncate ${value ? 'text-blue-700' : existingPath ? 'text-green-700' : 'text-slate-600'}`}>
                                {fileName || existingName || "Choose files..."}
                            </p>
                            
                            {existingPath && !fileName && (
                                <div className="flex flex-col gap-0.5 mt-0.5">
                                    <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">
                                        Active Document
                                    </span>
                                    {updatedAt && (
                                        <span className="text-[8px] text-slate-400 font-medium">
                                            Last Updated: {formatDate(updatedAt)}
                                        </span>
                                    )}
                                </div>
                            )}

                            {fileName && (
                                <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider mt-0.5 animate-pulse">
                                    New File Selected
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {existingPath && !fileName && (
                            <a 
                                href={existingPath} 
                                target="_blank" 
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-1.5 text-slate-400 hover:text-blue-600 bg-white rounded shadow-sm border transition-all z-20"
                                title="View Current"
                            >
                                <Eye size={16} />
                            </a>
                        )}
                        {fileName && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="p-1.5 text-slate-400 hover:text-red-500 bg-white rounded shadow-sm border transition-all z-20"
                                title="Remove New File"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                        <span className={`text-[10px] font-bold px-3 py-1.5 rounded transition-all border ${
                            value || existingPath 
                            ? "bg-blue-600 text-white border-blue-600" 
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}>
                            {value || existingPath ? "Change" : "Browse"}
                        </span>
                    </div>
                </div>
            </div>
            {error && <p className="text-[10px] text-red-500 font-bold ml-1">{error}</p>}
        </div>
    );
};

const ChevronDown = ({ size, className }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);
