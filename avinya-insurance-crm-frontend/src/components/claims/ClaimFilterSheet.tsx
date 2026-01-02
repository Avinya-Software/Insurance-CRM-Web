import { X } from "lucide-react";
import { useClaimTypes } from "../../hooks/claim/useClaimMasters";
import { useClaimStages } from "../../hooks/claim/useClaimMasters";

interface Props {
  open: boolean;
  filters: any;
  onApply: (filters: any) => void;
  onClose: () => void;
}

const ClaimFilterSheet = ({ open, filters, onApply, onClose }: Props) => {
  const { data: types } = useClaimTypes();
  const { data: stages } = useClaimStages();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30" onClick={onClose} />

      <div className="w-96 bg-white h-full shadow-xl">
        <div className="px-6 py-4 border-b flex justify-between">
          <h2 className="font-semibold text-lg">Filter Claims</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <Select
            label="Claim Type"
            options={types}
            value={filters.claimTypeId}
            onChange={(v) =>
              onApply({ ...filters, claimTypeId: v })
            }
          />

          <Select
            label="Stage"
            options={stages}
            value={filters.claimStageId}
            onChange={(v) =>
              onApply({ ...filters, claimStageId: v })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ClaimFilterSheet;

/* ---------- Helpers ---------- */

const Select = ({ label, options, value, onChange }: any) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <select
      className="input w-full"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">All</option>
      {options?.map((o: any) => (
        <option key={o.id} value={o.id}>
          {o.name}
        </option>
      ))}
    </select>
  </div>
);
