import { useState, useRef } from "react";
import { MoreVertical, X } from "lucide-react";
import type { Policy } from "../../interfaces/policy.interface";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useDeletePolicy } from "../../hooks/policy/useDeletePolicy";
import TableSkeleton from "../common/TableSkeleton";

const DROPDOWN_HEIGHT = 120;
const DROPDOWN_WIDTH = 180;

interface Props {
  data: Policy[];
  loading?: boolean;
  onEdit: (policy: Policy) => void;
}

const PolicyTable = ({
  data = [],
  loading = false,
  onEdit,
}: Props) => {
  const [openPolicy, setOpenPolicy] =
    useState<Policy | null>(null);

  const [confirmDelete, setConfirmDelete] =
    useState<Policy | null>(null);

  const [style, setStyle] = useState({
    top: 0,
    left: 0,
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dropdownRef, () => setOpenPolicy(null));

  const { mutate: deletePolicy, isPending } =
    useDeletePolicy();

  const openDropdown = (
    e: React.MouseEvent<HTMLButtonElement>,
    policy: Policy
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

    setOpenPolicy(policy);
  };

  const handleEdit = () => {
    if (!openPolicy) return;
    const p = openPolicy;
    setOpenPolicy(null);
    setTimeout(() => onEdit(p), 0);
  };

  const handleDelete = () => {
    if (!confirmDelete) return;

    deletePolicy(confirmDelete.policyId, {
      onSuccess: () => {
        setConfirmDelete(null);
        setOpenPolicy(null);
      },
    });
  };

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-slate-100 sticky top-0 z-10">
          <tr>
            {/* <Th>Policy No</Th> */}
            <Th>Policy Type</Th>
            <Th>Insurer</Th>
            <Th>Product</Th>
            <Th>Policy Status</Th>
            <Th>Start</Th>
            <Th>End</Th>
            <Th>Net Premium</Th>
            <Th>Gross Premium</Th>
            <Th className="text-center">Actions</Th>
          </tr>
        </thead>

        {/* ================= BODY ================= */}
        {loading ? (
          <TableSkeleton rows={6} columns={9} />
        ) : (
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="text-center py-12 text-slate-500"
                >
                  No policies found
                </td>
              </tr>
            ) : (
              data.map((p) => (
                <tr
                  key={p.policyId}
                  className="border-t h-[52px] hover:bg-slate-50"
                >
                  {/* <Td>{p.policyNumber}</Td> */}
                  <Td>{p.policyTypeName}</Td>
                  <Td>{p.insurerName}</Td>
                  <Td>{p.productName}</Td>
                  <Td>{p.policyStatusName}</Td>
                  <Td>{p.startDate?.split("T")[0]}</Td>
                  <Td>{p.endDate?.split("T")[0]}</Td>
                  <Td>{p.premiumNet}</Td>
                  <Td>{p.premiumGross}</Td>

                  <Td className="text-center">
                    <button
                      onClick={(e) => openDropdown(e, p)}
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
      {openPolicy && (
        <div
          ref={dropdownRef}
          className="fixed z-50 w-[180px] bg-white border rounded-lg shadow-lg"
          style={style}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem label="Edit Policy" onClick={handleEdit} />

          <MenuItem
            label="Delete Policy"
            danger
            onClick={() => setConfirmDelete(openPolicy)}
          />
        </div>
      )}

      {/* ================= CONFIRM DELETE MODAL ================= */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-[420px] p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Delete Policy
              </h3>
              <button
                onClick={() => setConfirmDelete(null)}
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this policy?
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
    </div>
  );
};

export default PolicyTable;

/* ---------- HELPERS ---------- */

const Th = ({ children }: any) => (
  <th className="px-4 py-3 text-left font-semibold">
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
      danger
        ? "text-red-600 hover:bg-red-50"
        : ""
    }`}
  >
    {danger && <X size={14} />}
    {label}
  </button>
);
