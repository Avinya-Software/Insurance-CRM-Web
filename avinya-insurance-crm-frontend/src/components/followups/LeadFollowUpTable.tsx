import { useEffect, useState } from "react";
import { getFollowUpsByLeadId } from "../../api/leadFollowUp.api";
import type { LeadFollowUp } from "../../interfaces/LeadFollowUp";

interface Props {
  leadId: string;
}

export const LeadFollowUpTable = ({ leadId }: Props) => {
  const [data, setData] = useState<LeadFollowUp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!leadId) return;

    const fetchData = async () => {
      try {
        const res = await getFollowUpsByLeadId(leadId);
        setData(res);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [leadId]);

  if (loading) return <p>Loading follow-ups...</p>;

  if (data.length === 0)
    return <p>No follow-ups available</p>;

  return (
    <table className="w-full border border-gray-300 text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="border p-2">Follow-up Date</th>
          <th className="border p-2">Next Follow-up</th>
          <th className="border p-2">Remark</th>
          <th className="border p-2">Created At</th>
        </tr>
      </thead>
      <tbody>
        {data.map((x) => (
          <tr key={x.followUpId}>
            <td className="border p-2">
              {new Date(x.followUpDate).toLocaleDateString()}
            </td>
            <td className="border p-2">
              {x.nextFollowUpDate
                ? new Date(x.nextFollowUpDate).toLocaleDateString()
                : "-"}
            </td>
            <td className="border p-2">
              {x.remark || "-"}
            </td>
            <td className="border p-2">
              {new Date(x.createdAt).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
