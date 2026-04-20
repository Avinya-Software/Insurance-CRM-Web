import { useState } from "react";
import { useBranches } from "../hooks/branch/useBranches";
import { useUpdateBranchStatus } from "../hooks/branch/useUpdateBranchStatus";
import BranchTable from "../components/branch/BranchTable";
import Pagination from "../components/leads/Pagination";
import BranchUpsertModal from "../components/policy/BranchUpsertModal";
import toast, { Toaster } from "react-hot-toast";
import { Branch } from "../interfaces/branch.interface";

const BranchPage = () => {
  const [filters, setFilters] = useState({
    pageNumber: 1,
    pageSize: 10,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const { data, isLoading, refetch } = useBranches(filters);
  const { mutate: updateStatus } = useUpdateBranchStatus();

  const branches = data?.data?.data || [];
  const totalCount = data?.data?.totalRecords || 0;

  const handleSuccess = (resData: any) => {
    toast.success(resData?.statusMessage || (editingBranch ? "Branch updated successfully!" : "Branch added successfully!"));
    setIsModalOpen(false);
    setEditingBranch(null);
    refetch();
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingBranch(null);
    setIsModalOpen(true);
  };

  const handleStatusChange = (branch: Branch) => {
    updateStatus(
      { id: branch.id, status: !branch.status },
      {
        onSuccess: (res: any) => {
          toast.success(res?.statusMessage || "Status updated successfully!");
          refetch();
        },
        onError: () => {
          toast.error("Failed to update status");
        },
      }
    );
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="bg-white rounded-lg border shadow-sm">
        {/*   HEADER   */}
        <div className="px-4 py-4 border-b bg-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-serif font-semibold text-slate-900">
                Branches
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {totalCount} total branches
              </p>
            </div>
            <div className="text-right">
              <button
                className="inline-flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-800 transition-colors"
                onClick={handleAdd}
              >
                <span className="text-lg leading-none">+</span>
                Add Branch
              </button>
            </div>
          </div>
        </div>

        <div className="min-h-[400px]">
          <BranchTable 
            data={branches} 
            loading={isLoading} 
            page={filters.pageNumber}
            pageSize={filters.pageSize}
            onEdit={handleEdit}
            onStatusChange={handleStatusChange}
          />
        </div>

        {/*   PAGINATION   */}
        <div className="border-t px-4 py-3">
          <Pagination
            page={filters.pageNumber}
            totalPages={Math.ceil(totalCount / filters.pageSize) || 1}
            onChange={(page) =>
              setFilters({ ...filters, pageNumber: page })
            }
          />
        </div>

        <BranchUpsertModal 
          open={isModalOpen}
          editingBranch={editingBranch}
          onClose={() => {
            setIsModalOpen(false);
            setEditingBranch(null);
          }}
          onSuccess={handleSuccess}
        />
      </div>
    </>
  );
};

export default BranchPage;
