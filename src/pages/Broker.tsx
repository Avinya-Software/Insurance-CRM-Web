import { useState } from "react";
import { Toaster } from "react-hot-toast";
import Pagination from "../components/leads/Pagination";
import { Broker } from "../interfaces/broker.interface";
import { useBrokers } from "../hooks/broker/useBrokers";
import { useUpdateBrokerStatus } from "../hooks/broker/useUpdateBrokerStatus";
import BrokerTable from "../components/broker/BrokerTable";
import BrokerUpsertSheet from "../components/broker/BrokerUpsertSheet";

const BrokerPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [openSheet, setOpenSheet] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Broker | null>(null);

  const { data, isLoading, refetch } = useBrokers(page, pageSize, search);
  const { mutate: updateStatus } = useUpdateBrokerStatus();

  const brokers = data?.data?.data ?? [];
  const totalPages = Math.ceil((data?.data?.totalRecords ?? 0) / pageSize);
  const totalRecords = data?.data?.totalRecords ?? 0;

  const handleEdit = (item: Broker) => {
    setSelectedItem(item);
    setOpenSheet(true);
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setOpenSheet(true);
  };

  const handleStatusChange = (item: Broker) => {
    updateStatus({ id: item.id, status: !item.status });
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="bg-white rounded-lg border shadow-sm">
        {/* HEADER */}
        <div className="px-4 py-4 border-b bg-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-serif font-semibold text-slate-900 tracking-tight">Brokers</h1>
              <p className="text-slate-600 text-sm mt-1">{totalRecords} total brokers</p>
            </div>
            <div className="text-right">
              <button
                onClick={handleAdd}
                className="inline-flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded text-sm font-medium transition-all"
              >
                <span className="text-lg leading-none">+</span>
                Add Broker
              </button>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search by name..."
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
        <BrokerTable
          data={brokers}
          loading={isLoading}
          page={page}
          pageSize={pageSize}
          onEdit={handleEdit}
          onStatusChange={handleStatusChange}
        />

        {/* PAGINATION */}
        <div className="px-6 py-4 border-t">
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={(p) => setPage(p)}
          />
        </div>
      </div>

      <BrokerUpsertSheet
        open={openSheet}
        item={selectedItem}
        onClose={() => setOpenSheet(false)}
        onSuccess={() => refetch()}
      />
    </>
  );
};

export default BrokerPage;
