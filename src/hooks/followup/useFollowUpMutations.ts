// src/hooks/followup/useFollowUpMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createFollowUp,
  updateFollowUp,
  updateFollowUpStatus,
  deleteFollowUp,
  getFollowUpById,
} from "../../api/followup.api";
import {
  CreateFollowUpDto,
  UpdateFollowUpDto,
} from "../../interfaces/followup.interface";
import { createFollowUpApi } from "../../api/leadFollowUp.api";

// ── Create Follow-Up ───────────────────────────────────────────────
export const useCreateFollowUp = () => {
    return useMutation({
      mutationFn: createFollowUpApi,
    });
  };

// ── Update Follow-Up ───────────────────────────────────────────────
export const useUpdateFollowUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      followUpId,
      data,
    }: {
      followUpId: string;
      data: UpdateFollowUpDto;
    }) => updateFollowUp(followUpId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-followups"] });
      toast.success("Follow-up updated successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to update follow-up";
      toast.error(message);
    },
  });
};

// ── Update Follow-Up Status ────────────────────────────────────────
export const useUpdateFollowUpStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      followUpId,
      status,
    }: {
      followUpId: string;
      status: string;
    }) => updateFollowUpStatus(followUpId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-followups"] });
      toast.success("Status updated successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to update status";
      toast.error(message);
    },
  });
};

// ── Delete Follow-Up ───────────────────────────────────────────────
export const useDeleteFollowUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (followUpId: string) => deleteFollowUp(followUpId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-followups"] });
      toast.success("Follow-up deleted successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to delete follow-up";
      toast.error(message);
    },
  });
};

// ── Get Follow-Up By ID ────────────────────────────────────────────
export const useGetFollowUpById = () => {
  return useMutation({
    mutationFn: (followUpId: string) =>
      getFollowUpById(followUpId),

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        "Failed to fetch follow-up details";
      toast.error(message);
    },
  });
};
