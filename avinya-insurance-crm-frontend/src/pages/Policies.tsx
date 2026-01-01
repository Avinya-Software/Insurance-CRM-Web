import { useState } from "react";
import { Filter } from "lucide-react";

import { usePolicies } from "../hooks/policy/usePolicies";
import PolicyTable from "../components/policy/PolicyTable";
import PolicyUpsertSheet from "../components/policy/PolicyUpsertSheet";
import PolicyFilterSheet from "../components/policy/PolicyFilterSheet";
import Pagination from "../components/leads/Pagination";

const Policies = () => {
  /* ---------------- STATE ---------------- */

  const [filters, setFilters] = useState({
    pageNumber: 1,
    pageSize: 10,
    search: "",
    policyStatusId: null,
    policyTypeId: null,
    customerId: null,
    insurerId: null,
    productId: null,
  });

  const [openPolicySheet, setOpenPolicySheet] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [openFilterSheet, setOpenFilterSheet] = useState(false);

  const { data, isLoading, isFetching } = usePolicies(filters);

  return (
    <>
      <div className="bg-white rounded-lg border">
        {/* ================= HEADER ================= */}
        <div className="px-4 py-5 border-b bg-gray-100">
          <div className="grid grid-cols-2 gap-y-4">
            <div>
              <h1 className="text-4xl font-serif font-semibold">
                Policies
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {data?.totalRecords ?? 0} total policies
              </p>
            </div>

            <div className="text-right">
              <button
                className="bg-blue-900 text-white px-4 py-2 rounded text-sm"
                onClick={() => {
                  setSelectedPolicy(null);
                  setOpenPolicySheet(true);
                }}
              >
                + Add Policy
              </button>
            </div>

            {/* SEARCH */}
            <div>
              <div className="relative w-[360px]">
                <input
                  placeholder="Search by policy number..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      search: e.target.value,
                      pageNumber: 1,
                    })
                  }
                  className="w-full h-10 pl-10 border rounded"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  🔍
                </span>
              </div>
            </div>

            {/* FILTER */}
            <div className="text-right">
              <button
                onClick={() => setOpenFilterSheet(true)}
                className="inline-flex items-center gap-2 border px-4 py-2 rounded"
              >
                <Filter size={16} />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* LOADING */}
        {(isLoading || isFetching) && (
          <div className="px-4 py-2 text-sm text-slate-500">
            {isLoading ? "Loading..." : "Updating..."}
          </div>
        )}

        {/* TABLE */}
        <PolicyTable
          data={data?.data ?? []}
          onEdit={(policy) => {
            setSelectedPolicy(policy);
            setOpenPolicySheet(true);
          }}
        />

        {/* PAGINATION */}
        <div className="border-t px-4 py-3">
          <Pagination
            page={filters.pageNumber}
            totalPages={data?.totalPages || 1}
            onChange={(page) =>
              setFilters({ ...filters, pageNumber: page })
            }
          />
        </div>
      </div>

      {/* FILTER SHEET */}
      <PolicyFilterSheet
        open={openFilterSheet}
        filters={filters}
        onClose={() => setOpenFilterSheet(false)}
        onApply={(f) =>
          setFilters({ ...f, pageNumber: 1 })
        }
        onClear={() =>
          setFilters({
            pageNumber: 1,
            pageSize: 10,
            search: "",
            policyStatusId: null,
            policyTypeId: null,
            customerId: null,
            insurerId: null,
            productId: null,
          })
        }
      />

      {/* UPSERT */}
      <PolicyUpsertSheet
        open={openPolicySheet}
        policy={selectedPolicy}
        onClose={() => {
          setOpenPolicySheet(false);
          setSelectedPolicy(null);
        }}
        onSuccess={() => {
          setOpenPolicySheet(false);
          setSelectedPolicy(null);
        }}
      />
    </>
  );
};

export default Policies;
