import { useState } from "react";
import {
  CheckCircle,
  Loader2,
  XCircle
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import { usePendingAdvisors } from "../hooks/admin/usePendingAdvisors";
import { useApproveAdvisor } from "../hooks/admin/useApproveAdvisor";
import { useDeleteAdvisor } from "../hooks/admin/useDeleteAdvisor";
import TableSkeleton from "../components/common/TableSkeleton";

type ActionType = "approve" | "reject" | null;

const AdminDashboard = () => {
  const { data, isLoading } = usePendingAdvisors();
  const approveMutation = useApproveAdvisor();
  const deleteMutation = useDeleteAdvisor();

  const [selectedUserId, setSelectedUserId] =
    useState<string | null>(null);
  const [actionType, setActionType] =
    useState<ActionType>(null);

  const advisors = data?.data || [];

  const confirmAction = () => {
    if (!selectedUserId || !actionType) return;

    if (actionType === "approve") {
      approveMutation.mutate(selectedUserId, {
        onSuccess: closeDialog,
      });
    } else {
      deleteMutation.mutate(selectedUserId, {
        onSuccess: closeDialog,
      });
    }
  };

  const closeDialog = () => {
    setSelectedUserId(null);
    setActionType(null);
  };

  const isActionLoading =
    approveMutation.isPending ||
    deleteMutation.isPending;

  return (
    <>
      <Toaster position="top-right" />

      <div className="bg-white rounded-lg border">
        {/*   HEADER   */}
        <div className="px-4 py-5 border-b bg-gray-100">
          <h1 className="text-4xl font-serif font-semibold text-slate-900">
            Pending Advisors
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {advisors.length} awaiting approval
          </p>
        </div>

        {/*   TABLE   */}
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 sticky top-0 z-10">
              <tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th className="text-center">Actions</Th>
              </tr>
            </thead>

            {isLoading ? (
              <TableSkeleton rows={6} columns={3} />
            ) : (
              <tbody>
                {advisors.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center py-12 text-slate-500"
                    >
                      No pending advisors 🎉
                    </td>
                  </tr>
                ) : (
                  advisors.map((a: any) => (
                    <tr
                      key={a.userId}
                      className="border-t h-[52px] hover:bg-slate-50"
                    >
                      <Td className="font-medium">
                        {a.fullName}
                      </Td>
                      <Td>{a.email}</Td>
                      <Td className="text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedUserId(a.userId);
                              setActionType("approve");
                            }}
                            className="inline-flex items-center gap-2 bg-green-700 text-white px-3 py-1.5 rounded text-sm hover:bg-green-800"
                          >
                            <CheckCircle size={16} />
                            Approve
                          </button>

                          <button
                            onClick={() => {
                              setSelectedUserId(a.userId);
                              setActionType("reject");
                            }}
                            className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700"
                          >
                            <XCircle size={16} />
                            Reject
                          </button>
                        </div>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>

      {/*   CONFIRM MODAL   */}
      {selectedUserId && actionType && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-[420px] p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-3">
              {actionType === "approve"
                ? "Approve Advisor"
                : "Reject Advisor"}
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to{" "}
              {actionType === "approve"
                ? "approve"
                : "reject"}{" "}
              this advisor?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeDialog}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={confirmAction}
                disabled={isActionLoading}
                className={`px-4 py-2 text-white rounded disabled:opacity-50 ${
                  actionType === "approve"
                    ? "bg-green-700 hover:bg-green-800"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isActionLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    Processing...
                  </span>
                ) : actionType === "approve" ? (
                  "Approve"
                ) : (
                  "Reject"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;

/*  HELPERS  */
const Th = ({ children, className = "" }: any) => (
  <th
    className={`px-4 py-3 text-left font-semibold text-slate-700 ${className}`}
  >
    {children}
  </th>
);

const Td = ({ children, className = "" }: any) => (
  <td className={`px-4 py-3 ${className}`}>{children}</td>
);
