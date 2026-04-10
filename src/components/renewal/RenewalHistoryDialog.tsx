import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useRenewalHistory } from "../../hooks/renewal/useRenewalHistory";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

interface RenewalHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policyId: string | null;
}

const policyTypeStyles: Record<string, string> = {
  Fresh: "bg-blue-100 text-blue-700 border-blue-200",
  Renewal: "bg-green-100 text-green-700 border-green-200",
  Lost: "bg-red-100 text-red-700 border-red-200",
};

export const RenewalHistoryDialog = ({
  open,
  onOpenChange,
  policyId,
}: RenewalHistoryDialogProps) => {
  const { data, isLoading } = useRenewalHistory(policyId || "");

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd-MM-yyyy");
    } catch (e) {
      return "-";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-2 shrink-0">
          <DialogTitle className="text-xl font-semibold text-slate-800">Policy History</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-visible p-6 pt-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
              <p className="text-slate-500 font-medium animate-pulse">Fetching history...</p>
            </div>
          ) : data?.data && data.data.length > 0 ? (
            <div className="relative border rounded-xl shadow-sm bg-white overflow-hidden">
              <div className="overflow-auto max-h-[380px]">
                <table className="w-full text-sm text-center border-collapse">
                  <thead className="bg-slate-50 text-slate-700 sticky top-0 z-20 border-b shadow-sm">
                  <tr>
                    <th className="px-4 py-3 font-semibold first:rounded-tl-xl whitespace-nowrap">Type</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Policy Number</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Division</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Company</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Policy Start</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Next Due</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap last:rounded-tr-xl">Premium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.data.map((record, index) => (
                    <tr 
                      key={index} 
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span 
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${
                            policyTypeStyles[record.type] || "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {record.type}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap font-medium text-slate-900">{record.policyNumber}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-slate-600 font-medium">{record.divisionName}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-slate-600">{record.companyName}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-slate-600">{formatDate(record.policyStartDate)}</td>
                      <td className="px-4 py-4 whitespace-nowrap font-semibold text-slate-900">{formatDate(record.nextDueDate)}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-slate-900">₹{record.finalInstallmentPremium.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-500 font-medium">Basic: ₹{record.basicPremium.toLocaleString()}</span>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50/50 rounded-xl border border-dashed flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Loader2 className="h-6 w-6" />
              </div>
              <p className="text-slate-500 font-medium">No history available for this policy.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
