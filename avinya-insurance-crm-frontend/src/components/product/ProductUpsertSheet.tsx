import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useUpsertProduct } from "../../hooks/product/useUpsertProduct";
import { useProductCategoryDropdown } from "../../hooks/product/useProductCategoryDropdown";
import { useInsurerDropdown } from "../../hooks/insurer/useInsurerDropdown";

interface Props {
  open: boolean;
  onClose: () => void;
  product?: any;
  insurerId?: string; // ✅ NEW
  onSuccess: () => void;
}

/* ---------------- VALIDATION RULES ---------------- */

const regex = {
  productName: /^[A-Za-z0-9\s]{3,50}$/,
  productCode: /^[A-Z0-9_-]{2,20}$/,
  commissionRules: /^[A-Za-z0-9\s,.\-\/]{3,500}$/,
};

/* ---------------- COMPONENT ---------------- */

const ProductUpsertSheet = ({
  open,
  onClose,
  product,
  insurerId,
  onSuccess,
}: Props) => {
  /* ---------------- API HOOKS ---------------- */
  const { mutateAsync, isLoading } = useUpsertProduct();
  const { data: categories } = useProductCategoryDropdown();
  const { data: insurers } = useInsurerDropdown();

  /* ---------------- FORM STATE ---------------- */

  const initialForm = {
    productId: null as string | null,
    insurerId: "",
    productCategoryId: 0,
    productName: "",
    productCode: "",
    defaultReminderDays: 0,
    commissionRules: "",
    isActive: true,
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<any>({});

  /* ---------------- PREFILL ---------------- */

  useEffect(() => {
    if (!open) return;

    // EDIT MODE
    if (product && categories) {
      const matchedCategory = categories.find(
        (c) => c.name === product.productCategory
      );

      setForm({
        productId: product.productId ?? null,
        insurerId: product.insurerId ?? "",
        productCategoryId: matchedCategory?.id ?? 0,
        productName: product.productName ?? "",
        productCode: product.productCode ?? "",
        defaultReminderDays: product.defaultReminderDays ?? 0,
        commissionRules: product.commissionRules ?? "",
        isActive: product.isActive ?? true,
      });
    }
    // ADD MODE (FROM INSURER)
    else {
      setForm({
        ...initialForm,
        insurerId: insurerId || "", // ✅ FORCE FROM INSURER TABLE
      });
    }

    setErrors({});
  }, [open, product, categories, insurerId]);

  /* ---------------- VALIDATION ---------------- */

  const validate = () => {
    const e: any = {};

    if (!form.insurerId)
      e.insurerId = "Insurer is required";

    if (!form.productCategoryId)
      e.productCategoryId = "Category is required";

    if (!form.productName)
      e.productName = "Product name is required";
    else if (!regex.productName.test(form.productName))
      e.productName = "3–50 letters/numbers only";

    if (!form.productCode)
      e.productCode = "Product code is required";
    else if (!regex.productCode.test(form.productCode))
      e.productCode =
        "Uppercase letters, numbers, _ or -";

    if (
      form.defaultReminderDays === null ||
      form.defaultReminderDays < 0
    )
      e.defaultReminderDays =
        "Must be 0 or greater";

    if (!form.commissionRules)
      e.commissionRules = "Commission rules required";
    else if (!regex.commissionRules.test(form.commissionRules))
      e.commissionRules =
        "Min 3 characters, no special symbols";

    setErrors(e);

    if (Object.keys(e).length > 0) {
      toast.error("Please fix validation errors", {
        duration: 3000,
      });
      return false;
    }

    return true;
  };

  /* ---------------- SAVE ---------------- */

  const handleSave = async () => {
    if (!validate()) return;

    await mutateAsync(form);
    toast.success("Product saved successfully");
    onClose();
    onSuccess();
  };

  if (!open) return null;

  return (
    <>
      {/* OVERLAY */}
      <div
        className="fixed inset-0 bg-black/40 z-[60]"
        onClick={onClose}
      />

      {/* SHEET */}
      <div className="fixed top-0 right-0 h-screen w-[420px] bg-white z-[70] shadow-2xl flex flex-col animate-slideInRight">
        {/* HEADER */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="font-semibold text-lg">
            {product ? "Edit Product" : "Add Product"}
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <Select
            label="Insurer"
            value={form.insurerId}
            error={errors.insurerId}
            onChange={(v) =>
              setForm({ ...form, insurerId: v })
            }
            options={insurers}
            valueKey="insurerId"
            labelKey="insurerName"
            disabled={!!insurerId} // 🔒 DISABLED
          />

          <Select
            label="Product Category"
            value={form.productCategoryId}
            error={errors.productCategoryId}
            onChange={(v) =>
              setForm({
                ...form,
                productCategoryId: Number(v),
              })
            }
            options={categories}
            valueKey="id"
            labelKey="name"
          />

          <Input
            label="Product Name"
            value={form.productName}
            error={errors.productName}
            onChange={(v) =>
              setForm({ ...form, productName: v })
            }
          />

          <Input
            label="Product Code"
            value={form.productCode}
            error={errors.productCode}
            onChange={(v) =>
              setForm({ ...form, productCode: v })
            }
          />

          <Input
            label="Default Reminder Days"
            type="number"
            value={form.defaultReminderDays}
            error={errors.defaultReminderDays}
            onChange={(v) =>
              setForm({
                ...form,
                defaultReminderDays: Number(v),
              })
            }
          />

          <Textarea
            label="Commission Rules"
            value={form.commissionRules}
            error={errors.commissionRules}
            onChange={(v) =>
              setForm({
                ...form,
                commissionRules: v,
              })
            }
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm({
                  ...form,
                  isActive: e.target.checked,
                })
              }
            />
            Active
          </label>
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

export default ProductUpsertSheet;

/* ---------------- HELPERS ---------------- */

const Input = ({
  label,
  value,
  onChange,
  type = "text",
  error,
}: any) => (
  <div>
    <label className="text-sm font-medium">
      {label}
    </label>
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

const Textarea = ({
  label,
  value,
  onChange,
  error,
}: any) => (
  <div>
    <label className="text-sm font-medium">
      {label}
    </label>
    <textarea
      className={`input w-full h-24 resize-none ${
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
  value,
  onChange,
  options,
  valueKey,
  labelKey,
  error,
  disabled = false,
}: any) => (
  <div>
    <label className="text-sm font-medium">
      {label}
    </label>
    <select
      disabled={disabled}
      className={`input w-full ${
        error ? "border-red-500" : ""
      } disabled:bg-gray-100`}
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
      <p className="text-xs text-red-500 mt-1">
        {error}
      </p>
    )}
  </div>
);
