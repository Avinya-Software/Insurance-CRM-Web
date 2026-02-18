import { useRef, useState, useEffect } from "react";
import { useCreateFollowUp } from "../../hooks/leadFollowUp/useCreateFollowUp";
import toast from "react-hot-toast";
import { LeadFollowUp } from "../../interfaces/leadFollowUp.interface";

interface Props {
  leadId: string;
  statuses: any[];
  mode?: "create" | "edit";
  editData?: LeadFollowUp;
  onSuccess: () => void;
}

const FollowUpForm = ({
  leadId,
  statuses,
  mode = "create",
  editData,
  onSuccess,
}: Props) => {
  const nextFollowUpRef = useRef<HTMLInputElement>(null);

  const { mutateAsync, isPending } = useCreateFollowUp();

  const [nextFollowUpDate, setNextFollowUpDate] = useState<string>("");
  const [remark, setRemark] = useState<string>("");
  const [leadFollowupStatusId, setLeadFollowupStatusId] =
    useState<number | "">("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getNowForDateTimeLocal = () => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
  
    return `${now.getFullYear()}-${pad(
      now.getMonth() + 1
    )}-${pad(now.getDate())}T${pad(
      now.getHours()
    )}:${pad(now.getMinutes())}`;
  };
  

  useEffect(() => {
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
    }
  }, [mode, editData, statuses]);
  
  const validate = () => {
    const e: Record<string, string> = {};

    if (!nextFollowUpDate) {
      e.nextFollowUpDate = "Next follow up date is required";
    }

    if (!remark.trim()) {
      e.remark = "Remark is required";
    }

    if (!leadFollowupStatusId) {
      e.leadFollowupStatusId = "Follow-up status is required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const payload = {
        leadId,
        status: Number(leadFollowupStatusId),
        nextFollowUpDate,
        remark,
        ...(mode === "edit" && editData
          ? { followUpId: editData.followUpID }
          : {}),
      };

      const res = await mutateAsync(payload as any);

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

  return (
    <div className="space-y-4">
      {/* NEXT FOLLOW UP DATE */}
      <div>
        <label className="text-sm font-medium">
          Next Follow Up Date <span className="text-red-500">*</span>
        </label>

        <div
          onClick={() => nextFollowUpRef.current?.showPicker()}
          className="cursor-pointer"
        >
          <input
            ref={nextFollowUpRef}
            type="datetime-local"
            min={getNowForDateTimeLocal()} 
            className={`input w-full ${
              errors.nextFollowUpDate ? "border-red-500" : ""
            }`}
            value={nextFollowUpDate}
            onChange={(e) => setNextFollowUpDate(e.target.value)}
          />
        </div>

        {errors.nextFollowUpDate && (
          <p className="text-xs text-red-600 mt-1">
            {errors.nextFollowUpDate}
          </p>
        )}
      </div>

      {/* REMARK */}
      <div>
        <label className="text-sm font-medium">
          Remark <span className="text-red-500">*</span>
        </label>

        <textarea
          className={`input w-full h-24 ${
            errors.remark ? "border-red-500" : ""
          }`}
          placeholder="Enter remark"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />

        {errors.remark && (
          <p className="text-xs text-red-600 mt-1">
            {errors.remark}
          </p>
        )}
      </div>

      {/* FOLLOW-UP STATUS */}
      <div>
        <label className="text-sm font-medium">
          Follow-up Status <span className="text-red-500">*</span>
        </label>

        <select
          className={`input w-full ${
            errors.leadFollowupStatusId
              ? "border-red-500"
              : ""
          }`}
          value={leadFollowupStatusId}
          onChange={(e) =>
            setLeadFollowupStatusId(
              Number(e.target.value)
            )
          }
        >
          <option value="">Select status</option>

          {statuses.map((s) => (
            <option
              key={s.leadFollowupStatusID}
              value={s.leadFollowupStatusID}
            >
              {s.statusName}
            </option>
          ))}
        </select>

        {errors.leadFollowupStatusId && (
          <p className="text-xs text-red-600 mt-1">
            {errors.leadFollowupStatusId}
          </p>
        )}
      </div>

      {/* SAVE BUTTON */}
      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-60"
      >
        {isPending
          ? "Saving..."
          : mode === "edit"
          ? "Update Follow Up"
          : "Save Follow Up"}
      </button>
    </div>
  );
};

export default FollowUpForm;
