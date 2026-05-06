import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import Spinner from "../common/Spinner";
import SearchableComboBox from "../common/SearchableComboBox";
import { useDivisionDropdown } from "../../hooks/division/useDivisionDropdown";
import { useCustomerDropdown } from "../../hooks/customer/useCustomerDropdown";
import { useClaimStatus, useClaimType } from "../../hooks/claim/useClaimMasters";

interface Props {
  open: boolean;
  filters: any;
  onApply: (f: any) => void;
  onClear: () => void;
  onClose: () => void;
}

const ClaimFilterSheet = ({ open, filters, onApply, onClear, onClose }: Props) => {
  const { data: divisions, isLoading: divisionLoading } = useDivisionDropdown();
  const { data: customers, isLoading: customerLoading } = useCustomerDropdown();
  const { data: statuses, isLoading: statusLoading } = useClaimStatus();
  const { data: types, isLoading: typeLoading } = useClaimType();
  
  const loading = divisionLoading || customerLoading || statusLoading || typeLoading;
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
    onClear();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30" onClick={onClose} />
      <div className="w-96 bg-white h-full shadow-xl flex flex-col">
        {/* HEADER */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="font-semibold text-lg">Filter Claims</h2>
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
              <SearchableComboBox
                label="Customer"
                items={(customers || []).map((c: any) => ({
                  value: c.customerId,
                  label: c.clientName,
                }))}
                value={local.customerId}
                placeholder="Select customer"
                onSelect={(item) =>
                  setLocal({ ...local, customerId: item?.value || undefined })
                }
              />

              <Select
                label="Division"
                value={local.divisionType}
                options={divisions}
                valueKey="divisionId"
                labelKey="divisionName"
                onChange={(v) => setLocal({ ...local, divisionType: v ? Number(v) : undefined })}
              />

              <Select
                label="Claim Type"
                value={local.claimType}
                options={types}
                valueKey="id"
                labelKey="name"
                onChange={(v) => setLocal({ ...local, claimType: v ? Number(v) : undefined })}
              />

              <Select
                label="Claim Status"
                value={local.claimStatus}
                options={statuses}
                valueKey="id"
                labelKey="name"
                onChange={(v) => setLocal({ ...local, claimStatus: v ? Number(v) : undefined })}
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

export default ClaimFilterSheet;

/* Helper Components */
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
