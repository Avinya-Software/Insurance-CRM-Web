import { useState, useRef } from "react";
import { MoreVertical } from "lucide-react";
import { useOutsideClick } from "../../hooks/useOutsideClick";

const DROPDOWN_HEIGHT = 80;
const DROPDOWN_WIDTH = 180;

interface Props {
  data: any[];
  onEdit: (insurer: any) => void;
  onAddProduct: (insurer: any) => void; // ✅ NEW
}

const InsurerTable = ({
  data = [],
  onEdit,
  onAddProduct, // ✅ IMPORTANT
}: Props) => {
  const [openInsurer, setOpenInsurer] = useState<any | null>(null);
  const [style, setStyle] = useState({ top: 0, left: 0 });

  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dropdownRef, () => setOpenInsurer(null));

  const openDropdown = (
    e: React.MouseEvent<HTMLButtonElement>,
    insurer: any
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setStyle({
      top: rect.bottom + 6,
      left: rect.right - DROPDOWN_WIDTH,
    });
    setOpenInsurer(insurer);
  };

  /* ---------------- ACTIONS ---------------- */

  const handleEdit = () => {
    if (!openInsurer) return;
    const insurer = openInsurer;
    setOpenInsurer(null);
    setTimeout(() => onEdit(insurer), 0);
  };

  const handleAddProduct = () => {
    if (!openInsurer) return;
    const insurer = openInsurer;
    setOpenInsurer(null);
    setTimeout(() => onAddProduct(insurer), 0);
  };

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-slate-100">
          <tr>
            <Th>Name</Th>
            <Th>Short Code</Th>
            <Th>Portal</Th>
            <Th>Username</Th>
            <Th className="text-center">Actions</Th>
          </tr>
        </thead>

        <tbody>
          {data.map((i) => (
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
          ))}

          {!data.length && (
            <tr>
              <td colSpan={5} className="text-center py-6 text-slate-500">
                No insurers found
              </td>
            </tr>
          )}
        </tbody>
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

const Td = ({ children, className = "" }: any) => (
  <td className={`px-4 py-3 ${className}`}>{children}</td>
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
