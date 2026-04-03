import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Toaster } from "react-hot-toast";

import { useRenewals } from "../hooks/renewal/useRenewals";
import { useRenewalStatuses } from "../hooks/renewal/useRenewalStatuses";
import RenewalTable from "../components/renewal/RenewalTable";
import Pagination from "../components/leads/Pagination";
import RenewalFilterSheet from "../components/renewal/RenewalFilterSheet";

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

  /*   API   */

  const { data, isLoading, isFetching } = useRenewals(filters);
  const { data: statuses = [] } = useRenewalStatuses();   

  /*   HELPERS   */

  const hasActiveFilters =
    filters.search ||
    filters.renewalStatusId ||
    filters.customerId;

  const clearAllFilters = () => {
    setFilters(DEFAULT_FILTERS);
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

        {/*   RENEWALS TABLE   */}
        <RenewalTable
          data={data?.data?.data ?? []}
          loading={isLoading || isFetching}
        />

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
    </>
  );
};

export default Renewals;
