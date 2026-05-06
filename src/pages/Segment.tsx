import { useState } from "react";
import { useSegments } from "../hooks/segment/useSegments";
import SegmentTable from "../components/segment/SegmentTable";
import Pagination from "../components/leads/Pagination";
import SegmentUpsertModal from "../components/policy/SegmentUpsertModal";
import toast, { Toaster } from "react-hot-toast";
import { useUpdateSegmentStatus } from "../hooks/segment/useUpsertSegment";

const Segment = () => {
  const [filters, setFilters] = useState<any>({
    pageNumber: 1,
    pageSize: 10,
    getAll: false,
    search: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSegment, setEditingSegment] = useState<any>(null);

  const { data, isLoading, refetch } = useSegments(filters);
  const { mutate: updateStatus } = useUpdateSegmentStatus();

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
    toast.success(resData?.message || (editingSegment ? "Segment updated successfully!" : "Segment added successfully!"));
    setIsModalOpen(false);
    setEditingSegment(null);
    refetch();
  };

  const handleEdit = (segment: any) => {
    setEditingSegment(segment);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingSegment(null);
    setIsModalOpen(true);
  };

  const handleStatusChange = (segment: any) => {
    updateStatus(
      { segmentId: segment.segmentId, isActive: !segment.isActive },
      {
        onSuccess: (res: any) => {
          toast.success(res?.message || "Status updated successfully!");
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
                Segments
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {totalCount} total segments
              </p>
            </div>
            <div className="text-right">
              <button
                className="inline-flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded text-sm font-medium"
                onClick={handleAdd}
              >
                <span className="text-lg leading-none">+</span>
                Add Segment
              </button>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search by segment name..."
                value={filters.search || ""}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value, pageNumber: 1 })
                }
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            </div>
          </div>
        </div>

        <div className="min-h-[400px]">
          <SegmentTable 
            data={segments} 
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

        <SegmentUpsertModal 
          open={isModalOpen}
          editingSegment={editingSegment}
          onClose={() => {
            setIsModalOpen(false);
            setEditingSegment(null);
          }}
          onSuccess={handleSuccess}
          divisionDropdownId={null}
        />
      </div>
    </>
    );
};

export default Segment;
