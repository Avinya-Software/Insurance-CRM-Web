import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { usePolicyStatusesDropdown } from "../../hooks/policy/usePolicyStatusesDropdown";
import { usePolicyTypesDropdown } from "../../hooks/policy/usePolicyTypesDropdown";
import { useCustomerDropdown } from "../../hooks/customer/useCustomerDropdown";
import { useInsurerDropdown } from "../../hooks/insurer/useInsurerDropdown";
import { useProductCategoryDropdown } from "../../hooks/product/useProductCategoryDropdown";

interface Props {
  open: boolean;
  filters: any;
  onApply: (f: any) => void;
  onClear: () => void;
  onClose: () => void;
}

const PolicyFilterSheet = ({
  open,
  filters,
  onApply,
  onClear,
  onClose,
}: Props) => {
  const [local, setLocal] = useState(filters);

  const { data: statuses } = usePolicyStatusesDropdown();
  const { data: types } = usePolicyTypesDropdown();
  const { data: customers } = useCustomerDropdown();
  const { data: insurers } = useInsurerDropdown();
  const { data: products } = useProductCategoryDropdown();

  useEffect(() => {
    setLocal(filters);
  }, [filters]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30" onClick={onClose} />

      <div className="w-96 bg-white h-full shadow-xl flex flex-col">
        <div className="px-6 py-4 border-b flex justify-between">
          <h2 className="font-semibold text-lg">
            Filter Policies
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
          <Select
            label="Policy Status"
            value={local.policyStatusId}
            options={statuses}
            onChange={(v) =>
              setLocal({ ...local, policyStatusId: v || null })
            }
          />

          <Select
            label="Policy Type"
            value={local.policyTypeId}
            options={types}
            onChange={(v) =>
              setLocal({ ...local, policyTypeId: v || null })
            }
          />

          <Select
            label="Customer"
            value={local.customerId}
            options={customers}
            valueKey="customerId"
            labelKey="fullName"
            onChange={(v) =>
              setLocal({ ...local, customerId: v || null })
            }
          />

          <Select
            label="Insurer"
            value={local.insurerId}
            options={insurers}
            valueKey="insurerId"
            labelKey="insurerName"
            onChange={(v) =>
              setLocal({ ...local, insurerId: v || null })
            }
          />

          <Select
            label="Product"
            value={local.productId}
            options={products}
            onChange={(v) =>
              setLocal({ ...local, productId: v || null })
            }
          />
        </div>

        <div className="px-6 py-4 border-t flex gap-3">
          <button className="flex-1 border" onClick={onClear}>
            Clear All
          </button>
          <button
            className="flex-1 bg-blue-600 text-white"
            onClick={() => {
              onApply(local);
              onClose();
            }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolicyFilterSheet;

/* helpers */
const Select = ({
  label,
  value,
  options,
  onChange,
  valueKey = "id",
  labelKey = "name",
}: any) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <select
      className="input w-full"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">All</option>
      {options?.map((o: any) => (
        <option key={o[valueKey]} value={o[valueKey]}>
          {o[labelKey]}
        </option>
      ))}
    </select>
  </div>
);
