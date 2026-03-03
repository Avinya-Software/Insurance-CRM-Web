/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { X, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import Spinner from "../common/Spinner";
import { useUpsertHPADetail } from "../../hooks/HPADetails/useUpsertHPADetail";
import { HPADetail } from "../../interfaces/HPADetails.interface";

interface Props {
  open: boolean;
  onClose: () => void;
  item?: HPADetail | null;
  onSuccess: () => void;
}

const AddHPADetailsUpsertSheet = ({
  open,
  onClose,
  item,
  onSuccess,
}: Props) => {
  const isEdit = !!item;

  const initialForm = {
    id: undefined,
    hpaName: "",
  };

  const [form, setForm] = useState<any>(initialForm);
  const [errors, setErrors] = useState<any>({});
  const { mutate: upsert, isPending: saving } = useUpsertHPADetail();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    if (isEdit && item) {
      setForm({
        id: item.id,
        hpaName: item.hpaName,
      });
    } else {
      setForm(initialForm);
    }

    setErrors({});
  }, [open, item]);

  const validate = () => {
    const e: any = {};
    if (!form.hpaName) e.hpaName = "HPA Name is required";

    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error("Please fix validation errors");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;

    const payload = {
      ...(isEdit && { id: form.id }),
      hpaName: form.hpaName,
    };

    upsert(payload, {
      onSuccess: () => {
        toast.success(
          `HPA Detail ${isEdit ? "updated" : "created"} successfully`
        );
        onClose();
        onSuccess();
      },
      onError: () => toast.error("Something went wrong"),
    });
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
              {isEdit ? "Edit HPA Detail" : "Add New HPA Detail"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {isEdit
                ? "Update the HPA information."
                : "Create a new HPA entry."}
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
              <div className="p-1.5 bg-white/10 rounded">
                <ShieldCheck size={16} />
              </div>
              <h3 className="font-bold uppercase tracking-wider text-[10px]">
                HPA Information
              </h3>
            </div>

            <div className="p-6 grid grid-cols-1 gap-6">
              {/* NAME */}
              <Input
                label="HPA NAME"
                required
                value={form.hpaName}
                error={errors.hpaName}
                placeholder="Enter HPA name"
                onChange={(v: string) =>
                  setForm({ ...form, hpaName: v })
                }
              />
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
};

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

export default AddHPADetailsUpsertSheet;
