import { useState, useRef } from "react";
import { MoreVertical } from "lucide-react";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import TableSkeleton from "../common/TableSkeleton";

const DROPDOWN_HEIGHT = 80;
const DROPDOWN_WIDTH = 180;

interface Props {
  data: any[];
  loading?: boolean; // ✅ NEW
  onEdit: (insurer: any) => void;
  onAddProduct: (insurer: any) => void;
}

const InsurerTable = ({
  data = [],
  loading = false,
  onEdit,
  onAddProduct,
}: Props) => {
  const [openInsurer, setOpenInsurer] = useState<any | null>(null);
  const [style, setStyle] = useState({ top: 0, left: 0 });

  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dropdownRef, () => setOpenInsurer(null));

  const openDropdown = (
    e: React.MouseEvent<HTMLButtonElement>,
    insurer: any
  ) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setStyle({
      top: rect.bottom + 6,
      left: rect.right - DROPDOWN_WIDTH,
    });
    setOpenInsurer(insurer);
  };

  const handleEdit = () => {
    if (!openInsurer) return;
    const i = openInsurer;
    setOpenInsurer(null);
    setTimeout(() => onEdit(i), 0);
  };

  const handleAddProduct = () => {
    if (!openInsurer) return;
    const i = openInsurer;
    setOpenInsurer(null);
    setTimeout(() => onAddProduct(i), 0);
  };

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-slate-100 sticky top-0 z-10">
          <tr>
            <Th>Name</Th>
            <Th>Short Code</Th>
            <Th>Portal</Th>
            <Th>Username</Th>
            <Th className="text-center">Actions</Th>
          </tr>
        </thead>

        {/* ================= BODY ================= */}
        {loading ? (
          <TableSkeleton rows={6} columns={5} />
        ) : (
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-12 text-slate-500"
                >
                  No insurers found
                </td>
              </tr>
            ) : (
              data.map((i) => (
                <tr
                  key={i.insurerId}
                  className="border-t h-[52px] hover:bg-slate-50"
                >
                  <Td>{i.insurerName}</Td>
                  <Td>{i.shortCode}</Td>
                  <Td>{i.portalUrl}</Td>
                  <Td>{i.portalUsername}</Td>

                  <Td className="text-center">
                    <button
                      onClick={(e) => openDropdown(e, i)}
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
      {openInsurer && (
        <div
          ref={dropdownRef}
          className="fixed z-50 w-[180px] bg-white border rounded-lg shadow-lg"
          style={style}
        >
          <MenuItem label="Edit Insurer" onClick={handleEdit} />
          <MenuItem label="Add Product" onClick={handleAddProduct} />
        </div>
      )}
    </div>
  );
};

export default InsurerTable;

/* ---------- HELPERS ---------- */

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
}: {
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
  >
    {label}
  </button>
);
