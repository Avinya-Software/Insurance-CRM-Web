import { useRef, useEffect } from "react";
import { X, Pencil } from "lucide-react";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useLeadFollowUps } from "../../hooks/leadFollowUp/useLeadFollowUps";
import { LeadFollowUp } from "../../interfaces/leadFollowUp.interface";

interface Props {
  open: boolean;
  onClose: () => void;
  leadId: string | null;
  leadName?: string;
}

const LeadFollowUpBottomSheet = ({
  open,
  onClose,
  leadId,
  leadName,
}: Props) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, refetch } = useLeadFollowUps(leadId || "");

  useOutsideClick(sheetRef, () => {
    if (open) onClose();
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  useEffect(() => {
    if (open && leadId) {
      refetch();
    }
  }, [open, leadId, refetch]);

  if (!open || !leadId) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* BOTTOM SHEET */}
      <div
        ref={sheetRef}
        className="
          fixed bottom-0 left-0 right-0
          bg-white
          rounded-t-2xl
          shadow-2xl
          z-50
          h-[55vh]
          flex flex-col
          animate-slideUp
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-semibold">Lead Follow Ups</h2>
            {leadName && (
              <p className="text-sm text-gray-600">{leadName}</p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p className="text-gray-500">Loading follow ups...</p>
            </div>
          ) : !data || data.length === 0 ? (
            <div className="flex justify-center py-8">
              <p className="text-gray-500">No follow ups found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.map((followUp: LeadFollowUp) => (
                  <div
                    key={followUp.followUpID}
                    className="relative border rounded-lg p-4 hover:shadow-md"
                  >
                    {/* EDIT ICON - TOP RIGHT */}
                    <button
                      onClick={() => console.log("Edit follow up:", followUp.followUpID)}
                      className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
                      title="Edit"
                    >
                      <Pencil size={16} className="text-gray-600" />
                    </button>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600 font-medium">Follow Up Date</p>
                        <p className="mt-1">
                          {new Date(followUp.createdDate).toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-600 font-medium">Next Follow Up</p>
                        <p className="mt-1">
                          {followUp.nextFollowupDate
                            ? new Date(followUp.nextFollowupDate).toLocaleString()
                            : "-"}
                        </p>
                      </div>

                      <div className="col-span-2">
                        <p className="text-gray-600 font-medium">Status</p>
                        <p className="mt-1">{followUp.statusName}</p>
                      </div>

                      {followUp.remark && (
                        <div className="col-span-2">
                          <p className="text-gray-600 font-medium">Remark</p>
                          <p className="mt-1">{followUp.remark}</p>
                        </div>
                      )}

                      <div className="col-span-2 pt-2 border-t">
                        <p className="text-xs text-gray-500">
                          Created: {new Date(followUp.createdDate).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
))}

            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LeadFollowUpBottomSheet;
