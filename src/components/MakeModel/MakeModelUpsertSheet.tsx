import { useEffect, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import Spinner from "../common/Spinner";
import { useMake } from "../../hooks/Make/useMake";
import { useModel } from "../../hooks/Model/useModel";

interface Props {
  open: boolean;
  agency?: any;
  type: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MakeModelUpsertSheet({
  open,
  agency,
  type,
  onClose,
  onSuccess
}: Props) {

  const isEdit = !!agency;

  const { getList, saveMake } = useMake();
  const { saveModel } = useModel();

  const [makeOptions, setMakeOptions] = useState<any[]>([]);
  const [loadingMake, setLoadingMake] = useState(false);
  const [saving, setSaving] = useState(false);

  const initialForm = {
    id: "",
    makeId: "",
    makeName: "",
    modelName: ""
  };

  const [form, setForm] = useState<any>(initialForm);
  const [errors, setErrors] = useState<any>({});

  /* BODY SCROLL LOCK */

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  /* LOAD DATA */

  useEffect(() => {
    if (!open) return;

    if (isEdit && agency) {
      setForm({
        ...agency
      });
    } else {
      setForm(initialForm);
    }

    setErrors({});
    loadMakeDropdown();

  }, [open, agency]);

  const loadMakeDropdown = async () => {

    if (type !== 2) return;

    setLoadingMake(true);

    const res = await getList(1, 100);
    setMakeOptions(res?.data || []);

    setLoadingMake(false);
  };

  /* VALIDATION */

  const validate = () => {

    const e: any = {};

    if (type === 1 && !form.makeName) {
      e.makeName = "Make name is required";
    }

    if (type === 2) {

      if (!form.makeId) {
        e.makeId = "Make selection is required";
      }

      if (!form.modelName) {
        e.modelName = "Model name is required";
      }
    }

    setErrors(e);

    if (Object.keys(e).length > 0) {
      toast.error("Please fix validation errors");
      return false;
    }

    return true;
  };

  /* SAVE */

  const handleSave = async () => {

    if (!validate()) return;

    setSaving(true);

    try {

      if (type === 1) {

        const payload = {
          ...(isEdit && { id: form.id }),
          makeName: form.makeName
        };

        await saveMake(payload);
      }

      if (type === 2) {

        const payload = {
          ...(isEdit && { id: form.id }),
          make: form.makeId,
          modelName: form.modelName
        };

        await saveModel(payload);
      }

      toast.success(
        `${type === 1 ? "Make" : "Model"} ${isEdit ? "updated" : "created"} successfully`
      );

      onSuccess();
      onClose();

    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* OVERLAY */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
        onClick={saving ? undefined : onClose}
      />

      {/* SHEET */}
      <div className="fixed top-0 right-0 w-full max-w-[20vw] h-screen bg-slate-50 z-[70] shadow-2xl flex flex-col animate-slide-in-right">

        {/* HEADER */}
        <div className="px-8 py-6 bg-white border-b flex justify-between items-center">

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {isEdit ? "Edit" : "Add"} {type === 1 ? "Make" : "Model"}
            </h2>

            <p className="text-slate-500 text-sm mt-1">
              Manage {type === 1 ? "make" : "model"} information.
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

            <div className="flex items-center gap-2 bg-slate-800 px-6 py-3 text-white">
              <h3 className="font-bold uppercase tracking-wider text-[10px]">
                {type === 1 ? "MAKE INFORMATION" : "MODEL INFORMATION"}
              </h3>
            </div>

            <div className="p-6 grid grid-cols-1 gap-6">

              {type === 1 && (
                <Input
                  label="MAKE NAME"
                  required
                  value={form.makeName}
                  error={errors.makeName}
                  placeholder="Enter make name"
                  onChange={(v: string) =>
                    setForm({ ...form, makeName: v })
                  }
                />
              )}

              {type === 2 && (
                <>
                  <Select
                    label="SELECT MAKE"
                    required
                    value={form.makeId}
                    error={errors.makeId}
                    loading={loadingMake}
                    options={makeOptions.map(m => ({
                      id: m.id,
                      name: m.makeName
                    }))}
                    onChange={(v: any) =>
                      setForm({ ...form, makeId: v })
                    }
                  />

                  <Input
                    label="MODEL NAME"
                    required
                    value={form.modelName}
                    error={errors.modelName}
                    placeholder="Enter model name"
                    onChange={(v: string) =>
                      setForm({ ...form, modelName: v })
                    }
                  />
                </>
              )}

            </div>
          </section>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 bg-white border-t flex justify-between items-center">
          <div className="flex gap-4">
            <button
              className="px-8 py-2.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Spinner className="text-white" />
                  Saving...
                </>
              ) : (
                "SAVE"
              )}
            </button>
            <button
              className="px-8 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded flex items-center justify-center gap-2 shadow-lg transition-all"
              onClick={onClose}
              disabled={saving}
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
  

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