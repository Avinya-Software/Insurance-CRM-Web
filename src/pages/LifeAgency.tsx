import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import AgencyTable from "../components/Agency/AgencyTable";
import LifeAgencyUpsertSheet from "../components/LifeAgency/LifeAgencyUpsertSheet";
import { useAgency } from "../hooks/Agency/useAgency";

const LifeAgency = () => {
  const { getAgencies, loading } = useAgency();

  const [agencies, setAgencies] = useState<any[]>([]);
  const [openAgencySheet, setOpenAgencySheet] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState<any | null>(null);

  /* LOAD DATA */

  const loadAgencies = async () => {
    const res = await getAgencies(1); // 1 = Life
    setAgencies(res);
  };

  useEffect(() => {
    loadAgencies();
  }, []);

  /* HANDLERS */

  const handleAddAgency = () => {
    setSelectedAgency(null);
    setOpenAgencySheet(true);
  };

  const handleEditAgency = (agency: any) => {
    setSelectedAgency(agency);
    setOpenAgencySheet(true);
  };

  const handleSuccess = () => {
    setOpenAgencySheet(false);
    loadAgencies();
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="bg-white rounded-lg border">

        {/* HEADER */}

        <div className="px-4 py-5 border-b bg-gray-100 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold">Life Agency</h1>
            <p className="text-sm text-gray-500">
              {agencies.length} total agencies
            </p>
          </div>

          <button
            className="bg-blue-900 text-white px-4 py-2 rounded text-sm"
            onClick={handleAddAgency}
          >
            + Add Life Agency
          </button>
        </div>

        {/* TABLE */}

        <AgencyTable
          data={agencies}
          loading={loading}
          onEdit={handleEditAgency}
        />

      </div>

      {/* UPSERT */}

      <LifeAgencyUpsertSheet
        open={openAgencySheet}
        agency={selectedAgency}
        onClose={() => setOpenAgencySheet(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default LifeAgency;