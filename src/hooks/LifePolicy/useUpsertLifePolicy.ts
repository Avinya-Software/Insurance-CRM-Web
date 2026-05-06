import { useMutation } from "@tanstack/react-query";
import { UpsertLifePolicyPayload } from "../../interfaces/policy.interface";
import { upsertLifePolicyApi } from "../../api/policy.api";

export const useUpsertLifePolicy = () => {
    return useMutation({
      mutationFn: (payload: UpsertLifePolicyPayload) =>
        upsertLifePolicyApi(payload),
    });
  };