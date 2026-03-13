import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { useLeadStatuses } from "../../hooks/lead/useLeadStatuses";
import { useLeadSources } from "../../hooks/lead/useLeadSources";
import Spinner from "../common/Spinner";

interface Props {
  open: boolean;
  filters: any;
  onApply: (f: any) => void;
  onClear: () => void;
  onClose: () => void;
}

const LeadFilterSheet = ({ open, filters, onApply, onClear, onClose }: Props) => {
  const { data: statuses, isLoading: statusLoading } = useLeadStatuses();
  const { data: sources, isLoading: sourceLoading } = useLeadSources();

  const loading = statusLoading || sourceLoading;
  const [local, setLocal] = useState(filters);

  useEffect(() => {
    setLocal(filters);
  }, [filters]);

  if (!open) return null;

  const handleApply = () => {
    onApply(local);
    onClose();
  };

  const handleClear = () => {
    setLocal({});
    onClear();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30" onClick={onClose} />
      <div className="w-96 bg-white h-full shadow-xl flex flex-col">
        {/* HEADER */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="font-semibold text-lg">Filter Leads</h2>
          <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded">
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
              <Input
                label="Full Name"
                value={local.fullName || ""}
                onChange={(v) => setLocal({ ...local, fullName: v })}
                placeholder="Search by name"
              />
              <Input
                label="Email"
                value={local.email || ""}
                onChange={(v) => setLocal({ ...local, email: v })}
                placeholder="Search by email..."
              />
              <Input
                label="Mobile"
                value={local.mobile || ""}
                onChange={(v) => setLocal({ ...local, mobile: v })}
                placeholder="Search by mobile..."
              />
              <Select
                label="Lead Status"
                value={local.leadStatusId}
                options={statuses}
                valueKey="id"
                labelKey="name"
                onChange={(v) => setLocal({ ...local, leadStatusId: v || null })}
              />
              <Select
                label="Lead Source"
                value={local.leadSourceId}
                options={sources}
                valueKey="id"
                labelKey="name"
                onChange={(v) => setLocal({ ...local, leadSourceId: v || null })}
              />
              <Select
                label="Page Size"
                value={local.pageSize || 10}
                options={[
                  { id: 10, name: "10 per page" },
                  { id: 25, name: "25 per page" },
                  { id: 50, name: "50 per page" },
                  { id: 100, name: "100 per page" },
                ]}
                onChange={(v) => setLocal({ ...local, pageSize: Number(v) })}
              />
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 bg-white border-t flex gap-4 justify-end">
          <button
            onClick={handleApply}
            disabled={loading}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded flex items-center gap-2 transition-colors duration-200"
          >
            {loading ? <Spinner className="text-white w-4 h-4" /> : "APPLY"}
          </button>
          <button
            onClick={handleClear}
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

export default LeadFilterSheet;

/* Helper Components */
const Input = ({ label, value, onChange, placeholder }: any) => (
  <div className="space-y-1">
    <label className="text-sm font-medium">{label}</label>
    <input
      className="input w-full px-4 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-50 focus:border-blue-400"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

const Select = ({ label, value, options, onChange, valueKey = "id", labelKey = "name" }: any) => (
  <div className="space-y-1.5 relative">
    <label className="text-sm font-medium">{label}</label>
    <div className="relative">
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border rounded appearance-none focus:ring-2 focus:ring-blue-50 focus:border-blue-400"
      >
        <option value="">Select</option>
        {options?.map((o: any) => (
          <option key={o[valueKey]} value={o[valueKey]}>
            {o[labelKey]}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  </div>
);