import React, { useState, useRef } from "react";
import { MoreVertical } from "lucide-react";
import TableSkeleton from "../common/TableSkeleton";
import Toggle from "../common/Toggle";
import { Segment } from "../../interfaces/segment.interface";

interface Props {
  data: Segment[];
  loading?: boolean;
  page: number;
  pageSize: number;
}

const DROPDOWN_WIDTH = 120;

const SegmentTable = ({ data = [], loading = false, page, pageSize }: Props) => {
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
            <Th>Sr No</Th>
            <Th>Segment Name</Th>
            <Th>Division</Th>
            <Th>Type</Th>
            <Th>Status</Th>
            <Th>Created Date</Th>
            <Th className="text-center">Actions</Th>
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
                      onChange={() => {
                        // TODO: Implement status update if API available
                        console.log("Toggle status for", item.segmentId);
                      }}
                    />
                  </Td>
                  <Td>{new Date(item.createdDate).toLocaleDateString()}</Td>
                  <Td className="text-center">
                    <button
                      onClick={(e) => openDropdown(e, item)}
                      className="p-2 rounded hover:bg-gray-200"
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

      {/* DROPDOWN */}
      {openId && (
        <div
          ref={dropdownRef}
          className="fixed z-50 w-[120px] bg-white border rounded-lg shadow-lg"
          style={style}
          onMouseLeave={() => setOpenId(null)}
        >
          <MenuItem
            label="Edit"
            onClick={() => {
              // Edit logic here if needed
              setOpenId(null);
            }}
          />
          <MenuItem
            label="Delete"
            danger
            onClick={() => {
              // Delete logic here if needed
              setOpenId(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SegmentTable;

/* Helper Components */
const Th = ({ children, className = "" }: any) => (
  <th className={`px-4 py-3 text-left font-semibold text-slate-700 ${className}`}>
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
