import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import { useCustomerDropdown } from "../../hooks/customer/useCustomerDropdown";
import { useCreateCampaign } from "../../hooks/campaigns/useCreateCampaign";
import CampaignTemplateEditor from "./CampaignTemplateEditor";
import { getAdvisorIdFromToken } from "../../utils/jwt";
import { useCampaignTypeDropdown } from "../../hooks/campaigns/useCampaignTypeDropdown";
import { useUpdateCampaign } from "../../hooks/campaigns/useUpdateCampaign";
import MultiSelectDropdown from "../common/MultiSelectDropdown";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedCampaign?: any;
}

const CampaignUpsertSheet = ({
  open,
  onClose,
  onSuccess,
  selectedCampaign,
}: Props) => {
  /* ================= LOCK SCROLL ================= */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  /* ================= API ================= */
  
  const { data: customers = [] } = useCustomerDropdown();
  const { mutate: createCampaign, isPending } = useCreateCampaign();
  const { data: campaignTypes = [], isLoading } = useCampaignTypeDropdown();
  const { mutate: updateCampaign, isPending: updating } = useUpdateCampaign();
  
  /* ================= STATE ================= */
  const advisorId = getAdvisorIdFromToken();
  const [campaign, setCampaign] = useState({
    name: "",
    campaignTypeId: undefined as number | undefined,
    channel: "Email",
    applyToAllCustomers: true,
    startDate: "", // yyyy-mm-dd
    endDate: "",   // yyyy-mm-dd
    advisorId: advisorId,
    isActive: true,
  });

  const [selectedCustomerIds, setSelectedCustomerIds] =
    useState<string[]>([]);

  const [template, setTemplate] = useState({
    subject: "",
    body: "",
    channel: "Email",
  });

  /* ================= RULE STATE ================= */

  const [ruleType, setRuleType] =
    useState<"OffsetDays" | "FixedDate">("OffsetDays");

  const [offsetRule, setOffsetRule] = useState({
    field: "DOB",
    direction: "On",
    days: 0,
  });

  const [fixedDate, setFixedDate] = useState("");

  /* ================= RESET / PREFILL ================= */

  useEffect(() => {
    if (!open) return;

    if (selectedCampaign) {
      // ===== EDIT MODE =====
      setCampaign({
        name: selectedCampaign.name || "",
        campaignTypeId: selectedCampaign.campaignTypeId,
        channel: selectedCampaign.channel || "Email",
        applyToAllCustomers: selectedCampaign.applyToAllCustomers ?? true,
        startDate: selectedCampaign.startDate
        ? selectedCampaign.startDate.split("T")[0]
        : "",
      endDate: selectedCampaign.endDate
        ? selectedCampaign.endDate.split("T")[0]
        : "",
        advisorId,
        isActive: selectedCampaign.isActive ?? true,
      });

      setSelectedCustomerIds(
        selectedCampaign.applyToAllCustomers
          ? customers.map((c) => c.customerId)
          : selectedCampaign.campaignCustomers?.map(
              (cc: any) => cc.customerId
            ) || []
      );

      if (selectedCampaign.templates?.[0]) {
        setTemplate({
          subject: selectedCampaign.templates[0].subject || "",
          body: selectedCampaign.templates[0].body || "",
          channel: selectedCampaign.templates[0].channel || "Email",
        });
      }

      if (selectedCampaign.rules?.[0]) {
        const r = selectedCampaign.rules[0];

        if (r.operator === "FixedDate") {
          setRuleType("FixedDate");
          setFixedDate(r.ruleValue);
        } else {
          setRuleType("OffsetDays");
          const offset = Number(r.ruleValue);
          setOffsetRule({
            field: r.ruleField,
            direction:
              offset === 0 ? "On" : offset < 0 ? "Before" : "After",
            days: Math.abs(offset),
          });
        }
      }
    } else {
      // ===== CREATE MODE =====
      resetForm();
    }
  }, [open, selectedCampaign, customers]);

  /* ================= RESET FORM ================= */
  const resetForm = () => {
    setCampaign({
      name: "",
      campaignTypeId: undefined,
      channel: "Email",
      applyToAllCustomers: true,
      startDate: "",
      endDate: "",
      advisorId,
      isActive: true,
    });

    setTemplate({
      subject: "",
      body: "",
      channel: "Email",
    });

    setSelectedCustomerIds(customers.map((c) => c.customerId));
    setRuleType("OffsetDays");
    setOffsetRule({ field: "DOB", direction: "On", days: 0 });
    setFixedDate("");
  };

  /* ================= APPLY TO ALL ================= */
  const handleApplyToAllChange = (checked: boolean) => {
    setCampaign((prev) => ({
      ...prev,
      applyToAllCustomers: checked,
    }));

    setSelectedCustomerIds(
      checked ? customers.map((c) => c.customerId) : []
    );
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = () => {
  if (!campaign.name.trim()) return toast.error("Campaign name is required");
  if (!campaign.campaignTypeId) return toast.error("Campaign type is required");
  if (!template.subject.trim()) return toast.error("Template subject is required");
  if (!template.body.trim()) return toast.error("Template body is required");
  if (selectedCustomerIds.length === 0)
    return toast.error("No customers selected");

  const selectedCampaignType = campaignTypes.find(
    (t) => t.campaignTypeId === campaign.campaignTypeId
  );

  let campaignRule: any;

  if (ruleType === "FixedDate") {
    if (!fixedDate) return toast.error("Please select a date");

    campaignRule = {
      ruleEntity: "System",
      ruleField: "Date",
      operator: "FixedDate",
      ruleValue: fixedDate,
      sortOrder: 0,
      isActive: true,
    };
  } else {
    const offset =
      offsetRule.direction === "Before"
        ? -offsetRule.days
        : offsetRule.direction === "After"
        ? offsetRule.days
        : 0;

    campaignRule = {
      ruleEntity: "Customer",
      ruleField: offsetRule.field,
      operator: "OffsetDays",
      ruleValue: offset.toString(),
      sortOrder: 0,
      isActive: true,
    };
  }

  const payload = {
    campaign: {
      ...campaign,
      campaignType: selectedCampaignType?.name || "Promotional",
      startDate: campaign.startDate || null,
      endDate: campaign.endDate || null,
      createdAt: new Date().toISOString(),
    },
    templates: [
      {
        subject: template.subject,
        body: template.body,
        channel: template.channel,
      },
    ],
    rules: [campaignRule],
    customerIds: selectedCustomerIds,
  };

  // 🔥 DECIDE CREATE vs UPDATE
  if (selectedCampaign?.campaignId) {
    updateCampaign(
      {
        campaignId: selectedCampaign.campaignId,
        data: payload,
      },
      {
        onSuccess: () => {
          toast.success("Campaign updated");
          onSuccess();
        },
      }
    );
  } else {
    createCampaign(payload, {
      onSuccess: () => {
        toast.success("Campaign created");
        onSuccess();
      },
    });
  }
};


  if (!open) return null;

  /* ================= UI ================= */

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-[60]"
        onClick={isPending ? undefined : onClose}
      />

      <div className="fixed top-0 right-0 h-screen w-[520px] bg-white z-[70] shadow-2xl flex flex-col">
        {/* HEADER */}
        <div className="px-6 py-4 border-b flex justify-between">
          <h2 className="font-semibold text-lg">
            {selectedCampaign ? "Edit Campaign" : "Create Campaign"}
          </h2>
          <button onClick={onClose} disabled={isPending}>
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* BASIC INFO */}
          <Input
            label="Campaign Name"
            required
            value={campaign.name}
            onChange={(v: string) =>
              setCampaign({ ...campaign, name: v })
            }
          />

          {/* START / END DATE */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={campaign.startDate}
              onChange={(v: string) =>
                setCampaign({ ...campaign, startDate: v })
              }
            />
            <Input
              label="End Date"
              type="date"
              value={campaign.endDate}
              onChange={(v: string) =>
                setCampaign({ ...campaign, endDate: v })
              }
            />
          </div>

          {/* TARGET CUSTOMERS */}
          <div>
            {/* TARGET CUSTOMERS */}
            <div>
              <label className="text-sm font-medium">Target Customers</label>

              <div className="mt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={campaign.applyToAllCustomers}
                  onChange={(e) => handleApplyToAllChange(e.target.checked)}
                />
                <span className="text-sm">
                  Apply to all customers ({selectedCustomerIds.length})
                </span>
              </div>

              {!campaign.applyToAllCustomers && (
                <div className="mt-3">
                 <MultiSelectDropdown
                    items={customers.map((c) => ({
                      value: c.customerId,
                      label: c.fullName,
                    }))}
                    selectedValues={selectedCustomerIds}
                    onChange={setSelectedCustomerIds}
                    placeholder="Select customers"
                  />
                </div>
              )}
            </div>


            {!campaign.applyToAllCustomers && (
              <div className="mt-3 max-h-[180px] overflow-y-auto border rounded-lg">
                {customers.map((c) => (
                  <label
                    key={c.customerId}
                    className="flex items-center gap-2 px-3 py-2 border-b text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCustomerIds.includes(c.customerId)}
                      onChange={(e) =>
                        setSelectedCustomerIds((prev) =>
                          e.target.checked
                            ? [...prev, c.customerId]
                            : prev.filter((id) => id !== c.customerId)
                        )
                      }
                    />
                    <span>{c.fullName}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* RULE TYPE */}
          <select
            className="input"
            value={ruleType}
            onChange={(e) =>
              setRuleType(e.target.value as any)
            }
          >
            <option value="OffsetDays">Relative Date</option>
            <option value="FixedDate">Fixed Date</option>
          </select>

          {/* RULE UI */}
          {ruleType === "OffsetDays" ? (
            <div className="grid grid-cols-3 gap-3">
              {/* CAMPAIGN TYPE DROPDOWN */}
              <select
                className="input w-full"
                value={campaign.campaignTypeId ?? ""}
                onChange={(e) =>
                  setCampaign({
                    ...campaign,
                    campaignTypeId: Number(e.target.value),
                  })
                }
              >
                <option value="">Select type</option>
                {campaignTypes.map((t) => (
                  <option key={t.campaignTypeId} value={t.campaignTypeId}>
                    {t.name}
                  </option>
                ))}
              </select>
              {/* DIRECTION */}
              <select
                className="input"
                value={offsetRule.direction}
                onChange={(e) =>
                  setOffsetRule({ ...offsetRule, direction: e.target.value })
                }
              >
                <option value="On">On</option>
                <option value="Before">Before</option>
                <option value="After">After</option>
              </select>

              {/* DAYS */}
              <input
                type="number"
                min={0}
                className="input"
                value={offsetRule.days}
                onChange={(e) =>
                  setOffsetRule({
                    ...offsetRule,
                    days: Number(e.target.value),
                  })
                }
              />
            </div>
          ) : (
            <Input
              label="Select Date"
              type="date"
              value={fixedDate}
              onChange={(v: string) => setFixedDate(v)}
            />
          )}

          {/* TEMPLATE */}
          <CampaignTemplateEditor
            value={template}
            onChange={setTemplate}
          />
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t flex gap-3">
          <button
            className="flex-1 border rounded-lg py-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            disabled={isPending}
            className="flex-1 bg-blue-600 text-white rounded-lg py-2"
            onClick={handleSubmit}
          >
            {isPending ? "Saving..." : "Save Campaign"}
          </button>
        </div>
      </div>
    </>
  );
};

export default CampaignUpsertSheet;

/* ================= HELPERS ================= */

const Input = ({
  label,
  value,
  onChange,
  required,
  type = "text",
}: any) => (
  <div>
    <label className="text-sm font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      className="input w-full"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);