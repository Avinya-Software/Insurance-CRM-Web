import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useUpsertBank } from "../../hooks/bank/useUpsertBank";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: (newBank: any) => void;
}

const BankUpsertModal = ({ open, onClose, onSuccess }: Props) => {
  const [name, setName] = useState("");
  const { mutate: upsertBank, isPending } = useUpsertBank();

  useEffect(() => {
    if (open) {
      setName("");
    }
  }, [open]);

  const handleSubmit = () => {
    if (!name.trim()) return;

    upsertBank({ name }, {
      onSuccess: (res: any) => {
        onSuccess(res.data || res);
        onClose();
      },
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-hidden">
      <div className="bg-white rounded-xl shadow-2xl w-[600px] animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-800 px-6 py-4 flex items-center justify-between text-white rounded-t-xl">
          <h3 className="font-bold uppercase tracking-wider text-xs">Add New Bank</h3>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5 transition-all">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Bank Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                autoFocus
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded text-sm transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none"
                placeholder="Enter bank name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-3 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending || !name.trim()}
            className="px-8 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold rounded shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isPending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Add Bank"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankUpsertModal;
