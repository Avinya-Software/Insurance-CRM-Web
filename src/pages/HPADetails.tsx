import { useState } from "react";
import { Toaster } from "react-hot-toast";
import Pagination from "../components/leads/Pagination";
import { useHPADetails } from "../hooks/HPADetails/useHPADetails";
import HPADetailsTable from "../components/HPADetails/HPADetailsTable";
import AddHPADetailsUpsertSheet from "../components/HPADetails/AddHPADetailsUpsertSheet";
import { HPADetail } from "../interfaces/HPADetails.interface";

const HPADetails = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");

  const [openSheet, setOpenSheet] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HPADetail | null>(null);

  const { data, isLoading, refetch } = useHPADetails();
  const allData = data ?? [];

  const filteredData = allData.filter((item) =>
    item.hpaName.toLowerCase().includes(search.toLowerCase())
  );

  const totalCount = filteredData.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const paginatedData = filteredData.slice(
    (pageNumber - 1) * pageSize,
    pageNumber * pageSize
  );

  /* HANDLERS */

  const handleAddItem = () => {
    setSelectedItem(null);
    setOpenSheet(true);
  };

  const handleEditItem = (item: HPADetail) => {
    setSelectedItem(item);
    setOpenSheet(true);
  };

  const handleSuccess = () => {
    setOpenSheet(false);
    refetch();
  };

  /* UI */

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <div className="bg-white rounded-lg border">
        {/* HEADER */}
        <div className="px-4 py-5 border-b bg-gray-100">
          <div className="grid grid-cols-2 gap-y-4 items-start">
            
            {/* TITLE */}
            <div>
              <h1 className="text-4xl font-serif font-semibold text-slate-900">
                HPA Details
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {totalCount} total HPA details
              </p>
            </div>

            {/* ADD BUTTON */}
            <div className="text-right">
              <button
                className="inline-flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded text-sm font-medium"
                onClick={handleAddItem}
              >
                <span className="text-lg leading-none">+</span>
                Add Detail
              </button>
            </div>

            {/* SEARCH */}
            <div>
              <div className="relative w-[360px]">
                <input
                  type="text"
                  placeholder="Search HPA Details..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPageNumber(1);
                  }}
                  className="w-full h-10 pl-10 pr-3 border rounded text-sm"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  🔍
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* TABLE */}
        <HPADetailsTable
          data={paginatedData}
          loading={isLoading}
          onEdit={handleEditItem}
        />

        {/* PAGINATION */}
        <Pagination
          page={pageNumber}
          totalPages={totalPages}
          onChange={(page) => setPageNumber(page)}
        />
      </div>

      {/* UPSERT SHEET */}
      <AddHPADetailsUpsertSheet
        open={openSheet}
        item={selectedItem}
        onClose={() => setOpenSheet(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default HPADetails;