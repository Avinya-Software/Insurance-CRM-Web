import { useState, useRef } from "react";
import { MoreVertical } from "lucide-react";
import type { Policy } from "../../interfaces/policy.interface";
import { useOutsideClick } from "../../hooks/useOutsideClick";

const DROPDOWN_HEIGHT = 48;
const DROPDOWN_WIDTH = 180;

interface Props {
  data: Policy[];
  onEdit: (policy: Policy) => void;
}

const PolicyTable = ({ data = [], onEdit }: Props) => {
  const [openPolicy, setOpenPolicy] = useState<Policy | null>(null);
  const [style, setStyle] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dropdownRef, () => setOpenPolicy(null));

  const openDropdown = (
    e: React.MouseEvent<HTMLButtonElement>,
    policy: Policy
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

    setOpenPolicy(policy);
  };

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-slate-100">
          <tr>
            <Th>Policy No</Th>
            <Th>Start</Th>
            <Th>End</Th>
            <Th>Premium</Th>
            <Th className="text-center">Actions</Th>
          </tr>
        </thead>

        <tbody>
          {data.map((p) => (
            <tr key={p.policyId} className="border-t h-[52px]">
              <Td>{p.policyNumber}</Td>
              <Td>{p.startDate?.split("T")[0]}</Td>
              <Td>{p.endDate?.split("T")[0]}</Td>
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
          ))}
        </tbody>
      </table>

      {/* DROPDOWN */}
      {openPolicy && (
        <div
          ref={dropdownRef}
          className="fixed z-50 w-[180px] bg-white border rounded-lg shadow-lg"
          style={style}
        >
          <MenuItem
            label="Edit Policy"
            onClick={() => {
              setOpenPolicy(null);
              onEdit(openPolicy);
            }}
          />
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
