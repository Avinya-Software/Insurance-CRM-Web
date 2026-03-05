import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import AgencyTable from "../components/Agency/AgencyTable";
import { useAgency } from "../hooks/Agency/useAgency";
import AgencyUpsertSheet from "../components/Agency/AgencyUpsertSheet";

interface Props {
  type: number; // 0 = General , 1 = Life
  title: string;
}

const Agency = ({ type, title }: Props) => {
  const { getAgencies, loading } = useAgency();

  const [agencies, setAgencies] = useState<any[]>([]);
  const [openSheet, setOpenSheet] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState<any | null>(null);

  const loadAgencies = async () => {
    const res = await getAgencies(type);
    setAgencies(res);
  };

  useEffect(() => {
    loadAgencies();
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
          onDeleteSuccess={loadAgencies}
        />

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