// src/pages/Leads.tsx
import { useState } from "react";
import { Filter } from "lucide-react";
import { useLeads } from "../hooks/lead/useLeads";
import LeadTable from "../components/leads/LeadTable";
import Pagination from "../components/leads/Pagination";
import FollowUpSheet from "../components/followups/FollowUpSheet";
import LeadFilterSheet from "../components/leads/LeadFilterSheet";
import LeadUpsertSheet from "../components/leads/LeadUpsertSheet";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
const Leads = () => {
  const [filters, setFilters] = useState({
    pageNumber: 1,
    pageSize: 10,
  });
  const [openSheet, setOpenSheet] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const advisorId = useSelector(
  (state: RootState) => state.auth.advisorId
);
const [followUpLeadId, setFollowUpLeadId] = useState<string | null>(null);
const [openFollowUpSheet, setOpenFollowUpSheet] = useState(false);
  const { data, isLoading, isFetching } = useLeads(filters);

  if (isLoading) return <p>Loading leads...</p>;
const handleAddLead = () => {
  setSelectedLead(null);   // empty form
  setOpenSheet(true);
};

// EDIT LEAD
const handleEditLead = (lead: any) => {
  setSelectedLead(lead);  // prefill form
  setOpenSheet(true);
};
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Leads</h1>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 border px-4 py-2 rounded-lg"
        >
          <Filter size={16} />
          Filters
        </button>
      </div>

      {isFetching && <p className="text-sm">Updating...</p>}

      <div className="bg-white rounded-lg border">
        <LeadTable
        data={data?.data ?? []}
        onAdd={handleAddLead}
        onEdit={handleEditLead}
        onCreateFollowUp={(lead) => {
        setFollowUpLeadId(lead.leadId);
        setOpenFollowUpSheet(true);
        }}
        />
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

      <LeadFilterSheet
        open={open}
        onClose={() => setOpen(false)}
        filters={filters}
        onApply={(f) =>
          setFilters({ ...f, pageNumber: 1 })
        }
        onClear={() =>
          setFilters({ pageNumber: 1, pageSize: 10 })
        }
      />
      <LeadUpsertSheet
        open={openSheet}
        onClose={() => {
            setOpenSheet(false);
            setSelectedLead(null);
        }}
        lead={selectedLead}
        advisorId={advisorId}
        />
        <FollowUpSheet
        open={openFollowUpSheet}
        leadId={followUpLeadId}
        onClose={() => {
            setOpenFollowUpSheet(false);
            setFollowUpLeadId(null);
        }}
        />
    </>
  );
};

export default Leads;
