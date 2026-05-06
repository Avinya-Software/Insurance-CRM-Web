import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import Spinner from "../common/Spinner";
import { Company } from "../../interfaces/company.interface";
import { useUpsertCompany } from "../../hooks/Company/useUpsertCompany";

interface Props {
  open: boolean;
  onClose: () => void;
  item?: Company | null;
  onSuccess: () => void;
}

const CompanyUpsertSheet = ({ open, onClose, item, onSuccess }: Props) => {

  const isEdit = !!item;

  const initialForm: any = {
    companyName: "",
    email: "",
    mobileNumber: "",
    policyType: false
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<any>({});

  const { mutate: upsert, isPending: saving } = useUpsertCompany();

  /* PREFILL */

  useEffect(() => {

    if (!open) return;

    if (isEdit && item) {

      setForm({
        companyId: item.companyId,
        companyName: item.companyName,
        email: item.email,
        mobileNumber: item.mobileNumber,
        policyType: item.policyType
      });

    } else {

      setForm(initialForm);

    }

    setErrors({});

  }, [open, item]);

  /* VALIDATION */

  const validate = () => {

    const e: any = {};

    if (!form.companyName)
      e.companyName = "Company name required";

    if (form.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email format";

    setErrors(e);

    if (Object.keys(e).length) {
      toast.error("Please fix validation errors");
      return false;
    }

    return true;
  };

  /* SAVE */

  const handleSave = () => {

    if (!validate()) return;

    const payload: any = {
      companyName: form.companyName,
      email: form.email,
      mobileNumber: form.mobileNumber,
      policyType: form.policyType
    };

    if (isEdit && form.companyId) {
      payload.companyId = form.companyId;
    }

    upsert(payload, {
      onSuccess: () => {
        toast.success(
          `Company ${isEdit ? "updated" : "created"} successfully`
        );
        onSuccess();
        onClose();
      },
      onError: () => toast.error("Something went wrong")
    });

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

      <div className="fixed top-0 right-0 w-full max-w-[20vw] h-screen bg-slate-50 z-[70] shadow-2xl flex flex-col animate-slide-in-right">

        {/* Header */}

        <div className="px-8 py-6 bg-white border-b flex justify-between items-center">

          <div>

            <h2 className="text-2xl font-bold text-slate-900">
              {isEdit ? "Edit Company" : "Add Company"}
            </h2>

            <p className="text-slate-500 text-sm mt-1">
              Manage company information
            </p>

          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full"
          >
            <X size={22}/>
          </button>

        </div>

        {/* Body */}

        <div className="flex-1 overflow-y-auto p-4">

          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">

            <div className="grid grid-cols-1 gap-x-6 gap-y-5">

              <Input
                label="Company Name"
                required
                value={form.companyName}
                error={errors.companyName}
                onChange={(v:any)=>setForm({...form,companyName:v})}
              />

              <Input
                label="Email"
                value={form.email}
                error={errors.email}
                onChange={(v:any)=>setForm({...form,email:v})}
              />

              <Input
                label="Mobile Number"
                value={form.mobileNumber}
                onChange={(v:any)=>setForm({...form,mobileNumber:v})}
              />

              {/* Policy Type */}

              <div className="space-y-1.5">

                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Policy Type
                </label>

                <div className="flex gap-3">

                  <button
                    type="button"
                    onClick={()=>setForm({...form,policyType:false})}
                    className={`px-4 py-2.5 text-sm font-medium border rounded transition-all
                    ${!form.policyType
                      ? "bg-blue-50 border-blue-200 text-blue-700"
                      : "bg-white border-slate-200"
                    }`}
                  >
                    General
                  </button>

                  <button
                    type="button"
                    onClick={()=>setForm({...form,policyType:true})}
                    className={`px-4 py-2.5 text-sm font-medium border rounded transition-all
                    ${form.policyType
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-white border-slate-200"
                    }`}
                  >
                    Life
                  </button>

                </div>

              </div>

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

export default CompanyUpsertSheet;

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
      onChange={(e)=>onChange(e.target.value)}
    />

    {error && (
      <p className="text-[10px] font-medium text-red-500 mt-1">
        {error}
      </p>
    )}
  </div>
);