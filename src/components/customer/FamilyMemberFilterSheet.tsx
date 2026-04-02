import React, { useEffect, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import Spinner from "../common/Spinner";

interface Props {
  open: boolean;
  filters: any;
  onApply: (f: any) => void;
  onClear: () => void;
  onClose: () => void;
}

const FamilyMemberFilterSheet = ({ open, filters, onApply, onClear, onClose }: Props) => {
  const [local, setLocal] = useState(filters);
  const loading = false;

  useEffect(() => {
    setLocal(filters);
  }, [filters]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30" onClick={onClose} />
      <div className="w-96 bg-white h-full shadow-xl flex flex-col">
        {/* HEADER */}
        <div className="px-6 py-4 border-b flex justify-between">
          <h2 className="font-semibold text-lg">Filter Family Members</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 px-6 py-4 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Spinner />
            </div>
          ) : (
            <div className="space-y-4">
              <Select
                label="Relation with Head"
                value={local.relationWithFamilyHead}
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
                valueKey="id"
                labelKey="name"
                onChange={(v: string) => {
                  setLocal({ ...local, relationWithFamilyHead: v || "", page: 1 });
                }}
              />

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                  value={local.startDate || ""}
                  onChange={(e) => setLocal({ ...local, startDate: e.target.value, page: 1 })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                  value={local.endDate || ""}
                  onChange={(e) => setLocal({ ...local, endDate: e.target.value, page: 1 })}
                />
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 bg-white border-t flex gap-4 justify-end">
          <button
            disabled={loading}
            onClick={() => {
              onApply(local); 
              onClose();     
            }}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded flex items-center gap-2 transition-colors duration-200"
          >
            {loading ? <Spinner className="text-white w-4 h-4" /> : "APPLY"}
          </button>

          <button
            onClick={() => {
              setLocal({});
              onClear();
            }}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded transition-colors duration-200"
          >
            CLEAR
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors duration-200"
          >
            CANCEL
          </button>
        </div>  
      </div>
    </div>
  );
};

export default FamilyMemberFilterSheet;

/* HELPER SELECT COMPONENT */
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
  <div className="space-y-1.5 border-none">
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
