import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateCampaignApi } from "../../api/campaign.api";

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      campaignId,
      data,
    }: {
      campaignId: string;
      data: {
        campaign: any;
        templates: any[];
        customerIds?: string[];
      };
    }) => updateCampaignApi(campaignId, data),

    onSuccess: () => {
      toast.success("Campaign updated successfully");
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ||
          "Failed to update campaign"
      );
    },
  });
};
