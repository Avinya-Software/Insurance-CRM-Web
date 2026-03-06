import { useEffect, useState } from "react";
import { X, User, ChevronDown } from "lucide-react";
import { useUpsertLead } from "../../hooks/lead/useUpsertLead";
import { useLeadStatuses } from "../../hooks/lead/useLeadStatuses";
import { useLeadSources } from "../../hooks/lead/useLeadSources";
import { getCustomerDropdownApi } from "../../api/customer.api";
import SearchableComboBox from "../common/SearchableComboBox";
import Spinner from "../common/Spinner";
import { toast } from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  lead?: any;
  advisorId: string | null;
}

interface Customer {
  customerId: string;
  clientName: string;
  email: string;
  primaryMobile?: string;
  address?: string;
}

const LeadUpsertSheet = ({ open, onClose, lead, advisorId }: Props) => {

  const { mutate, isPending } = useUpsertLead();
  const { data: statuses } = useLeadStatuses();
  const { data: sources } = useLeadSources();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  const initialForm = {
    customerId: null as string | null,
    fullName: "",
    email: "",
    mobile: "",
    address: "",
    leadStatusId: "",
    leadSourceId: "",
    leadSourceDescription: "",
    notes: "",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const selectedSource = sources?.find(
    (s: any) => String(s.id) === String(form.leadSourceId)
  );
  
  const isOtherSource =
    selectedSource?.name?.toLowerCase() === "other";
  /* BODY LOCK */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  /* CUSTOMER LIST */
  useEffect(() => {
    getCustomerDropdownApi().then((res) => {
      setCustomers(res?.data ?? []);
    });
  }, []);

  /* PREFILL */
  useEffect(() => {
    if (!open) return;
    if (!statuses || !sources) return;

    if (lead) {
      const mappedStatusId =
        String(
          lead.leadStatusId ||
            statuses?.find(
              (s: any) =>
                s.name?.toLowerCase() === lead.leadStatus?.toLowerCase()
            )?.id ||
            ""
        );

      const mappedSourceId =
        String(
          lead.leadSourceId ||
            sources?.find(
              (s: any) =>
                s.name?.toLowerCase() === lead.leadSource?.toLowerCase()
            )?.id ||
            ""
        );

        setForm({
          customerId: lead.customerId ?? null,
          fullName: lead.clientName  ?? "",
          email: lead.email ?? "",
          mobile: lead.mobile ?? "",
          address: lead.address ?? "",
          leadStatusId: mappedStatusId,
          leadSourceId: mappedSourceId,
          leadSourceDescription: lead.leadSourceDescription ?? "",
          notes: lead.notes ?? "",
        });

      setSelectedCustomerId(lead.customerId ?? "");
    } else {
      setForm(initialForm);
      setSelectedCustomerId("");
    }

    setErrors({});
  }, [open, lead, statuses, sources]);

  /* CUSTOMER AUTO FILL */
  useEffect(() => {
    if (!selectedCustomerId) return;
    if (lead) return;
  
    const customer = customers.find(
      (c) => c.customerId === selectedCustomerId
    );
  
    if (!customer) return;
  
    setForm((prev) => ({
      ...prev,
      customerId: customer.customerId,
      fullName: customer.clientName ?? "",
      email: customer.email ?? "",
      mobile: customer.primaryMobile ?? "",
      address: customer.address ?? "",
    }));
  }, [selectedCustomerId, customers, lead]);


  useEffect(() => {
    if (!selectedCustomerId) return;
  
    const customer = customers.find(
      (c) => c.customerId === selectedCustomerId
    );
  
    if (!customer) return;
  
    setForm((prev) => ({
      ...prev,
      customerId: customer.customerId,
      fullName: customer.clientName ?? "",
      email: customer.email ?? "",
      mobile: customer.primaryMobile ?? "",
      address: customer.address ?? "",
    }));
  }, [selectedCustomerId, customers]);

  /* VALIDATION */

  const validate = () => {
    const e: Record<string, string> = {};
    const mobileRegex = /^[6-9]\d{9}$/;

    if (!form.fullName.trim()) e.fullName = "Full name is required";

    if (!form.mobile.trim()) e.mobile = "Mobile is required";
    else if (!mobileRegex.test(form.mobile))
      e.mobile = "Invalid mobile number";

    if (!form.leadStatusId) e.leadStatusId = "Lead status required";

    if (!form.leadSourceId) e.leadSourceId = "Lead source required";

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

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed top-0 right-0 w-full max-w-[30vw] h-screen bg-slate-50 z-[70] shadow-2xl flex flex-col animate-slide-in-right">

        {/* HEADER */}

        <div className="px-8 py-6 bg-white border-b flex justify-between items-center">

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {lead ? "Edit Lead" : "Add Lead"}
            </h2>

            <p className="text-slate-500 text-sm mt-1">
              Lead Information
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full"
          >
            <X size={22} />
          </button>

        </div>

        {/* BODY */}

        <div className="flex-1 overflow-y-auto p-8">

          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

            <div className="flex items-center gap-2 bg-slate-800 px-6 py-3 text-white">

              <div className="p-1.5 bg-white/10 rounded">
                <User size={16}/>
              </div>

              <h3 className="font-bold uppercase tracking-wider text-xs">
                Lead Information
              </h3>

            </div>

            <div className="p-6 grid grid-cols-2 gap-x-6 gap-y-5">

              {/* CUSTOMER */}
              <SearchableComboBox
                label="Customer"
                items={customers.map((c) => ({
                  value: c.customerId,
                  label: `${c.clientName} (${c.email ?? c.primaryMobile ?? ""})`,
                }))}
                value={selectedCustomerId}
                placeholder="Search Customer..."
                emptyText="No customer found"
                createText="Add new customer"
                onSelect={(item) => {
                  setSelectedCustomerId(item?.value);
                }}
              />

              <Input
                label="Full Name"
                required
                value={form.fullName}
                error={errors.fullName}
                onChange={(v:any)=>
                  setForm({...form,fullName:v.replace(/[^a-zA-Z ]/g,"")})
                }
              />

              {/* EMAIL + MOBILE */}
              <Input
                label="Email"
                value={form.email}
                onChange={(v:any)=>setForm({...form,email:v})}
              />

              <Input
                label="Mobile"
                required
                value={form.mobile}
                error={errors.mobile}
                onChange={(v:any)=>
                  setForm({...form,mobile:v.replace(/[^0-9]/g,"").slice(0,10)})
                }
              />

              {/* ADDRESS + STATUS */}
              <Input
                label="Address"
                value={form.address}
                onChange={(v:any)=>setForm({...form,address:v})}
              />

              <Select
                label="Lead Status"
                required
                options={statuses}
                value={form.leadStatusId}
                error={errors.leadStatusId}
                onChange={(v:any)=>setForm({...form,leadStatusId:v})}
              />

              {/* SOURCE + SOURCE DESCRIPTION */}
              <Select
                label="Lead Source"
                required
                options={sources}
                value={form.leadSourceId}
                error={errors.leadSourceId}
                onChange={(v:any)=>
                  setForm({
                    ...form,
                    leadSourceId:v,
                    leadSourceDescription:""
                  })
                }
              />

              {isOtherSource ? (
                <Input
                  label="Lead Source Description"
                  required
                  value={form.leadSourceDescription}
                  onChange={(v:any)=>
                    setForm({...form,leadSourceDescription:v})
                  }
                />
              ) : (
                <div />
              )}

              {/* NOTES */}
              <div className="col-span-2">
                <Textarea
                  label="Notes"
                  value={form.notes}
                  onChange={(v:any)=>setForm({...form,notes:v})}
                />
              </div>

            </div>

          </section>

        </div>

        {/* FOOTER */}

        <div className="px-8 py-6 bg-white border-t flex gap-4">

          <button
            disabled={isPending}
            onClick={handleSave}
            className="px-8 py-2.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded flex items-center gap-2"
          >
            {isPending ? <Spinner className="text-white"/> : "SAVE"}
          </button>

          <button
            onClick={onClose}
            className="px-8 py-2.5 text-sm font-bold text-white bg-red-500 rounded"
          >
            CANCEL
          </button>

        </div>

      </div>
    </>
  );
};

export default LeadUpsertSheet;

/*   HELPERS   */

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
  disabled,
  className = ""
}: any) => (
  <div className="space-y-1.5">
    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
      {label} {required && <span className="text-red-500">*</span>}
    </label>

    <textarea
      disabled={disabled}
      placeholder={placeholder}
      rows={4}
      className={`
        w-full px-4 py-2.5 bg-white border rounded text-sm transition-all outline-none resize-none
        ${error ? "border-red-500 ring-2 ring-red-50" : "border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"}
        ${disabled ? "bg-slate-50 cursor-not-allowed opacity-60" : ""}
        ${className}
      `}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />

    {error && (
      <p className="text-[10px] font-medium text-red-500 mt-1">
        {error}
      </p>
    )}
  </div>
);