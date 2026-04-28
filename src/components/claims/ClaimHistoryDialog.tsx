import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useClaimHistory } from "../../hooks/claim/useClaimHistory";
import { format } from "date-fns";
import { 
  Loader2, 
  History as HistoryIcon,
  Calendar,
  Clock,
  User,
  Shield,
  FileText
} from "lucide-react";

interface ClaimHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  claimId: string | null;
}

const claimStatusStyles: Record<number, string> = {
  1: "bg-blue-100 text-blue-700 border-blue-200",         // Registered
  2: "bg-amber-100 text-amber-700 border-amber-200",       // Under Review
  3: "bg-purple-100 text-purple-700 border-purple-200",    // Survey In Progress
  4: "bg-emerald-100 text-emerald-700 border-emerald-200", // Approved
  5: "bg-red-100 text-red-700 border-red-200",             // Rejected
  6: "bg-indigo-100 text-indigo-700 border-indigo-200",    // Paid
  7: "bg-slate-100 text-slate-700 border-slate-200",       // Closed
};

export const ClaimHistoryDialog = ({
  open,
  onOpenChange,
  claimId,
}: ClaimHistoryDialogProps) => {
  const { data, isLoading } = useClaimHistory(claimId || "");

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    try {
      return format(new Date(dateStr), "dd/MM/yyyy hh:mm a");
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
      <DialogContent className="max-w-[1000px] max-h-[90vh] h-auto flex flex-col p-0 border shadow-lg bg-white overflow-hidden">
        <DialogHeader className="p-5 border-b bg-slate-50/50 shrink-0">
          <div className="flex items-center justify-between pr-8">
            <div>
              <DialogTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <HistoryIcon className="h-5 w-5 text-slate-500" />
                Claim Status History
              </DialogTitle>
              <p className="text-xs text-slate-500 mt-0.5">Timeline of status changes and updates for this claim.</p>
            </div>
            {data?.data?.[0] && (
              <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-full border border-slate-100 shadow-sm">
                  <Shield className="h-3.5 w-3.5 text-blue-500" />
                  <span>{data.data[0].claimNumber}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-full border border-slate-100 shadow-sm">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span>{data.data[0].customerName}</span>
                </div>
              </div>
            )}
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
                    <th className="w-[15%] py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                    <th className="w-[15%] py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="w-[45%] py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Remarks / Description</th>
                    <th className="w-[25%] py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Claim Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.data.map((record: any, index: number) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-4 align-top">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            {format(new Date(record.createdDate), "dd/MM/yyyy")}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                            <Clock className="h-3 w-3 text-slate-400" />
                            {format(new Date(record.createdDate), "hh:mm a")}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${claimStatusStyles[record.status] || "bg-slate-50 text-slate-600 border-slate-100"}`}>
                          {record.statusName}
                        </span>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <div className="flex flex-col gap-1.5">
                          {record.remark && (
                            <p className="text-sm text-slate-700 font-medium leading-relaxed">
                              {record.remark}
                            </p>
                          )}
                          {record.description && (
                            <div className="flex gap-1.5">
                              <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                              <p className="text-xs text-slate-500 italic break-words line-clamp-3">
                                {record.description}
                              </p>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 align-top text-right">
                        <div className="flex flex-col items-end">
                          <div className="text-xs font-bold text-slate-900">
                            Amount: {formatCurrency(record.claimAmount)}
                          </div>
                          {record.approvedAmount > 0 && (
                            <div className="text-[10px] text-emerald-600 font-semibold mt-1">
                              Approved: {formatCurrency(record.approvedAmount)}
                            </div>
                          )}
                          <div className="text-[10px] text-slate-500 mt-1">
                            {record.policyNumber}
                          </div>
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
              <p className="text-slate-500 font-medium italic text-sm">No status history found for this claim.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
