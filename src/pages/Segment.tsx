import { useState } from "react";
import { useSegments } from "../hooks/segment/useSegments";
import SegmentTable from "../components/segment/SegmentTable";
import Pagination from "../components/leads/Pagination";
import SegmentUpsertModal from "../components/policy/SegmentUpsertModal";
import toast, { Toaster } from "react-hot-toast";

const Segment = () => {
  const [filters, setFilters] = useState({
    pageNumber: 1,
    pageSize: 10,
    getAll: false,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, refetch } = useSegments(filters);

  // Defensive unwrapping of the segments array based on the provided JSON structure
  const segments = Array.isArray(data?.data?.data)
    ? data.data.data
    : Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
    ? data
    : [];

  // Defensive unwrapping of total count
  const totalCount =
    data?.data?.totalRecords || data?.totalRecords || segments.length || 0;

  const handleSuccess = (resData: any) => {
    toast.success(resData?.message || "Segment added successfully!");
    setIsModalOpen(false);
    refetch();
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
                Segments
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {totalCount} total segments
              </p>
            </div>
            <div className="text-right">
              <button
                className="inline-flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded text-sm font-medium"
                onClick={() => setIsModalOpen(true)}
              >
                <span className="text-lg leading-none">+</span>
                Add Segment
              </button>
            </div>
          </div>
        </div>

        <div className="min-h-[400px]">
          <SegmentTable 
            data={segments} 
            loading={isLoading} 
            page={filters.pageNumber}
            pageSize={filters.pageSize}
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

        <SegmentUpsertModal 
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
          divisionDropdownId={null}
        />
      </div>
    </>
    );
};

export default Segment;
