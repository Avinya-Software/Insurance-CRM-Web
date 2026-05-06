import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MessageSquare, MoreVertical, X } from "lucide-react";
import { useLeadFollowUps } from "../hooks/leadFollowUp/useLeadFollowUps";
import { useEffect, useRef, useState } from "react";
import LeadFollowUpCreateSheet from "../components/followups/LeadFollowUpCreateSheet";

const followStatusStyles: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  Completed: "bg-green-100 text-green-700 border-green-200",
  Closed: "bg-green-100 text-green-700 border-green-200",
};

const LeadFollowUpPage = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  const {
    data: followUps = [],
    isLoading,
    refetch,
  } = useLeadFollowUps(leadId || "");

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [search, setSearch] = useState("");

  const [openFollowUp, setOpenFollowUp] = useState<any | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<any>(null);

  const [editFollowUp, setEditFollowUp] = useState<any | null>(null);

  const leadNo = followUps.length > 0 ? followUps[0].leadNo : "...";

  const filtered = followUps.filter((f) =>
    f.remark?.toLowerCase().includes(search.toLowerCase())
  );

  const openDropdown = (e: any, followUp: any) => {
    const rect = e.currentTarget.getBoundingClientRect();

    setDropdownPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX - 120,
    });

    setOpenFollowUp(followUp);
  };

  const handleEdit = () => {
    setEditFollowUp({
      leadId,
      followUp: openFollowUp,
    });

    setOpenFollowUp(null);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenFollowUp(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div>
      <div className="bg-white rounded-lg border">

            {/* HEADER */}
            <div className="px-4 py-4 border-b bg-gray-100 flex items-center justify-between gap-4">

            {/* Left Section → Back Button + Title */}
            <div className="flex items-center gap-4 min-w-0">

                <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg border hover:bg-gray-200 transition flex items-center justify-center shrink-0"
                title="Go back"
                >
                <ArrowLeft size={18} />
                </button>

                <div className="min-w-0">
                <h1 className="text-2xl font-serif font-semibold text-slate-900 truncate">
                    Follow-up History for Lead: {leadNo}
                </h1>

                <p className="mt-1 text-sm text-slate-600">
                    {followUps.length} total follow ups
                </p>
                </div>

            </div>
            {/* Search Section */}
            <div className="relative w-[320px] shrink-0">
                <input
                type="text"
                placeholder="Search follow ups..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-3 border rounded text-sm"
                />

                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
                </span>
            </div>

            </div>

        {/* TABLE */}

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100">
              <tr>
                <Th>Created Date</Th>
                <Th>Next Follow Up</Th>
                <Th>Status</Th>
                <Th>Remark</Th>
                <Th className="text-center">Actions</Th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500">
                    Loading follow ups...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <MessageSquare size={40} />
                      No follow ups found
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((f) => (
                  <tr key={f.followUpID} className="border-t hover:bg-slate-50">
                    <Td>{new Date(f.createdDate).toLocaleString()}</Td>

                    <Td>
                      {f.nextFollowupDate
                        ? new Date(f.nextFollowupDate).toLocaleString()
                        : "-"}
                    </Td>

                    <Td>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          followStatusStyles[f.statusName] ||
                          "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {f.statusName}
                      </span>
                    </Td>

                    <Td className="max-w-[300px] truncate">
                      {f.remark || "N/A"}
                    </Td>

                    <Td className="text-center">
                      <button
                        onClick={(e) => openDropdown(e, f)}
                        className="p-2 rounded hover:bg-slate-200"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && filtered.length > 0 && (
          <div className="px-4 py-3 border-t text-xs text-slate-500">
            Showing {filtered.length} follow ups
          </div>
        )}
      </div>

      {/* DROPDOWN */}

      {openFollowUp && (
        <div
          ref={dropdownRef}
          className="fixed z-50 w-[180px] bg-white border rounded-lg shadow-lg"
          style={dropdownPosition}
        >
          <MenuItem label="Edit" onClick={handleEdit} />
        </div>
      )}

      {/* SHEET MODAL */}

      <LeadFollowUpCreateSheet
        open={!!editFollowUp}
        leadId={editFollowUp?.leadId || null}
        leadName={leadNo}
        editData={editFollowUp?.followUp}
        mode="edit"
        onClose={() => setEditFollowUp(null)}
        onSuccess={() => {
          setEditFollowUp(null);
          refetch?.();
        }}
      />
    </div>
  );
};

export default LeadFollowUpPage;


const Th = ({ children, className = "" }: any) => (
  <th className={`px-4 py-3 text-left font-semibold ${className}`}>
    {children}
  </th>
);

const Td = ({ children, className = "" }: any) => (
  <td className={`px-4 py-3 ${className}`}>{children}</td>
);

const MenuItem = ({
    label,
    onClick,
    danger = false,
  }: {
    label: string;
    onClick: () => void;
    danger?: boolean;
  }) => (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-slate-100 ${
        danger ? "text-red-600 hover:bg-red-50" : ""
      }`}
    >
      {danger && <X size={14} />}
      {label}
    </button>
  );