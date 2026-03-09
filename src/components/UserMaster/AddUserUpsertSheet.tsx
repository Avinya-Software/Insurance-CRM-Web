import React from "react";
import { X } from "lucide-react";
import { UserDetail } from "../../interfaces/UserMaster.interface";

interface Props {
  open: boolean;
  item: UserDetail | null;
  onClose: () => void;
  onSuccess: () => void;
}

const AddUserUpsertSheet = ({ open, item, onClose, onSuccess }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="w-[500px] bg-white h-full shadow-xl flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {item ? "Edit User" : "Add User"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
          <p className="text-gray-500 italic">Upsert form placeholder for {item?.name || "new user"}</p>
          {/* Form implementation would go here */}
          <div className="mt-8 flex gap-3">
            <button 
              onClick={onSuccess}
              className="px-4 py-2 bg-blue-900 text-white rounded"
            >
              Save (Mock Success)
            </button>
            <button 
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserUpsertSheet;
