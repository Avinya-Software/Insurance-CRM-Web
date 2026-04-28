import { useState, useRef } from "react";
import { MoreVertical, X, Check } from "lucide-react";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useDeleteClaim } from "../../hooks/claim/useDeleteClaim";
import { useClaimStatus } from "../../hooks/claim/useClaimMasters";
import { useUpdateClaimStatus } from "../../hooks/claim/useUpdateClaimStatus";
import TableSkeleton from "../common/TableSkeleton";
import { ClaimHistoryDialog } from "./ClaimHistoryDialog";
import type { Claim } from "../../interfaces/claim.interface";

const divisionStyles: Record<number, string> = {
  1: "bg-blue-100 text-blue-700 border-blue-200", // Health
  2: "bg-purple-100 text-purple-700 border-purple-200", // Other
  5: "bg-green-100 text-green-700 border-green-200", // Motor/Vehicle
};

const typeStyles: Record<string, string> = {
  Cashless: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Reimbursement: "bg-sky-100 text-sky-700 border-sky-200",
};

const claimStatusStyles: Record<number, string> = {
  1: "bg-blue-100 text-blue-700 border-blue-200",         // Registered
  2: "bg-amber-100 text-amber-700 border-amber-200",       // Under Review
  3: "bg-purple-100 text-purple-700 border-purple-200",    // Survey In Progress
  4: "bg-emerald-100 text-emerald-700 border-emerald-200", // Approved
  5: "bg-red-100 text-red-700 border-red-200",             // Rejected
  6: "bg-indigo-100 text-indigo-700 border-indigo-200",    // Paid
  7: "bg-slate-100 text-slate-700 border-slate-200",       // Closed
};

const policyTypeStyles: Record<number, string> = {
  1: "bg-rose-100 text-rose-700 border-rose-200",   // Life
  2: "bg-teal-100 text-teal-700 border-teal-200",   // General
};

interface Props {
  data: Claim[];
  loading?: boolean;
  onEdit: (claim: Claim) => void;
}

const DROPDOWN_HEIGHT = 280;
const DROPDOWN_WIDTH = 220;

