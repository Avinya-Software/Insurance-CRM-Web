import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertSegmentApi, updateSegmentStatusApi } from "../../api/segment.api";
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

export const useUpdateSegmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { segmentId: number; isActive: boolean }) => updateSegmentStatusApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["segments"] });
      queryClient.invalidateQueries({ queryKey: ["segment-dropdown"] });
    },
  });
};
