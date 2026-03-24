import { useEffect, useState } from "react";
import { X, User, Users, MapPin, ClipboardList, ChevronDown, Loader2 } from "lucide-react";
import { useLeadStatuses } from "../../hooks/lead/useLeadStatuses";
import { useLeadSources } from "../../hooks/lead/useLeadSources";
import { getCustomerDropdownApi } from "../../api/customer.api";
import SearchableComboBox from "../common/SearchableComboBox";
import { toast } from "react-hot-toast";
import { useCreateLead } from "../../hooks/lead/useCreateLead";
import { useUpdateLead } from "../../hooks/lead/useUpsertLead";

interface Props {
  open: boolean;
  onClose: () => void;
  lead?: any;
  advisorId: string | null;
}

const LeadUpsertSheet = ({ open, onClose, lead, advisorId }: Props) => {
  const { mutate: createLead, isPending: isCreating } = useCreateLead();
  const { mutate: updateLead, isPending: isUpdating } = useUpdateLead();

  const isEdit = !!lead;
  const isPending = isEdit ? isUpdating : isCreating;

  const { data: statuses } = useLeadStatuses();
  const { data: sources } = useLeadSources();
  // const { data: usersResponse } = useUsersDropdown();
  // const { data: states = [] } = useStates();

  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedStateId, setSelectedStateId] = useState("");

  // const { data: cities = [] } = useCities(
  //   selectedStateId ? Number(selectedStateId) : null
  // );

  const customerOptions = customers.map((c: any) => ({
    value: String(c.clientID ?? c.customerId),
    label: `${c.contactPerson ?? c.clientName ?? ""} (${
      c.email ?? c.mobileNumber ?? ""
    })`,
  }));

  const initialForm = {
    customerId: null as string | null,
    fullName: "",
    email: "",
    mobile: "",
    address: "",
    assignedTo: "",
    requirementDetails: "",
    links: "",
    nextFollowupDate: "",
    leadStatusId: "",
    leadSourceId: "",
    notes: "",
    cityId: "",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* BODY LOCK */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [open]);

  /* CUSTOMER LIST */
  useEffect(() => {
    getCustomerDropdownApi().then((res) => setCustomers(res?.data ?? []));
  }, []);

  /* PREFILL ON EDIT */
  useEffect(() => {
    if (!open || !lead) return;
    const stateId = lead.stateID?.toString() ?? "";
    setSelectedStateId(stateId);
    setSelectedCustomerId(lead.clientID ?? "");
    setForm({
      customerId: lead.clientID ?? null,
      fullName: lead.contactPerson ?? "",
      email: lead.email ?? "",
      mobile: lead.mobile ?? "",
      address: lead.billingAddress ?? "",
      assignedTo: lead.assignedTo ?? "",
      requirementDetails: lead.requirementDetails ?? "",
      links: lead.links ?? "",
      nextFollowupDate: lead.nextFollowupDate
        ? lead.nextFollowupDate.slice(0, 16)
        : "",
      leadSourceId: lead.leadSourceID?.toString() ?? "",
      leadStatusId: lead.status?.toString() ?? "",
      notes: lead.notes ?? "",
      cityId: lead.cityID?.toString() ?? "",
    });
    setErrors({});
  }, [lead, open]);

  /* RESET ON CLOSE */
  useEffect(() => {
    if (!open) {
      setForm(initialForm);
      setSelectedCustomerId("");
      setSelectedStateId("");
      setErrors({});
    }
  }, [open]);

  /* CUSTOMER AUTO-FILL */
  const onCustomerSelect = (customerId: string | null) => {
    if (customerId) {
      setSelectedCustomerId(customerId);
      const customer = customers.find((c: any) => c.clientID === customerId);
      if (customer) {
        const stateId = customer.stateID?.toString() ?? "";
        setSelectedStateId(stateId);
        setForm((prev) => ({
          ...prev,
          customerId,
          fullName: customer.contactPerson ?? "",
          email: customer.email ?? "",
          mobile: customer.mobileNumber ?? "",
          address: customer.billAddress ?? "",
          cityId: customer.cityID?.toString() ?? "",
        }));
        setErrors((prev) => ({
          ...prev,
          fullName: "",
          email: "",
          mobile: "",
          address: "",
        }));
      }
    } else {
      setSelectedCustomerId("");
      setSelectedStateId("");
      setForm((prev) => ({
        ...prev,
        customerId: null,
        fullName: "",
        email: "",
        mobile: "",
        address: "",
        cityId: "",
      }));
    }
  };

  /* VALIDATION */
  const validate = () => {
    const e: Record<string, string> = {};
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.mobile.trim()) e.mobile = "Mobile is required";
    else if (!mobileRegex.test(form.mobile)) e.mobile = "Invalid mobile number";
    if (!form.leadStatusId) e.leadStatusId = "Status is required";
    if (!form.leadSourceId) e.leadSourceId = "Source is required";
    setErrors(e);
    if (Object.keys(e).length) {
      toast.error("Please fix validation errors");
      return false;
    }
    return true;
  };

  /* SAVE */
  const handleSave = () => {
    if (!validate()) return;

    const payload = {
      ClientID: form.customerId,
      ContactPerson: form.fullName,
      Mobile: form.mobile,
      Email: form.email,
      BillingAddress: form.address,
      StateID: selectedStateId ? Number(selectedStateId) : null,
      CityID: form.cityId ? Number(form.cityId) : null,
      RequirementDetails: form.requirementDetails,
      Links: form.links,
      Notes: form.notes,
      NextFollowupDate: form.nextFollowupDate
        ? new Date(form.nextFollowupDate)
        : null,
      Status: form.leadStatusId,
      LeadSource: form.leadSourceId,
      AssignedTo: form.assignedTo || advisorId,
    };

    if (isEdit) {
      updateLead({ id: lead.leadID, payload }, { onSuccess: onClose });
    } else {
      createLead(payload, { onSuccess: onClose });
    }
  };

  if (!open) return null;

  // const userOptions = (usersResponse ?? []).map((u: any) => ({
  //   value: u.id,
  //   label: u.fullName,
  // }));

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed top-0 right-0 w-full max-w-[30vw] h-screen bg-slate-50 z-[70] shadow-2xl flex flex-col animate-slide-in-right">

        {/* ── HEADER ── */}
        <div className="px-8 py-6 bg-white border-b flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {isEdit ? "Edit Lead" : "Add Lead"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">Lead Information</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* ── BODY ── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {/* CONTACT INFO CARD */}
          <Card icon={<User size={14} />} title="Contact Info">

            <div className="col-span-2">
            <SearchableComboBox
              label="Customer"
              items={customerOptions}
              value={selectedCustomerId}
              placeholder="Search customer..."
              emptyText="No customer found"
              onSelect={(item: any) => onCustomerSelect(item?.value ? String(item.value) : null)}
            />
            </div>

            <Input
              label="Full Name"
              required
              value={form.fullName}
              error={errors.fullName}
              onChange={(v: string) => setForm({ ...form, fullName: v.replace(/[^a-zA-Z ]/g, "") })}
              disabled={!!form.customerId}
            />

            <Input
              label="Mobile"
              required
              value={form.mobile}
              error={errors.mobile}
              onChange={(v: string) => setForm({ ...form, mobile: v.replace(/\D/g, "").slice(0, 10) })}
              disabled={!!form.customerId}
            />

            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(v: string) => setForm({ ...form, email: v })}
              disabled={!!form.customerId}
            />

            <div className="col-span-2">
              <Textarea
                label="Billing Address"
                value={form.address}
                onChange={(v: string) => setForm({ ...form, address: v })}
                disabled={!!form.customerId}
              />
            </div>

          </Card>

          {/* ASSIGNMENT & LOCATION CARD */}
          <Card icon={<MapPin size={14} />} title="Assignment & Location">

            <div className="col-span-2">
              <Select
                label="Assigned To"
                options={
                  [] /* replace with userOptions when useUsersDropdown is enabled */
                }
                value={form.assignedTo}
                onChange={(v: string) => setForm({ ...form, assignedTo: v })}
                placeholder="Select employee..."
              />
            </div>

            <Select
              label="State"
              options={
                [] /* replace with stateOptions when useStates is enabled */
              }
              value={selectedStateId}
              onChange={(v: string) => {
                setSelectedStateId(v);
                setForm((prev) => ({ ...prev, cityId: "" }));
              }}
              disabled={!!form.customerId}
              placeholder="Select state"
            />

            <Select
              label="City"
              options={
                [] /* replace with cityOptions when useCities is enabled */
              }
              value={form.cityId}
              onChange={(v: string) => setForm({ ...form, cityId: v })}
              disabled={!selectedStateId || !!form.customerId}
              placeholder={selectedStateId ? "Select city" : "Select state first"}
            />

          </Card>

          {/* LEAD DETAILS CARD */}
          <Card icon={<ClipboardList size={14} />} title="Lead Details">

          <SearchableComboBox
                label="Lead Status"
                items={(statuses ?? []).map((s: any) => ({
                  value: String(s.id ?? s.leadStatusId ?? s.statusId ?? s.leadStatusID ?? ""),
                  label: s.name ?? s.statusName ?? s.leadStatusName ?? s.leadStatus ?? "",
                }))}
                value={form.leadStatusId}
                placeholder="Search status..."
                emptyText="No status found"
                onSelect={(item: any) =>
                  setForm({ ...form, leadStatusId: item?.value ? String(item.value) : null })
                }
              />

              <SearchableComboBox
                label="Lead Source"
                items={(sources ?? []).map((s: any) => ({
                  value: String(s.id ?? s.leadSourceId ?? s.sourceId ?? s.leadSourceID ?? ""),
                  label: s.name ?? s.sourceName ?? s.leadSourceName ?? s.leadSource ?? "",
                }))}
                value={form.leadSourceId}
                placeholder="Search source..."
                emptyText="No source found"
                onSelect={(item: any) =>
                  setForm({ ...form, leadSourceId: item?.value ? String(item.value) : null })
                }
              />

            <div className="col-span-2">
              <Textarea
                label="Requirement Details"
                value={form.requirementDetails}
                onChange={(v: string) => setForm({ ...form, requirementDetails: v })}
              />
            </div>

            {!isEdit && (
              <>
                <div className="col-span-2">
                  <Input
                    label="Links"
                    value={form.links}
                    onChange={(v: string) => setForm({ ...form, links: v })}
                  />
                </div>

                <div className="col-span-2">
                  <Textarea
                    label="Notes"
                    value={form.notes}
                    onChange={(v: string) => setForm({ ...form, notes: v })}
                  />
                </div>

                <div className="col-span-2">
                  <Input
                    label="Next Follow-up Date"
                    type="datetime-local"
                    value={form.nextFollowupDate}
                    onChange={(v: string) => setForm({ ...form, nextFollowupDate: v })}
                  />
                </div>
              </>
            )}

          </Card>

        </div>

        {/* ── FOOTER ── */}
        <div className="px-8 py-6 bg-white border-t flex gap-4 shrink-0">
          <button
            disabled={isPending}
            onClick={handleSave}
            className="px-8 py-2.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 disabled:opacity-60 rounded flex items-center gap-2 transition-colors"
          >
            {isPending ? (
              <><Loader2 size={14} className="animate-spin" /> Saving…</>
            ) : (
              "SAVE"
            )}
          </button>

          <button
            onClick={onClose}
            className="px-8 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded transition-colors"
          >
            CANCEL
          </button>
        </div>

      </div>
    </>
  );
};