const ClaimTable = ({ data, loading = false, onEdit }: Props) => {
  const [openClaim, setOpenClaim] = useState<Claim | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Claim | null>(null);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyClaimId, setHistoryClaimId] = useState<string | null>(null);
  const [style, setStyle] = useState({ top: 0, left: 0 });

  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dropdownRef, () => {
    setOpenClaim(null);
    setShowStatusMenu(false);
  });

  const { data: statuses = [] } = useClaimStatus();
  const { mutate: updateStatus, isPending: updatingStatus } = useUpdateClaimStatus();

  const { mutate: deleteClaim, isPending } = useDeleteClaim();

  const openDropdown = (e: React.MouseEvent<HTMLButtonElement>, claim: Claim) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const openUpwards = spaceBelow < DROPDOWN_HEIGHT;

    setStyle({
      top: openUpwards ? rect.top - DROPDOWN_HEIGHT - 6 : rect.bottom + 6,
      left: rect.right - DROPDOWN_WIDTH,
    });
    setOpenClaim(claim);
    setShowStatusMenu(false);
  };

  const handleStatusChange = (statusId: number) => {
    if (!openClaim) return;

    const statusName = statuses.find((s: any) => s.id === statusId)?.name;

    updateStatus(
      {
        claimId: openClaim.claimId,
        statusId,
        statusName,
      },
      {
        onSuccess: () => {
          setOpenClaim(null);
          setShowStatusMenu(false);
        },
      }
    );
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    deleteClaim(confirmDelete.claimId, {
      onSuccess: () => {
        setConfirmDelete(null);
        setOpenClaim(null);
      },
    });
  };

  const getDivisionDetails = (claim: Claim) => {
    if (claim.motor) return `Vehicle: ${claim.motor.vehicleNumber}`;
    if (claim.health) return `Hospital: ${claim.health.hospitalName}`;
    if (claim.death) return `Death: ${claim.death.deathTypeName}`;
    if (claim.risk) return `Risk: ${claim.risk.riskAddress}`;
    return "-";
  };

  return (
    <div className="relative overflow-x-auto">
      <table className="min-w-[1600px] text-sm">
        <thead className="bg-slate-100">
          <tr>
            <Th>Claim</Th>
            <Th>Customer</Th>
            <Th>Division</Th>
            <Th>Policy</Th>
            <Th>Policy Type</Th>
            <Th>Type</Th>
            <Th>Event</Th>
            <Th>Amount</Th>
            <Th>Details</Th>
            <Th>Status</Th>
            <Th>Claim Date</Th>
            <Th>Incident Date</Th>
            <Th>Created Date</Th>
            <Th className="text-left">Actions</Th>
          </tr>
        </thead>

        {loading ? (
          <TableSkeleton />
        ) : (
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={13} className="text-center py-12">
                  No claims found
                </td>
              </tr>
            ) : (
              data.map((claim) => (
                <tr 
                  key={claim.claimId} 
                  className="border-t hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setHistoryClaimId(claim.claimId);
                    setShowHistory(true);
                  }}
                >
                  <Td>
                    <div className="font-semibold text-blue-600 hover:underline">{claim.claimNumber}</div>
                  </Td>
                  <Td>{claim.customerName || "-"}</Td>
                  <Td>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        divisionStyles[claim.divisionType] || "bg-gray-100 text-gray-600 border-gray-200"
                      }`}
                    >
                      {claim.divisionTypeName || "-"}
                    </span>
                  </Td>
                  <Td>{claim.policyNumber || "-"}</Td>
                  <Td>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        policyTypeStyles[claim.policyType] || "bg-gray-100 text-gray-600 border-gray-200"
                      }`}
                    >
                      {claim.policyTypeName || "-"}
                    </span>
                  </Td>
                  <Td>
                    {claim.claimTypeName ? (
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          typeStyles[claim.claimTypeName] || "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        {claim.claimTypeName}
                      </span>
                    ) : (
                      "-"
                    )}
                  </Td>
                  <Td>{claim.claimEventTypeName || "-"}</Td>
                  <Td>
                    <div className="font-medium text-slate-900">
                      ₹ {claim.claimAmount?.toLocaleString() || 0}
                    </div>
                  </Td>
                  <Td>
                    <div className="text-xs text-slate-600 truncate max-w-[200px]" title={getDivisionDetails(claim)}>
                      {getDivisionDetails(claim)}
                    </div>
                  </Td>
                  <Td>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${
                      claimStatusStyles[claim.claimStatus] || "bg-slate-100 text-slate-700 border-slate-200"
                    }`}>
                      {claim.claimStatusName || "-"}
                    </span>
                  </Td>
                  <Td>{claim.claimDate ? new Date(claim.claimDate).toLocaleDateString() : "-"}</Td>
                  <Td>{claim.incidentDate ? new Date(claim.incidentDate).toLocaleDateString() : "-"}</Td>
                  <Td>{claim.createdDate ? new Date(claim.createdDate).toLocaleDateString() : "-"}</Td>
                  <Td className="text-left">
                    <button
                      onClick={(e) => openDropdown(e, claim)}
                      className="p-2 hover:bg-slate-200 rounded"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        )}
      </table>

      {/*   ACTION DROPDOWN   */}
      {openClaim && (
        <div
          ref={dropdownRef}
          onClick={(e) => e.stopPropagation()}
          className="fixed z-50 w-[220px] bg-white border rounded-lg shadow-lg overflow-hidden"
          style={style}
        >
          <MenuItem
            label="Edit Claim"
            onClick={() => {
              onEdit(openClaim);
              setOpenClaim(null);
            }}
          />
          <MenuItem
            label="Change Status"
            onClick={() => setShowStatusMenu((p) => !p)}
          />

          <MenuItem
            label="Status history"
            onClick={() => {
              setHistoryClaimId(openClaim.claimId);
              setShowHistory(true);
              setOpenClaim(null);
            }}
          />

          <MenuItem
            label="Delete Claim"
            danger
            onClick={() => setConfirmDelete(openClaim)}
          />

          {/* STATUS SUBMENU */}
          {showStatusMenu && (
            <div className="border-t max-h-[200px] overflow-y-auto">
              {statuses
                .filter((s: any) => s.id !== openClaim.claimStatus)
                .map((status: any) => (
                  <button
                    key={`status-${status.id}`}
                    onClick={() => handleStatusChange(status.id)}
                    disabled={updatingStatus}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 flex items-center gap-2"
                  >
                    <Check size={14} className="text-slate-400" />
                    {status.name}
                  </button>
                ))}
            </div>
          )}
        </div>
      )}

      {/*   CONFIRM DELETE   */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-[420px] p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Delete Claim
              </h3>
              <button
                onClick={() => setConfirmDelete(null)}
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this claim?
              <br />
              <span className="text-red-600 font-medium">
                This action cannot be undone.
              </span>
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={isPending}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/*   CLAIM HISTORY DIALOG   */}
      <ClaimHistoryDialog
        open={showHistory}
        onOpenChange={setShowHistory}
        claimId={historyClaimId}
      />
    </div>
  );
};

export default ClaimTable;

/*   HELPERS   */
const Th = ({ children, className = "" }: any) => (
  <th className={`px-4 py-3 text-left font-semibold whitespace-nowrap ${className}`}>
    {children}
  </th>
);

const Td = ({ children }: any) => (
  <td className="px-4 py-3 whitespace-nowrap">{children}</td>
);

const MenuItem = ({ label, onClick, danger = false }: any) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-slate-100 ${
      danger ? "text-red-600 hover:bg-red-50" : ""
    }`}
  >
    {danger && <X size={14} />}
    {label}
  </button>
);
