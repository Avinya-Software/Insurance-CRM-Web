import { useEffect, useState } from "react";
import { X, Building2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Spinner from "../common/Spinner";

interface Props {
  open: boolean;
  onClose: () => void;
  item?: any;
  onSuccess: () => void;
}

const GeneralAgencyUpsertSheet = ({
  open,
  onClose,
  item,
  onSuccess,
}: Props) => {
  const isEdit = !!item;

  const initialForm = {
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

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    if (isEdit && item) {
      setForm({ ...initialForm, ...item });
    } else {
      setForm(initialForm);
    }

    setErrors({});
  }, [open, item]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.agencyName) e.agencyName = "Agency Name is required";
    if (!form.agencyCode) e.agencyCode = "Agency Code is required";
    if (!form.mobileNumber) e.mobileNumber = "Mobile Number is required";

    setErrors(e);
    if (Object.keys(e).length > 0) {
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

      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed top-0 right-0 w-full max-w-[30vw] h-screen bg-slate-50 z-[70] shadow-2xl flex flex-col animate-slide-in-right">

        {/* HEADER */}
        <div className="px-8 py-6 bg-white border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {isEdit ? "Edit General Agency" : "Add New General Agency"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Fill in the details to {isEdit ? "update" : "create"} the agency.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={22} className="text-slate-400" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">

          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

            <div className="flex items-center gap-2 bg-slate-800 px-6 py-3 text-white">
              <div className="p-1.5 bg-white/10 rounded">
                <Building2 size={16} />
              </div>
              <h3 className="font-bold uppercase tracking-wider text-xs font-semibold">
                General Agency Details
              </h3>
            </div>

            <div className="p-6 grid grid-cols-2 gap-x-6 gap-y-5">
              <Input
                label="Agency Name"
                required
                value={form.agencyName}
                error={errors.agencyName}
                onChange={(v: any) => setForm({ ...form, agencyName: v })}
              />

              <Input
                label="Agency Code"
                required
                value={form.agencyCode}
                error={errors.agencyCode}
                onChange={(v: any) => setForm({ ...form, agencyCode: v })}
              />

              <Input
                label="Agency Company"
                value={form.agencyCompany}
                onChange={(v: any) => setForm({ ...form, agencyCompany: v })}
              />

              <Input
                label="Mobile Number"
                required
                value={form.mobileNumber}
                error={errors.mobileNumber}
                onChange={(v: any) => setForm({ ...form, mobileNumber: v })}
              />

              <Input
                label="Email ID"
                value={form.emailId}
                onChange={(v: any) => setForm({ ...form, emailId: v })}
              />

              <Input
                label="License Start Date"
                type="date"
                value={form.licenseStartDate}
                onChange={(v: any) =>
                  setForm({ ...form, licenseStartDate: v })
                }
              />

              <Input
                label="License End Date"
                type="date"
                value={form.licenseEndDate}
                onChange={(v: any) =>
                  setForm({ ...form, licenseEndDate: v })
                }
              />

              <Input
                label="Address Line 1"
                value={form.addressLine1}
                onChange={(v: any) =>
                  setForm({ ...form, addressLine1: v })
                }
              />

              <Input
                label="Address Line 2"
                value={form.addressLine2}
                onChange={(v: any) =>
                  setForm({ ...form, addressLine2: v })
                }
              />

              <Input
                label="City"
                value={form.city}
                onChange={(v: any) =>
                  setForm({ ...form, city: v })
                }
              />

              <Input
                label="State"
                value={form.state}
                onChange={(v: any) =>
                  setForm({ ...form, state: v })
                }
              />

            </div>
          </section>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 bg-white border-t flex gap-4">
          <button
            disabled={saving}
            className="px-8 py-2.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            onClick={handleSave}
          >
            {saving ? <Spinner className="text-white" /> : "SAVE"}
          </button>

          <button
            className="px-8 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded shadow-lg"
            onClick={onClose}
            disabled={saving}
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