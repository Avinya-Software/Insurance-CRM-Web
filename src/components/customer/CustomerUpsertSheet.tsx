import { useEffect, useState } from "react";
import { X, Eye, Download, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Spinner from "../common/Spinner";

import { createCustomerApi } from "../../api/customer.api";
import { useKycFileActions } from "../../hooks/customer/useKycFileActions";
import type { CreateCustomerRequest } from "../../interfaces/customer.interface";

interface Props {
  open: boolean;
  onClose: () => void;
  customer?: any;
  leadId?: string;
  onSuccess: () => void;
}

const CustomerUpsertSheet = ({
  open,
  onClose,
  customer,
  leadId,
  onSuccess,
}: Props) => {
  /* Lock body scroll when sheet is open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  /* KYC Actions for existing files */
  const [existingKycFiles, setExistingKycFiles] = useState<
  { fileName: string; url: string; id: string }[]
>([]);

const { preview, download, remove } = useKycFileActions((deletedId) => {
  setExistingKycFiles((prev) =>
    prev.filter((f) => {
      const idFromUrl = f.url.split("/").pop()?.split(".")[0];
      return idFromUrl !== deletedId;
    })
  );
});


  /* Form state */
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
  const customerId = customer?.customerId;
  /* Prefill form when editing */
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

      setExistingKycFiles(
        Array.isArray(customer.kycFiles)
          ? customer.kycFiles
          : []
      );
    } else {
      setForm({ ...initialForm, leadId: leadId ?? "" });
      setExistingKycFiles([]);
      setKycFiles([]);
    }

    setErrors({});
  }, [open, customer, leadId]);

  /* Clear anniversary if before dob */
  useEffect(() => {
    if (
      form.dob &&
      form.anniversary &&
      new Date(form.anniversary) <= new Date(form.dob)
    ) {
      setForm((prev) => ({ ...prev, anniversary: "" }));
    }
  }, [form.dob]);

  /* Validation */
  const validate = () => {
    const e: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;

    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.primaryMobile.trim()) e.primaryMobile = "Mobile is required";
    else if (!mobileRegex.test(form.primaryMobile))
      e.primaryMobile = "Invalid mobile number";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!emailRegex.test(form.email)) e.email = "Invalid email address";

    if (form.dob && form.anniversary) {
      const dob = new Date(form.dob);
      const anniv = new Date(form.anniversary);
      if (anniv <= dob) e.anniversary = "Anniversary must be after DOB";
    }

    setErrors(e);
    if (Object.keys(e).length) {
      toast.error("Please fix validation errors");
      return false;
    }

    return true;
  };

  /* Save customer */
  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      await createCustomerApi({
        ...form,
        kycFiles: kycFiles.length ? kycFiles : undefined,
      });

      onClose();
      onSuccess();
      toast.success("Customer saved successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-[60]"
        onClick={saving ? undefined : onClose}
      />

      {/* Sheet */}
      <div className="fixed top-0 right-0 h-screen w-[420px] bg-white z-[70] shadow-2xl flex flex-col animate-slideInRight">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between">
          <h2 className="font-semibold">
            {customer ? "Edit Customer" : "Add Customer"}
          </h2>
          <button onClick={onClose} disabled={saving}>
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <Input
            label="Full Name"
            required
            value={form.fullName}
            error={errors.fullName}
            onChange={(v) =>
              setForm({ ...form, fullName: v.replace(/[^a-zA-Z ]/g, "") })
            }
          />

          <Input
            label="Primary Mobile"
            required
            value={form.primaryMobile}
            error={errors.primaryMobile}
            onChange={(v) =>
              setForm({ ...form, primaryMobile: v.replace(/[^0-9]/g, "").slice(0, 10) })
            }
          />

          <Input
            label="Secondary Mobile"
            value={form.secondaryMobile}
            onChange={(v) =>
              setForm({ ...form, secondaryMobile: v.replace(/[^0-9]/g, "").slice(0, 10) })
            }
          />

          <Input
            label="Email"
            required
            value={form.email}
            error={errors.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />

          <Textarea
            label="Address"
            value={form.address}
            onChange={(v) => setForm({ ...form, address: v })}
          />

          <Input
            label="Date of Birth"
            type="date"
            value={form.dob}
            max={new Date().toISOString().split("T")[0]}
            onChange={(v) => setForm({ ...form, dob: v })}
          />

          <Input
            label="Anniversary"
            type="date"
            value={form.anniversary}
            error={errors.anniversary}
            max={new Date().toISOString().split("T")[0]}
            onChange={(v) => setForm({ ...form, anniversary: v })}
          />

          <Textarea
            label="Notes"
            value={form.notes}
            onChange={(v) => setForm({ ...form, notes: v })}
          />

          {/* Existing KYC files */}
          {customer?.customerId && existingKycFiles.length > 0 && (
            <div>
              <label className="text-sm font-medium">Uploaded KYC Documents</label>
              <div className="space-y-2 mt-2">
              {existingKycFiles.map((file) => {
                const documentId = getDocumentIdFromUrl(file.url);

                return (
                  <div key={file.url} className="flex justify-between items-center border rounded px-3 py-2 text-sm">
                    <span className="truncate">{file.fileName}</span>

                    <div className="flex gap-2">
                    <button
                      onClick={() => preview(file.url)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                        onClick={() => download(file.url, file.fileName)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Download size={16} />
                    </button>

                      <button
                          onClick={async () => {
                            if (!confirm("Delete this document?")) return;

                            try {
                              await remove(customer.customerId, file.id);
                              setExistingKycFiles((prev) =>
                                prev.filter((f) => f.id !== file.id)
                              );
                            } catch {
                              toast.error("Failed to delete document");
                            }
                          }}
                          className="p-1 hover:bg-red-100 text-red-600 rounded"
                        >
                          <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          )}

          {/* KYC Upload */}
          <div className="mt-4">
            <label className="text-sm font-medium mb-1 block">
              Add KYC Documents
            </label>

            <div className="flex items-center gap-3">
              <label
                htmlFor="kyc-upload"
                className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
              >
                Choose Files
              </label>

              <span className="text-sm text-gray-500">
                {kycFiles.length > 0
                  ? kycFiles.map((f) => f.name).join(", ")
                  : "No file chosen"}
              </span>
            </div>

            <input
              id="kyc-upload"
              type="file"
              multiple
              accept=".pdf,.jpg,.png"
              className="hidden"
              disabled={saving}
              onChange={(e) => {
                if (!e.target.files) return;

                const newFiles = Array.from(e.target.files);

                setKycFiles((prev) => {
                  const combined = [...prev, ...newFiles];

                  return combined.filter(
                    (file, index, self) =>
                      index === self.findIndex((f) => f.name === file.name)
                  );
                });
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex gap-3">
          <button
            className="flex-1 border rounded-lg py-2"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            disabled={saving}
            className="flex-1 bg-blue-600 text-white rounded-lg py-2 flex items-center justify-center gap-2"
            onClick={handleSave}
          >
            {saving && <Spinner />}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </>
  );
};

export default CustomerUpsertSheet;

/* --- Input & Textarea Helpers --- */
const Input = ({
  label,
  required,
  value,
  error,
  type = "text",
  min,
  max,
  onChange,
}: any) => (
  <div>
    <label className="text-sm font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      min={min}
      max={max}
      className={`input w-full ${error ? "border-red-500" : ""}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
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
const getDocumentIdFromUrl = (url: string) => {
  return url.split("/").pop() ?? "";
};