export default LeadUpsertSheet;

/* ─────────────── CARD SECTION ─────────────── */

const Card = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
    <div className="flex items-center gap-2 bg-slate-800 px-6 py-3 text-white">
      <div className="p-1.5 bg-white/10 rounded">{icon}</div>
      <h3 className="font-bold uppercase tracking-wider text-xs">{title}</h3>
    </div>
    <div className="p-6 grid grid-cols-2 gap-x-6 gap-y-5">{children}</div>
  </section>
);

/* ─────────────── FIELD HELPERS ─────────────── */

const labelCls =
  "block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5";

const inputCls = (error?: string, disabled?: boolean) =>
  [
    "w-full px-4 py-2.5 bg-white border rounded text-sm transition-all outline-none",
    error
      ? "border-red-500 ring-2 ring-red-50"
      : "border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50",
    disabled ? "bg-slate-50 cursor-not-allowed opacity-60" : "",
  ]
    .filter(Boolean)
    .join(" ");
    
    const Input = ({
      label,
      required,
      value,
      error,
      type = "text",
      onChange,
      placeholder,
      min,
      max,
      disabled,
      className = ""
    }: any) => (
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type={type}
          disabled={disabled}
          min={min}
          max={max}
          placeholder={placeholder}
          className={`
            w-full px-4 py-2.5 bg-white border rounded text-sm transition-all outline-none
            ${error ? "border-red-500 ring-2 ring-red-50" : "border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"}
            ${disabled ? "bg-slate-50 cursor-not-allowed opacity-60" : ""}
            ${className}
          `}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
        {error && <p className="text-[10px] font-medium text-red-500 mt-1">{error}</p>}
      </div>
    );
    
    const Select = ({
      label,
      required,
      options,
      value,
      onChange,
      disabled = false,
      valueKey = "id",
      labelKey = "name",
      error,
    }: any) => (
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <select
            disabled={disabled}
            className={`
              w-full px-4 py-2.5 bg-white border rounded text-sm transition-all outline-none appearance-none
              ${error ? "border-red-500 ring-2 ring-red-50" : "border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"}
              ${disabled ? "bg-slate-50 cursor-not-allowed opacity-60" : ""}
            `}
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
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        {error && <p className="text-[10px] font-medium text-red-500 mt-1">{error}</p>}
      </div>
    );
    
    const Textarea = ({
      label,
      required,
      value,
      error,
      onChange,
      placeholder,
      disabled = false,
      className = "",
      rows = 3,
    }: any) => (
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea
          rows={rows}
          disabled={disabled}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full px-4 py-2.5 bg-white border rounded text-sm transition-all outline-none
            ${error ? "border-red-500 ring-2 ring-red-50" : "border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"}
            ${disabled ? "bg-slate-50 cursor-not-allowed opacity-60" : ""}
            ${className}
          `}
        />
        {error && <p className="text-[10px] font-medium text-red-500 mt-1">{error}</p>}
      </div>
    );