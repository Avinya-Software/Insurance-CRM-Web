import { useState } from "react";
import { useBanks } from "../hooks/bank/useBanks";
import { useUpdateBankStatus } from "../hooks/bank/useUpdateBankStatus";
import BankTable from "../components/bank/BankTable";
import Pagination from "../components/leads/Pagination";
import BankUpsertModal from "../components/policy/BankUpsertModal";
import toast, { Toaster } from "react-hot-toast";
import { Bank } from "../interfaces/bank.interface";

const BankPage = () => {
  const [filters, setFilters] = useState({
    pageNumber: 1,
    pageSize: 10,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<Bank | null>(null);

  const { data, isLoading, refetch } = useBanks(filters);
  const { mutate: updateStatus } = useUpdateBankStatus();

  const banks = data?.data?.data || [];
  const totalCount = data?.data?.totalRecords || 0;

  const handleSuccess = (resData: any) => {
    toast.success(resData?.statusMessage || (editingBank ? "Bank updated successfully!" : "Bank added successfully!"));
    setIsModalOpen(false);
    setEditingBank(null);
    refetch();
  };

  const handleEdit = (bank: Bank) => {
    setEditingBank(bank);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingBank(null);
    setIsModalOpen(true);
  };

  const handleStatusChange = (bank: Bank) => {
    updateStatus(
      { id: bank.id, status: !bank.status },
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
                Banks
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {totalCount} total banks
              </p>
            </div>
            <div className="text-right">
              <button
                className="inline-flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-800 transition-colors"
                onClick={handleAdd}
              >
                <span className="text-lg leading-none">+</span>
                Add Bank
              </button>
            </div>
          </div>
        </div>

        <div className="min-h-[400px]">
          <BankTable 
            data={banks} 
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

        <BankUpsertModal 
          open={isModalOpen}
          editingBank={editingBank}
          onClose={() => {
            setIsModalOpen(false);
            setEditingBank(null);
          }}
          onSuccess={handleSuccess}
        />
      </div>
    </>
  );
};

export default BankPage;
