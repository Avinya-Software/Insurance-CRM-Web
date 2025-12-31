// src/pages/Leads.tsx
import { useState } from "react";
import { Filter } from "lucide-react";
import { useSelector } from "react-redux";

import { useLeads } from "../hooks/lead/useLeads";
import LeadTable from "../components/leads/LeadTable";
import Pagination from "../components/leads/Pagination";
import LeadFilterSheet from "../components/leads/LeadFilterSheet";
import LeadUpsertSheet from "../components/leads/LeadUpsertSheet";
import LeadFollowUpBottomSheet from "../components/followups/LeadFollowUpBottomSheet";
import LeadFollowUpCreateSheet from "../components/followups/LeadFollowUpCreateSheet";

import type { RootState } from "../store";

const Leads = () => {
  /* ---------------- STATE ---------------- */

  const [filters, setFilters] = useState({
    pageNumber: 1,
    pageSize: 10,
  });

  const [openFilterSheet, setOpenFilterSheet] = useState(false);
  const [openUpsertSheet, setOpenUpsertSheet] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  // 👇 VIEW FOLLOW UPS (BOTTOM SHEET)
  const [viewFollowUpLead, setViewFollowUpLead] = useState<{
    leadId: string;
    leadName?: string;
  } | null>(null);

  // 👇 CREATE FOLLOW UP (RIGHT SHEET)
  const [createFollowUpLead, setCreateFollowUpLead] = useState<{
    leadId: string;
    leadName?: string;
  } | null>(null);

  const advisorId = useSelector(
    (state: RootState) => state.auth.advisorId
  );

  const { data, isLoading, isFetching } = useLeads(filters);

  /* ---------------- HANDLERS ---------------- */

  const handleAddLead = () => {
    setSelectedLead(null);
    setOpenUpsertSheet(true);
  };

  const handleEditLead = (lead: any) => {
    setSelectedLead(lead);
    setOpenUpsertSheet(true);
  };

  if (isLoading) return <p>Loading leads...</p>;

  return (
    <>
      {/* ---------- HEADER ---------- */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Leads</h1>

        <button
          onClick={() => setOpenFilterSheet(true)}
          className="flex items-center gap-2 border px-4 py-2 rounded-lg"
        >
          <Filter size={16} />
          Filters
        </button>
      </div>

      {isFetching && <p className="text-sm">Updating...</p>}

      {/* ---------- LEADS TABLE ---------- */}
      <div className="bg-white rounded-lg border">
        <LeadTable
          data={data?.data ?? []}
          onAdd={handleAddLead}
          onEdit={handleEditLead}
          onViewFollowUps={(lead) => {
            setCreateFollowUpLead(null); // 🔥 ensure only one open
            setViewFollowUpLead({
              leadId: lead.leadId,
              leadName: lead.fullName,
            });
          }}
          onCreateFollowUp={(lead) => {
            setViewFollowUpLead(null); // 🔥 ensure only one open
            setCreateFollowUpLead({
              leadId: lead.leadId,
              leadName: lead.fullName,
            });
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

      {/* ---------- FILTER SHEET ---------- */}
      <LeadFilterSheet
        open={openFilterSheet}
        onClose={() => setOpenFilterSheet(false)}
        filters={filters}
        onApply={(f) =>
          setFilters({ ...f, pageNumber: 1 })
        }
        onClear={() =>
          setFilters({ pageNumber: 1, pageSize: 10 })
        }
      />

      {/* ---------- ADD / EDIT LEAD ---------- */}
      <LeadUpsertSheet
        open={openUpsertSheet}
        onClose={() => {
          setOpenUpsertSheet(false);
          setSelectedLead(null);
        }}
        lead={selectedLead}
        advisorId={advisorId}
      />

      {/* ---------- VIEW FOLLOW UPS (BOTTOM) ---------- */}
      <LeadFollowUpBottomSheet
        open={!!viewFollowUpLead}
        leadId={viewFollowUpLead?.leadId || null}
        leadName={viewFollowUpLead?.leadName}
        onClose={() => setViewFollowUpLead(null)}
      />

      {/* ---------- CREATE FOLLOW UP (RIGHT) ---------- */}
      <LeadFollowUpCreateSheet
        open={!!createFollowUpLead}
        leadId={createFollowUpLead?.leadId || null}
        leadName={createFollowUpLead?.leadName}
        onClose={() => setCreateFollowUpLead(null)}
        onSuccess={() => {
          // After save → go back to view
          setCreateFollowUpLead(null);
          setViewFollowUpLead(createFollowUpLead);
        }}
      />
    </>
  );
};

export default Leads;
