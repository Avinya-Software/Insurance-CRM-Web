import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertPolicyApi } from "../../api/policy.api";

export const useUpsertPolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policies"] });
      queryClient.invalidateQueries({ queryKey: ["general-policies"] });
      queryClient.invalidateQueries({ queryKey: ["renewals"] });
    },
    mutationFn: async (data: any) => {
      const division = data.detail.divisionType;
      const fmt = (d: string) => d || null;

      const payload: any = {
        type: data.type,
        transactionDate: fmt(data.transactionDate),
        documentNumber: data.documentNumber,
        familyGroupId: data.familyGroupId,
        policyHolderId: data.policyHolderId,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        area: data.area,
        mobileNumber: data.mobileNumber,
        gender: data.gender,
        email: data.email,
        dob: fmt(data.dob),
        relationWithHead: data.relationWithHead,

        // Mapping Detail
        detail: {
          ...data.detail,
          riskStartDate: fmt(data.detail.riskStartDate),
          riskEndDate: fmt(data.detail.riskEndDate),
          tpDueDate: data.detail.tpDueDate ? fmt(data.detail.tpDueDate) : null,
        },

        // Mapping Premium
        premium: {
          ...data.premium,
          sumAssured: data.premium.sumAssured || 0,
          idvValue: data.premium.idvValue || 0,
        },

        // Mapping Payment
        payment: data.payment,

        // Conditional Logic for Arrays/Objects
        members: (division === "Health" || division === 1 || division === "1") ? data.members : [],
        riskLocations: (division === "OtherGeneral" || division === 2 || division === "2") ? data.riskLocations : [],
        vehicle: (division === "Vehicle" || division === 3 || division === "3") ? {
          ...data.vehicle,
          registerDate: fmt(data.vehicle.registerDate),
          manufactureYear: Number(data.vehicle.manufactureYear)
        } : null
      };

      return await upsertPolicyApi(payload);
    },
  });
};