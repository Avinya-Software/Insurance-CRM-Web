import React, { useState, useRef } from "react";
import { MoreVertical, Pencil } from "lucide-react";
import TableSkeleton from "../common/TableSkeleton";
import Toggle from "../common/Toggle";
import { Segment } from "../../interfaces/segment.interface";

interface Props {
  data: Segment[];
  loading?: boolean;
  page: number;
  pageSize: number;
  onEdit: (item: Segment) => void;
  onStatusChange: (item: Segment) => void;
}

const DROPDOWN_WIDTH = 120;

const SegmentTable = ({ data = [], loading = false, page, pageSize, onEdit, onStatusChange }: Props) => {
  const [openId, setOpenId] = useState<number | null>(null);
  const [style, setStyle] = useState({ top: 0, left: 0 });

  const dropdownRef = useRef<HTMLDivElement>(null);

  const openDropdown = (e: React.MouseEvent<HTMLButtonElement>, item: Segment) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setStyle({ top: rect.bottom + 6, left: rect.right - DROPDOWN_WIDTH });
    setOpenId(item.segmentId);
  };

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            <Th className="text-left">Sr No</Th>
            <Th className="text-left">Segment Name</Th>
            <Th className="text-left">Division</Th>
            <Th className="text-left">Type</Th>
            <Th className="text-left">Status</Th>
            <Th className="text-left">Created Date</Th>
            <Th className="text-center">Action</Th>
          </tr>
        </thead>

        {loading ? (
          <TableSkeleton rows={10} columns={7} />
        ) : (
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-500">
                  No segments found
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.segmentId} className="border-t h-[52px] hover:bg-slate-50">
                  <Td>{(page - 1) * pageSize + index + 1}</Td>
                  <Td>{item.segmentName}</Td>
                  <Td>{item.divisionName}</Td>
                  <Td>
                    {item.segmentTypeName && (
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                        {item.segmentTypeName}
                      </span>
                    )}
                  </Td>
                  <Td>
                    <Toggle 
                      active={item.isActive} 
                      onChange={() => onStatusChange(item)}
                    />
                  </Td>
                  <Td>{new Date(item.createdDate).toLocaleDateString()}</Td>
                  <Td className="text-center">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edit Segment"
                    >
                      <Pencil size={18} />
                    </button>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        )}
      </table>
      
    </div>
  );
};

export default SegmentTable;

/* Helper Components */
const Th = ({ children, className = "" }: any) => (
  <th className={`px-4 py-3 font-semibold text-slate-700 ${className}`}>
    {children}
  </th>
);
const Td = ({ children, className = "" }: any) => (
  <td className={`px-4 py-3 ${className}`}>{children}</td>
);
const MenuItem = ({ label, onClick, icon, danger = false }: any) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 ${
      danger ? "text-red-600 hover:bg-red-50" : "text-slate-700"
    }`}
  >
    {icon}
    {label}
  </button>
);
