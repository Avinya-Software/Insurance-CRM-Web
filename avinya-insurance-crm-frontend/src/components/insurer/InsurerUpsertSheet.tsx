import { useEffect, useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import {
  upsertInsurerApi,
  getInsurerPortalPasswordApi,
} from "../../api/insurer.api";

interface Props {
  open: boolean;
  onClose: () => void;
  insurer?: any;
  onSuccess: () => void; // 🔥 IMPORTANT
}

const InsurerUpsertSheet = ({
  open,
  onClose,
  insurer,
  onSuccess,
}: Props) => {
  const isEdit = !!insurer;

  const initialForm = {
    insurerId: null,
    insurerName: "",
    shortCode: "",
    contactDetails: "",
    portalUrl: "",
    portalUsername: "",
    portalPassword: "",
  };

  const [form, setForm] = useState<any>(initialForm);

  const [showPassword, setShowPassword] = useState(false);
  const [passwordFetched, setPasswordFetched] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ---------------- PREFILL ---------------- */

  useEffect(() => {
    if (!open) return;

    if (isEdit) {
      setForm({
        ...insurer,
        portalPassword: "", // NEVER prefill
      });
    } else {
      setForm(initialForm);
    }

    setShowPassword(false);
    setPasswordFetched(false);
    setLoadingPassword(false);
  }, [open, insurer]);

  /* ---------------- PASSWORD HANDLING ---------------- */

  const handleTogglePassword = async () => {
    if (!isEdit) return;

    // Fetch only once
    if (!passwordFetched) {
      setLoadingPassword(true);
      try {
        const res = await getInsurerPortalPasswordApi(
          insurer.insurerId
        );
        setForm((f: any) => ({
          ...f,
          portalPassword: res.password,
        }));
        setPasswordFetched(true);
      } finally {
        setLoadingPassword(false);
      }
    }

    // Toggle visibility only
    setShowPassword((p) => !p);
  };

  /* ---------------- SAVE ---------------- */

  const handleSave = async () => {
    setSaving(true);
    try {
      await upsertInsurerApi(form);
      onClose();
      onSuccess(); // 🔥 refresh list
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
      <div className="fixed top-0 right-0 h-screen w-[420px] bg-white z-[70] shadow-xl flex flex-col">
        {/* HEADER */}
        <div className="px-6 py-4 border-b flex justify-between">
          <h2 className="font-semibold">
            {isEdit ? "Edit Insurer" : "Add Insurer"}
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <Input
            label="Insurer Name"
            value={form.insurerName}
            onChange={(v) =>
              setForm({ ...form, insurerName: v })
            }
          />

          <Input
            label="Short Code"
            value={form.shortCode}
            onChange={(v) =>
              setForm({ ...form, shortCode: v })
            }
          />

          <Input
            label="Portal URL"
            value={form.portalUrl}
            onChange={(v) =>
              setForm({ ...form, portalUrl: v })
            }
          />

          <Input
            label="Portal Username"
            value={form.portalUsername}
            onChange={(v) =>
              setForm({ ...form, portalUsername: v })
            }
          />

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium">
              Portal Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="input w-full pr-10"
                value={form.portalPassword}
                onChange={(e) =>
                  setForm({
                    ...form,
                    portalPassword: e.target.value,
                  })
                }
              />

              {/* 👁 ICON ONLY IN EDIT MODE */}
              {isEdit && (
                <button
                  type="button"
                  className="absolute right-2 top-2 text-slate-500"
                  onClick={handleTogglePassword}
                >
                  {loadingPassword ? (
                    "..."
                  ) : showPassword ? (
                    <EyeOff />
                  ) : (
                    <Eye />
                  )}
                </button>
              )}
            </div>

            {!isEdit && (
              <p className="text-xs text-slate-500 mt-1">
                Set a new portal password
              </p>
            )}
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

export default InsurerUpsertSheet;

/* ---------------- INPUT ---------------- */

const Input = ({ label, value, onChange }: any) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input
      className="input w-full"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);
