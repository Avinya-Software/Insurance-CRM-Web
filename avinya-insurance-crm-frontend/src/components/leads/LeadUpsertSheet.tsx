import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useUpsertLead } from "../../hooks/lead/useUpsertLead";
import { useLeadStatuses } from "../../hooks/lead/useLeadStatuses";
import { useLeadSources } from "../../hooks/lead/useLeadSources";

interface Props {
  open: boolean;
  onClose: () => void;
  lead?: any; // undefined = add, defined = edit
  advisorId: string | null;
}

const LeadUpsertSheet = ({ open, onClose, lead, advisorId }: Props) => {
  const { mutate, isPending } = useUpsertLead();
  const { data: statuses } = useLeadStatuses();
  const { data: sources } = useLeadSources();

  const initialForm = {
    fullName: "",
    email: "",
    mobile: "",
    address: "",
    leadStatusId: "",
    leadSourceId: "",
    leadSourceDescription: "",
    notes: "",
  };

  const [form, setForm] = useState<any>(initialForm);

  // Reset form when modal opens/closes or lead changes
  useEffect(() => {
    if (open) {
      if (lead) {
        // Edit mode - prefill with lead data
        // Find the ID by matching the name from the response
        const statusId = lead.leadStatusId || 
          statuses?.find((s: any) => s.name === lead.leadStatus)?.id || "";
        const sourceId = lead.leadSourceId || 
          sources?.find((s: any) => s.name === lead.leadSource)?.id || "";
        
        setForm({
          ...lead,
          leadStatusId: statusId,
          leadSourceId: sourceId,
        });
      } else {
        // Add mode - reset to initial state
        setForm(initialForm);
      }
    }
  }, [lead, open, statuses, sources]);

  if (!open) return null;

  const handleSave = () => {
    mutate(
      {
        leadId: lead?.leadId,
        advisorId,
        ...form,
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30" onClick={onClose} />

      <div className="w-96 bg-white h-full shadow-xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between">
          <h2 className="font-semibold">
            {lead ? "Edit Lead" : "Add Lead"}
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <Input label="Full Name" value={form.fullName}
            onChange={(v) => setForm({ ...form, fullName: v })} />

          <Input label="Email" value={form.email}
            onChange={(v) => setForm({ ...form, email: v })} />

          <Input label="Mobile" value={form.mobile}
            onChange={(v) => setForm({ ...form, mobile: v })} />

          <Input label="Address" value={form.address}
            onChange={(v) => setForm({ ...form, address: v })} />

          <Select
            label="Lead Status"
            value={form.leadStatusId}
            options={statuses}
            onChange={(v) =>
              setForm({ ...form, leadStatusId: Number(v) })
            }
          />

          <Select
            label="Lead Source"
            value={form.leadSourceId}
            options={sources}
            onChange={(v) =>
              setForm({ ...form, leadSourceId: Number(v) })
            }
          />

          <Textarea
            label="Notes"
            value={form.notes}
            onChange={(v) => setForm({ ...form, notes: v })}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex gap-3">
          <button
            className="flex-1 border rounded-lg py-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            disabled={isPending}
            className="flex-1 bg-green-800 text-white rounded-lg py-2"
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

/* ---- Small helpers ---- */

const Input = ({ label, value, onChange }: any) => (
  <div className="space-y-1">
    <label className="text-sm font-medium">{label}</label>
    <input className="input" value={value}
      onChange={(e) => onChange(e.target.value)} />
  </div>
);

const Select = ({ label, value, options, onChange }: any) => (
  <div className="space-y-1">
    <label className="text-sm font-medium">{label}</label>
    <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select</option>
      {options?.map((o: any) => (
        <option key={o.id} value={o.id}>{o.name}</option>
      ))}
    </select>
  </div>
);

const Textarea = ({ label, value, onChange }: any) => (
  <div className="space-y-1">
    <label className="text-sm font-medium">{label}</label>
    <textarea className="input h-20" value={value}
      onChange={(e) => onChange(e.target.value)} />
  </div>
);