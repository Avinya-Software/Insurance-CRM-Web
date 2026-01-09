import { useState } from "react";
import {
  CheckCircle,
  Loader2,
  UserCheck,
  XCircle
} from "lucide-react";
import { usePendingAdvisors } from "../hooks/admin/usePendingAdvisors";
import { useApproveAdvisor } from "../hooks/admin/useApproveAdvisor";
import { useDeleteAdvisor } from "../hooks/admin/useDeleteAdvisor";

type PendingAdvisor = {
  userId: string;
  advisorId: string;
  fullName: string;
  email: string;
  registeredAt?: string;
};

type ActionType = "approve" | "reject" | null;

const AdminDashboard = () => {
  const { data, isLoading, isError } = usePendingAdvisors();
  const approveMutation = useApproveAdvisor();
  const deleteMutation = useDeleteAdvisor();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<ActionType>(null);

  const advisors: PendingAdvisor[] = data?.data || [];

  const openApproveDialog = (userId: string) => {
    setSelectedUserId(userId);
    setActionType("approve");
  };

  const openRejectDialog = (userId: string) => {
    setSelectedUserId(userId);
    setActionType("reject");
  };

  const closeDialog = () => {
    setSelectedUserId(null);
    setActionType(null);
  };

  const confirmAction = () => {
    if (!selectedUserId || !actionType) return;

    if (actionType === "approve") {
      approveMutation.mutate(selectedUserId, {
        onSuccess: closeDialog
      });
    }

    if (actionType === "reject") {
      deleteMutation.mutate(selectedUserId, {
        onSuccess: closeDialog
      });
    }
  };

  const isActionLoading =
    approveMutation.isPending || deleteMutation.isPending;

  return (
    <div className="min-h-screen bg-blue-50 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-700">
            Approve or reject newly registered advisors
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-700" />
          </div>
        )}

        {/* Error */}
        {isError && (
          <p className="text-red-600">
            Failed to load pending advisors
          </p>
        )}

        {/* Empty */}
        {!isLoading && advisors.length === 0 && (
          <div className="bg-white rounded-lg p-8 text-center shadow">
            <UserCheck className="w-12 h-12 mx-auto text-green-600 mb-3" />
            <p className="text-gray-800 font-medium">
              No pending advisors 🎉
            </p>
          </div>
        )}

        {/* Table */}
        {advisors.length > 0 && (
          <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {advisors.map((advisor) => (
                  <tr key={advisor.userId} className="border-t">
                    <td className="px-6 py-4 font-medium">
                      {advisor.fullName}
                    </td>
                    <td className="px-6 py-4">
                      {advisor.email}
                    </td>
                    <td className="px-6 py-4 flex gap-3">
                      {/* APPROVE */}
                      <button
                        onClick={() =>
                          openApproveDialog(advisor.userId)
                        }
                        className="inline-flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>

                      {/* REJECT */}
                      <button
                        onClick={() =>
                          openRejectDialog(advisor.userId)
                        }
                        className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CONFIRMATION MODAL */}
      {selectedUserId && actionType && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {actionType === "approve"
                ? "Confirm Approval"
                : "Confirm Rejection"}
            </h3>

            <p className="text-gray-700 mb-6">
              {actionType === "approve"
                ? "Are you sure you want to approve this advisor?"
                : "Are you sure you want to reject this advisor?"}
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
                className={`px-4 py-2 text-white rounded flex items-center gap-2 disabled:opacity-60 ${
                  actionType === "approve"
                    ? "bg-green-700 hover:bg-green-800"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isActionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
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
    </div>
  );
};

export default AdminDashboard;
