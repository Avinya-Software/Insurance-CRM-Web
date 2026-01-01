import { useState, useRef } from "react";
import { MoreVertical } from "lucide-react";
import type { Customer } from "../../interfaces/customer.interface";
import { useOutsideClick } from "../../hooks/useOutsideClick";

const DROPDOWN_HEIGHT = 80;
const DROPDOWN_WIDTH = 180;

interface CustomerTableProps {
  data: Customer[];
  onEdit: (customer: Customer) => void;
  onAddPolicy: (customer: Customer) => void; // ✅ REQUIRED
}

const CustomerTable = ({
  data = [],
  onEdit,
  onAddPolicy, // ✅ FIX: destructured here
}: CustomerTableProps) => {
  const [openCustomer, setOpenCustomer] =
    useState<Customer | null>(null);

  const [style, setStyle] = useState({ top: 0, left: 0 });

  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dropdownRef, () => setOpenCustomer(null));

  /* ---------------- DROPDOWN POSITION ---------------- */

  const openDropdown = (
    e: React.MouseEvent<HTMLButtonElement>,
    customer: Customer
  ) => {
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

    setOpenCustomer(customer);
  };

  /* ---------------- ACTIONS ---------------- */

  const handleEdit = () => {
    if (!openCustomer) return;
    const customer = openCustomer;
    setOpenCustomer(null);
    setTimeout(() => onEdit(customer), 0);
  };

  const handleAddPolicy = () => {
    if (!openCustomer) return;
    const customer = openCustomer;
    setOpenCustomer(null);
    setTimeout(() => onAddPolicy(customer), 0);
  };

  /* ================= UI ================= */

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-slate-100 sticky top-0 z-10">
          <tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Mobile</Th>
            <Th>Address</Th>
            <Th className="text-center">Actions</Th>
          </tr>
        </thead>

        <tbody>
          {data.map((c) => (
            <tr
              key={c.customerId}
              className="border-t h-[52px] hover:bg-slate-50"
            >
              <Td>{c.fullName}</Td>
              <Td>{c.email || "-"}</Td>
              <Td>{c.primaryMobile}</Td>
              <Td>{c.address || "-"}</Td>

              <Td className="text-center">
                <button
                  onClick={(e) => openDropdown(e, c)}
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
                No customers found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ================= DROPDOWN ================= */}
      {openCustomer && (
        <div
          ref={dropdownRef}
          className="fixed z-50 w-[180px] bg-white border rounded-lg shadow-lg"
          style={style}
        >
          <MenuItem label="Edit Customer" onClick={handleEdit} />
          <MenuItem label="Add Policy" onClick={handleAddPolicy} />
        </div>
      )}
    </div>
  );
};

export default CustomerTable;

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
