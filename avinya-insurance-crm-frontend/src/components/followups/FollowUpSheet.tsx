// src/components/followups/FollowUpSheet.tsx
import { useState } from "react";
import { X } from "lucide-react";
import { useCreateFollowUp } from "../../hooks/leadFollowUp/useCreateFollowUp";

interface Props {
  open: boolean;
  onClose: () => void;
  leadId: string | null;
}

const FollowUpSheet = ({ open, onClose, leadId }: Props) => {
  const { mutate, isPending } = useCreateFollowUp();

  const [form, setForm] = useState({
    followUpDate: "",
    nextFollowUpDate: "",
    remark: "",
  });

  if (!open || !leadId) return null;

  const handleSave = () => {
    mutate(
      {
        leadId,
        followUpDate: new Date(form.followUpDate).toISOString(),
        nextFollowUpDate: new Date(form.nextFollowUpDate).toISOString(),
        remark: form.remark,
      },
      {
        onSuccess: () => {
          onClose();
          setForm({
            followUpDate: "",
            nextFollowUpDate: "",
            remark: "",
          });
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30" onClick={onClose} />

      <div className="w-96 bg-white h-full shadow-xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between">
          <h2 className="font-semibold">Create Follow Up</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 px-6 py-4 space-y-4">
          <Field label="Follow Up Date">
            <input
              type="datetime-local"
              className="input"
              value={form.followUpDate}
              onChange={(e) =>
                setForm({ ...form, followUpDate: e.target.value })
              }
            />
          </Field>

          <Field label="Next Follow Up Date">
            <input
              type="datetime-local"
              className="input"
              value={form.nextFollowUpDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  nextFollowUpDate: e.target.value,
                })
              }
            />
          </Field>

          <Field label="Remark">
            <textarea
              className="input h-24"
              value={form.remark}
              onChange={(e) =>
                setForm({ ...form, remark: e.target.value })
              }
            />
          </Field>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border rounded-lg py-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex-1 bg-green-800 text-white rounded-lg py-2"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FollowUpSheet;

/* Small helper */
const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1">
    <label className="text-sm font-medium">{label}</label>
    {children}
  </div>
);
