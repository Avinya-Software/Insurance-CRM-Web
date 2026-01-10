import { useState, useRef } from "react";
import { MoreVertical } from "lucide-react";
import { useOutsideClick } from "../../hooks/useOutsideClick";

const DROPDOWN_WIDTH = 160;

interface Renewal {
  renewalId: string;
  renewalDate: string;
  renewalPremium: number;
  status: string;
  customerName: string;
  policyCode: string;
}

interface Props {
  data: Renewal[];
  loading?: boolean;
  onEdit: (renewal: Renewal) => void;
}

const statusStyles: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Renewed: "bg-green-100 text-green-700 border-green-200",
  Lost: "bg-red-100 text-red-700 border-red-200",
};

const RenewalTable = ({
  data = [],
  loading,
  onEdit,
}: Props) => {
  const [openRow, setOpenRow] = useState<Renewal | null>(null);
  const [style, setStyle] = useState({ top: 0, left: 0 });

  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dropdownRef, () => setOpenRow(null));

  const openDropdown = (
    e: React.MouseEvent<HTMLButtonElement>,
    row: Renewal
  ) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();

    setStyle({
      top: rect.bottom + 6,
      left: rect.right - DROPDOWN_WIDTH,
    });

    setOpenRow(row);
  };

  const handleEdit = () => {
    if (!openRow) return;
    const r = openRow;
    setOpenRow(null);
    setTimeout(() => onEdit(r), 0);
  };

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-slate-100 sticky top-0 z-10">
          <tr>
            <Th>Customer</Th>
            <Th>Policy Code</Th>
            <Th>Renewal Date</Th>
            <Th>Premium</Th>
            <Th>Status</Th>
            <Th className="text-center">Actions</Th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="text-center py-10">
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="text-center py-10 text-slate-500"
              >
                No renewals found
              </td>
            </tr>
          ) : (
            data.map((r) => (
              <tr
                key={r.renewalId}
                className="border-t h-[52px] hover:bg-slate-50"
              >
                <Td>{r.customerName}</Td>
                <Td>{r.policyCode}</Td>
                <Td>
                  {new Date(r.renewalDate).toLocaleDateString()}
                </Td>
                <Td>₹ {r.renewalPremium}</Td>

                <Td>
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${
                      statusStyles[r.status] ??
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </Td>

                <Td className="text-center">
                  <button
                    onClick={(e) => openDropdown(e, r)}
                    className="p-2 rounded hover:bg-slate-200"
                  >
                    <MoreVertical size={16} />
                  </button>
                </Td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/*  DROPDOWN  */}
      {openRow && (
        <div
          ref={dropdownRef}
          className="fixed z-50 w-[160px] bg-white border rounded-lg shadow-lg"
          style={style}
        >
          <MenuItem label="Edit Renewal" onClick={handleEdit} />
        </div>
      )}
    </div>
  );
};

export default RenewalTable;

/*  HELPERS  */

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
