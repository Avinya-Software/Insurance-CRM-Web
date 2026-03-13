import { useEffect } from "react";
import { X } from "lucide-react";
import FollowUpForm from "./FollowUpForm";
import { useLeadFollowupStatuses } from "../../hooks/leadFollowUp/useLeadFollowupStatuses";

interface Props {
  open: boolean;
  leadId: string | null;
  leadName?: string;
  mode?: "create" | "edit";
  editData?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const LeadFollowUpCreateSheet = ({
  open,
  leadId,
  leadName,
  mode = "create",
  editData,
  onClose,
  onSuccess,
}: Props) => {

  /* Lock body scroll when sheet is open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  /* Fetch statuses only when sheet is open */
  const { statuses } = useLeadFollowupStatuses(open);

  /* Guard render */
  if (!open || !leadId) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet Panel */}
      <div className="
        fixed top-0 right-0
        h-full w-[420px]
        bg-white
        z-50
        shadow-2xl
        animate-slideInRight
        flex flex-col
      ">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">

          <div className="min-w-0">
            <h2 className="text-lg font-semibold truncate">
              {mode === "edit" ? "Edit Follow Up" : "Create Follow Up"}
            </h2>

            {leadName && (
              <p className="text-sm text-gray-600 truncate">
                {leadName}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition"
          >
            <X size={18}/>
          </button>

        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
        <FollowUpForm
            open={open}
            onClose={onClose}
            leadId={leadId}
            mode={mode}
            editData={editData}
            onSuccess={onSuccess}
            statuses={statuses}
          />
        </div>

      </div>
    </>
  );
};

export default LeadFollowUpCreateSheet;