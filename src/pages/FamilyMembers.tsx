import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Filter, X } from "lucide-react";

import { useFamilyMembers } from "../hooks/family-member/useFamilyMembers";
import { useDeleteFamilyMember } from "../hooks/family-member/useDeleteFamilyMember";
import FamilyMemberTable from "../components/customer/FamilyMemberTable";
import FamilyMemberFilterSheet from "../components/customer/FamilyMemberFilterSheet";
import FamilyMemberUpsertSheet from "../components/customer/FamilyMemberUpsertSheet";
import Pagination from "../components/leads/Pagination";
import { FamilyMemberFilterParams, IFamilyMember } from "../interfaces/family-member.interface";

const DEFAULT_FILTERS: FamilyMemberFilterParams = {
  page: 1,
  pageSize: 10,
  search: "",
  familyHeadId: null, // Default changed to null
  relationWithFamilyHead: "",
  startDate: "",
  endDate: "",
};

const FamilyMembers = () => {
  /*   STATE   */

  const [filters, setFilters] = useState<FamilyMemberFilterParams>(DEFAULT_FILTERS);
  const [openFilterSheet, setOpenFilterSheet] = useState(false);
  const [openUpsertSheet, setOpenUpsertSheet] = useState(false);
  const [selectedMember, setSelectedMember] = useState<IFamilyMember | null>(null);

  /*   API   */

  const { data, isLoading, isFetching, refetch } = useFamilyMembers(filters);
  const { mutate: deleteMember, isPending: isDeleting } = useDeleteFamilyMember();

  /*   HELPERS   */

  const hasActiveFilters =
    filters.search ||
    filters.relationWithFamilyHead ||
    filters.startDate ||
    filters.endDate;

  const clearAllFilters = () => {
    setFilters(DEFAULT_FILTERS);
    toast.success("Filters cleared");
  };

  /*   HANDLERS   */

  const handleAddMember = () => {
    setSelectedMember(null);
    setOpenUpsertSheet(true);
  };

  const handleEditMember = (member: IFamilyMember) => {
    setSelectedMember(member);
    setOpenUpsertSheet(true);
  };

  const handleUpsertSuccess = () => {
    setOpenUpsertSheet(false);
    setSelectedMember(null);
    refetch();
  };

  const handleDeleteMember = (member: IFamilyMember) => {
    deleteMember(member.familyMemberId);
  };

  /*   UI   */

  return (
    <>
      <Toaster position="top-right" />

      <div className="bg-white rounded-lg border shadow-sm">
        {/*   HEADER   */}
        <div className="px-4 py-5 border-b bg-gray-100">
          <div className="grid grid-cols-2 gap-y-4 items-start">
            <div>
              <h1 className="text-4xl font-serif font-semibold text-slate-900">
                Family Members
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {data?.totalCount ?? 0} total family members
              </p>
            </div>

            <div className="text-right">
              <button
                className="bg-blue-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-800 transition-colors"
                onClick={handleAddMember}
              >
                + Add member
              </button>
            </div>

            {/* 🔍 SEARCH */}
            <div>
              <div className="relative w-[360px]">
                <input
                  placeholder="Search by member name..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      search: e.target.value,
                      page: 1,
                    })
                  }
                  className="w-full h-10 pl-10 border rounded"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  🔍
                </span>
              </div>
            </div>

            {/* 🎯 FILTER + CLEAR */}
            <div className="flex justify-end gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-2 border border-red-300 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-50"
                >
                  <X size={14} />
                  Clear Filters
                </button>
              )}

              <button
                onClick={() => setOpenFilterSheet(true)}
                className="inline-flex items-center gap-2 border px-4 py-2 rounded text-sm"
              >
                <Filter size={16} />
                Filters
              </button>
            </div>
          </div>
        </div>

        <div className="min-h-[460px]">
          <FamilyMemberTable
            data={data?.data ?? []}
            loading={isLoading || isDeleting}
            onEdit={handleEditMember}
            onDelete={handleDeleteMember}
          />
        </div>

        {/*   PAGINATION   */}
        <div className="border-t px-4 py-3">
          <Pagination
            page={filters.page!}
            totalPages={data?.totalPages || 1}
            onChange={(page) =>
              setFilters({ ...filters, page: page })
            }
          />
        </div>
      </div>

      {/*   FILTER SHEET   */}
      <FamilyMemberFilterSheet
        open={openFilterSheet}
        filters={filters}
        onClose={() => setOpenFilterSheet(false)}
        onApply={(f) => {
          setFilters({ ...f, page: 1 });
          toast.success("Filters applied");
        }}
        onClear={clearAllFilters}
      />

      {/*   UPSERT SHEET   */}
      <FamilyMemberUpsertSheet
        open={openUpsertSheet}
        item={selectedMember}
        onClose={() => setOpenUpsertSheet(false)}
        onSuccess={handleUpsertSuccess}
      />
    </>
  );
};

export default FamilyMembers;
