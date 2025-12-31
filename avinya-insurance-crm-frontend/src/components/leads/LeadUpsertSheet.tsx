import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { useUpsertLead } from "../../hooks/lead/useUpsertLead";
import { useLeadStatuses } from "../../hooks/lead/useLeadStatuses";
import { useLeadSources } from "../../hooks/lead/useLeadSources";
import {
  getCustomerDropdownApi,
  getCustomersApi,
} from "../../api/customer.api";

/* ================= TYPES ================= */

interface Props {
  open: boolean;
  onClose: () => void;
  lead?: any;
  advisorId: string | null;
}

interface CustomerDropdown {
  customerId: string;
  fullName: string;
  email: string;
}

const LeadUpsertSheet = ({
  open,
  onClose,
  lead,
  advisorId,
}: Props) => {
  const { mutate, isPending } = useUpsertLead();
  const { data: statuses } = useLeadStatuses();
  const { data: sources } = useLeadSources();

  /* ================= CUSTOMER STATE ================= */

  const [customers, setCustomers] = useState<CustomerDropdown[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");

  const isExistingCustomer = !!selectedCustomerId;

  useEffect(() => {
    getCustomerDropdownApi().then(setCustomers);
  }, []);

  /* ================= FORM STATE ================= */

  const initialForm = {
    customerId: null as string | null,
    fullName: "",
    email: "",
    mobile: "",
    address: "",
    leadStatusId: "",
    leadSourceId: "",
    notes: "",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ================= PREFILL (EDIT MODE) ================= */

  useEffect(() => {
    if (!open) return;

    if (lead) {
      setForm({
        customerId: lead.customerId ?? null,
        fullName: lead.fullName ?? "",
        email: lead.email ?? "",
        mobile: lead.mobile ?? "",
        address: lead.address ?? "",
        leadStatusId: lead.leadStatusId ?? "",
        leadSourceId: lead.leadSourceId ?? "",
        notes: lead.notes ?? "",
      });

      setSelectedCustomerId(lead.customerId ?? "");
    } else {
      setForm(initialForm);
      setSelectedCustomerId("");
    }

    setErrors({});
  }, [open, lead]);

  /* ================= CUSTOMER SELECT ================= */

  const handleCustomerSelect = async (customerId: string) => {
    // 🔄 De-select → New Customer
    if (!customerId) {
      setSelectedCustomerId("");
      setForm(initialForm);
      setErrors({});
      return;
    }

    setSelectedCustomerId(customerId);

    // 🔥 Call SEARCH API (single customer)
    const res = await getCustomersApi({
      pageNumber: 1,
      pageSize: 1,
      search: customerId,
    });

    const customer = res.customers?.[0];
    if (!customer) return;

    setForm({
      ...form,
      customerId: customer.customerId,
      fullName: customer.fullName,
      email: customer.email,
      mobile: customer.primaryMobile,
      address: customer.address ?? "",
    });

    setErrors({});
  };

  /* ================= VALIDATION ================= */

  const validate = () => {
    const e: Record<string, string> = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;

    // 🔥 Skip manual validation for existing customer
    if (!isExistingCustomer) {
      if (!form.fullName.trim())
        e.fullName = "Full name is required";

      if (!form.email.trim())
        e.email = "Email is required";
      else if (!emailRegex.test(form.email))
        e.email = "Invalid email address";

      if (!form.mobile.trim())
        e.mobile = "Mobile number is required";
      else if (!mobileRegex.test(form.mobile))
        e.mobile = "Invalid mobile number";
    }

    if (!form.leadSourceId)
      e.leadSourceId = "Lead source is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= SAVE ================= */

  const handleSave = () => {
    if (!validate()) return;

    mutate(
      {
        leadId: lead?.leadId,
        advisorId,
        ...form,
        leadStatusId:
          form.leadStatusId ||
          statuses?.find((s: any) => s.name === "New")?.id,
      },
      { onSuccess: onClose }
    );
  };

  if (!open) return null;

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30" onClick={onClose} />

      <div className="w-96 bg-white h-full shadow-xl flex flex-col">
        {/* ---------- HEADER ---------- */}
        <div className="px-6 py-4 border-b flex justify-between">
          <h2 className="font-semibold">
            {lead ? "Edit Lead" : "Add Lead"}
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* ---------- BODY ---------- */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

          {/* EXISTING CUSTOMER (OPTIONAL) */}
          <Select
            label="Existing Customer (optional)"
            value={selectedCustomerId}
            options={[
              { id: "", name: "— New Customer —" },
              ...customers.map((c) => ({
                id: c.customerId,
                name: `${c.fullName} (${c.email})`,
              })),
            ]}
            onChange={handleCustomerSelect}
          />

          <Input
            label="Full Name"
            required
            disabled={isExistingCustomer}
            value={form.fullName}
            error={errors.fullName}
            onChange={(v) =>
              setForm({ ...form, fullName: v })
            }
          />

          <Input
            label="Email"
            required
            disabled={isExistingCustomer}
            value={form.email}
            error={errors.email}
            onChange={(v) =>
              setForm({ ...form, email: v })
            }
          />

          <Input
            label="Mobile"
            required
            disabled={isExistingCustomer}
            value={form.mobile}
            error={errors.mobile}
            onChange={(v) =>
              setForm({ ...form, mobile: v })
            }
          />

          <Input
            label="Address"
            disabled={isExistingCustomer}
            value={form.address}
            onChange={(v) =>
              setForm({ ...form, address: v })
            }
          />

          <Select
            label="Lead Status"
            value={form.leadStatusId}
            options={statuses}
            onChange={(v) =>
              setForm({ ...form, leadStatusId: v })
            }
          />

          <Select
            label="Lead Source"
            required
            value={form.leadSourceId}
            options={sources}
            error={errors.leadSourceId}
            onChange={(v) =>
              setForm({ ...form, leadSourceId: v })
            }
          />

          <Textarea
            label="Notes"
            value={form.notes}
            onChange={(v) =>
              setForm({ ...form, notes: v })
            }
          />
        </div>

        {/* ---------- FOOTER ---------- */}
        <div className="px-6 py-4 border-t flex gap-3">
          <button
            className="flex-1 border rounded-lg py-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            disabled={isPending}
            className="flex-1 bg-blue-600 text-white rounded-lg py-2"
            onClick={handleSave}
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadUpsertSheet;

/* ================= HELPERS ================= */

const Input = ({
  label,
  required,
  value,
  error,
  disabled,
  onChange,
}: any) => (
  <div>
    <label className="text-sm font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      disabled={disabled}
      className={`input w-full ${
        error ? "border-red-500" : ""
      } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    {error && (
      <p className="text-xs text-red-600 mt-1">{error}</p>
    )}
  </div>
);

const Select = ({
  label,
  required,
  value,
  options,
  error,
  onChange,
}: any) => (
  <div>
    <label className="text-sm font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      className={`input w-full ${
        error ? "border-red-500" : ""
      }`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o: any) => (
        <option key={o.id} value={o.id}>
          {o.name}
        </option>
      ))}
    </select>
    {error && (
      <p className="text-xs text-red-600 mt-1">{error}</p>
    )}
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
