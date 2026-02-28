import { useEffect, useState } from "react";
import { X, ShieldCheck, UserPlus, Calendar, Mail, Phone, MapPin, Building2, Briefcase } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  agency?: any;
  onSuccess: () => void;
}

const Spinner = ({ className }: any) => <div className={`animate-spin rounded-full h-5 w-5 border-b-2 border-current ${className}`} />;

const GeneralAgencyUpsertSheet = ({
  open,
  onClose,
  agency,
  onSuccess,
}: Props) => {
  const isEdit = !!agency;

  const initialForm = {
    agencyId: null,
    agencyName: "",
    agencyCode: "",
    agencyCompany: "",
    mobileNumber: "",
    emailId: "",
    licenseStartDate: "",
    licenseEndDate: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
  };

  const [form, setForm] = useState<any>(initialForm);
  const [errors, setErrors] = useState<any>({});
  const [saving, setSaving] = useState(false);

  /*   PREFILL   */
  useEffect(() => {
    if (!open) return;

    if (isEdit) {
      setForm({ ...agency });
    } else {
      setForm(initialForm);
    }

    setErrors({});
  }, [open, agency]);

  /*   VALIDATION   */
  const validate = () => {
    const e: any = {};
    if (!form.agencyName) e.agencyName = "Agency name is required";
    if (!form.agencyCode) e.agencyCode = "Agency code is required";
    
    setErrors(e);
    if (Object.keys(e).length) {
      toast.error("Please fix validation errors");
      return false;
    }
    return true;
  };

  /*   SAVE   */
  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      // Mock API call
      await new Promise(r => setTimeout(r, 1000));
      toast.success("Agency details saved successfully");
      onClose();
      onSuccess();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <Toaster position="top-right" />
      {/* OVERLAY */}
      <div
        className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
        onClick={onClose}
      />

      {/* SHEET */}
      <div className="fixed top-0 right-0 h-screen w-full max-w-3xl bg-white z-[70] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* HEADER */}
        <div className="px-8 py-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            {isEdit ? "Edit General Agency Details" : "Add General Agency Details"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* ROW 1: Name, Code, Company */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Agency Name"
              value={form.agencyName}
              error={errors.agencyName}
              placeholder="Name"
              onChange={(v: string) => setForm({ ...form, agencyName: v })}
            />
            <Input
              label="Agency Code"
              value={form.agencyCode}
              error={errors.agencyCode}
              placeholder="Agency Code"
              onChange={(v: string) => setForm({ ...form, agencyCode: v })}
            />
            <Input
              label="Agency Company"
              value={form.agencyCompany}
              placeholder="Agency Company"
              onChange={(v: string) => setForm({ ...form, agencyCompany: v })}
            />
          </div>

          {/* ROW 2: Mobile, Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Mobile Number"
              value={form.mobileNumber}
              error={errors.mobileNumber}
              placeholder="Mobile Number"
              onChange={(v: string) => setForm({ ...form, mobileNumber: v })}
            />
            <Input
              label="Email Id"
              value={form.emailId}
              placeholder="Email Id"
              onChange={(v: string) => setForm({ ...form, emailId: v })}
            />
          </div>

          {/* ROW 3: License Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="License Start Date"
              type="date"
              value={form.licenseStartDate}
              placeholder="Select Date"
              onChange={(v: string) => setForm({ ...form, licenseStartDate: v })}
            />
            <Input
              label="License End Date"
              type="date"
              value={form.licenseEndDate}
              placeholder="Select Date"
              onChange={(v: string) => setForm({ ...form, licenseEndDate: v })}
            />
          </div>

          {/* ROW 4: Address Lines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Address Line 1"
              value={form.addressLine1}
              placeholder="Address Line 1"
              onChange={(v: string) => setForm({ ...form, addressLine1: v })}
            />
            <Input
              label="Address Line 2"
              value={form.addressLine2}
              placeholder="Address Line 2"
              onChange={(v: string) => setForm({ ...form, addressLine2: v })}
            />
          </div>

          {/* ROW 5: City, State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="City"
              value={form.city}
              placeholder="City"
              onChange={(v: string) => setForm({ ...form, city: v })}
            />
            <Input
              label="State"
              value={form.state}
              placeholder="State"
              onChange={(v: string) => setForm({ ...form, state: v })}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 border-t flex gap-4">
          <button
            disabled={saving}
            className="px-6 py-2.5 bg-slate-800 text-white rounded font-bold text-sm hover:bg-slate-900 transition-colors disabled:opacity-50 flex items-center gap-2"
            onClick={handleSave}
          >
            {saving && <Spinner />}
            {saving ? "SAVING..." : "SAVE"}
          </button>
          <button
            className="px-6 py-2.5 bg-red-500 text-white rounded font-bold text-sm hover:bg-red-600 transition-colors"
            onClick={onClose}
          >
            CANCEL
          </button>
        </div>
      </div>
    </>
  );
};

export default GeneralAgencyUpsertSheet;

/*   REUSABLE INPUT COMPONENT   */
const Input = ({ label, required, value, error, type = "text", onChange, placeholder, suffix }: any) => (
  <div className="space-y-1.5 w-full">
    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input 
        type={type} 
        placeholder={placeholder} 
        className={`w-full px-4 py-2.5 bg-white border rounded text-sm transition-all outline-none ${
          error 
            ? "border-red-500 ring-2 ring-red-50" 
            : "border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
        }`} 
        value={value ?? ""} 
        onChange={(e) => onChange(e.target.value)} 
      />
      {suffix && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          {suffix}
        </div>
      )}
    </div>
    {error && <p className="text-[10px] font-medium text-red-500 mt-1">{error}</p>}
  </div>
);
