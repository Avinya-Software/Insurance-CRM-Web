import React, { useState, useRef } from "react";
import { Pencil, X } from "lucide-react";
import TableSkeleton from "../common/TableSkeleton";
import Toggle from "../common/Toggle";
import { Product } from "../../interfaces/product.interface";


interface Props {
  data: Product[];
  loading?: boolean;
  page: number;
  pageSize: number;
  onEdit: (item: Product) => void;
  onStatusChange: (item: Product) => void;
}

const DROPDOWN_WIDTH = 180;

const ProductTable = ({ data = [], loading = false, page, pageSize, onEdit, onStatusChange }: Props) => {

  const showValue = (v: any) =>
    v === null || v === undefined || v === "" ? "-" : v;

  return (
    <div className="relative overflow-x-auto">

      <table className="w-full text-sm border-collapse">

        {/* HEADER */}
        <thead className="bg-slate-100 sticky top-0 z-10">
          <tr>
            <Th>Sr No</Th>
            <Th>Product Name</Th>
            <Th>Company</Th>
            <Th>Division</Th>
            <Th>Segment</Th>
            <Th>Status</Th>
            <Th>Insurance Type</Th>
            <Th>Policy Type</Th>
            <Th>Created At</Th>
            <Th className="text-center">Action</Th>
          </tr>
        </thead>

        {loading ? (
          <TableSkeleton rows={6} columns={5} />
        ) : (
          <tbody>

            {data.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-12 text-slate-500">
                  No products found
                </td>
              </tr>
            ) : (

              data.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-t h-[52px] hover:bg-slate-50"
                >
                  <Td>{(page - 1) * pageSize + index + 1}</Td>

                  {/* PRODUCT NAME */}
                  <Td>{item.productName}</Td>

                  {/* COMPANY */}
                  <Td>{showValue(item.companyName)}</Td>

                  {/* DIVISION */}
                  <Td>{showValue(item.divisionName)}</Td>

                  {/* SEGMENT */}
                  <Td>{showValue(item.segmentName)}</Td>

                  {/* STATUS */}
                  <Td>
                    <Toggle
                      active={item.status}
                      onChange={() => onStatusChange(item)}
                    />
                  </Td>

                  {/* INSURANCE TYPE */}
                  <Td>{showValue(item.insuranceName || item.insuranceType)}</Td>

                  {/* POLICY TYPE */}
                  <Td>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                        item.policyType
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {item.policyType ? "Life" : "General"}
                    </span>
                  </Td>

                  {/* CREATED AT */}
                  <Td>
                    {item.createdDate ? new Date(item.createdDate).toLocaleDateString('en-GB') : "-"}
                  </Td>

                  {/* ACTION */}
                  <Td className="text-center">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edit Product"
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

export default ProductTable;

/* TABLE COMPONENTS */

const Th = ({ children, className = "" }: any) => (
  <th className={`px-4 py-3 text-left font-semibold text-slate-700 ${className}`}>
    {children}
  </th>
);

const Td = ({ children, className = "" }: any) => (
  <td className={`px-4 py-3 ${className}`}>{children}</td>
);

const MenuItem = ({
  label,
  onClick,
  danger = false,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-slate-100 ${
      danger ? "text-red-600 hover:bg-red-50" : ""
    }`}
  >
    {danger && <X size={14} />}
    {label}
  </button>
);