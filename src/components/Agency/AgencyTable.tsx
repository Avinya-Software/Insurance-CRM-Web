import { useState, useRef } from "react";
import { MoreVertical, X } from "lucide-react";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import TableSkeleton from "../common/TableSkeleton";
import { useDeleteAgency } from "../../hooks/Agency/useDeleteAgency";

const DROPDOWN_WIDTH = 180;

interface Agency {
  id: string;
  agencyName: string;
  agencyCode: string;
  mobileNumber?: string;
  email?: string;
  city?: string;
}

interface Props {
  data: Agency[];
  loading?: boolean;
  onEdit: (agency: Agency) => void;
  onDeleteSuccess?: () => void;
}

const AgencyTable = ({
  data = [],
  loading = false,
  onEdit,
  onDeleteSuccess,
}: Props) => {
  const [openAgency, setOpenAgency] = useState<Agency | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Agency | null>(null);

  const [dropdownStyle, setDropdownStyle] = useState({ top: 0, left: 0 });

  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dropdownRef, () => setOpenAgency(null));

  const { deleteAgency, deleting } = useDeleteAgency();

  /* OPEN DROPDOWN */

  const openDropdown = (
    e: React.MouseEvent<HTMLButtonElement>,
    agency: Agency
  ) => {
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();

    setDropdownStyle({
      top: rect.bottom + 6,
      left: rect.right - DROPDOWN_WIDTH,
    });

    setOpenAgency(agency);
  };

  /* EDIT */

  const handleEdit = () => {
    if (!openAgency) return;

    const agency = openAgency;
    setOpenAgency(null);

    setTimeout(() => onEdit(agency), 0);
  };

  /* DELETE */

  const handleDelete = async () => {
    if (!confirmDelete) return;

    const success = await deleteAgency(confirmDelete.id);

    if (success) {
      setConfirmDelete(null);
      setOpenAgency(null);
      onDeleteSuccess?.(); // reload list
    }
  };

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-slate-100 sticky top-0 z-10">
          <tr>
            <Th>Agency Name</Th>
            <Th>Agency Code</Th>
            <Th>Mobile</Th>
            <Th>Email</Th>
            <Th>City</Th>
            <Th className="text-center">Actions</Th>
          </tr>
        </thead>

        {loading ? (
          <TableSkeleton rows={6} columns={6} />
        ) : (
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-500">
                  No agencies found
                </td>
              </tr>
            ) : (
              data.map((agency) => (
                <tr
                  key={agency.id}
                  className="border-t hover:bg-slate-50 transition"
                >
                  <Td>{agency.agencyName}</Td>
                  <Td>{agency.agencyCode}</Td>
                  <Td>{agency.mobileNumber || "-"}</Td>
                  <Td>{agency.email || "-"}</Td>
                  <Td>{agency.city || "-"}</Td>

                  <Td className="text-center">
                    <button
                      onClick={(e) => openDropdown(e, agency)}
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

      {/* DROPDOWN */}

      {openAgency && (
  <div
    ref={dropdownRef}
    className="fixed z-50 w-[180px] bg-white border rounded-lg shadow-lg"
    style={dropdownStyle}
    onClick={(e) => e.stopPropagation()}
  >
    <MenuItem label="Edit Agency" onClick={handleEdit} />

    <MenuItem
      label="Delete Agency"
      danger
      onClick={() => setConfirmDelete(openAgency)}
    />
  </div>
)}

      {/* DELETE CONFIRM MODAL */}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-[420px] p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Delete Agency</h3>

              <button onClick={() => setConfirmDelete(null)}>
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this agency?
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
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencyTable;

/* TABLE HELPERS */

const Th = ({ children }: any) => (
  <th className="px-4 py-3 text-left font-semibold text-slate-700">
    {children}
  </th>
);

const Td = ({ children }: any) => (
  <td className="px-4 py-3">{children}</td>
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
    onClick={onClick}
    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-slate-100 ${
      danger ? "text-red-600 hover:bg-red-50" : ""
    }`}
  >
    {danger && <X size={14} />}
    {label}
  </button>
);