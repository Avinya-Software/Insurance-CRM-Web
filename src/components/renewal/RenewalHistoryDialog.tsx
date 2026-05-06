import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useRenewalHistory } from "../../hooks/renewal/useRenewalHistory";
import { format } from "date-fns";
import { 
  Loader2, 
  Calendar, 
  User, 
  Shield, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Building2,
  Tag,
  Layers,
  History as HistoryIcon
} from "lucide-react";

interface RenewalHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policyId: string | null;
}

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700 border-amber-100",
  Renew: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Cancelled: "bg-slate-50 text-slate-500 border-slate-100",
};

const typeStyles = {
  Fresh: "bg-blue-50 text-blue-700 border-blue-100",
  Renewal: "bg-teal-50 text-teal-700 border-teal-100",
  Lost: "bg-rose-50 text-rose-700 border-rose-100",
};

export const RenewalHistoryDialog = ({
  open,
  onOpenChange,
  policyId,
}: RenewalHistoryDialogProps) => {
  const { data, isLoading } = useRenewalHistory(policyId || "");

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    try {
      return format(new Date(dateStr), "dd/MM/yyyy");
    } catch (e) {
      return "-";
    }
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "-";
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1200px] max-h-[90vh] h-auto flex flex-col p-0 border shadow-lg bg-white overflow-hidden">
        <DialogHeader className="p-5 border-b bg-slate-50/50 shrink-0">
          <div className="flex items-center justify-between pr-8">
            <div>
              <DialogTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <HistoryIcon className="h-5 w-5 text-slate-500" />
                Policy Lifecycle History
              </DialogTitle>
              <p className="text-xs text-slate-500 mt-0.5">Historical records of renewals and modifications for this policy.</p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-0 overflow-hidden flex flex-col">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm text-slate-500 font-medium">Loading history logs...</p>
            </div>
          ) : data?.data && data.data.length > 0 ? (
            <div className="overflow-auto max-h-[520px] scrollbar-thin scrollbar-thumb-slate-200">
              <table className="w-full text-left border-collapse table-fixed">
                <thead className="bg-white sticky top-0 z-20 shadow-sm border-b">
                  <tr>
                    <th className="w-[12%] py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Type</th>
                    <th className="w-[18%] py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Client & Policy</th>
                    <th className="w-[20%] py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Company & Division</th>
                    <th className="w-[18%] py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Period / Schedule</th>
                    <th className="w-[20%] py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Premium Details</th>
                    <th className="w-[12%] py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.data.map((record, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-4 align-top">
                        <div className="flex flex-col gap-1">
                          <span className={`w-fit px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${typeStyles[record.type as keyof typeof typeStyles] || ""}`}>
                            {record.type}
                          </span>
                          {record.renewalNo && (
                            <span className="text-[10px] text-slate-400 font-semibold italic">Renewal No: {record.renewalNo}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 truncate">
                            {record.title ? `${record.title} ` : ""}{record.clientName || "-"}
                          </span>
                          <span className="text-xs text-blue-600 font-medium">{record.policyNumber}</span>
                          {record.previousPolicyNumber && (
                            <span className="text-[10px] text-slate-400 mt-1">Prev: {record.previousPolicyNumber}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-700 truncate">{record.companyName || "N/A"}</span>
                          <span className="text-[11px] text-slate-500">{record.divisionName || "No Division"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <div className="grid grid-cols-[max-content_1fr] gap-x-2 gap-y-1 text-xs">
                          <span className="text-slate-400 font-medium">Start:</span>
                          <span className="text-slate-700 font-medium">{formatDate(record.policyStartDate)}</span>
                          <span className="text-slate-400 font-medium">End:</span>
                          <span className="text-slate-900 font-bold">{formatDate(record.policyEndDate || record.nextPremiumDueDate || record.nextDueDate)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 align-top text-right">
                        <div className="flex flex-col items-end">
                          <div className="text-sm font-bold text-slate-900">
                            {formatCurrency(record.annualPremium || record.finalInstallmentPremium)}
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium mt-1">
                            Basic: {formatCurrency(record.basicPremium)}
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium">
                            SA: {formatCurrency(record.sumAssured)}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <div className="flex flex-col gap-2">
                          {record.renewalStatus ? (
                            <span className={`w-fit px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${statusStyles[record.renewalStatus as keyof typeof statusStyles] || ""}`}>
                              {record.renewalStatus}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">No Status</span>
                          )}
                          {record.remark && (
                            <p className="text-[10px] text-slate-400 italic break-words line-clamp-2" title={record.remark}>
                              "{record.remark}"
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50/30">
              <HistoryIcon className="h-12 w-12 text-slate-200 mb-3" />
              <p className="text-slate-500 font-medium italic text-sm">No historical logs found for this policy.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
