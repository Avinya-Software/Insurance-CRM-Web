import { useRef, useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { LeadFollowUp } from "../../interfaces/leadFollowUp.interface";
import Spinner from "../common/Spinner";
import { useCreateFollowUp } from "../../hooks/followup/useFollowUpMutations";

interface Props {
  open: boolean;
  onClose: () => void;
  leadId: string;
  statuses: any[];
  mode?: "create" | "edit";
  editData?: LeadFollowUp;
  onSuccess: () => void;
}

const FollowUpSheet = ({
  open,
  onClose,
  leadId,
  statuses,
  mode = "create",
  editData,
  onSuccess,
}: Props) => {

  const nextFollowUpRef = useRef<HTMLInputElement>(null);

  const { mutateAsync, isPending } = useCreateFollowUp();

  const [nextFollowUpDate, setNextFollowUpDate] = useState("");
  const [remark, setRemark] = useState("");
  const [leadFollowupStatusId, setLeadFollowupStatusId] =
    useState<number | "">("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* BODY LOCK */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  /* PREFILL EDIT */
  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && editData && statuses.length > 0) {
      setNextFollowUpDate(
        editData.nextFollowupDate
          ? new Date(editData.nextFollowupDate)
              .toISOString()
              .slice(0, 16)
          : ""
      );

      setRemark(editData.remark || "");

      const matchedStatus = statuses.find(
        (s) => s.statusName === editData.statusName
      );

      if (matchedStatus) {
        setLeadFollowupStatusId(matchedStatus.leadFollowupStatusID);
      }
    } else {
      setNextFollowUpDate("");
      setRemark("");
      setLeadFollowupStatusId("");
    }

    setErrors({});
  }, [open, mode, editData, statuses]);

  /* VALIDATION */
  const validate = () => {
    const e: Record<string, string> = {};

    if (!nextFollowUpDate) e.nextFollowUpDate = "Next follow up date is required";
    if (!remark.trim()) e.remark = "Remark is required";
    if (!leadFollowupStatusId)
      e.leadFollowupStatusId = "Follow-up status is required";

    setErrors(e);

    if (Object.keys(e).length) {
      toast.error("Please fix validation errors");
      return false;
    }

    return true;
  };

  /* SUBMIT */
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const payload: any = {
        leadId,
        status: Number(leadFollowupStatusId),
        nextFollowUpDate,
        remark,
      };

      if (mode === "edit" && editData) {
        payload.followUpId = editData.followUpID;
      }

      const res = await mutateAsync(payload);

      toast.success(
        res?.statusMessage ||
          (mode === "edit"
            ? "Follow up updated successfully"
            : "Follow up created successfully")
      );

      onSuccess();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.statusMessage ||
          err?.message ||
          "Something went wrong"
      );
    }
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
      <div className="fixed top-0 right-0 w-full max-w-[20vw] h-screen bg-slate-50 z-[70] shadow-2xl flex flex-col animate-slide-in-right">

        {/* HEADER */}
        <div className="px-8 py-6 bg-white border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {mode === "edit" ? "Edit Follow Up" : "Add Follow Up"}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Follow up information
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-8">

          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

            <div className="bg-slate-800 text-white px-6 py-3 flex items-center gap-2">
              <h3 className="text-xs uppercase tracking-wider font-bold">
                Follow Up Details
              </h3>
            </div>

            <div className="p-6 grid grid-cols-1 gap-5">

              {/* DATE */}
              <Input
                label="Next Follow Up Date"
                required
                type="datetime-local"
                refTrigger={nextFollowUpRef}
                value={nextFollowUpDate}
                error={errors.nextFollowUpDate}
                min={getNowForDateTimeLocal()}
                onClickPicker={() =>
                  nextFollowUpRef.current?.showPicker()
                }
                onChange={setNextFollowUpDate}
              />

              {/* REMARK */}
              <Textarea
                label="Remark"
                required
                value={remark}
                error={errors.remark}
                onChange={setRemark}
                placeholder="Enter remark"
              />

              {/* STATUS */}
              <Select
                label="Follow-up Status"
                required
                options={statuses}
                value={leadFollowupStatusId}
                error={errors.leadFollowupStatusId}
                valueKey="leadFollowupStatusID"
                labelKey="statusName"
                onChange={(v:any)=>setLeadFollowupStatusId(Number(v))}
              />

            </div>

          </section>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-5 bg-white border-t flex gap-4">

          <button
            disabled={isPending}
            onClick={handleSubmit}
            className="px-8 py-2.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded flex items-center gap-2 transition"
          >
            {isPending ? <Spinner className="text-white" /> : null}
            {mode === "edit" ? "UPDATE" : "SAVE"}
          </button>

          <button
            onClick={onClose}
            className="px-8 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded transition"
          >
            CANCEL
          </button>
        </div>
      </div>
    </>
  );
};

export default FollowUpSheet;

/* ===============================
   HELPERS
================================*/

const getNowForDateTimeLocal = () => {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

/* INPUT COMPONENT */
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