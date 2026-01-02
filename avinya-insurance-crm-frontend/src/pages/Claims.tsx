import { useState } from "react";
import { Filter } from "lucide-react";
import { useClaims } from "../hooks/claim/useClaims";
import ClaimTable from "../components/claims/ClaimTable";
import Pagination from "../components/leads/Pagination";
import ClaimFilterSheet from "../components/claims/ClaimFilterSheet";
import ClaimUpsertSheet from "../components/claims/ClaimUpsertSheet";

const Claims = () => {
  const [filters, setFilters] = useState({
    pageNumber: 1,
    pageSize: 10,
  });

  const [openFilter, setOpenFilter] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);

  const { data, isLoading } = useClaims(filters);

  return (
    <>
      <div className="bg-white border rounded">
        <div className="px-4 py-5 border-b bg-gray-100 flex justify-between">
          <h1 className="text-3xl font-semibold">Claims</h1>
          <button
            onClick={() => setOpenSheet(true)}
            className="bg-blue-900 text-white px-4 py-2 rounded"
          >
            + Add Claim
          </button>
        </div>

        <ClaimTable
          data={data?.data || []}
          loading={isLoading}
          onEdit={(c) => {
            setSelectedClaim(c);
            setOpenSheet(true);
          }}
        />

        <div className="px-4 py-3 border-t">
          <Pagination
            page={filters.pageNumber}
            totalPages={data?.totalPages || 1}
            onChange={(page) =>
              setFilters({ ...filters, pageNumber: page })
            }
          />
        </div>
      </div>

      <ClaimFilterSheet
        open={openFilter}
        filters={filters}
        onApply={(f) => setFilters({ ...f, pageNumber: 1 })}
        onClose={() => setOpenFilter(false)}
      />

      <ClaimUpsertSheet
        open={openSheet}
        claim={selectedClaim}
        onClose={() => {
          setOpenSheet(false);
          setSelectedClaim(null);
        }}
      />
    </>
  );
};

export default Claims;
