import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createCustomerApi } from "../../api/customer.api";

interface Props {
  open: boolean;
  onClose: () => void;
  customer?: any;
  onSuccess: () => void; // 🔥 REQUIRED FOR REFRESH
}

const CustomerUpsertSheet = ({
  open,
  onClose,
  customer,
  onSuccess,
}: Props) => {
  /* ---------------- LOCK BODY SCROLL ---------------- */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  /* ---------------- FORM STATE ---------------- */

  const initialForm = {
    customerId: null as string | null,
    fullName: "",
    primaryMobile: "",
    secondaryMobile: "",
    email: "",
    address: "",
    dob: "",
    anniversary: "",
    notes: "",
    leadId: "",
  };

  const [form, setForm] = useState(initialForm);
  const [kycFiles, setKycFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  /* ---------------- PREFILL (EDIT MODE) ---------------- */

  useEffect(() => {
    if (!open) return;

    if (customer) {
      setForm({
        customerId: customer.customerId ?? null,
        fullName: customer.fullName ?? "",
        primaryMobile: customer.primaryMobile ?? "",
        secondaryMobile: customer.secondaryMobile ?? "",
        email: customer.email ?? "",
        address: customer.address ?? "",
        dob: customer.dob ? customer.dob.split("T")[0] : "",
        anniversary: customer.anniversary
          ? customer.anniversary.split("T")[0]
          : "",
        notes: customer.notes ?? "",
        leadId: customer.leadId ?? "",
      });
    } else {
      setForm(initialForm);
      setKycFiles([]);
    }

    setErrors({});
  }, [open, customer]);

  /* ---------------- VALIDATION ---------------- */

  const validate = () => {
    const e: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;

    if (!form.fullName.trim())
      e.fullName = "Full name is required";

    if (!form.primaryMobile.trim())
      e.primaryMobile = "Mobile is required";
    else if (!mobileRegex.test(form.primaryMobile))
      e.primaryMobile = "Invalid mobile number";

    if (form.email && !emailRegex.test(form.email))
      e.email = "Invalid email";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------------- SAVE (ADD + EDIT) ---------------- */

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      await createCustomerApi({
        ...form,
        kycFiles: kycFiles.length ? kycFiles : undefined,
      });

      onClose();
      onSuccess(); // 🔥 REFRESH CUSTOMER LIST
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  /* =================== UI =================== */

  return (
    <>
      {/* OVERLAY */}
      <div
        className="fixed inset-0 bg-black/40 z-[60]"
        onClick={onClose}
      />

      {/* SHEET */}
      <div className="fixed top-0 right-0 h-screen w-[420px] bg-white z-[70] shadow-2xl animate-slideInRight flex flex-col">
        {/* HEADER */}
        <div className="px-6 py-4 border-b flex justify-between">
          <h2 className="font-semibold">
            {customer ? "Edit Customer" : "Add Customer"}
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <Input
            label="Full Name"
            required
            value={form.fullName}
            error={errors.fullName}
            onChange={(v) =>
              setForm({ ...form, fullName: v })
            }
          />

          <Input
            label="Primary Mobile"
            required
            value={form.primaryMobile}
            error={errors.primaryMobile}
            onChange={(v) =>
              setForm({ ...form, primaryMobile: v })
            }
          />

          <Input
            label="Secondary Mobile"
            value={form.secondaryMobile}
            onChange={(v) =>
              setForm({ ...form, secondaryMobile: v })
            }
          />

          <Input
            label="Email"
            value={form.email}
            error={errors.email}
            onChange={(v) =>
              setForm({ ...form, email: v })
            }
          />

          <Input
            label="Address"
            value={form.address}
            onChange={(v) =>
              setForm({ ...form, address: v })
            }
          />

          <Input
            label="Date of Birth"
            type="date"
            value={form.dob}
            onChange={(v) =>
              setForm({ ...form, dob: v })
            }
          />

          <Input
            label="Anniversary"
            type="date"
            value={form.anniversary}
            onChange={(v) =>
              setForm({ ...form, anniversary: v })
            }
          />

          <Textarea
            label="Notes"
            value={form.notes}
            onChange={(v) =>
              setForm({ ...form, notes: v })
            }
          />

          {/* KYC UPLOAD */}
          <div>
            <label className="text-sm font-medium">
              KYC Documents
            </label>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.png"
              onChange={(e) =>
                setKycFiles(
                  e.target.files
                    ? Array.from(e.target.files)
                    : []
                )
              }
              className="block mt-1 text-sm"
            />
            <p className="text-xs text-slate-500 mt-1">
              Uploading files will mark KYC as <b>Uploaded</b>
            </p>
          </div>
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
            disabled={saving}
            className="flex-1 bg-blue-600 text-white rounded-lg py-2"
            onClick={handleSave}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </>
  );
};

export default CustomerUpsertSheet;

/* ---------------- HELPERS ---------------- */

const Input = ({
  label,
  required,
  value,
  error,
  type = "text",
  onChange,
}: any) => (
  <div>
    <label className="text-sm font-medium">
      {label} {required && <span className="text-red-500">*</span>}
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
