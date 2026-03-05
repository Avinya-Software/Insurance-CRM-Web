import { useState, useRef } from "react";
import { MoreVertical, X } from "lucide-react";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import TableSkeleton from "../common/TableSkeleton";
import { useDeleteAgency } from "../../hooks/Agency/useDeleteAgency";

const DROPDOWN_WIDTH = 180;

interface RowData {
  id: string;
  agencyName?: string;
  agencyCode?: string;
  mobileNumber?: string;
  email?: string;
  city?: string;
  modelName?: string;
  makeName?: string;
}

interface Props {
  data: any[];
  loading?: boolean;
  type: number;
  onEdit: (row: any) => void;
  onDeleteMake: (id: string) => Promise<boolean>;
  onDeleteModel: (id: string) => Promise<boolean>;
  onDeleteSuccess?: () => void;
}

const MakeModelTable = ({
  data = [],
  loading = false,
  onEdit,
  type,
  onDeleteSuccess,
}: Props) => {

  const [openRow, setOpenRow] = useState<RowData | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<RowData | null>(null);

  const [dropdownStyle, setDropdownStyle] = useState({ top: 0, left: 0 });

  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dropdownRef, () => setOpenRow(null));

  const { deleteAgency, deleting } = useDeleteAgency();

  const openDropdown = (
    e: React.MouseEvent<HTMLButtonElement>,
    row: RowData
  ) => {
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();

    setDropdownStyle({
      top: rect.bottom + 6,
      left: rect.right - DROPDOWN_WIDTH,
    });

    setOpenRow(row);
  };

  const handleEdit = () => {
    if (!openRow) return;

    const row = openRow;
    setOpenRow(null);

    setTimeout(() => onEdit(row), 0);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;

    const success = await deleteAgency(confirmDelete.id);

    if (success) {
      setConfirmDelete(null);
      setOpenRow(null);
      onDeleteSuccess?.();
    }
  };

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm border-collapse">

        <thead className="bg-slate-100 sticky top-0 z-10">
        <tr>

          {type === 1 && <Th>Make Name</Th>}

          {type === 2 && (
            <>
              <Th>Make Name</Th>
              <Th>Model Name</Th>
            </>
          )}

          <Th className="text-center">Actions</Th>

          </tr>
        </thead>

        {loading ? (
          <TableSkeleton rows={6} columns={3} />
        ) : (
          <tbody>

            {data.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-12 text-slate-500">
                  No records found
                </td>
              </tr>
            ) : (

              data.map((row) => (
                <tr key={row.id} className="border-t hover:bg-slate-50">
  
                  {type === 1 && <Td>{row.makeName}</Td>}
  
                  {type === 2 && (
                    <>
                      <Td>{row.makeName}</Td>
                      <Td>{row.modelName}</Td>
                    </>
                  )}
  
                  <Td className="text-center">
                    <button
                      className="text-blue-600"
                      onClick={() => onEdit(row)}
                    >
                      Edit
                    </button>
                  </Td>
  
                </tr>
              ))

            )}
          </tbody>
        )}

      </table>

      {/* Dropdown */}

      {openRow && (
        <div
          ref={dropdownRef}
          className="fixed z-50 w-[180px] bg-white border rounded shadow-lg"
          style={dropdownStyle}
          onClick={e => e.stopPropagation()}
        >
          <MenuItem label="Edit" onClick={handleEdit} />

          <MenuItem
            label="Delete"
            danger
            onClick={() => setConfirmDelete(openRow)}
          />
        </div>
      )}

      {/* Delete Modal */}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">

          <div className="bg-white rounded-lg w-[420px] p-6">

            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold">Delete Record</h3>

              <button onClick={() => setConfirmDelete(null)}>
                <X size={18}/>
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete?
              <br/>
              <span className="text-red-600 font-medium">
                This action cannot be undone.
              </span>
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded"
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

export default MakeModelTable;

/* Helpers */

const Th = ({ children }: any) => (
  <th className="px-4 py-3 text-left">{children}</th>
);

const Td = ({ children }: any) => (
  <td className="px-4 py-3">{children}</td>
);

const MenuItem = ({ label, onClick, danger }: any) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-2 text-sm flex gap-2 hover:bg-slate-100 ${
      danger ? "text-red-600 hover:bg-red-50" : ""
    }`}
  >
    {danger && <X size={14}/>}
    {label}
  </button>
);