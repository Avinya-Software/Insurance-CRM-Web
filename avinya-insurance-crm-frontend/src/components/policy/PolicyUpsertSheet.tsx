import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import { useUpsertPolicy } from "../../hooks/policy/useUpsertPolicy";
import { usePolicyTypesDropdown } from "../../hooks/policy/usePolicyTypesDropdown";
import { usePolicyStatusesDropdown } from "../../hooks/policy/usePolicyStatusesDropdown";
import { useCustomerDropdown } from "../../hooks/customer/useCustomerDropdown";
import { useInsurerDropdown } from "../../hooks/insurer/useInsurerDropdown";
import { useProductDropdown } from "../../hooks/product/useProductDropdown";
import Spinner from "../common/Spinner";

interface Props {
  open: boolean;
  onClose: () => void;
  policy?: any;
  customerId?: string;
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

  const { data: customers, isLoading: cLoading } =
    useCustomerDropdown();
  const { data: insurers, isLoading: iLoading } =
    useInsurerDropdown();
  const {
    data: products,
    isLoading: pLoading,
  } = useProductDropdown(form.insurerId || undefined);
  const { data: policyTypes, isLoading: tLoading } =
    usePolicyTypesDropdown();
  const { data: policyStatuses, isLoading: sLoading } =
    usePolicyStatusesDropdown();

  const loadingDropdowns =
    cLoading || iLoading || pLoading || tLoading || sLoading;

  /* ---------------- PREFILL ---------------- */

  useEffect(() => {
    if (!open) return;

    if (policy) {
      setForm({
        ...initialForm,
        ...policy,
        policyId: policy.policyId ?? null,
        startDate: policy.startDate?.split("T")[0] ?? "",
        endDate: policy.endDate?.split("T")[0] ?? "",
        paymentDueDate:
          policy.paymentDueDate?.split("T")[0] ?? "",
        renewalDate:
          policy.renewalDate?.split("T")[0] ?? "",
      });
    } else {
      setForm({
        ...initialForm,
        customerId: customerId || "",
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

    if (!form.customerId) e.customerId = "Customer required";
    if (!form.insurerId) e.insurerId = "Insurer required";
    if (!form.productId) e.productId = "Product required";
    if (!form.policyTypeId)
      e.policyTypeId = "Policy type required";
    if (!form.policyStatusId)
      e.policyStatusId = "Policy status required";
    if (!form.registrationNo)
      e.registrationNo = "Registration no required";
    if (!form.startDate)
      e.startDate = "Start date required";
    if (!form.endDate)
      e.endDate = "End date required";

    setErrors(e);

    if (Object.keys(e).length) {
      toast.error("Please fix validation errors");
      return false;
    }

    return true;
  };

  /* ---------------- SAVE ---------------- */

  const handleSave = async () => {
    if (!validate()) return;

    const formData = new FormData();

    Object.entries(form).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== "") {
        formData.append(k, String(v));
      }
    });

    files.forEach((f) =>
      formData.append("PolicyDocuments", f)
    );

    await mutateAsync(formData);
    toast.success("Policy saved successfully");
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
        onClick={isLoading ? undefined : onClose}
      />

      {/* SHEET */}
      <div className="fixed top-0 right-0 w-[420px] h-screen bg-white z-[70] shadow-xl flex flex-col animate-slideInRight">
        {/* HEADER */}
        <div className="px-6 py-4 border-b flex justify-between">
          <h2 className="font-semibold">
            {policy ? "Edit Policy" : "Add Policy"}
          </h2>
          <button onClick={onClose} disabled={isLoading}>
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loadingDropdowns ? (
            <div className="flex items-center justify-center h-full">
              <Spinner />
            </div>
          ) : (
            <div className="space-y-4">
              <Select
                label="Customer"
                value={form.customerId}
                error={errors.customerId}
                options={customers}
                valueKey="customerId"
                labelKey="fullName"
                disabled={!!customerId}
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
                  setForm({
                    ...form,
                    insurerId: v,
                    productId: "",
                  })
                }
              />

              <Select
                label="Product"
                value={form.productId}
                error={errors.productId}
                options={products}
                valueKey="productId"
                labelKey="productName"
                disabled={!form.insurerId}
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
                  setForm({
                    ...form,
                    policyTypeId: Number(v),
                  })
                }
              />

              <Select
                label="Policy Status"
                value={form.policyStatusId}
                error={errors.policyStatusId}
                options={policyStatuses}
                onChange={(v) =>
                  setForm({
                    ...form,
                    policyStatusId: Number(v),
                  })
                }
              />

              <Input
                label="Registration No"
                value={form.registrationNo}
                error={errors.registrationNo}
                onChange={(v) =>
                  setForm({
                    ...form,
                    registrationNo: v,
                  })
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
                label="Premium Gross"
                value={form.premiumGross}
                onChange={(v) =>
                  setForm({
                    ...form,
                    premiumGross: Number(v),
                  })
                }
              />

              <div>
                <label className="text-sm font-medium">
                  Policy Documents
                </label>
                <input
                  type="file"
                  multiple
                  disabled={isLoading}
                  onChange={(e) =>
                    setFiles(
                      Array.from(e.target.files || [])
                    )
                  }
                  className="input w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t flex gap-3">
          <button
            className="flex-1 border rounded-lg py-2"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>

          <button
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white rounded-lg py-2 flex items-center justify-center gap-2"
            onClick={handleSave}
          >
            {isLoading && <Spinner />}
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </>
  );
};

export default PolicyUpsertSheet;

/* ---------- HELPERS ---------- */

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
      className={`input w-full ${
        error ? "border-red-500" : ""
      }`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    {error && (
      <p className="text-xs text-red-500 mt-1">
        {error}
      </p>
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
      className={`input w-full ${
        error ? "border-red-500" : ""
      } disabled:bg-gray-100`}
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
    {error && (
      <p className="text-xs text-red-500 mt-1">
        {error}
      </p>
    )}
  </div>
);
