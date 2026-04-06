import { useState, useRef } from "react";
import { Check, RefreshCw, MoreVertical, X } from "lucide-react";
import { useUpdateRenewalStatus } from "../../hooks/renewal/useUpdateRenewalStatus";
import { Renewal } from "../../interfaces/renewal.interface";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useRenewalStatuses } from "../../hooks/renewal/useRenewalStatuses";
import toast from "react-hot-toast";

interface Props {
  data: Renewal[];
  loading?: boolean;
}

/*   STATUS BADGES   */
const statusStyles: Record<string, string> = {
  "Pending": "bg-amber-100 text-amber-700 border-amber-200",
  "Paid": "bg-green-100 text-green-700 border-green-200",
  "Overdue": "bg-red-100 text-red-700 border-red-200",
  "Cancelled": "bg-slate-100 text-slate-600 border-slate-200",
};

const DROPDOWN_HEIGHT = 280;
const DROPDOWN_WIDTH = 220;

const RenewalTable = ({ data = [], loading }: Props) => {
  const [openRow, setOpenRow] = useState<Renewal | null>(null);
  const [style, setStyle] = useState({ top: 0, left: 0 });

  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dropdownRef, () => {
    setOpenRow(null);
  });

  const { mutate: updateStatus, isPending } = useUpdateRenewalStatus();
  const { data: statuses = [] } = useRenewalStatuses();

  /*   ACTIONS   */
  const handleStatusUpdate = (id: string, statusId: number) => {
    updateStatus(
      { id, renewalStatusId: statusId },
      {
        onSuccess: (res) => {
          toast.success(res?.statusMessage || "Status updated successfully");
          setOpenRow(null);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.statusMessage || "Failed to update status");
        }
      }
    );
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const getOverdueDays = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const showValue = (v: any) => (v === null || v === undefined || v === "" ? "-" : v);

  const openDropdown = (e: React.MouseEvent<HTMLButtonElement>, row: Renewal) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const openUpwards = spaceBelow < DROPDOWN_HEIGHT;

    setStyle({
      top: openUpwards ? rect.top - DROPDOWN_HEIGHT : rect.bottom + 6,
      left: rect.right - DROPDOWN_WIDTH,
    });

    setOpenRow(row);
  };

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-slate-100 sticky top-0 z-10">
          <tr>
            <Th>Client Name</Th>
            <Th>Policy Number</Th>
            <Th>Group Head</Th>
            <Th>Group Code</Th>
            <Th>Email</Th>
            <Th>Mobile</Th>
            <Th>Mode</Th>
            <Th>Term/PPT</Th>
            <Th>Start Date</Th>
            <Th>Next Due</Th>
            <Th>Premium</Th>
            <Th>Renewal No</Th>
            <Th>Status</Th>
            <Th className="text-left font-semibold">Actions</Th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={14} className="text-center py-12 text-slate-500">Loading...</td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={14} className="text-center py-12 text-slate-500">No renewals found</td>
            </tr>
          ) : (
            data.map((r, index) => (
              <tr key={index} className="border-t h-[52px] hover:bg-slate-50 transition-colors cursor-default">
                <Td>{showValue(r.title)} {showValue(r.clientName)}</Td>
                <Td>{showValue(r.policyNumber)}</Td>
                <Td>{showValue(r.groupHeadName)}</Td>
                <Td>{showValue(r.groupCode)}</Td>
                <Td>{showValue(r.email)}</Td>
                <Td>{showValue(r.primaryMobile)}</Td>
                <Td>{showValue(r.premiumMode)}</Td>
                <Td>{showValue(r.policyTerm)} / {showValue(r.ppt)}</Td>
                <Td>{r.policyStartDate ? r.policyStartDate.split("T")[0] : "-"}</Td>
                <Td>
                    {r.nextPremiumDueDate ? r.nextPremiumDueDate.split("T")[0] : "-"}
                    {getOverdueDays(r.dueDate) > 0 && (
                        <div className="text-[10px] text-red-600 font-medium">
                            {getOverdueDays(r.dueDate)} days due
                        </div>
                    )}
                </Td>
                <Td>
                    <div className="flex flex-col">
                        <span>₹{r.installmentPremium}</span>
                        <span className="text-[10px] text-slate-500">Final: ₹{r.finalInstallmentPremium}</span>
                    </div>
                </Td>
                <Td>{r.renewalNo}</Td>
                <Td>
                   <div className="flex items-center gap-2">
                        <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                                statusStyles[r.renewalStatus] ?? "bg-gray-100 text-gray-700 border-gray-200"
                            }`}
                        >
                            {r.renewalStatus}
                        </span>
                        {r.renewalStatusId === 1 && isOverdue(r.dueDate) && (
                            <button
                                onClick={() => handleStatusUpdate(r.renewalId, 2)}
                                disabled={isPending}
                                className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-amber-950 px-2.5 py-1 rounded text-[10px] font-bold shadow-sm transition-all transform hover:scale-105 active:scale-95 animate-pulse"
                                title="Click to Renew"
                            >
                                <RefreshCw size={10} className={isPending ? "animate-spin" : ""} />
                                RENEW
                            </button>
                        )}
                   </div>
                </Td>
                <Td className="text-left">
                  <button
                    onClick={(e) => openDropdown(e, r)}
                    className="p-2 rounded hover:bg-slate-200"
                  >
                    <MoreVertical size={16} />
                  </button>
                </Td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/*   ACTION DROPDOWN   */}
      {openRow && (
        <div
          ref={dropdownRef}
          onClick={(e) => e.stopPropagation()}
          className="fixed z-50 w-[220px] bg-white border rounded-lg shadow-xl overflow-hidden py-2"
          style={{ top: style.top, left: style.left }}
        >
          {/*   STATUS HEADER   */}
          <div className="px-4 py-2 text-sm font-medium text-slate-700">
            Change Status
          </div>

          {/* 🔥 FLAT STATUS LIST */}
          <div className="border-t my-1"></div>
          {statuses.map((status: any) => {
            const isActive = status.statusName === openRow.renewalStatus;
            return (
              <button
                key={status.renewalStatusId}
                disabled={isPending || isActive}
                onClick={() => handleStatusUpdate(openRow.renewalId, status.renewalStatusId)}
                className={`
                  w-full px-4 py-2 text-sm text-left flex items-center gap-2 transition-colors
                  ${isActive 
                    ? 'text-slate-400 bg-slate-50 cursor-not-allowed' 
                    : 'text-slate-600 hover:bg-slate-100'}
                `}
              >
                <Check 
                  size={14} 
                  className={`${isActive ? "opacity-100" : "opacity-0"} text-slate-500`} 
                />
                {status.statusName}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RenewalTable;

/* ================= HELPERS ================= */

const Th = ({ children, className = "" }: any) => (
  <th className={`px-4 py-3 text-left font-semibold ${className}`}>
    {children}
  </th>
);

const Td = ({ children, className = "" }: any) => (
  <td className={`px-4 py-3 ${className}`}>
    {children}
  </td>
);
