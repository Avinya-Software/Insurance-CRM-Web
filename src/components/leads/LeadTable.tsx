import { useState, useRef } from "react";
import { MoreVertical, X, Check } from "lucide-react";
import type { Lead, LeadDetails } from "../../interfaces/lead.interface";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useDeleteLead } from "../../hooks/lead/useDeleteLead";
import { useUpdateLeadStatus } from "../../hooks/lead/useUpdateLeadStatus";
import { useQuery } from "@tanstack/react-query";
import { getLeadByIdApi, getLeadStatusesApi } from "../../api/lead.api";
import TableSkeleton from "../common/TableSkeleton";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "../ui/dialog";


/*   STATUS BADGE STYLES   */

const leadStatusStyles: Record<string, string> = {
  New: "bg-slate-100 text-slate-700 border-slate-200",
  Contacted: "bg-blue-100 text-blue-700 border-blue-200",
  Qualified: "bg-purple-100 text-purple-700 border-purple-200",
  "Follow Up": "bg-amber-100 text-amber-700 border-amber-200",
  Converted: "bg-green-100 text-green-700 border-green-200",
  Lost: "bg-red-100 text-red-700 border-red-200",
};

/*   TYPES   */

const DROPDOWN_HEIGHT = 280;
const DROPDOWN_WIDTH = 230;

interface LeadTableProps {
  data: Lead[];
  loading?: boolean;
  onEdit: (lead: Lead) => void;
  onAdd: () => void;
  onCreateFollowUp?: (lead: Lead) => void;
  onViewFollowUps?: (lead: Lead) => void;
  onRowClick?: (lead: Lead) => void;
  onAddCustomer?: (lead: Lead) => void;
}

/*   COMPONENT   */

