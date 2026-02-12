export interface LeadFollowUp {
  followUpID: string;
  leadID: string;
  leadNo: string;
  updatedDate?: string | null;
  remark?: string;
  nextFollowupDate?: string | null;
  status: number;
  statusName: string;
  followUpBy: string;
  followUpByName: string;
  createdDate: string;
}
