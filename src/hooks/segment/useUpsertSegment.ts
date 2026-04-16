import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertSegmentApi } from "../../api/segment.api";
import { SegmentPayload } from "../../interfaces/segment.interface";

export const useUpsertSegment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SegmentPayload) => upsertSegmentApi(data),
    onSuccess: () => {
      // Invalidate both segment dropdown and general segment list
      queryClient.invalidateQueries({ queryKey: ["segment-dropdown"] });
      queryClient.invalidateQueries({ queryKey: ["segments"] });
    },
  });
};
