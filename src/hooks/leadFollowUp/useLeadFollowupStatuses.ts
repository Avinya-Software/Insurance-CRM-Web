import { useEffect, useState } from "react";
import { getLeadFollowupStatusesApi } from "../../api/leadFollowUp.api";

export const useLeadFollowupStatuses = (open: boolean) => {
  const [data, setData] = useState<
    { leadFollowupStatusID: number; statusName: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchStatuses = async () => {
      try {
        setLoading(true);
        const res = await getLeadFollowupStatusesApi();

        setData(res.data); 
      } catch (err) {
        console.error("Failed to fetch follow-up statuses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatuses();
  }, [open]);

  return { statuses: data, loading };
};
