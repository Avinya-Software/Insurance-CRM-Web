import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { useUpsertPolicy } from "../../hooks/policy/useUpsertPolicy";
import { usePolicyTypesDropdown } from "../../hooks/policy/usePolicyTypesDropdown";
import { usePolicyStatusesDropdown } from "../../hooks/policy/usePolicyStatusesDropdown";
import { useCustomerDropdown } from "../../hooks/customer/useCustomerDropdown";
import { useInsurerDropdown } from "../../hooks/insurer/useInsurerDropdown";
import { useProductDropdown } from "../../hooks/product/useProductDropdown";

interface Props {
  open: boolean;
  onClose: () => void;
  policy?: any;
  customerId?: string; // ✅ NEW
  onSuccess: () => void;
}

const PolicyUpsertSheet = ({
  open,
  onClose,
  policy,
  customerId,
  onSuccess,
}: Props) => {
  /* ---------------- FORM STATE ---------------- */

  const initialForm = {
    policyId: null as string | null,
    customerId: "",
    insurerId: "",
    productId: "",
    policyTypeId: 0,
    policyStatusId: 0,
    registrationNo: "",
    startDate: "",
    endDate: "",
    premiumNet: 0,
    premiumGross: 0,
    paymentMode: "",
    paymentDueDate: "",
    renewalDate: "",
    brokerCode: "",
    policyCode: "",
  };

  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ---------------- API HOOKS ---------------- */

  const { mutateAsync, isLoading } = useUpsertPolicy();

  const { data: customers } = useCustomerDropdown();
  const { data: insurers } = useInsurerDropdown();
  const { data: products } = useProductDropdown(
    form.insurerId || undefined
  );
  const { data: policyTypes } = usePolicyTypesDropdown();
  const { data: policyStatuses } = usePolicyStatusesDropdown();

  /* ---------------- PREFILL ---------------- */

  useEffect(() => {
    if (!open) return;

    if (policy) {
      // EDIT MODE
      setForm({
        ...initialForm,
        ...policy,
        policyId: policy.policyId ?? null,
        customerId: policy.customerId,
        startDate: policy.startDate?.split("T")[0] ?? "",
        endDate: policy.endDate?.split("T")[0] ?? "",
        paymentDueDate: policy.paymentDueDate?.split("T")[0] ?? "",
        renewalDate: policy.renewalDate?.split("T")[0] ?? "",
      });
    } else {
      // ADD MODE
      setForm({
        ...initialForm,
        customerId: customerId || "", // ✅ FORCE CUSTOMER
      });
      setFiles([]);
    }

    setErrors({});
  }, [open, policy, customerId]);

  /* ---------------- RESET PRODUCT ON INSURER CHANGE ---------------- */

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      productId: "",
    }));
  }, [form.insurerId]);

  /* ---------------- VALIDATION ---------------- */

  const validate = () => {
    const e: Record<string, string> = {};

    if (!form.customerId) e.customerId = "Customer is required";
    if (!form.insurerId) e.insurerId = "Insurer is required";
    if (!form.productId) e.productId = "Product is required";

    if (!form.policyTypeId)
      e.policyTypeId = "Policy type is required";
    if (!form.policyStatusId)
      e.policyStatusId = "Policy status is required";

    if (!form.registrationNo)
      e.registrationNo = "Registration number is required";

    if (!form.startDate)
      e.startDate = "Start date is required";
    if (!form.endDate)
      e.endDate = "End date is required";
    if (
      form.startDate &&
      form.endDate &&
      new Date(form.endDate) < new Date(form.startDate)
    ) {
      e.endDate = "End date must be after start date";
    }

    if (form.premiumNet < 0)
      e.premiumNet = "Must be 0 or greater";
    if (form.premiumGross < 0)
      e.premiumGross = "Must be 0 or greater";

    if (!form.paymentMode)
      e.paymentMode = "Payment mode is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------------- SAVE ---------------- */

  const handleSave = async () => {
    if (!validate()) return;

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (
        value !== null &&
        value !== undefined &&
        !(key === "policyId" && !value)
      ) {
        formData.append(key, String(value));
      }
    });

    if (form.startDate)
      formData.set(
        "startDate",
        new Date(form.startDate).toISOString()
      );
    if (form.endDate)
      formData.set(
        "endDate",
        new Date(form.endDate).toISOString()
      );
    if (form.paymentDueDate)
      formData.set(
        "paymentDueDate",
        new Date(form.paymentDueDate).toISOString()
      );
    if (form.renewalDate)
      formData.set(
        "renewalDate",
        new Date(form.renewalDate).toISOString()
      );

    files.forEach((file) =>
      formData.append("PolicyDocuments", file)
    );

    await mutateAsync(formData);

    onClose();
    onSuccess();
  };

  if (!open) return null;

  /* ================= UI ================= */

  return (
    <>
      {/* OVERLAY */}
      <div
        className="fixed inset-0 bg-black/40 z-[60]"
        onClick={onClose}
      />

      {/* SHEET */}
      <div className="fixed top-0 right-0 w-[420px] h-screen bg-white z-[70] shadow-xl flex flex-col animate-slideInRight">
        {/* HEADER */}
        <div className="px-6 py-4 border-b flex justify-between">
          <h2 className="font-semibold">
            {policy ? "Edit Policy" : "Add Policy"}
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <Select
            label="Customer"
            value={form.customerId}
            error={errors.customerId}
            options={customers}
            valueKey="customerId"
            labelKey="fullName"
            disabled={!!customerId} // 🔒 DISABLED
            onChange={(v) =>
              setForm({ ...form, customerId: v })
            }
          />

          <Select
            label="Insurer"
            value={form.insurerId}
            error={errors.insurerId}
            options={insurers}
            valueKey="insurerId"
            labelKey="insurerName"
            onChange={(v) =>
              setForm({ ...form, insurerId: v, productId: "" })
            }
          />

          <Select
            label="Product"
            value={form.productId}
            error={errors.productId}
            options={products}
            disabled={!form.insurerId}
            valueKey="productId"
            labelKey="productName"
            onChange={(v) =>
              setForm({ ...form, productId: v })
            }
          />

          <Select
            label="Policy Type"
            value={form.policyTypeId}
            error={errors.policyTypeId}
            options={policyTypes}
            onChange={(v) =>
              setForm({ ...form, policyTypeId: Number(v) })
            }
          />

          <Select
            label="Policy Status"
            value={form.policyStatusId}
            error={errors.policyStatusId}
            options={policyStatuses}
            onChange={(v) =>
              setForm({ ...form, policyStatusId: Number(v) })
            }
          />

          <Input
            label="Registration No"
            value={form.registrationNo}
            error={errors.registrationNo}
            onChange={(v) =>
              setForm({ ...form, registrationNo: v })
            }
          />

          <Input
            type="date"
            label="Start Date"
            value={form.startDate}
            error={errors.startDate}
            onChange={(v) =>
              setForm({ ...form, startDate: v })
            }
          />

          <Input
            type="date"
            label="End Date"
            value={form.endDate}
            error={errors.endDate}
            onChange={(v) =>
              setForm({ ...form, endDate: v })
            }
          />

          <Input
            type="number"
            label="Premium Net"
            value={form.premiumNet}
            error={errors.premiumNet}
            onChange={(v) =>
              setForm({ ...form, premiumNet: Number(v) })
            }
          />

          <Input
            type="number"
            label="Premium Gross"
            value={form.premiumGross}
            error={errors.premiumGross}
            onChange={(v) =>
              setForm({ ...form, premiumGross: Number(v) })
            }
          />

          <Input
            label="Payment Mode"
            value={form.paymentMode}
            error={errors.paymentMode}
            onChange={(v) =>
              setForm({ ...form, paymentMode: v })
            }
          />

          <Input
            type="date"
            label="Payment Due Date"
            value={form.paymentDueDate}
            onChange={(v) =>
              setForm({ ...form, paymentDueDate: v })
            }
          />

          <Input
            type="date"
            label="Renewal Date"
            value={form.renewalDate}
            onChange={(v) =>
              setForm({ ...form, renewalDate: v })
            }
          />

          {/* FILE UPLOAD */}
          <div>
            <label className="text-sm font-medium">
              Policy Documents
            </label>
            <input
              type="file"
              multiple
              className="input w-full"
              onChange={(e) =>
                setFiles(Array.from(e.target.files || []))
              }
            />
          </div>

          <Input
            label="Broker Code"
            value={form.brokerCode}
            onChange={(v) =>
              setForm({ ...form, brokerCode: v })
            }
          />

          <Input
            label="Policy Code"
            value={form.policyCode}
            onChange={(v) =>
              setForm({ ...form, policyCode: v })
            }
          />
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t flex gap-3">
          <button
            className="flex-1 border rounded-lg py-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white rounded-lg py-2"
            onClick={handleSave}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </>
  );
};

export default PolicyUpsertSheet;

/* ---------------- HELPERS ---------------- */

const Input = ({
  label,
  value,
  onChange,
  type = "text",
  error,
}: any) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input
      type={type}
      className={`input w-full ${error ? "border-red-500" : ""}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    {error && (
      <p className="text-xs text-red-500 mt-1">{error}</p>
    )}
  </div>
);

const Select = ({
  label,
  options,
  value,
  onChange,
  disabled = false,
  valueKey = "id",
  labelKey = "name",
  error,
}: any) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <select
      disabled={disabled}
      className={`input w-full ${error ? "border-red-500" : ""} disabled:bg-gray-100`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select</option>
      {options?.map((o: any) => (
        <option key={o[valueKey]} value={o[valueKey]}>
          {o[labelKey]}
        </option>
      ))}
    </select>
    {error && (
      <p className="text-xs text-red-500 mt-1">{error}</p>
    )}
  </div>
);
