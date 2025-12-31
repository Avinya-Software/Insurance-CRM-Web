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
    search: "",
  });

  // 🔥 SAME PATTERN AS CUSTOMERS
  const [openLeadSheet, setOpenLeadSheet] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const [openFilterSheet, setOpenFilterSheet] = useState(false);

  // FOLLOW UPS
  const [viewFollowUpLead, setViewFollowUpLead] = useState<{
    leadId: string;
    leadName?: string;
  } | null>(null);

  const [createFollowUpLead, setCreateFollowUpLead] = useState<{
    leadId: string;
    leadName?: string;
  } | null>(null);

  const advisorId = useSelector(
    (state: RootState) => state.auth.advisorId
  );

  const { data, isLoading, isFetching } = useLeads(filters);

  /* ---------------- HANDLERS ---------------- */

  const closeAllSheets = () => {
    setViewFollowUpLead(null);
    setCreateFollowUpLead(null);
  };

  const handleAddLead = () => {
    closeAllSheets();
    setSelectedLead(null);
    setOpenLeadSheet(true);
  };

  const handleEditLead = (lead: any) => {
    closeAllSheets();
    setSelectedLead(lead);
    setOpenLeadSheet(true);
  };

  if (isLoading) return <p>Loading leads...</p>;

  return (
    <>
      <div className="bg-white rounded-lg border">
        {/* ================= HEADER ================= */}
        <div className="px-4 py-5 border-b bg-gray-100">
          <div className="grid grid-cols-2 gap-y-4 items-start">
            {/* LEFT - TITLE + COUNT */}
            <div>
              <h1 className="text-4xl font-serif font-semibold text-slate-900">
                Leads
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {data?.totalRecords ?? 0} total leads
              </p>
            </div>

            {/* RIGHT - ADD LEAD BUTTON */}
            <div className="text-right">
              <button
                className="inline-flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded text-sm font-medium"
                onClick={handleAddLead}
              >
                <span className="text-lg leading-none">+</span>
                Add Lead
              </button>
            </div>

            {/* LEFT - SEARCH */}
            <div>
              <div className="relative w-[360px]">
                <input
                  type="text"
                  placeholder="Search leads by name, email, or phone..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      search: e.target.value,
                      pageNumber: 1,
                    })
                  }
                  className="w-full h-10 pl-10 pr-3 border rounded text-sm text-slate-700 placeholder-slate-400"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  🔍
                </span>
              </div>
            </div>

            {/* RIGHT - FILTER BUTTON */}
            <div className="text-right">
              <button
                onClick={() => setOpenFilterSheet(true)}
                className="inline-flex items-center gap-2 border px-4 py-2 rounded-lg text-sm font-medium"
              >
                <Filter size={16} />
                Filters
              </button>
            </div>
          </div>
        </div>

        {isFetching && (
          <div className="px-4 py-2 text-sm text-slate-500">
            Updating...
          </div>
        )}

        {/* ================= LEADS TABLE ================= */}
        <LeadTable
          data={data?.data ?? []}
          onAdd={handleAddLead}
          onEdit={handleEditLead}
          onViewFollowUps={(lead) => {
            setCreateFollowUpLead(null);
            setViewFollowUpLead({
              leadId: lead.leadId,
              leadName: lead.fullName,
            });
          }}
          onCreateFollowUp={(lead) => {
            setViewFollowUpLead(null);
            setCreateFollowUpLead({
              leadId: lead.leadId,
              leadName: lead.fullName,
            });
          }}
        />

        {/* ================= PAGINATION ================= */}
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

      {/* ================= FILTER SHEET ================= */}
      <LeadFilterSheet
        open={openFilterSheet}
        onClose={() => setOpenFilterSheet(false)}
        filters={filters}
        onApply={(f) =>
          setFilters({ ...f, pageNumber: 1 })
        }
        onClear={() =>
          setFilters({ pageNumber: 1, pageSize: 10, search: "" })
        }
      />

      {/* ================= ADD / EDIT LEAD ================= */}
      <LeadUpsertSheet
        open={openLeadSheet}
        onClose={() => {
          setOpenLeadSheet(false);
          setSelectedLead(null);
        }}
        lead={selectedLead}
        advisorId={advisorId}
      />

      {/* ================= VIEW FOLLOW UPS ================= */}
      <LeadFollowUpBottomSheet
        open={!!viewFollowUpLead}
        leadId={viewFollowUpLead?.leadId || null}
        leadName={viewFollowUpLead?.leadName}
        onClose={() => setViewFollowUpLead(null)}
      />

      {/* ================= CREATE FOLLOW UP ================= */}
      <LeadFollowUpCreateSheet
        open={!!createFollowUpLead}
        leadId={createFollowUpLead?.leadId || null}
        leadName={createFollowUpLead?.leadName}
        onClose={() => setCreateFollowUpLead(null)}
        onSuccess={() => {
          setCreateFollowUpLead(null);
          setViewFollowUpLead(createFollowUpLead);
        }}
      />
    </>
  );
};

export default Leads;
