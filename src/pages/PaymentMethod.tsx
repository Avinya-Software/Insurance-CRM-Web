import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Pagination from "../components/leads/Pagination";
import { PaymentMethod } from "../interfaces/payment.interface";
import { usePaymentMethods } from "../hooks/payment/usePaymentMethods";
import { useUpdatePaymentMethodStatus } from "../hooks/payment/useUpdatePaymentMethodStatus";
import PaymentMethodTable from "../components/payment/PaymentMethodTable";
import PaymentMethodUpsertModal from "../components/payment/PaymentMethodUpsertModal";

const PaymentMethodPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PaymentMethod | null>(null);

  const { data, isLoading, refetch } = usePaymentMethods(page, pageSize, search);
  const { mutate: updateStatus } = useUpdatePaymentMethodStatus();

  const methods = data?.data?.data ?? [];
  const totalRecords = data?.data?.totalRecords ?? 0;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;

  const handleEdit = (item: PaymentMethod) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleStatusChange = (item: PaymentMethod) => {
    updateStatus(
      { id: item.id, status: !item.status },
      {
        onSuccess: (res: any) => {
          toast.success(res?.statusMessage || "Status updated successfully");
          refetch();
        },
      }
    );
  };

  return (
    <>
      <div className="bg-white rounded-lg border shadow-sm">
        {/* HEADER */}
        <div className="px-4 py-4 border-b bg-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-serif font-semibold text-slate-900 tracking-tight">Payment Methods</h1>
              <p className="text-slate-600 text-sm mt-1">{totalRecords} total methods</p>
            </div>
            <div className="text-right">
              <button
                onClick={handleAdd}
                className="inline-flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded text-sm font-medium transition-all"
              >
                <span className="text-lg leading-none">+</span>
                Add Method
              </button>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search methods..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="min-h-[400px]">
          <PaymentMethodTable
            data={methods}
            loading={isLoading}
            page={page}
            pageSize={pageSize}
            onEdit={handleEdit}
            onStatusChange={handleStatusChange}
          />
        </div>

        {/* PAGINATION */}
        <div className="px-4 py-3 border-t">
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={(p) => setPage(p)}
          />
        </div>
      </div>

      <PaymentMethodUpsertModal
        open={isModalOpen}
        item={selectedItem}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        onSuccess={() => refetch()}
      />
    </>
  );
};

export default PaymentMethodPage;
