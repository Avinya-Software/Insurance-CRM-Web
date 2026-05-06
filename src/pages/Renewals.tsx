import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Toaster } from "react-hot-toast";

import { useRenewals } from "../hooks/renewal/useRenewals";
import RenewalTable from "../components/renewal/RenewalTable";
import Pagination from "../components/leads/Pagination";
import RenewalFilterSheet from "../components/renewal/RenewalFilterSheet";
import PolicyUpsertSheet from "../components/policy/PolicyUpsertSheet";

const DEFAULT_FILTERS = {
  pageNumber: 1,
  pageSize: 10,
  search: "",
  renewalStatusId: null as number | null,
  customerId: null as string | null,
};

const Renewals = () => {
  /*   STATE   */

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [openFilterSheet, setOpenFilterSheet] = useState(false);
  const [openPolicySheet, setOpenPolicySheet] = useState(false);
  const [selectedRenewalId, setSelectedRenewalId] = useState<string | null>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);

  /*   API   */

  const { data, isLoading, isFetching, refetch } = useRenewals(filters);

  /*   HELPERS   */

  const hasActiveFilters =
    filters.search ||
    filters.renewalStatusId ||
    filters.customerId;

  const clearAllFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleCreateRenewal = (renewal: any) => {
    setSelectedRenewalId(renewal.policyId);
    setSelectedPolicy(renewal);
    setOpenPolicySheet(true);
  };

  const handleEditRenewal = (policyId: string) => {
    setSelectedRenewalId(policyId);
    // When editing, we don't pass the initial 'policy' object from the table
    // but let the sheet fetch the full data via useGeneralPolicyById
    setSelectedPolicy(null); 
    setOpenPolicySheet(true);
  };

  const handlePolicySuccess = () => {
    refetch();
  };

  /*   UI   */

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <div className="bg-white rounded-lg border">
        {/*  HEADER  */}
        <div className="px-4 py-5 border-b bg-gray-100">
          <div className="grid grid-cols-2 gap-y-4 items-start">
            <div>
              <h1 className="text-4xl font-serif font-semibold text-slate-900">
                Renewals
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {data?.data?.totalCount ?? 0} total renewals
              </p>
            </div>

            <div className="text-right">
              {/* Optional: Add button here if needed in future */}
            </div>

            {/* 🔍 SEARCH */}
            <div>
              <div className="relative w-[360px]">
                <input
                  type="text"
                  placeholder="Search Customer or Policy..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      search: e.target.value,
                      pageNumber: 1,
                    })
                  }
                  className="w-full h-10 pl-10 pr-3 border rounded text-sm outline-none focus:ring-2 focus:ring-blue-50 focus:border-blue-400"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  🔍
                </span>
              </div>
            </div>

            {/* 🎯 FILTER + CLEAR */}
            <div className="flex justify-end gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-2 border border-red-300 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-50 transition-all"
                >
                  <X size={14} />
                  Clear Filters
                </button>
              )}

              <button
                onClick={() => setOpenFilterSheet(true)}
                className="inline-flex items-center gap-2 border px-4 py-2 rounded-lg text-sm font-medium bg-white hover:bg-slate-50 transition-all border-slate-200"
              >
                <Filter size={16} className="text-slate-600" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* 📑 TABS */}
        <div className="px-4 border-b bg-white flex items-center gap-8 overflow-x-auto no-scrollbar">
          {[
            { id: null, name: "All", count: data?.data?.allCount ?? 0 },
            { id: 1, name: "Pending", count: data?.data?.pendingCount ?? 0 },
            { id: 2, name: "Renew", count: data?.data?.renewalCount ?? 0 },
            { id: 3, name: "Overdue", count: data?.data?.overdueCount ?? 0 },
          ].map((tab) => (
            <button
              key={tab.name}
              onClick={() => setFilters(f => ({ ...f, renewalStatusId: tab.id, pageNumber: 1 }))}
              className={`
                relative py-4 text-sm font-medium transition-all whitespace-nowrap
                ${filters.renewalStatusId === tab.id
                  ? "text-blue-600"
                  : "text-slate-500 hover:text-slate-700"}
              `}
            >
              {tab.name}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${
                filters.renewalStatusId === tab.id 
                  ? "bg-blue-100 text-blue-600" 
                  : "bg-slate-100 text-slate-500"
              }`}>
                {tab.count}
              </span>
              {filters.renewalStatusId === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
        
        {/*   RENEWALS TABLE   */}
        <div className="px-0">
          <RenewalTable
            data={data?.data?.data ?? []}
            loading={isLoading || isFetching}
            statusId={filters.renewalStatusId}
            onRenewal={handleCreateRenewal}
            onEdit={handleEditRenewal}
          />
        </div>

        {/*   PAGINATION   */}
        <div className="border-t px-4 py-3">
          <Pagination
            page={filters.pageNumber}
            totalPages={Math.ceil((data?.data?.totalCount || 1) / filters.pageSize)}
            onChange={(page) =>
              setFilters({ ...filters, pageNumber: page })
            }
          />
        </div>
      </div>

      {/*   FILTER SHEET   */}
      <RenewalFilterSheet
        open={openFilterSheet}
        onClose={() => setOpenFilterSheet(false)}
        filters={filters}
        onApply={(f) => setFilters({ ...f, pageNumber: 1 })}
        onClear={clearAllFilters}
      />

      <PolicyUpsertSheet
        open={openPolicySheet}
        onClose={() => {
          setOpenPolicySheet(false);
          setSelectedRenewalId(null);
          setSelectedPolicy(null);
        }}
        policy={selectedPolicy}
        renewalId={selectedRenewalId}
        isEdit={!selectedPolicy && !!selectedRenewalId}
        onSuccess={handlePolicySuccess}
      />
    </>
  );
};

export default Renewals;
