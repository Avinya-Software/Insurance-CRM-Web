import React, { useEffect, useMemo, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { useDivisionDropdown } from "../../hooks/division/useDivisionDropdown";
import { useSegmentDropdown } from "../../hooks/segment/useSegmentDropdown";
import { useUpsertPolicyType } from "../../hooks/PolicyType/useUpsertPolicyType";
import { PolicyType } from "../../interfaces/PolicyType.interface";
import MultiSelectDropdown from "../common/MultiSelectDropdown";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  item?: PolicyType | null;
  onClose: () => void;
}

const initialForm = {
  division: "",
  segmentIds: [] as string[],
  policyTypeName: "",
};

const PolicyTypeUpsertModal = ({ isOpen, item, onClose }: Props) => {
  const [formData, setFormData] = useState<any>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: divisions = [] } = useDivisionDropdown(1);
  const { data: segments = [] } = useSegmentDropdown(Number(formData.division));

  const dropdownItems = useMemo(() => {
    const map = new Map(segments.map((s: any) => [s.segmentId.toString(), s.segmentName]));
    
    if (item && item.segment && item.segmentName) {
      const ids = item.segment.split(",").map(id => id.trim());
      const names = item.segmentName.split(",").map(n => n.trim());
      ids.forEach((id, idx) => {
        if (!map.has(id) && id) {
          map.set(id, names[idx] || `ID: ${id}`);
        }
      });
    }
    
    return Array.from(map.entries()).map(([value, label]) => ({ label, value }));
  }, [segments, item]);

  const { mutate: upsertPolicyType, isPending } = useUpsertPolicyType();

  useEffect(() => {
    if (isOpen) {
      if (item) {
        setFormData({
          division: item.division.toString(),
          segmentIds: item.segment ? item.segment.split(",").map(id => id.trim()) : [],
          policyTypeName: item.policyTypeName,
        });
      } else {
        setFormData(initialForm);
      }
      setErrors({});
    }
  }, [isOpen, item]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    if (name === "division") {
        setFormData((prev: any) => ({ ...prev, segmentIds: [] }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.division) newErrors.division = "Division is required";
    if (formData.segmentIds.length === 0) newErrors.segmentIds = "At least one segment is required";
    if (!formData.policyTypeName) newErrors.policyTypeName = "Policy Type Name is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    upsertPolicyType(
      {
        id: item ? item.id : 0,
        division: Number(formData.division),
        segmentIds: formData.segmentIds.map((id: string) => Number(id)),
        policyTypeName: formData.policyTypeName,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]" onClick={onClose} />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] bg-white z-[70] shadow-2xl rounded-xl flex flex-col animate-in fade-in zoom-in duration-200 text-black">
        {/* HEADER */}
        <div className="px-6 py-4 bg-white border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {item ? "Edit Policy Type" : "Add Policy Type"}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">
          <Select
            label="Select Division"
            required
            value={formData.division}
            options={divisions}
            valueKey="divisionId"
            labelKey="divisionName"
            onChange={(v: string) => handleChange("division", v)}
            error={errors.division}
          />

          <div className="space-y-1.5 w-full">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Select Segments <span className="text-red-500">*</span>
            </label>
            <MultiSelectDropdown
              placeholder="Select Segments"
              items={dropdownItems}
              selectedValues={formData.segmentIds}
              onChange={(values) => handleChange("segmentIds", values)}
            />
            {errors.segmentIds && <p className="text-[10px] text-red-500 font-medium">{errors.segmentIds}</p>}
          </div>

          <Input
            label="Policy Type Name"
            required
            value={formData.policyTypeName}
            onChange={(v: string) => handleChange("policyTypeName", v)}
            error={errors.policyTypeName}
          />
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-slate-50 border-t flex gap-3 justify-end">
          <button
            className="px-6 py-2 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-lg flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 transition-all"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? (
               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : "SAVE"}
          </button>
          <button
            className="px-6 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm transition-all"
            onClick={onClose}
          >
            CANCEL
          </button>
        </div>
      </div>
    </>
  );
};

export default PolicyTypeUpsertModal;

/* HELPERS */

const Input = ({ label, required, value, onChange, type = "text", error }: any) => (
  <div className="space-y-1.5 w-full"> 
    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      className={`w-full px-3 py-2 bg-white border rounded-lg text-sm outline-none transition-all ${
        error ? "border-red-500 focus:ring-red-50" : "border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
      }`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
  </div>
);

const Select = ({ label, required, value, options, onChange, valueKey = "id", labelKey = "name", error, disabled }: any) => (
  <div className="space-y-1.5 w-full">
    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <select
        disabled={disabled}
        className={`w-full px-3 py-2 bg-white border rounded-lg text-sm outline-none appearance-none transition-all ${
            error ? "border-red-500 focus:ring-red-50" : "border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
        } ${disabled ? "bg-slate-50 cursor-not-allowed text-slate-400" : ""}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select Option</option>
        {options.map((o: any) => (
          <option key={o[valueKey]} value={o[valueKey]}>{o[labelKey]}</option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
    {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
  </div>
);
