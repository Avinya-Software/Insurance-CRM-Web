import { useEffect, useState } from "react";
import InsurerTable from "../components/insurer/InsurerTable";
import InsurerUpsertSheet from "../components/insurer/InsurerUpsertSheet";
import { getInsurersApi } from "../api/insurer.api";

const Insurers = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [openSheet, setOpenSheet] = useState(false);
  const [selectedInsurer, setSelectedInsurer] = useState<any | null>(null);

  /* ---------------- FETCH DATA ---------------- */

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getInsurersApi(pageNumber, pageSize, search);
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [pageNumber, search]);

  /* ---------------- HANDLERS ---------------- */

  const handleAdd = () => {
    setSelectedInsurer(null);
    setOpenSheet(true);
  };

  const handleEdit = (insurer: any) => {
    setSelectedInsurer(insurer);
    setOpenSheet(true);
  };

  const handleSuccess = () => {
    // 🔥 REFRESH AFTER ADD / EDIT
    loadData();
  };

  /* =================== UI =================== */

  return (
    <>
      <div className="bg-white rounded-lg border">
        {/* HEADER */}
        <div className="px-4 py-5 border-b bg-gray-100">
          <div className="grid grid-cols-2 gap-y-4 items-start">
            {/* LEFT */}
            <div>
              <h1 className="text-4xl font-serif font-semibold text-slate-900">
                Insurers
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {data?.totalRecords ?? 0} total insurers
              </p>
            </div>

            {/* RIGHT */}
            <div className="text-right">
              <button
                className="inline-flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded text-sm font-medium"
                onClick={handleAdd}
              >
                + Add Insurer
              </button>
            </div>

            {/* SEARCH */}
            <div>
              <input
                type="text"
                placeholder="Search insurer..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPageNumber(1);
                }}
                className="w-[360px] h-10 px-3 border rounded text-sm"
              />
            </div>

            <div />
          </div>
        </div>

        {/* TABLE */}
        <InsurerTable
          data={data?.data || []}
          onEdit={handleEdit}
        />

        {/* PAGINATION */}
        <div className="flex justify-end gap-4 px-4 py-3 border-t text-sm">
          <button
            disabled={pageNumber === 1}
            onClick={() => setPageNumber((p) => p - 1)}
            className="disabled:text-slate-400"
          >
            Prev
          </button>

          <span>Page {pageNumber}</span>

          <button
            disabled={pageNumber === data?.totalPages}
            onClick={() => setPageNumber((p) => p + 1)}
            className="disabled:text-slate-400"
          >
            Next
          </button>
        </div>

        {loading && (
          <div className="px-4 py-2 text-sm text-slate-500">
            Loading...
          </div>
        )}
      </div>

      {/* ADD / EDIT SHEET */}
      <InsurerUpsertSheet
        open={openSheet}
        insurer={selectedInsurer}
        onClose={() => setOpenSheet(false)}
        onSuccess={handleSuccess}   // 🔥 IMPORTANT
      />
    </>
  );
};

export default Insurers;
