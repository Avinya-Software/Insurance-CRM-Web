import { History, MoreVertical, RefreshCcw } from "lucide-react";
import { Renewal } from "../../interfaces/renewal.interface";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { RenewalHistoryDialog } from "./RenewalHistoryDialog";
import { useState, useRef } from "react";

interface Props {
  data: Renewal[];
  loading?: boolean;
  statusId: number | null;
  onRenewal: (renewal: Renewal) => void;
  onEdit: (policyId: string) => void;
}

/*   STATUS BADGES   */
const statusStyles: Record<string, string> = {
  "Pending": "bg-amber-100 text-amber-700 border-amber-200",
  "Paid": "bg-green-100 text-green-700 border-green-200",
  "Overdue": "bg-red-100 text-red-700 border-red-200",
};

const DROPDOWN_HEIGHT = 280;
const DROPDOWN_WIDTH = 220;

const RenewalTable = ({ data = [], loading, statusId, onRenewal, onEdit }: Props) => {
  const [openRow, setOpenRow] = useState<Renewal | null>(null);
  const [style, setStyle] = useState({ top: 0, left: 0 });
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedHistoryPolicy, setSelectedHistoryPolicy] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dropdownRef, () => {
    setOpenRow(null);
  });

  const getOverdueDays = (dueDate: string) => {
    if (!dueDate) return 0;
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

  const handleAction = (cb: () => void) => {
    setOpenRow(null);
    setTimeout(cb, 0);
  };

  const isAllTab = statusId === null;

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        {/* ... (table head remains same) ... */}
        <thead className="bg-slate-100 sticky top-0 z-10">
          <tr>
            <Th>Client Name</Th>
            <Th>Policy Number</Th>
            <Th>Division</Th>
            <Th>Company</Th>
            <Th>Group Head</Th>
            <Th>Group Code</Th>
            <Th>Email</Th>
            <Th>Mobile</Th>
            <Th>Start Date</Th>
            <Th>Next Due</Th>
            <Th>Reminder Date</Th>
            <Th>Premium</Th>
            {isAllTab && <Th>Status</Th>}
            <Th className="text-left font-semibold">Actions</Th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={isAllTab ? 15 : 14} className="text-center py-12 text-slate-500">Loading...</td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={isAllTab ? 15 : 14} className="text-center py-12 text-slate-500">No renewals found</td>
            </tr>
          ) : (
            data.map((r, index) => (
              <tr key={index} className="border-t h-[52px] hover:bg-slate-50 transition-colors cursor-default">
                <Td className="whitespace-nowrap">{showValue(r.title)} {showValue(r.clientName)}</Td>
                <Td>{r.policyNumber}</Td>
                <Td>{showValue(r.divisionName)}</Td>
                <Td>{showValue(r.companyName)}</Td>
                <Td>{showValue(r.groupHeadName)}</Td>
                <Td>{showValue(r.groupCode)}</Td>
                <Td>{showValue(r.email)}</Td>
                <Td>{showValue(r.primaryMobile)}</Td>
                <Td>{r.policyStartDate ? r.policyStartDate.split("T")[0] : "-"}</Td>
                <Td>
                    {r.nextPremiumDueDate ? r.nextPremiumDueDate.split("T")[0] : "-"}
                    {getOverdueDays(r.nextPremiumDueDate || r.dueDate) > 0 && (
                        <div className="text-[10px] text-red-600 font-medium whitespace-nowrap">
                            {getOverdueDays(r.nextPremiumDueDate || r.dueDate)} days due
                        </div>
                    )}
                </Td>
                <Td>{r.reminderDate ? r.reminderDate.split("T")[0] : "-"}</Td>
                <Td>
                    <div className="flex flex-col whitespace-nowrap">
                        <span>₹{r.basicPremium}</span>
                        <span className="text-[10px] text-slate-500">Final: ₹{r.finalInstallmentPremium}</span>
                    </div>
                </Td>
                {isAllTab && (
                  <Td>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusStyles[r.renewalStatus] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                      {r.renewalStatus}
                    </span>
                  </Td>
                )}
                <Td className="text-left">
                  <button
                    onClick={(e) => openDropdown(e, r)}
                    className="p-2 rounded hover:bg-slate-200 transition-colors"
                  >
                    <MoreVertical size={16} />
                  </button>
                </Td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ACTION DROPDOWN */}
      {openRow && (
        <div
          ref={dropdownRef}
          onClick={(e) => e.stopPropagation()}
          className="fixed z-50 w-[220px] bg-white border rounded-lg shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100"
          style={style}
        >
          <MenuItem
            label="View History"
            onClick={() => handleAction(() => {
              setSelectedHistoryPolicy(openRow.policyId);
              setHistoryOpen(true);
            })}
          />

          {openRow.renewalStatus !== "Renew" && (
            <MenuItem
              label="Create Renewal"
              onClick={() => handleAction(() => onRenewal(openRow))}
            />
          )}

          <MenuItem
            label="Edit Renewal"
            onClick={() => handleAction(() => onEdit(openRow.policyId))}
          />

        </div>
      )}

      {/*   HISTORY DIALOG   */}
      <RenewalHistoryDialog
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        policyId={selectedHistoryPolicy}
      />
    </div>
  );
};

export default RenewalTable;

/*   HELPERS   */

const Th = ({ children, className = "" }: any) => (
  <th className={`px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap ${className}`}>
    {children}
  </th>
);

const Td = ({ children, className = "" }: any) => (
  <td className={`px-4 py-3 text-slate-600 ${className}`}>
    {children}
  </td>
);

const MenuItem = ({
  label,
  onClick,
  danger = false,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
}) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-slate-100 transition-colors ${
      danger ? "text-red-600 hover:bg-red-50" : "text-slate-700 hover:text-slate-900"
    }`}
  >
    <span>{label}</span>
  </button>
);
