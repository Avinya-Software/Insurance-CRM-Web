import { useState, useRef } from "react";
import { MoreVertical } from "lucide-react";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import TableSkeleton from "../common/TableSkeleton";

interface Claim {
  claimId: string;
  claimType: string;
  status: string;
  claimAmount: number;
  createdAt: string;
  customer?: {
    fullName: string;
  };
}

interface Props {
  data: Claim[];
  loading?: boolean;
  onEdit: (claim: Claim) => void;
}

const DROPDOWN_HEIGHT = 120;
const DROPDOWN_WIDTH = 180;

const ClaimTable = ({ data, loading = false, onEdit }: Props) => {
  const [openClaim, setOpenClaim] = useState<Claim | null>(null);
  const [style, setStyle] = useState({ top: 0, left: 0 });

  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dropdownRef, () => setOpenClaim(null));

  const openDropdown = (
    e: React.MouseEvent<HTMLButtonElement>,
    claim: Claim
  ) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();

    setStyle({
      top: rect.bottom + 6,
      left: rect.right - DROPDOWN_WIDTH,
    });

    setOpenClaim(claim);
  };

  return (
    <div className="relative">
      <table className="w-full text-sm">
        <thead className="bg-slate-100">
          <tr>
            <Th>Customer</Th>
            <Th>Claim Type</Th>
            <Th>Amount</Th>
            <Th>Status</Th>
            <Th>Created</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>

        {loading ? (
          <TableSkeleton />
        ) : (
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  No claims found
                </td>
              </tr>
            ) : (
              data.map((claim) => (
                <tr
                  key={claim.claimId}
                  className="border-t hover:bg-slate-50"
                >
                  <Td>{claim.customer?.fullName}</Td>
                  <Td>{claim.claimType}</Td>
                  <Td>₹ {claim.claimAmount}</Td>
                  <Td>{claim.status}</Td>
                  <Td>
                    {new Date(claim.createdAt).toLocaleDateString()}
                  </Td>
                  <Td className="text-right">
                    <button
                      onClick={(e) => openDropdown(e, claim)}
                      className="p-2 hover:bg-slate-200 rounded"
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

      {openClaim && (
        <div
          ref={dropdownRef}
          className="fixed bg-white border rounded shadow z-50"
          style={style}
        >
          <MenuItem label="Edit Claim" onClick={() => onEdit(openClaim)} />
        </div>
      )}
    </div>
  );
};

export default ClaimTable;

/* ---------- Helpers ---------- */

const Th = ({ children }: any) => (
  <th className="px-4 py-3 text-left font-semibold">{children}</th>
);

const Td = ({ children, className = "" }: any) => (
  <td className={`px-4 py-3 ${className}`}>{children}</td>
);

const MenuItem = ({ label, onClick }: any) => (
  <button
    onClick={onClick}
    className="w-full text-left px-4 py-2 hover:bg-gray-100"
  >
    {label}
  </button>
);
