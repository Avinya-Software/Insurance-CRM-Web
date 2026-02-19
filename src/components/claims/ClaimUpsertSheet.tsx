import { useEffect, useState } from "react";
import { X, Eye, Download, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { useCreateClaim } from "../../hooks/claim/useCreateClaim";
import {
  useClaimTypes,
  useClaimStages,
  useClaimHandlers,
} from "../../hooks/claim/useClaimMasters";
import { useCustomerDropdown } from "../../hooks/customer/useCustomerDropdown";
import { usePolicies } from "../../hooks/policy/usePolicies";
import { useClaimFileActions } from "../../hooks/claim/useClaimFileActions";
import Spinner from "../common/Spinner";
import SearchableComboBox from "../common/SearchableComboBox";
import { usePoliciesByCustomer } from "../../hooks/policy/usePoliciesByCustomer";

interface Props {
  open: boolean;
  onClose: () => void;
  claim?: any;
  onSuccess: () => void;
}

const ClaimUpsertSheet = ({ open, onClose, claim, onSuccess }: Props) => {
  /*   LOCK BODY SCROLL   */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  /*   CLAIM DOCUMENT ACTIONS   */
  const [existingDocuments, setExistingDocuments] = useState<
  { fileName: string; url: string }[]
>([]);

const { preview, download, remove } = useClaimFileActions((deletedId) => {
  setExistingDocuments((prev) =>
    prev.filter(
      (f) => f.url.split("/").pop() !== deletedId
    )
  );
});


  /*   API HOOKS   */
  const { mutateAsync, isPending } = useCreateClaim();

  /*   DROPDOWNS   */
  const { data: customers, isLoading: customersLoading } = useCustomerDropdown();
  const { data: claimTypes, isLoading: typesLoading } = useClaimTypes();
  const { data: claimStages, isLoading: stagesLoading } = useClaimStages();
  const { data: claimHandlers, isLoading: handlersLoading } = useClaimHandlers();

  /*   FORM STATE   */
  const initialForm = {
    claimId: null as string | null,
    customerId: "",
    policyId: "",
    claimTypeId: "",
    claimStageId: "",
    claimHandlerId: "",
    incidentDate: "",
    claimAmount: "",
    approvedAmount: "",
    tatDays: 0,
    status: "Open",
    notes: "",
  };

  const [form, setForm] = useState(initialForm);
  const [documents, setDocuments] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /*   POLICIES (DEPENDENT)   */
  const { data: policies, isLoading: policiesLoading } = usePoliciesByCustomer(
    form.customerId
  );

  const loadingDropdowns =
    customersLoading || typesLoading || stagesLoading || handlersLoading;

  /*   PREFILL   */
  useEffect(() => {
    if (!open) {
      setForm(initialForm);
      setExistingDocuments([]);
      setDocuments([]);
      setErrors({});
      return;
    }
  
    if (!claim) return;
  
    setForm({
      claimId: claim.claimId ?? null,
      customerId: claim.customerId || "",
      policyId: claim.policyId || "",
      claimTypeId: claim.claimTypeId?.toString() || "",
      claimStageId: claim.claimStageId?.toString() || "",
      claimHandlerId: claim.claimHandlerId?.toString() || "",
      incidentDate: claim.incidentDate
        ? claim.incidentDate.split("T")[0]
        : "",
      claimAmount: claim.claimAmount?.toString() || "",
      approvedAmount: claim.approvedAmount?.toString() || "",
      tatDays: claim.tatDays ?? 0,
      status: claim.status || "Open",
      notes: claim.notes ?? "",
    });
  
    // ✅ Correct existing file mapping
    setExistingDocuments(claim.claimFiles || []);
  
    setErrors({});
  }, [open, claim]);
  

  /*   VALIDATION   */
  const validate = () => {
    const e: Record<string, string> = {};

    if (!form.customerId) {
      e.customerId = "Customer is required";
    }

    if (!form.policyId) {
      e.policyId = "Policy is required";
    }

    if (!form.claimTypeId) {
      e.claimTypeId = "Claim type is required";
    }

    if (!form.claimStageId) {
      e.claimStageId = "Claim stage is required";
    }

    if (!form.claimHandlerId) {
      e.claimHandlerId = "Handler is required";
    }

    if (!form.incidentDate) {
      e.incidentDate = "Incident date is required";
    } else {
      // Check if incident date is not in the future
      const incidentDate = new Date(form.incidentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (incidentDate > today) {
        e.incidentDate = "Incident date cannot be in the future";
      }
    }

    if (!form.claimAmount || form.claimAmount === "") {
      e.claimAmount = "Claim amount is required";
    } else if (Number(form.claimAmount) <= 0) {
      e.claimAmount = "Claim amount must be greater than 0";
    }

    if (form.approvedAmount && form.approvedAmount !== "") {
      const approved = Number(form.approvedAmount);
      const claimed = Number(form.claimAmount);

      if (approved < 0) {
        e.approvedAmount = "Approved amount cannot be negative";
      } else if (approved > claimed) {
        e.approvedAmount = "Approved amount cannot exceed claim amount";
      }
    }

    if (form.tatDays !== null && form.tatDays !== undefined) {
      if (Number(form.tatDays) < 0) {
        e.tatDays = "TAT must be 0 or greater";
      }
    }

    setErrors(e);

    if (Object.keys(e).length) {
      toast.error("Please fix validation errors");
      return false;
    }

    return true;
  };

  /*  SAVE  */
  const handleSave = async () => {
    if (!validate()) return;

    try {
      await mutateAsync({ ...form, documents });
      toast.success("Claim saved successfully");
      onClose();
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  if (!open) return null;

  /*   UI   */

  return (
    <>
      {/* OVERLAY */}
      <div
        className="fixed inset-0 bg-black/40 z-[60]"
        onClick={isPending ? undefined : onClose}
      />

      {/* SHEET */}
      <div className="fixed top-0 right-0 h-screen w-[480px] bg-white z-[70] shadow-2xl flex flex-col animate-slideInRight">
        {/* HEADER */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="font-semibold text-lg">
            {claim ? "Edit Claim" : "Add Claim"}
          </h2>
          <button onClick={onClose} disabled={isPending}>
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loadingDropdowns ? (
            <div className="flex items-center justify-center h-full">
              <Spinner />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <SearchableComboBox
                  label="Customer"
                  items={(customers || []).map((c) => ({
                    value: c.customerId,
                    label: c.fullName,
                  }))}
                  value={form.customerId}
                  placeholder="Select customer"
                  onSelect={(item) => {
                    setForm({
                      ...form,
                      customerId: item?.value || "",
                      policyId: "", // reset policy on customer change
                    });
                    if (errors.customerId) {
                      setErrors({ ...errors, customerId: "" });
                    }
                  }}
                />
                {errors.customerId && (
                  <p className="text-sm text-red-500 mt-1">{errors.customerId}</p>
                )}
              </div>

              <div
                className={
                  !form.customerId || policiesLoading
                    ? "opacity-50 pointer-events-none"
                    : ""
                }
              >
                <SearchableComboBox
                  label="Policy"
                  items={(policies || []).map((p) => ({
                    value: p.policyId,
                    label: p.policyNumber,
                  }))}
                  value={form.policyId}
                  placeholder={
                    policiesLoading
                      ? "Loading policies..."
                      : "Select policy"
                  }
                  onSelect={(item) => {
                    setForm({
                      ...form,
                      policyId: item?.value || "",
                    });
                    if (errors.policyId) {
                      setErrors({ ...errors, policyId: "" });
                    }
                  }}
                />
                {errors.policyId && (
                  <p className="text-sm text-red-500 mt-1">{errors.policyId}</p>
                )}
              </div>

              <Select
                label="Claim Type"
                required
                value={form.claimTypeId}
                error={errors.claimTypeId}
                options={claimTypes}
                idKey="claimTypeId"
                labelKey="typeName"
                onChange={(v) => {
                  setForm({
                    ...form,
                    claimTypeId: v,
                  });
                  if (errors.claimTypeId) {
                    setErrors({ ...errors, claimTypeId: "" });
                  }
                }}
              />

              <Select
                label="Claim Stage"
                required
                value={form.claimStageId}
                error={errors.claimStageId}
                options={claimStages}
                idKey="claimStageId"
                labelKey="stageName"
                onChange={(v) => {
                  setForm({
                    ...form,
                    claimStageId: v,
                  });
                  if (errors.claimStageId) {
                    setErrors({ ...errors, claimStageId: "" });
                  }
                }}
              />

              <Select
                label="Claim Handler"
                required
                value={form.claimHandlerId}
                error={errors.claimHandlerId}
                options={claimHandlers}
                idKey="claimHandlerId"
                labelKey="handlerName"
                onChange={(v) => {
                  setForm({
                    ...form,
                    claimHandlerId: v,
                  });
                  if (errors.claimHandlerId) {
                    setErrors({ ...errors, claimHandlerId: "" });
                  }
                }}
              />

              <Input
                label="Incident Date"
                required
                type="date"
                value={form.incidentDate}
                error={errors.incidentDate}
                onChange={(v) => {
                  setForm({ ...form, incidentDate: v });
                  if (errors.incidentDate) {
                    setErrors({ ...errors, incidentDate: "" });
                  }
                }}
              />

              <Input
                label="Claim Amount"
                required
                value={form.claimAmount}
                error={errors.claimAmount}
                min={0}
                onChange={(v) => {
                  setForm({ ...form, claimAmount: v.replace(/[^0-9]/g, "") });
                  if (errors.claimAmount || errors.approvedAmount) {
                    setErrors({ ...errors, claimAmount: "", approvedAmount: "" });
                  }
                }}
              />

              <Input
                label="Approved Amount"
                value={form.approvedAmount}
                error={errors.approvedAmount}
                min={form.claimAmount}
                onChange={(v) => {
                  setForm({
                    ...form,
                    approvedAmount: v.replace(/[^0-9]/g, ""),
                  });
                  if (errors.approvedAmount) {
                    setErrors({ ...errors, approvedAmount: "" });
                  }
                }}
              />

              <Input
                label="TAT (Days)"
                value={form.tatDays}
                error={errors.tatDays}
                min={0}
                onChange={(v) => {
                  setForm({
                    ...form,
                    tatDays: v === "" ? 0 : Number(v.replace(/[^0-9]/g, "")),
                  });
                  if (errors.tatDays) {
                    setErrors({ ...errors, tatDays: "" });
                  }
                }}
              />

              <Textarea
                label="Notes"
                value={form.notes}
                onChange={(v) => setForm({ ...form, notes: v })}
              />

              {/* ===== EXISTING CLAIM DOCUMENTS ===== */}
              {claim?.claimId && existingDocuments.length > 0 && (
                <div>
                  <label className="text-sm font-medium">
                    Uploaded Claim Documents
                  </label>

                  <div className="space-y-2 mt-2">
                    {existingDocuments.map((file) => {
                      const documentId = file.url.split("/").pop();

                      return (
                        <div
                          key={file.url}
                          className="flex justify-between items-center border rounded px-3 py-2 text-sm"
                        >
                          <span className="truncate flex-1">
                            {file.fileName}
                          </span>

                          <div className="flex gap-2 ml-2">
                            {/* PREVIEW */}
                            <button
                              onClick={() =>
                                preview(claim.claimId, documentId!)
                              }
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Eye size={16} />
                            </button>

                            {/* DOWNLOAD */}
                            <button
                              onClick={() =>
                                download(claim.claimId, documentId!)
                              }
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Download size={16} />
                            </button>
                            
                            {/* DELETE */}
                            <button
                              onClick={async () => {
                                if (!confirm("Delete this document?")) return;
                                if (!documentId) return;

                                try {
                                  await remove(claim.claimId, documentId);

                                  setExistingDocuments((prev) =>
                                    prev.filter(
                                      (f) =>
                                        f.url.split("/").pop() !== documentId
                                    )
                                  );
                                } catch {
                                  toast.error("Failed to delete document");
                                }
                              }}
                              className="p-1 hover:bg-red-100 text-red-600 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ===== CLAIM DOCUMENT UPLOAD ===== */}
              <div className="mt-4">
                <label className="text-sm font-medium mb-1 block">
                  Add Claim Documents
                </label>

                <div className="flex items-center gap-3">
                  <label
                    htmlFor="claim-upload"
                    className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
                  >
                    Choose Files
                  </label>

                  <span className="text-sm text-gray-500">
                    {documents.length > 0
                      ? documents.map((f) => f.name).join(", ")
                      : "No file chosen"}
                  </span>
                </div>

                <input
                  id="claim-upload"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  disabled={isPending}
                  onChange={(e) => {
                    if (!e.target.files) return;

                    const newFiles = Array.from(e.target.files);

                    setDocuments((prev) => {
                      const combined = [...prev, ...newFiles];

                      return combined.filter(
                        (file, index, self) =>
                          index === self.findIndex((f) => f.name === file.name)
                      );
                    });
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t flex gap-3">
          <button
            className="flex-1 border rounded-lg py-2 hover:bg-gray-50"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </button>

          <button
            disabled={isPending || loadingDropdowns}
            className="flex-1 bg-blue-600 text-white rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSave}
          >
            {isPending && <Spinner />}
            {isPending ? "Saving..." : "Save Claim"}
          </button>
        </div>
      </div>
    </>
  );
};

export default ClaimUpsertSheet;

/*   HELPERS   */

const Input = ({
  label,
  required,
  value,
  onChange,
  type = "text",
  error,
}: any) => (
  <div>
    <label className="text-sm font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      className={`input w-full ${error ? "border-red-500" : ""}`}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    />
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

const Textarea = ({ label, value, onChange }: any) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <textarea
      className="input w-full h-24 resize-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const Select = ({
  label,
  required,
  options,
  value,
  onChange,
  idKey = "id",
  labelKey = "name",
  error,
  disabled = false,
  loading = false,
}: any) => (
  <div>
    <label className="text-sm font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>

    <select
      disabled={disabled || loading}
      className={`input w-full ${
        error ? "border-red-500" : ""
      } disabled:bg-gray-100 disabled:cursor-not-allowed`}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">
        {loading
          ? "Loading..."
          : disabled
          ? "Select customer first"
          : `Select ${label}`}
      </option>

      {Array.isArray(options) &&
        options.map((o: any) => (
          <option
            key={o[idKey]}
            value={String(o[idKey])} 
          >
            {o[labelKey] || "—"}
          </option>
        ))}
    </select>

    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

