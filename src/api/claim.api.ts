import api from "./axios";
import type {
  CreateClaimRequest,
  ClaimFilters,
  ClaimResponse,
  PaginatedClaims,
} from "../interfaces/claim.interface";

/*   CREATE / UPDATE CLAIM   */
export const upsertClaimApi = async (data: CreateClaimRequest) => {
  const { documents, ...payload } = data;
  const res = await api.post("/claim", payload);
  return res.data;
};

/*   UPLOAD CLAIM DOCUMENT   */
export const uploadClaimDocumentApi = async (data: FormData) => {
  const res = await api.post("/claim/documents", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

/*   GET CLAIMS (PAGINATED)   */

export const getClaimsApi = async (
  params: ClaimFilters
): Promise<PaginatedClaims> => {
  const res = await api.get<{
    statusCode: number;
    statusMessage: string;
    data: PaginatedClaims;
  }>("/Claim/filter", { params });

  return res.data.data; 
};


/*   CLAIM DOCUMENT PREVIEW   */

export const previewClaimDocumentApi = (
  claimId: string,
  documentId: string
) => {
  return `${api.defaults.baseURL}/claim/${claimId}/documents/${documentId}/preview`;
};

/*   CLAIM DOCUMENT DOWNLOAD   */

export const downloadClaimDocumentApi = (
  claimId: string,
  documentId: string
) => {
  return `${api.defaults.baseURL}/claim/${claimId}/documents/${documentId}/download`;
};

/*   CLAIM DOCUMENT DELETE   */

export const deleteClaimDocumentApi = async (
  claimId: string,
  documentId: string
) => {
  const res = await api.delete(
    `/claim/${claimId}/documents/${documentId}`
  );
  return res.data;
};

/*   DELETE CLAIM (BY ID)   */

export const deleteClaimApi = async (
  claimId: string
) => {
  const res = await api.delete(
    `/claim/${claimId}`
  );
  return res.data;
};

/*   UPDATE CLAIM STAGE   */

export const updateClaimStageApi = async (
  claimId: string,
  stageId: number,
  notes?: string
) => {
  const res = await api.patch(
    `/claim/${claimId}/stage/${stageId}`,
    null,
    {
      params: notes ? { notes } : undefined,
    }
  );

  return res.data;
};
