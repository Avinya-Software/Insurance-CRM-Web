import React, { useEffect, useState } from "react";
import { X, Save, User, MapPin, Landmark, Phone, ShieldCheck, FileText, ChevronRight, ChevronDown } from "lucide-react";
import { UserDetail, UserPayload } from "../../interfaces/UserMaster.interface";
import { useUserTypes } from "../../hooks/UserMaster/useUserTypes";
import { useUpsertUser } from "../../hooks/UserMaster/useUpsertUser";
import toast from "react-hot-toast";
import { useUpdateUser } from "../../hooks/UserMaster/useUpdateUser";

interface Props {
  open: boolean;
  item: UserDetail | null;
  onClose: () => void;
  onSuccess: () => void;
}

type TabType = "general" | "address" | "banking";

const initialForm: UserPayload = {
  userTypeId: "",
  name: "",
  email: "",
  mobileNumber: "",
  password: "",
  gstNumber: "",
  panCard: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  pincode: "",
  state: "",
  country: "India",
  userCode: "",
  userName: "",
  officeNumber: "",
  residenceNumber: "",
  bankName: "",
  branchName: "",
  accountType: "",
  accountNumber: "",
  micrCode: "",
  ifscCode: "",
};

const AddUserUpsertSheet = ({ open, item, onClose, onSuccess }: Props) => {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [formData, setFormData] = useState<UserPayload>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: userTypesRes } = useUserTypes();
  const userTypes = userTypesRes?.data || [];

  const { mutate: upsertUser, isPending: isCreating } = useUpsertUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  
  const isPending = isCreating || isUpdating;
  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id,
        userTypeId: item.userTypeId,
        name: item.name,
        email: item.email,
        mobileNumber: item.mobile,
        gstNumber: item.gstNumber,
        panCard: item.panNo,
        addressLine1: item.addressLine1,
        addressLine2: item.addressLine2,
        city: item.city,
        pincode: item.pincode,
        state: item.state,
        country: item.country || "India",
        userCode: item.userCode,
        userName: item.userName,
        officeNumber: item.officeNumber,
        residenceNumber: item.residenceNumber,
        bankName: item.bankName,
        branchName: item.branchName,
        accountType: item.accountType,
        accountNumber: item.accountNumber,
        micrCode: item.micrCode,
        ifscCode: item.ifscCode,
        status: item.status,
      });
    } else {
      setFormData(initialForm);
    }
    setErrors({});
    setActiveTab("general");
  }, [item, open]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.userTypeId) e.userTypeId = "User Type is required";
    if (!formData.name?.trim()) e.name = "Full Name is required";
    if (!formData.email?.trim()) e.email = "Email is required";
    if (!formData.mobileNumber?.trim()) e.mobileNumber = "Mobile is required";
    if (!formData.userName?.trim()) e.userName = "Username is required";

    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error("Please fill required fields in General Information");
      setActiveTab("general");
      return false;
    }
    return true;
  };
  const displayValue = (value: string | null | undefined) => {
    return value && value.trim() !== "" ? value : "-";
  };
  
  const handleSubmit = () => {
    if (!validate()) return;
  
    if (item?.id) {
      // EDIT USER
      updateUser(
        {
          ...formData,
          userMasterId: item.id,
        },
        {
          onSuccess: () => {
            onSuccess();
          },
        }
      );
    } else {
      // ADD USER
      upsertUser(formData, {
        onSuccess: () => {
          onSuccess();
        },
      });
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]" onClick={isPending ? undefined : onClose} />

      <div className="fixed top-0 right-0 w-full max-w-[800px] h-screen bg-slate-50 z-[70] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* HEADER */}
        <div className="px-8 py-6 bg-white border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {item ? "Edit User Details" : "Register New User"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">Fill in the details to {item ? 'update' : 'register'} the user account.</p>
          </div>
          <button 
            onClick={onClose} 
            disabled={isPending}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* TABS */}
        <div className="px-8 bg-white border-b flex gap-8">
          {[
            { id: "general", label: "General Information", icon: User },
            { id: "address", label: "Address & Contact", icon: MapPin },
            { id: "banking", label: "Banking Details", icon: Landmark },
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
            {activeTab === "general" && (
              <section className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="flex items-center gap-2 bg-slate-800 px-6 py-3 text-white">
                  <div className="p-1.5 bg-white/10 text-white rounded">
                    <ShieldCheck size={16} />
                  </div>
                  <h3 className="font-bold uppercase tracking-wider text-[10px]">Personal Information</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="User Type"
                      required
                      value={formData.userTypeId ?? "-"}
                      error={errors.userTypeId}
                      options={userTypes}
                      onChange={(v: string) => handleChange("userTypeId", v)}
                    />
                    <Input
                      label="Full Name"
                      required
                      value={formData.name ?? "-"}
                      error={errors.name}
                      placeholder="Enter full name"
                      onChange={(v: string) => handleChange("name", v)}
                    />
                    <Input
                      label="Email Address"
                      required
                      type="email"
                      value={formData.email ?? "-"}
                      error={errors.email}
                      placeholder="name@example.com"
                      onChange={(v: string) => handleChange("email", v)}
                    />
                    <Input
                      label="Mobile Number"
                      required
                      value={formData.mobileNumber ?? "-"}
                      error={errors.mobileNumber}
                      placeholder="10-digit mobile"
                      onChange={(v: string) => handleChange("mobileNumber", v)}
                    />
                    <Input
                      label="User Name"
                      required
                      value={formData.userName ?? "-"}
                      error={errors.userName}
                      placeholder="Unique username"
                      onChange={(v: string) => handleChange("userName", v)}
                    />
                    <Input
                      label="User Code"
                      value={formData.userCode ?? "-"}
                      placeholder="Internal code"
                      onChange={(v: string) => handleChange("userCode", v)}
                    />
                    <Input
                      label="GST Number"
                      value={formData.gstNumber ?? "-"}
                      placeholder="GSTIN"
                      onChange={(v: string) => handleChange("gstNumber", v)}
                    />
                    <Input
                      label="PAN Card"
                      value={formData.panCard ?? "-"}
                      className={"text-black"}
                      placeholder="PAN Number"
                      onChange={(v: string) => handleChange("panCard", v)}
                    />
                  </div>
                </div>
              </section>
            )}

            {activeTab === "address" && (
              <div className="space-y-6">
                <section className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                  <div className="flex items-center gap-2 bg-slate-800 px-6 py-3 text-white">
                    <div className="p-1.5 bg-white/10 text-white rounded">
                      <MapPin size={16} />
                    </div>
                    <h3 className="font-bold uppercase tracking-wider text-[10px]">Address Details</h3>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      <Input
                        label="Address Line 1"
                        value={formData.addressLine1  ?? "-"} 
                        placeholder="Street address"
                        onChange={(v: string) => handleChange("addressLine1", v)}
                      />
                      <Input
                        label="Address Line 2"
                        value={formData.addressLine2  ?? "-"}
                        placeholder="Apartment, suite, etc."
                        onChange={(v: string) => handleChange("addressLine2", v)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="City"
                        value={formData.city  ?? "-"}
                        placeholder="City"
                        onChange={(v: string) => handleChange("city", v)}
                      />
                      <Input
                        label="Pincode"
                        value={formData.pincode ?? "-"}
                        placeholder="Pincode"
                        onChange={(v: string) => handleChange("pincode", v)}
                      />
                      <Input
                        label="State"
                        value={formData.state ?? "-"}
                        placeholder="State"
                        onChange={(v: string) => handleChange("state", v)}
                      />
                      <Input
                        label="Country"
                        value={formData.country ?? "-"}
                        placeholder="Country"
                        onChange={(v: string) => handleChange("country", v)}
                      />
                    </div>
                  </div>
                </section>

                <section className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                  <div className="flex items-center gap-2 bg-slate-800 px-6 py-3 text-white">
                    <div className="p-1.5 bg-white/10 text-white rounded">
                      <Phone size={16} />
                    </div>
                    <h3 className="font-bold uppercase tracking-wider text-[10px]">Contact Numbers</h3>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Office Number"
                        value={formData.officeNumber ?? "-"}
                        placeholder="Office phone"
                        onChange={(v: string) => handleChange("officeNumber", v)}
                      />
                      <Input
                        label="Residence Number"
                        value={formData.residenceNumber ?? "-"}
                        placeholder="Home phone"
                        onChange={(v: string) => handleChange("residenceNumber", v)}
                      />
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === "banking" && (
              <section className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="flex items-center gap-2 bg-slate-800 px-6 py-3 text-white">
                  <div className="p-1.5 bg-white/10 text-white rounded">
                    <Landmark size={16} />
                  </div>
                  <h3 className="font-bold uppercase tracking-wider text-[10px]">Banking Information</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Bank Name"
                      value={formData.bankName ?? "-"}
                      placeholder="Bank name"
                      onChange={(v: string) => handleChange("bankName", v)}
                    />
                    <Input
                      label="Branch Name"
                      value={formData.branchName ?? "-"}
                      placeholder="Branch location"
                      onChange={(v: string) => handleChange("branchName", v)}
                    />
                    <Input
                    label="Account Type"
                    value={formData.accountType ?? "-"}
                    placeholder="Account Type (e.g., Savings, Current)"
                    onChange={(v: string) => handleChange("accountType", v)}
                    />
                    <Input
                      label="Account Number"
                      value={formData.accountNumber ?? "-"}
                      placeholder="A/C Number"
                      onChange={(v: string) => handleChange("accountNumber", v)}
                    />
                    <Input
                      label="IFSC Code"
                      value={formData.ifscCode ?? "-"}
                      placeholder="IFSC"
                      onChange={(v: string) => handleChange("ifscCode", v)}
                    />
                    <Input
                      label="MICR Code"
                      value={formData.micrCode ?? "-"}
                      placeholder="MICR"
                      onChange={(v: string) => handleChange("micrCode", v)}
                    />
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 bg-white border-t flex justify-between items-center">
          <div className="flex gap-4">
            <button
              disabled={isPending}
              className="px-8 py-2.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              onClick={handleSubmit}
            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Save size={18} />
              )}
              {isPending ? "SAVING..." : "SAVE"}
            </button>
            <button
              className="px-8 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded flex items-center justify-center gap-2 shadow-lg transition-all"
              onClick={onClose}
              disabled={isPending}
            >
              CANCEL
            </button>
          </div>

          <div className="flex gap-4">
            {activeTab !== "general" && (
              <button
                onClick={() => setActiveTab(activeTab === "banking" ? "address" : "general")}
                className="px-6 py-2.5 text-sm font-bold text-white bg-red-400 hover:bg-red-500 rounded flex items-center gap-2 transition-all"
              >
                Previous
              </button>
            )}
            {activeTab !== "banking" && (
              <button
                onClick={() => setActiveTab(activeTab === "general" ? "address" : "banking")}
                className="px-6 py-2.5 text-sm font-bold text-white bg-blue-400 hover:bg-blue-500 rounded flex items-center gap-2 transition-all"
              >
                Next <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddUserUpsertSheet;

/*   HELPERS   */

const Input = ({
  label,
  required,
  value,
  error,
  type = "text",
  onChange,
  placeholder,
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
