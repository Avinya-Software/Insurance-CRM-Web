import { useEffect, useState } from "react";
import { Building2, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  agency?: any;
  onSuccess: () => void;
}

const Spinner = ({ className }: any) => <div className={`animate-spin rounded-full h-5 w-5 border-b-2 border-current ${className}`} />;

const LifeAgencyUpsertSheet = ({
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
    agencyCompanyId: "",
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

  // Mock companies for the dropdown
  const companies = [
    { id: "1", name: "LIC of India" },
    { id: "2", name: "HDFC Life" },
    { id: "3", name: "ICICI Prudential" },
    { id: "4", name: "SBI Life" },
    { id: "5", name: "Max Life" },
  ];

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
    if (!form.agencyCompanyId) e.agencyCompanyId = "Agency company is required";
    
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
      toast.success("Life Agency details saved successfully");
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
    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
    onClick={saving ? undefined : onClose}
  />

  {/* SHEET */}
  <div className="fixed top-0 right-0 w-full max-w-[30vw] h-screen bg-slate-50 z-[70] shadow-2xl flex flex-col animate-slide-in-right">

    {/* HEADER */}
    <div className="px-8 py-6 bg-white border-b flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          {isEdit ? "Edit Life Agency" : "Add Life Agency"}
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Manage life agency details and license information.
        </p>
      </div>

      <button
        onClick={onClose}
        disabled={saving}
        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
      >
        <X size={22} className="text-slate-400" />
      </button>
    </div>

    {/* BODY */}
    <div className="flex-1 overflow-y-auto p-8">
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

        {/* SECTION TITLE */}
        <div className="flex items-center gap-2 bg-slate-800 px-6 py-3 text-white">
        <div className="p-1.5 bg-white/10 rounded">
                <Building2 size={16} />
              </div>
          <h3 className="font-bold uppercase tracking-wider text-[10px]">
            Life Agency Information
          </h3>
        </div>

        {/* FORM GRID */}
        <div className="p-6 grid grid-cols-2 gap-x-6 gap-y-5">

          <Input
            label="AGENCY NAME"
            required
            value={form.agencyName}
            error={errors.agencyName}
            onChange={(v: string) => setForm({ ...form, agencyName: v })}
          />

          <Input
            label="AGENCY CODE"
            required
            value={form.agencyCode}
            error={errors.agencyCode}
            onChange={(v: string) => setForm({ ...form, agencyCode: v })}
          />

          <Select
            label="AGENCY COMPANY"
            required
            value={form.agencyCompanyId}
            error={errors.agencyCompanyId}
            options={companies}
            onChange={(v: string) =>
              setForm({ ...form, agencyCompanyId: v })
            }
          />

          <Input
            label="MOBILE NUMBER"
            value={form.mobileNumber}
            onChange={(v: string) => setForm({ ...form, mobileNumber: v })}
          />

          <Input
            label="EMAIL ID"
            value={form.emailId}
            onChange={(v: string) => setForm({ ...form, emailId: v })}
          />

          <Input
            label="LICENSE START DATE"
            type="date"
            value={form.licenseStartDate}
            onChange={(v: string) =>
              setForm({ ...form, licenseStartDate: v })
            }
          />

          <Input
            label="LICENSE END DATE"
            type="date"
            value={form.licenseEndDate}
            onChange={(v: string) =>
              setForm({ ...form, licenseEndDate: v })
            }
          />

          <Input
            label="CITY"
            value={form.city}
            onChange={(v: string) => setForm({ ...form, city: v })}
          />

          <Input
            label="STATE"
            value={form.state}
            onChange={(v: string) => setForm({ ...form, state: v })}
          />
        </div>
      </section>
    </div>

    {/* FOOTER */}
    <div className="px-8 py-6 bg-white border-t flex gap-4">
      <button
        disabled={saving}
        onClick={handleSave}
        className="px-8 py-2.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded flex items-center gap-2 shadow-lg disabled:opacity-50"
      >
        {saving ? (
          <>
            <Spinner className="text-white" />
            SAVING...
          </>
        ) : (
          "SAVE"
        )}
      </button>

      <button
        disabled={saving}
        onClick={onClose}
        className="px-8 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded shadow-lg"
      >
        CANCEL
      </button>
    </div>
  </div>
</>
  );
};

export default LifeAgencyUpsertSheet;

/*   INPUT   */
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

/*   SELECT   */
const Select = ({ label, value, error, options, onChange }: any) => (
  <div className="space-y-1.5 w-full">
    <label className="text-xs font-bold text-slate-700">
      {label}
    </label>
    <select
      className={`w-full px-4 py-2 bg-white border rounded text-sm transition-all outline-none appearance-none ${
        error 
          ? "border-red-500 ring-2 ring-red-50" 
          : "border-slate-200 focus:border-blue-400"
      }`}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">-Select-</option>
      {options.map((opt: any) => (
        <option key={opt.id} value={opt.id}>{opt.name}</option>
      ))}
    </select>
    {error && <p className="text-[10px] font-medium text-red-500 mt-1">{error}</p>}
  </div>
);
