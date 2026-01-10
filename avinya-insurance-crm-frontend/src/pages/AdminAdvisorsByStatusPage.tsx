import { useState, useMemo } from "react";
import { useAdvisorsByStatus } from "../hooks/admin/useAdvisorsByStatus";

type StatusType = "approved" | "rejected";

const AdminAdvisorsByStatusPage = () => {
  const [status, setStatus] = useState<StatusType>("approved");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useAdvisorsByStatus({
    status
  });

  // 🔍 Client-side search (fast & simple)
  const filteredData = useMemo(() => {
    if (!data?.data) return [];

    return data.data.filter((item) =>
      `${item.fullName} ${item.email}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search]);

  return (
    <div className="p-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          {status === "approved"
            ? "Approved Advisors"
            : "Rejected Advisors"}
        </h1>

        {/* 🔀 STATUS SWITCH */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setStatus("approved")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
              status === "approved"
                ? "bg-white shadow text-green-600"
                : "text-gray-500"
            }`}
          >
            Approved
          </button>

          <button
            onClick={() => setStatus("rejected")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
              status === "rejected"
                ? "bg-white shadow text-red-600"
                : "text-gray-500"
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left">
              <th className="p-3">Advisor</th>
              <th className="p-3">Email</th>
              <th className="p-3">Advisor ID</th>
              <th className="p-3">
                {status === "approved" ? "Approved On" : "Rejected On"}
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={4} className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!isLoading && filteredData.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  No records found
                </td>
              </tr>
            )}

            {filteredData.map((item) => (
              <tr
                key={item.userId}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-3 font-medium">
                  {item.fullName}
                </td>
                <td className="p-3">{item.email}</td>
                <td className="p-3">{item.advisorId}</td>
                <td className="p-3">
                  {item.actionDate
                    ? new Date(item.actionDate).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAdvisorsByStatusPage;
