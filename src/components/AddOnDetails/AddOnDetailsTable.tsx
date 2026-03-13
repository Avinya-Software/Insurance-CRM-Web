import React, { useState, useRef } from "react";
import { MoreVertical, X } from "lucide-react";
import TableSkeleton from "../common/TableSkeleton";
import { useDeleteAddOnDetail } from "../../hooks/AddOnDetails/useDeleteAddOnDetail";
import { AddOnDetail } from "../../interfaces/addondetails.interface";

interface Props {
  data: AddOnDetail[];
  loading?: boolean;
  onEdit: (item: AddOnDetail) => void;
}

const DROPDOWN_WIDTH = 180;

const AddOnDetailsTable = ({
  data = [],
  loading = false,
  onEdit,
}: Props) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<AddOnDetail | null>(null);
  const [style, setStyle] = useState({ top: 0, left: 0 });

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { mutate: deleteAddOnDetail, isPending } = useDeleteAddOnDetail();

  const openDropdown = (
    e: React.MouseEvent<HTMLButtonElement>,
    item: AddOnDetail
  ) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setStyle({
      top: rect.bottom + 6,
      left: rect.right - DROPDOWN_WIDTH,
    });
    setOpenId(item.id || null);
  };

  const handleEdit = (item: AddOnDetail) => {
    setOpenId(null);
    onEdit(item);
  };

  const handleDelete = () => {
    if (!confirmDelete || !confirmDelete.id) return;

    deleteAddOnDetail(confirmDelete.id, {
      onSuccess: () => {
        setConfirmDelete(null);
        setOpenId(null);
      },
    });
  };

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-slate-100 sticky top-0 z-10">
          <tr>
            <Th>Name</Th>
            <Th>Insurance Type</Th>
            <Th className="text-center">Actions</Th>
          </tr>
        </thead>

        {loading ? (
          <TableSkeleton rows={6} columns={3} />
        ) : (
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-12 text-slate-500"
                >
                  No add-on details found
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="border-t h-[52px] hover:bg-slate-50"
                >
                  <Td>{item.name}</Td>
                  <Td>{item.insuranceTypeName}</Td>
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
              const item = data.find(i => i.id === openId);
              if (item) handleEdit(item);
            }} 
          />
          <MenuItem
            label="Delete"
            danger
            onClick={() => {
              const item = data.find(i => i.id === openId);
              if (item) setConfirmDelete(item);
              setOpenId(null);
            }}
          />
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-[420px] p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Delete Add-On Detail
              </h3>
              <button
                onClick={() => setConfirmDelete(null)}
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this item?
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

export default AddOnDetailsTable;

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