const LeadTable = ({
  data = [],
  loading = false,
  onEdit,
  onAdd,
  onCreateFollowUp,
  onViewFollowUps,
  onRowClick,
}: LeadTableProps) => {
  const [openLead, setOpenLead] = useState<Lead | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Lead | null>(null);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const { data: leadDetails, isLoading: loadingLeadDetails } = useQuery<LeadDetails | null>({
    queryKey: ["lead-details", selectedLeadId],
    queryFn: () => (selectedLeadId ? getLeadByIdApi(selectedLeadId) : Promise.resolve(null)),
    enabled: !!selectedLeadId && isViewOpen,
  });
  

  const [style, setStyle] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dropdownRef, () => {
    setOpenLead(null);
    setShowStatusMenu(false);
  });

  const { mutate: deleteLead, isPending } = useDeleteLead();
  const { mutate: updateStatus, isPending: updatingStatus } =
    useUpdateLeadStatus();

  /* 🔥 Fetch statuses */
  const { data: statuses = [] } = useQuery({
    queryKey: ["lead-statuses"],
    queryFn: getLeadStatusesApi,
  });
  const openDropdown = (
    e: React.MouseEvent<HTMLButtonElement>,
    lead: Lead
  ) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const spaceBelow = viewportHeight - rect.bottom;
    const openUpwards = spaceBelow < DROPDOWN_HEIGHT;

    setStyle({
      top: openUpwards
        ? rect.top - DROPDOWN_HEIGHT - 6
        : rect.bottom + 6,
      left: rect.right - DROPDOWN_WIDTH,
    });

    setOpenLead(lead);
    setShowStatusMenu(false);
  };

  const handleAction = (cb: () => void) => {
    setOpenLead(null);
    setShowStatusMenu(false);
    setTimeout(cb, 0);
  };

  const handleViewDetails = () => {
    if (!openLead) return;
    setSelectedLeadId(openLead.leadId);
    setIsViewOpen(true);
    setOpenLead(null);
  };

  const handleDelete = () => {
    if (!confirmDelete) return;

    deleteLead(confirmDelete.leadId, {
      onSuccess: () => {
        setConfirmDelete(null);
        setOpenLead(null);
      },
    });
  };

  const handleStatusChange = (statusId: number) => {
    if (!openLead) return;

    updateStatus(
      {
        leadId: openLead.leadId,
        statusId,
      },
      {
        onSuccess: () => {
          setOpenLead(null);
          setShowStatusMenu(false);
        },
      }
    );
  };

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-slate-100 sticky top-0 z-10">
          <tr>
            <Th>Lead No</Th>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Mobile</Th>
            <Th>Status</Th>
            <Th>Source</Th>
            <Th>Created</Th>
            <Th className="text-left">Actions</Th>
          </tr>
        </thead>

        {loading ? (
          <TableSkeleton rows={6} columns={8} />
        ) : (
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-slate-500">
                  No leads found
                </td>
              </tr>
            ) : (
              data.map((lead) => (
                <tr
                  key={lead.leadId}
                  onClick={() =>
                    onRowClick
                      ? onRowClick(lead)
                      : onViewFollowUps?.(lead)
                  }
                  className="border-t h-[52px] hover:bg-slate-50 cursor-pointer"
                >
                  <Td>{lead.leadNo}</Td>
                  <Td>{lead.fullName}</Td>
                  <Td>{lead.email}</Td>
                  <Td>{lead.mobile}</Td>

                  <Td>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        leadStatusStyles[lead.leadStatusName]
                      }`}
                    >
                      {lead.leadStatusName}
                    </span>
                  </Td>

                  <Td>{lead.leadSourceName}</Td>

                  <Td>
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </Td>

                  <Td className="text-left">
                    <button
                      onClick={(e) => openDropdown(e, lead)}
                      className="p-2 rounded hover:bg-slate-200"
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
      {openLead && (
        <div
          ref={dropdownRef}
          onClick={(e) => e.stopPropagation()}
          className="fixed z-50 w-[230px] bg-white border rounded-lg shadow-lg overflow-hidden"
          style={{ top: style.top, left: style.left }}
        >
          {openLead.leadStatusName !== "Lost" &&
            openLead.leadStatusName !== "Converted" && (
              <>
                <MenuItem
                  label="Edit Lead"
                  onClick={() => handleAction(() => onEdit(openLead))}
                />

                <MenuItem
                  label="Create Follow Up"
                  onClick={() =>
                    handleAction(() =>
                      onCreateFollowUp?.(openLead)
                    )
                  }
                />

                <MenuItem
                  label="Change Status"
                  onClick={() => setShowStatusMenu((p) => !p)}
                />
              </>
            )}

          <MenuItem
            label="View Follow Ups"
            onClick={() =>
              handleAction(() => onViewFollowUps?.(openLead))
            }
          />

          <MenuItem label="View Details" onClick={handleViewDetails} />

          <MenuItem
            label="Delete Lead"
            danger
            onClick={() => setConfirmDelete(openLead)}
          />



          {/* 🔥 STATUS SUBMENU */}
          {showStatusMenu && (
            <div className="border-t mt-1">
              {statuses
                .filter((s) => s.name !== openLead.leadStatusName)
                .map((status) => (
                  <button
                    key={status.id}
                    onClick={() =>
                      handleStatusChange(status.id)
                    }
                    disabled={updatingStatus}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 flex items-center gap-2"
                  >
                    <Check size={14} />
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
                Delete Lead
              </h3>
              <button onClick={() => setConfirmDelete(null)}>
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this lead?
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

     {/* VIEW DETAILS DIALOG */}
{isViewOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
      <DialogContent className="relative w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle>
          <strong> Lead No: </strong> {leadDetails?.leadNo || "..."} | <strong>Status: </strong> {leadDetails?.leadStatusName || "..."}
          </DialogTitle>
          <button
            className="absolute right-4 top-4 p-1 rounded hover:bg-slate-200"
            onClick={() => setIsViewOpen(false)}
          >
            <X size={18} />
          </button>
        </DialogHeader>

        {loadingLeadDetails ? (
          <div className="py-10 text-center text-gray-500">Loading...</div>
        ) : leadDetails ? (
          <div className="mt-4 space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <strong>Full Name:</strong> {leadDetails.fullName}
              </div>
              <div>
                <strong>Mobile:</strong> {leadDetails.mobile || "N/A"}
              </div>
              <div>
                <strong>Email:</strong> {leadDetails.email || "N/A"}
              </div>
              <div className="sm:col-span-2">
                <strong>Address:</strong>
                <p className="mt-1 bg-muted/40 rounded-md p-2">{leadDetails.address || "N/A"}</p>
              </div>
              <div>
                <strong>Lead Source:</strong> {leadDetails.leadSourceName}
              </div>
              <div className="sm:col-span-2">
                <strong>Notes:</strong>
                <p className="mt-1 bg-muted/40 rounded-md p-2">{leadDetails.notes || "N/A"}</p>
              </div>
              <div>
                <strong>Created At:</strong>{" "}
                {leadDetails.createdAt
                  ? new Date(leadDetails.createdAt).toLocaleString()
                  : "N/A"}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-10 text-center text-red-500">Failed to load lead details.</div>
        )}
      </DialogContent>
    </Dialog>
  </div>
)}


    </div>
  );
};

export default LeadTable;

/*   HELPERS   */

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
    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-slate-100 ${
      danger ? "text-red-600 hover:bg-red-50" : ""
    }`}
  >
    {danger && <X size={14} />}
    {label}
  </button>
);
