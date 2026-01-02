import { useState, useRef } from "react";
import { MoreVertical } from "lucide-react";
import type { Lead } from "../../interfaces/lead.interface";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import TableSkeleton from "../common/TableSkeleton";

const DROPDOWN_HEIGHT = 160;
const DROPDOWN_WIDTH = 210;

interface LeadTableProps {
  data: Lead[];
  loading?: boolean; // ✅ NEW
  onEdit: (lead: Lead) => void;
  onAdd: () => void;
  onCreateFollowUp?: (lead: Lead) => void;
  onViewFollowUps?: (lead: Lead) => void;
  onRowClick?: (lead: Lead) => void;
}

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
  const [style, setStyle] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dropdownRef, () => setOpenLead(null));

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
  };

  const handleAction = (cb: () => void) => {
    setOpenLead(null);
    setTimeout(cb, 0);
  };

  return (
    <div className="relative">
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
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>

        {/* ================= BODY ================= */}
        {loading ? (
          <TableSkeleton />
        ) : (
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-12 text-slate-500"
                >
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
                  <Td>{lead.leadStatus}</Td>
                  <Td>{lead.leadSource}</Td>
                  <Td>
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </Td>

                  <Td className="text-right">
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

      {/* ================= DROPDOWN ================= */}
      {openLead && (
        <div
          ref={dropdownRef}
          onClick={(e) => e.stopPropagation()}
          className="fixed z-50 w-[210px] bg-white border rounded-lg shadow-lg overflow-hidden"
          style={{ top: style.top, left: style.left }}
        >
          {openLead.leadStatus !== "Lost" &&
            openLead.leadStatus !== "Converted" && (
              <>
                <MenuItem
                  label="Edit Lead"
                  onClick={() =>
                    handleAction(() => onEdit(openLead))
                  }
                />

                <MenuItem
                  label="Create Follow Up"
                  onClick={() =>
                    handleAction(() =>
                      onCreateFollowUp?.(openLead)
                    )
                  }
                />
              </>
            )}

          <MenuItem
            label="View Follow Ups"
            onClick={() =>
              handleAction(() =>
                onViewFollowUps?.(openLead)
              )
            }
          />
        </div>
      )}
    </div>
  );
};

/* ---------- Helpers ---------- */

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
}: {
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
  >
    {label}
  </button>
);

export default LeadTable;
