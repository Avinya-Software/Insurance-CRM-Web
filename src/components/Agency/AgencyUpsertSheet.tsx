import { useEffect, useState } from "react";
import { X, Building2, ChevronDown } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Spinner from "../common/Spinner";
import { useCreateAgency } from "../../hooks/Agency/useCreateAgency";
import SearchableComboBox from "../common/SearchableComboBox";

interface Props {
  open: boolean;
  agency?: any;
  type: number; // 0 = General, 1 = Life
  onClose: () => void;
  onSuccess: () => void;
}

const AgencyUpsertSheet = ({
  open,
  agency,
  type,
  onClose,
  onSuccess,
}: Props) => {

  const isEdit = !!agency;

  const initialForm:any = {
    agencyName: "",
    agencyCode: "",
    agencyCompanyId: "",
    mobileNumber: "",
    email: "",
    licenseStartDate: "",
    licenseEndDate: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<any>({});

  const { saveAgency, saving } = useCreateAgency();

  const companies = [
    { id: "5EDE7534-1306-4D4A-ADAA-5433340DB308", name: "LIC of India" },
    { id: "5EDE7534-1306-4D4A-ADAA-5433340DB308", name: "HDFC Life" },
    { id: "5EDE7534-1306-4D4A-ADAA-5433340DB308", name: "ICICI Prudential" },
  ];

  /* PREFILL */
  useEffect(() => {

    if (!open) return;

    if (isEdit) {
      setForm({ ...initialForm, ...agency });
    } else {
      setForm(initialForm);
    }

    setErrors({});

  }, [open, agency]);

  /* VALIDATION */

  const validate = () => {

    const e:any = {};

    if (!form.agencyName) e.agencyName = "Agency name required";
    if (!form.agencyCode) e.agencyCode = "Agency code required";

    if (type === 1 && !form.agencyCompanyId)
      e.agencyCompanyId = "Agency company required";

    setErrors(e);

    if (Object.keys(e).length) {
      toast.error("Please fix validation errors");
      return false;
    }

    return true;
  };

  /* SAVE */

  const handleSave = async () => {

    if (!validate()) return;

    const payload = {
      id: isEdit ? agency?.id : undefined,
      ...form,
      type,
    };

    const success = await saveAgency(payload, isEdit);

    if (success) {
      onSuccess();
      onClose();
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed top-0 right-0 w-full max-w-[30vw] h-screen bg-slate-50 z-[70] shadow-2xl flex flex-col animate-slide-in-right">

        {/* Header */}

        <div className="px-8 py-6 bg-white border-b flex justify-between items-center">

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {isEdit ? "Edit Agency" : "Add Agency"}
            </h2>

            <p className="text-slate-500 text-sm mt-1">
              {type === 0 ? "General Agency Details" : "Life Agency Details"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full"
          >
            <X size={22} />
          </button>

        </div>

        {/* Body */}

        <div className="flex-1 overflow-y-auto p-8">

          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

            <div className="flex items-center gap-2 bg-slate-800 px-6 py-3 text-white">

              <div className="p-1.5 bg-white/10 rounded">
                <Building2 size={16}/>
              </div>

              <h3 className="font-bold uppercase tracking-wider text-xs">
                Agency Information
              </h3>

            </div>

            <div className="p-6 grid grid-cols-2 gap-x-6 gap-y-5">

              <Input
                label="Agency Name"
                required
                value={form.agencyName}
                error={errors.agencyName}
                onChange={(v:any)=>setForm({...form,agencyName:v})}
              />

              <Input
                label="Agency Code"
                required
                value={form.agencyCode}
                error={errors.agencyCode}
                onChange={(v:any)=>setForm({...form,agencyCode:v})}
              />

              {/* LIFE AGENCY ONLY */}

              {type === 1 ? (
              <SearchableComboBox
              label="AGENCY COMPANY"
              required
              items={(companies || []).map((c: any) => ({
                value: c.id,
                label: c.name,
              }))}
              value={form.agencyCompanyId}
              error={errors.agencyCompanyId}
              onSelect={(item: any) =>
                setForm({
                  ...form,
                  agencyCompanyId: item?.value || "",
                })
              }
            />
            ) : (
              <Input
                label="Agency Company"
                value={form.agencyCompanyName}
                onChange={(v: any) =>
                  setForm({ ...form, agencyCompanyName: v })
                }
              />
            )}

              <Input
                label="Mobile Number"
                value={form.mobileNumber}
                onChange={(v:any)=>setForm({...form,mobileNumber:v})}
              />

              <Input
                label="Email"
                value={form.email}
                onChange={(v:any)=>setForm({...form,email:v})}
              />

              {/* LICENSE FIELDS */}

              {type === 1 && (
                <>
                  <Input
                    label="License Start Date"
                    type="date"
                    value={form.licenseStartDate}
                    onChange={(v:any)=>setForm({...form,licenseStartDate:v})}
                  />

                  <Input
                    label="License End Date"
                    type="date"
                    value={form.licenseEndDate}
                    onChange={(v:any)=>setForm({...form,licenseEndDate:v})}
                  />
                </>
              )}

              <Input
                label="Address Line 1"
                value={form.addressLine1}
                onChange={(v:any)=>setForm({...form,addressLine1:v})}
              />

              <Input
                label="Address Line 2"
                value={form.addressLine2}
                onChange={(v:any)=>setForm({...form,addressLine2:v})}
              />

              <Input
                label="City"
                value={form.city}
                onChange={(v:any)=>setForm({...form,city:v})}
              />

              <Input
                label="State"
                value={form.state}
                onChange={(v:any)=>setForm({...form,state:v})}
              />

            </div>

          </section>

        </div>

        {/* Footer */}

        <div className="px-8 py-6 bg-white border-t flex gap-4">

          <button
            disabled={saving}
            onClick={handleSave}
            className="px-8 py-2.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded flex items-center gap-2"
          >
            {saving ? <Spinner className="text-white"/> : "SAVE"}
          </button>

          <button
            onClick={onClose}
            className="px-8 py-2.5 text-sm font-bold text-white bg-red-500 rounded"
          >
            CANCEL
          </button>

        </div>

      </div>
    </>
  );
};

export default AgencyUpsertSheet;

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