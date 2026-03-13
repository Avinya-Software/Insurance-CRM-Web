import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import AgencyTable from "../components/Agency/AgencyTable";
import { useAgency } from "../hooks/Agency/useAgency";
import AgencyUpsertSheet from "../components/Agency/AgencyUpsertSheet";
import Pagination from "../components/leads/Pagination";

interface Props {
  type: number;
  title: string;
}

const Agency = ({ type, title }: Props) => {
  const { getAgencies, loading, pageNumber, setPageNumber } = useAgency();

  const [agencies, setAgencies] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [openSheet, setOpenSheet] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState<any | null>(null);

  const pageSize = 10;

  const loadAgencies = async (page: number = pageNumber) => {
    const res = await getAgencies(type, page);

    if (res) {
      setAgencies(res.data || []);
      setTotalPages(res.totalPages || 1);
    }
  };

  useEffect(() => {
    loadAgencies(1);
  }, [type]);

  const handleAdd = () => {
    setSelectedAgency(null);
    setOpenSheet(true);
  };

  const handleEdit = (agency: any) => {
    setSelectedAgency(agency);
    setOpenSheet(true);
  };

  const handleSuccess = () => {
    setOpenSheet(false);
    loadAgencies();
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="bg-white rounded-lg border">

        {/* HEADER */}
        <div className="px-6 py-5 border-b bg-gray-100">
          <div className="flex justify-between items-start">

            <div>
              <h1 className="text-4xl font-serif font-semibold text-slate-900">
                {title}
              </h1>

              <p className="mt-1 text-sm text-slate-600">
                {agencies.length} total agencies
              </p>
            </div>

            <button
              className="inline-flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded text-sm font-medium"
              onClick={handleAdd}
            >
              + Add {title}
            </button>

          </div>
        </div>

        {/* TABLE */}
        <AgencyTable
          data={agencies}
          loading={loading}
          onEdit={handleEdit}
          onDeleteSuccess={() => loadAgencies()}
        />

        {/* PAGINATION */}
        <div className="p-4 flex justify-end">
          <Pagination
            page={pageNumber}
            totalPages={totalPages}
            onChange={(page) => {
              setPageNumber(page);
              loadAgencies(page);
            }}
          />
        </div>

      </div>

      {/* UPSERT SHEET */}
      <AgencyUpsertSheet
        open={openSheet}
        agency={selectedAgency}
        type={type}
        onClose={() => setOpenSheet(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default Agency;