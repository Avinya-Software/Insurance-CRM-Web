
import React, { useState, useRef } from "react";
import { MoreVertical, X, Mail, Phone, Shield } from "lucide-react";
import TableSkeleton from "../common/TableSkeleton";
import { Company } from "../../interfaces/company.interface";
import { useDeleteCompany } from "../../hooks/Company/useDeleteCompany";

interface Props {
  data: Company[];
  loading?: boolean;
  onEdit: (item: Company) => void;
}

const DROPDOWN_WIDTH = 180;

const CompanyTable = ({ data = [], loading = false, onEdit }: Props) => {

  const [openId, setOpenId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Company | null>(null);
  const [style, setStyle] = useState({ top: 0, left: 0 });

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { mutate: deleteCompany, isPending } = useDeleteCompany();

  const showValue = (v: any) => (v === null || v === undefined || v === "" ? "-" : v);

  const openDropdown = (
    e: React.MouseEvent<HTMLButtonElement>,
    item: Company
  ) => {

    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();

    setStyle({
      top: rect.bottom + 6,
      left: rect.right - DROPDOWN_WIDTH,
    });

    setOpenId(item.companyId || null);
  };

  const handleEdit = (item: Company) => {
    setOpenId(null);
    onEdit(item);
  };

  const handleDelete = () => {

    if (!confirmDelete || !confirmDelete.companyId) return;

    deleteCompany(confirmDelete.companyId, {
      onSuccess: () => {
        setConfirmDelete(null);
        setOpenId(null);
      },
    });
  };

  return (
    <div className="relative overflow-x-auto">

      <table className="w-full text-sm border-collapse">

        {/* HEADER */}
        <thead className="bg-slate-100 sticky top-0 z-10">
          <tr>
            <Th>Company Name</Th>
            <Th>Email</Th>
            <Th>Mobile Number</Th>
            <Th>Policy Type</Th>
            <Th className="text-center">Actions</Th>
          </tr>
        </thead>

        {loading ? (
          <TableSkeleton rows={6} columns={4} />
        ) : (
          <tbody>

            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-slate-500">
                  No companies found
                </td>
              </tr>
            ) : (

              data.map((item) => (
                <tr
                  key={item.companyId}
                  className="border-t h-[52px] hover:bg-slate-50"
                >

                  {/* COMPANY NAME */}
                  <Td>{item.companyName}</Td>

                  {/* CONTACT INFO */}
                  <Td>{showValue(item.email)}</Td>
                  <Td>{showValue(item.mobileNumber)}</Td>

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

                  {/* ACTION */}
                  <Td className="text-center">

                    <button
                      onClick={(e) => openDropdown(e, item)}
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

      {/* DROPDOWN */}
      {openId && (
        <div
          ref={dropdownRef}
          className="fixed z-50 w-[180px] bg-white border rounded-lg shadow-lg"
          style={style}
          onMouseLeave={() => setOpenId(null)}
        >

          <MenuItem
            label="Edit"
            onClick={() => {
              const item = data.find((i) => i.companyId === openId);
              if (item) handleEdit(item);
            }}
          />

          <MenuItem
            label="Delete"
            danger
            onClick={() => {
              const item = data.find((i) => i.companyId === openId);
              if (item) setConfirmDelete(item);
              setOpenId(null);
            }}
          />

        </div>
      )}

      {/* DELETE MODAL */}
      {confirmDelete && (

        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">

          <div className="bg-white rounded-lg w-[420px] p-6 shadow-lg">

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Delete Company</h3>

              <button onClick={() => setConfirmDelete(null)}>
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {confirmDelete.companyName}
              </span>
              ?
              <br />
              <span className="text-red-600 font-medium">
                This action cannot be undone.
              </span>
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={isPending}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default CompanyTable;



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