import React, { useEffect, useState } from "react";
import { X, Save, User, FileText, ShieldCheck, Landmark } from "lucide-react";
import { useAddFamilyMember } from "../../hooks/family-member/useAddFamilyMember";
import { useCustomerDropdown } from "../../hooks/customer/useCustomerDropdown";
import { IFamilyMember } from "../../interfaces/family-member.interface";

interface Props {
  open: boolean;
  item: IFamilyMember | null;
  onClose: () => void;
  onSuccess: () => void;
}

type TabType = "personal" | "additional";

const initialForm = {
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

const FamilyMemberUpsertSheet = ({ open, item, onClose, onSuccess }: Props) => {
  const [activeTab, setActiveTab] = useState<TabType>("personal");
  const [formData, setFormData] = useState<any>(initialForm);
  const [files, setFiles] = useState<Record<string, File | null>>({
    AadhaarCardDocument: null,
    PanCardDocument: null,
    GSTDocument: null,
    ProfilePhoto: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: customers = [] } = useCustomerDropdown();

  const { mutate: addMember, isPending } = useAddFamilyMember();

  useEffect(() => {
    if (item) {
      setFormData({
        FamilyHeadId: item.familyHeadId,
        RelationWithFamilyHead: item.relationWithFamilyHead,
        FirstName: item.firstName,
        MiddleName: item.middleName,
        LastName: item.lastName,
        MobileNumber: item.mobileNumber,
        WhatsappNumber: item.whatsappNumber,
        Gender: item.gender,
        DOB: item.dob ? item.dob.split("T")[0] : "",
        AnniversaryDate: item.anniversaryDate ? item.anniversaryDate.split("T")[0] : "",
        BusinessType: item.businessType.toString(),
        AadhaarCardNumber: item.aadhaarCardNumber,
        PanCardNumber: item.panCardNumber,
        GSTNumber: item.gstNumber,
        MarriageStatus: item.marriageStatus,
      });
    } else {
      setFormData(initialForm);
    }
    setErrors({});
    setActiveTab("personal");
  }, [item, open]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (name: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [name]: file }));
  };

  const handleSubmit = () => {
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    Object.keys(files).forEach((key) => {
      if (files[key]) {
        data.append(key, files[key] as File);
      }
    });

    addMember(data, {
      onSuccess: () => {
        onSuccess();
        onClose();
      },
    });
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
                    />
                    <Input
                      label="First Name"
                      required
                      value={formData.FirstName}
                      onChange={(v: string) => handleChange("FirstName", v)}
                    />
                    <Input
                      label="Middle Name"
                      value={formData.MiddleName}
                      onChange={(v: string) => handleChange("MiddleName", v)}
                    />
                    <Input
                      label="Last Name"
                      required
                      value={formData.LastName}
                      onChange={(v: string) => handleChange("LastName", v)}
                    />
                    <Input
                      label="Mobile Number"
                      required
                      value={formData.MobileNumber}
                      onChange={(v: string) => handleChange("MobileNumber", v)}
                    />
                    <Input
                      label="Whatsapp Number"
                      value={formData.WhatsappNumber}
                      onChange={(v: string) => handleChange("WhatsappNumber", v)}
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
                    />
                    <Input
                      label="DOB"
                      type="date"
                      value={formData.DOB}
                      onChange={(v: string) => handleChange("DOB", v)}
                    />
                    <Input
                      label="Anniversary Date"
                      type="date"
                      value={formData.AnniversaryDate}
                      onChange={(v: string) => handleChange("AnniversaryDate", v)}
                    />
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
                    />
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
                        onChange={(f) => handleFileChange("AadhaarCardDocument", f)}
                      />
                      <FileInput
                        label="PAN Document"
                        onChange={(f) => handleFileChange("PanCardDocument", f)}
                      />
                      <FileInput
                        label="GST Document"
                        onChange={(f) => handleFileChange("GSTDocument", f)}
                      />
                      <FileInput
                        label="Profile Photo"
                        onChange={(f) => handleFileChange("ProfilePhoto", f)}
                      />
                    </div>
                  </div>
                </section>
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
                <Save size={18} />
            )}
            {isPending ? "SAVING..." : "SAVE MEMBER"}
          </button>
          <button
            className="px-8 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded flex items-center justify-center gap-2 shadow-lg transition-all"
            onClick={onClose}
          >
            CANCEL
          </button>
        </div>
      </div>
    </>
  );
};

export default FamilyMemberUpsertSheet;

/* HELPERS */

const Input = ({ label, required, value, onChange, type = "text" }: any) => (
  <div className="space-y-1.5 w-full">
    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const Select = ({ label, required, value, options, onChange, valueKey = "id", labelKey = "name" }: any) => (
  <div className="space-y-1.5 w-full">
    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <select
        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all appearance-none"
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
  </div>
);

const RadioGroup = ({ label, name, value, options, onChange }: any) => (
  <div className="space-y-1.5 w-full">
    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
      {label}
    </label>
    <div className="flex flex-wrap gap-4 mt-2">
      {options.map((o: any) => (
        <label key={o.value} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={o.value}
            checked={value === o.value}
            onChange={(e) => onChange(e.target.value)}
            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <span className="text-sm text-slate-600">{o.label}</span>
        </label>
      ))}
    </div>
  </div>
);

const FileInput = ({ label, onChange }: any) => (
  <div className="space-y-1.5 w-full">
    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
      {label}
    </label>
    <input
      type="file"
      className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-900"
      onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)}
    />
  </div>
);

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
