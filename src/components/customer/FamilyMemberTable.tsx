import { useState, useRef } from "react";
import { MoreVertical } from "lucide-react";
import { IFamilyMember } from "../../interfaces/family-member.interface";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useUpdateFamilyStatus } from "../../hooks/family-member/useUpdateFamilyStatus";
import TableSkeleton from "../common/TableSkeleton";

/*   CONSTANTS   */
const DROPDOWN_HEIGHT = 160;
const DROPDOWN_WIDTH = 200;

interface Props {
  data: IFamilyMember[];
  loading?: boolean;
  onEdit?: (member: IFamilyMember) => void;
  onDelete?: (member: IFamilyMember) => void;
}
  
const FamilyMemberTable = ({
  data = [],
  loading = false,
  onEdit,
  onDelete,
}: Props) => {
  const [openMember, setOpenMember] = useState<IFamilyMember | null>(null);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateFamilyStatus();
  const [style, setStyle] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(dropdownRef, () => {
    setOpenMember(null);
  });

  const openDropdown = (
    e: React.MouseEvent<HTMLButtonElement>,
    member: IFamilyMember
  ) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const spaceBelow = viewportHeight - rect.bottom;
    const openUpwards = spaceBelow < DROPDOWN_HEIGHT;

    setStyle({
      top: openUpwards ? rect.top - DROPDOWN_HEIGHT - 6 : rect.bottom + 6,
      left: rect.right - DROPDOWN_WIDTH,
    });

    setOpenMember(member);
  };

  const handleAction = (cb?: () => void) => {
    setOpenMember(null);
    if (cb) setTimeout(cb, 0);
  };

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-slate-100 sticky top-0 z-10">
          <tr>
            <Th>Full Name</Th>
            <Th>Relation</Th>
            <Th>Mobile</Th>
            <Th>Whatsapp</Th>
            <Th>Gender</Th>
            <Th>DOB</Th>
            <Th>Aadhaar</Th>
            <Th>PAN</Th>
            <Th>Status</Th>
            <Th>Marriage Status</Th>
            <Th>Created Date</Th>
            <Th className="text-center">Actions</Th>
          </tr>
        </thead>

        {loading ? (
          <TableSkeleton rows={6} columns={11} />
        ) : (
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-12 text-slate-500 font-medium">
                  No family members found
                </td>
              </tr>
            ) : (
              data.map((member) => (
                <tr
                  key={member.familyMemberId}
                  className="border-t h-[52px] hover:bg-slate-50 transition-colors duration-150"
                >
                  <Td className="whitespace-nowrap font-medium text-slate-900">
                    {`${member.firstName} ${member.middleName || ""} ${member.lastName}`.trim()}
                  </Td>
                  <Td>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-gray-100 text-gray-600 border-gray-200">
                      {member.relationWithFamilyHead}
                    </span>
                  </Td>
                  <Td>{member.mobileNumber || "-"}</Td>
                  <Td>{member.whatsappNumber || "-"}</Td>
                  <Td>{member.gender}</Td>
                  <Td className="whitespace-nowrap font-medium text-slate-600">
                    {member.dob ? member.dob.split("T")[0] : "-"}
                  </Td>
                  <Td className="whitespace-nowrap">{member.aadhaarCardNumber || "-"}</Td>
                  <Td className="whitespace-nowrap">{member.panCardNumber || "-"}</Td>
                  <Td>
                    <Toggle 
                      active={member.status} 
                      onChange={() => updateStatus({ familyMemberId: member.familyMemberId, status: !member.status })}
                      loading={isUpdating}
                    />
                  </Td>
                  <Td className="whitespace-nowrap">{member.marriageStatus || "-"}</Td>
                  <Td className="whitespace-nowrap font-medium text-slate-600">
                    {member.createdAt ? member.createdAt.split("T")[0] : "-"}
                  </Td>
                  <Td className="text-center">
                    <button
                      onClick={(e) => openDropdown(e, member)}
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

      {/* ACTION DROPDOWN */}
      {openMember && (
        <div
          ref={dropdownRef}
          onClick={(e) => e.stopPropagation()}
          className="fixed z-50 w-[200px] bg-white border rounded-lg shadow-lg overflow-hidden"
          style={style}
        >
          <MenuItem
            label="Edit Member"
            onClick={() => handleAction(() => onEdit?.(openMember))}
          />
          <MenuItem
            label="Delete Member"
            danger
            onClick={() => handleAction(() => onDelete?.(openMember))}
          />
        </div>
      )}
    </div>
  );
};

export default FamilyMemberTable;

/*   HELPERS   */

const Th = ({ children, className = "" }: any) => (
  <th className={`px-4 py-3 text-left font-semibold ${className}`}>
    {children}
  </th>
);

const Td = ({ children, className = "" }: any) => (
  <td className={`px-4 py-3 ${className}`}>{children}</td>
);

const MenuItem = ({
  label,
  onClick,
  icon,
  danger = false,
}: {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
}) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-slate-100 ${
      danger ? "text-red-600 hover:bg-red-50" : ""
    }`}
  >
    {icon}
    {label}
  </button>
);
const Toggle = ({ active = false, onChange, loading = false }: { active?: boolean; onChange: () => void; loading?: boolean }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      if (!loading) onChange();
    }}
    disabled={loading}
    type="button"
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 transition-all duration-200 ease-in-out focus:outline-none ${
      active 
        ? "bg-blue-600 border-blue-600 shadow-sm" 
        : "bg-white border-blue-100 shadow-[0_0_8px_rgba(37,99,235,0.1)]"
    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-sm transition duration-200 ease-in-out ${
        active 
          ? "translate-x-5 bg-white" 
          : "translate-x-0 bg-slate-300"
      }`}
    />
  </button>
);
