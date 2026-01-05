import { useState, useRef } from "react";
import { MoreVertical } from "lucide-react";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import TableSkeleton from "../common/TableSkeleton";

/* ===================== TYPES ===================== */

interface Claim {
  claimId: string;
  status: string;
  claimAmount: number;
  createdAt: string;

  customer: {
    fullName: string;
    email: string;
  };

  policy: {
    policyNumber: string;
    policyStatus: string;
  };

  insurer: {
    insurerName: string;
  };

  product: {
    productName: string;
  };

  claimType: string;
  claimStage: string;
  claimHandler: string;
}

interface Props {
  data: Claim[];
  loading?: boolean;
  onEdit: (claim: Claim) => void;
}

const DROPDOWN_HEIGHT = 120;
const DROPDOWN_WIDTH = 180;

/* ===================== COMPONENT ===================== */

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
            <Th>Policy</Th>
            <Th>Policy Status</Th>
            <Th>Insurer</Th>
            <Th>Product</Th>
            <Th>Claim Type</Th>
            <Th>Stage</Th>
            <Th>Handler</Th>
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
                <td colSpan={12} className="text-center py-12">
                  No claims found
                </td>
              </tr>
            ) : (
              data.map((claim) => (
                <tr
                  key={claim.claimId}
                  className="border-t hover:bg-slate-50"
                >
                  <Td>
                    {/* <div className="font-medium">
                      {claim.customer.fullName}
                    </div> */}
                    <div className="text-xs text-gray-500">
                      {claim.customer.email}
                    </div>
                  </Td>

                  <Td>{claim.policy.policyNumber}</Td>
                  <Td>{claim.policy.policyStatus}</Td>
                  <Td>{claim.insurer.insurerName}</Td>
                  <Td>{claim.product.productName}</Td>
                  <Td>{claim.claimType}</Td>
                  <Td>{claim.claimStage}</Td>
                  <Td>{claim.claimHandler}</Td>
                  <Td>₹ {claim.claimAmount}</Td>
                  <Td>{claim.status}</Td>

                  <Td>
                    {new Date(claim.createdAt).toLocaleDateString()}
                  </Td>

                  <Td className="text-left">
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
          <MenuItem
            label="Edit Claim"
            onClick={() => onEdit(openClaim)}
          />
        </div>
      )}
    </div>
  );
};

export default ClaimTable;

/* ===================== HELPERS ===================== */

const Th = ({ children }: any) => (
  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
    {children}
  </th>
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
