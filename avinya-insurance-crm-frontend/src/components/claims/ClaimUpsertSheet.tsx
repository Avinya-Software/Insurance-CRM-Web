import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { useCreateClaim } from "../../hooks/claim/useCreateClaim";
import { useClaimTypes } from "../../hooks/claim/useClaimMasters";
import { useClaimStages } from "../../hooks/claim/useClaimMasters";
import { useClaimHandlers } from "../../hooks/claim/useClaimMasters";

import { useCustomerDropdown } from "../../hooks/customer/useCustomerDropdown";
import { usePolicies } from "../../hooks/policy/usePolicies";

interface Props {
  open: boolean;
  onClose: () => void;
  claim?: any;
}

const ClaimUpsertSheet = ({ open, onClose, claim }: Props) => {
  const { mutate, isPending } = useCreateClaim();

  /* ---------- DROPDOWNS ---------- */
  const { data: customers } = useCustomerDropdown();
  const { data: claimTypes } = useClaimTypes();
  const { data: claimStages } = useClaimStages();
  const { data: claimHandlers } = useClaimHandlers();

  /* ---------- FORM STATE ---------- */
  const [form, setForm] = useState<any>({
    claimId: undefined,

    customerId: "",
    policyId: "",

    claimTypeId: "",
    claimStageId: "",
    claimHandlerId: "",

    incidentDate: "",
    claimAmount: "",
    approvedAmount: "",

    tatDays: "",
    status: "Open",
    notes: "",

    documents: [] as File[],
  });

  /* ---------- POLICIES (DEPENDENT) ---------- */
  const { data: policies } = usePolicies(
    form.customerId
      ? {
          pageNumber: 1,
          pageSize: 100,
          customerId: form.customerId,
        }
      : { pageNumber: 1, pageSize: 100 }
  );

  /* ---------- PREFILL FOR EDIT ---------- */
  useEffect(() => {
    if (claim) {
      setForm({
        claimId: claim.claimId,

        customerId: claim.customerId,
        policyId: claim.policyId,

        claimTypeId: claim.claimTypeId,
        claimStageId: claim.claimStageId,
        claimHandlerId: claim.claimHandlerId,

        incidentDate: claim.incidentDate?.split("T")[0],
        claimAmount: claim.claimAmount,
        approvedAmount: claim.approvedAmount ?? "",

        tatDays: claim.tatDays,
        status: claim.status,
        notes: claim.notes ?? "",

        documents: [],
      });
    }
  }, [claim]);

  if (!open) return null;

  const handleSubmit = () => {
    mutate(form, { onSuccess: onClose });
  };

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* SHEET */}
      <div className="fixed top-0 right-0 w-[480px] h-screen bg-white shadow-xl z-50 overflow-y-auto">
        {/* HEADER */}
        <div className="px-6 py-4 border-b flex justify-between">
          <h2 className="text-lg font-semibold">
            {claim ? "Edit Claim" : "Add Claim"}
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">
          {/* CUSTOMER */}
          <Select
            label="Customer"
            options={customers}
            value={form.customerId}
            onChange={(v) =>
              setForm({
                ...form,
                customerId: v,
                policyId: "", // reset policy
              })
            }
            idKey="customerId"
            labelKey="fullName"
          />

          {/* POLICY (DEPENDENT) */}
          <Select
            label="Policy"
            options={policies?.data || []}
            value={form.policyId}
            onChange={(v) => setForm({ ...form, policyId: v })}
            idKey="policyId"
            labelKey="policyNumber"
            disabled={!form.customerId}
          />

          {/* CLAIM TYPE */}
          <Select
            label="Claim Type"
            options={claimTypes}
            value={form.claimTypeId}
            onChange={(v) =>
              setForm({ ...form, claimTypeId: Number(v) })
            }
            idKey="claimTypeId"
            labelKey="typeName"
          />

          {/* CLAIM STAGE */}
          <Select
            label="Current Stage"
            options={claimStages}
            value={form.claimStageId}
            onChange={(v) =>
              setForm({ ...form, claimStageId: Number(v) })
            }
            idKey="claimStageId"
            labelKey="stageName"
          />

          {/* HANDLER */}
          <Select
            label="Assigned Handler"
            options={claimHandlers}
            value={form.claimHandlerId}
            onChange={(v) =>
              setForm({ ...form, claimHandlerId: Number(v) })
            }
            idKey="claimHandlerId"
            labelKey="handlerName"
          />

          {/* INCIDENT DATE */}
          <Input
            label="Incident Date"
            type="date"
            value={form.incidentDate}
            onChange={(v) =>
              setForm({ ...form, incidentDate: v })
            }
          />

          {/* AMOUNTS */}
          <Input
            label="Claim Amount"
            type="number"
            value={form.claimAmount}
            onChange={(v) =>
              setForm({ ...form, claimAmount: v })
            }
          />

          <Input
            label="Approved Amount"
            type="number"
            value={form.approvedAmount}
            onChange={(v) =>
              setForm({ ...form, approvedAmount: v })
            }
          />

          {/* TAT */}
          <Input
            label="TAT (Days)"
            type="number"
            value={form.tatDays}
            onChange={(v) =>
              setForm({ ...form, tatDays: v })
            }
          />

          {/* STATUS */}
          <Select
            label="Status"
            options={[
              { id: "Open", name: "Open" },
              { id: "Approved", name: "Approved" },
              { id: "Rejected", name: "Rejected" },
              { id: "Closed", name: "Closed" },
            ]}
            value={form.status}
            onChange={(v) =>
              setForm({ ...form, status: v })
            }
          />

          {/* NOTES */}
          <Textarea
            label="Notes"
            value={form.notes}
            onChange={(v) => setForm({ ...form, notes: v })}
          />

          {/* DOCUMENTS */}
          <FileInput
            label="Claim Documents"
            onChange={(files) =>
              setForm({ ...form, documents: files })
            }
          />
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t flex gap-3">
          <button
            className="flex-1 border rounded py-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 bg-blue-600 text-white rounded py-2"
            disabled={isPending}
            onClick={handleSubmit}
          >
            {isPending ? "Saving..." : "Save Claim"}
          </button>
        </div>
      </div>
    </>
  );
};

export default ClaimUpsertSheet;

/* ===================== HELPERS ===================== */

const Input = ({ label, type = "text", value, onChange }: any) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input
      type={type}
      className="input w-full"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const Textarea = ({ label, value, onChange }: any) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <textarea
      className="input w-full h-24"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const Select = ({
  label,
  options,
  value,
  onChange,
  idKey = "id",
  labelKey = "name",
  disabled = false,
}: any) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <select
      className="input w-full"
      value={value || ""}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">
        {disabled ? "Select customer first" : "Select"}
      </option>
      {options?.map((o: any) => (
        <option key={o[idKey]} value={o[idKey]}>
          {o[labelKey] || "—"}
        </option>
      ))}
    </select>
  </div>
);

const FileInput = ({ label, onChange }: any) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input
      type="file"
      multiple
      onChange={(e) =>
        onChange(Array.from(e.target.files || []))
      }
    />
  </div>
);
