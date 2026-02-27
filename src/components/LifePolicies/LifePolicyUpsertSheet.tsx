import { useEffect, useState } from "react";
import { X, Eye, Download, Trash2, Plus, FileText, ShieldCheck, CreditCard, UploadCloud, ChevronRight, ChevronDown, UserPlus, AlertCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Spinner from "../common/Spinner";
import SearchableComboBox from "../common/SearchableComboBox";
import PolicyFundInfo from "./PolicyFundInfo";
import { useInsuranceTypes } from "../../hooks/policy/useInsuranceTypes";
import { useCompanyList } from "../../hooks/policy/useCompany";
import { useCompanyWiseProduct } from "../../hooks/policy/useProducts";
import { usePolicyTypesDropdown } from "../../hooks/policy/usePolicyTypesDropdown";
import { usePolicyStatusesDropdown } from "../../hooks/policy/usePolicyStatusesDropdown";

// --- MOCK HOOKS (Replace with real ones in production) ---
const useUpsertPolicy = () => ({ mutateAsync: async (d: any) => { console.log("Saving...", d); await new Promise(r => setTimeout(r, 1000)); }, isPending: false });

const usePolicyDocumentActions = (cb: any) => ({ 
  preview: (p: any, f: any) => toast.success("Previewing " + f), 
  download: (p: any, f: any, n: any) => toast.success("Downloading " + n), 
  remove: async (p: any, f: any) => { toast.success("Removed " + f); cb(f); } 
});


interface Props {
  open: boolean;
  onClose: () => void;
  policy?: any;
  customerId?: string;
  onSuccess: () => void;
}

type TabType = "general" | "related" | "documents";

const PolicyUpsertSheet = ({
  open,
  onClose,
  policy,
  customerId,
  onSuccess,
}: Props) => {
  const [activeTab, setActiveTab] = useState<TabType>("general");

  /*   LOCK BODY SCROLL   */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);
  
  const { data: insuranceTypes } = useInsuranceTypes();
  const { data: companies } = useCompanyList();


  /*   POLICY DOCUMENT ACTIONS   */
  const [existingDocuments, setExistingDocuments] = useState<
    { fileName: string; savedFileName: string; type: string }[]
  >([]);

  const { preview, download, remove } = usePolicyDocumentActions(
    (deletedId: string) => {
      setExistingDocuments((prev) =>
        prev.filter((f) => f.savedFileName !== deletedId)
      );
    }
  );

  /*   FORM STATE   */
  const initialForm = {
    policyId: null as string | null,
    customerId: "",
    
    // Policy Personal Information
    policyStatusId: undefined as number | undefined,
    policyTypeId: undefined as number | undefined, // Mapping to "Status" field in screenshot
    insuredName: "",
    dobOfLa: "",
    age: "",
    proposerName: "",
    nomineeName: "",
    nomineeType: "Nominee",
    relationWithLa: "Spouse",
    policyNumber: "",
    baName: "ALPESH SHELADIYA",
    agencyName: "",
    insurerId: "",
    productId: "",
    premiumMode: "Y",
    policyTerm: "",
    ppt: "",
    startDate: "",
    completionDate: "2026-02-25",
    nextPremiumDueDate: "",
    graceDate: "",
    maturityDate: "",
    objective: "Select",
    insuranceType: "1", // Default to LI

    // Premium Details
    installmentPremium: 0,
    premiumIncludingGst: true,
    basicPremium: 0,
    gstPerc: 0,
    gstAmount: 0,
    finalInstallmentPremium: 0,
    annualPremium: 0,
    sumAssured: "",

    // Payment Details
    ecs: "No",
    paymentBy: "Select",
    payReferenceNo: "",
    paymentDate: "",
    mandateExpDate: "",
    accountNo: "",
    bankName: "",
    branchName: "",
    remarks: ""
  };

  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState<{ file: File; type: string; label: string }[]>([]);
  const [selectedDocName, setSelectedDocName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { data: products } = useCompanyWiseProduct(
    form.insurerId,
    Number(form.insuranceType) 
  );

  const documentOptions = [
    { id: "Policy Copy", name: "Policy Copy" },
    { id: "Proposal Form", name: "Proposal Form" },
    { id: "Aadhar Card", name: "Aadhar Card" },
    { id: "PAN Card", name: "PAN Card" },
    { id: "Previous Policy", name: "Previous Policy" },
    { id: "RC Copy", name: "RC Copy" },
    { id: "Driving License", name: "Driving License" },
    { id: "Others", name: "Others" },
  ];

  
  /*   API HOOKS   */
const { mutateAsync, isPending } = useUpsertPolicy();
const { data: policyStatuses, isLoading: sLoading } =
  usePolicyStatusesDropdown();
const { data: statusTypes, isLoading: stLoading } =
  usePolicyStatusesDropdown(1);
const loadingDropdowns = sLoading || stLoading; 
const isLoading = isPending;

  /*   PREFILL   */
  useEffect(() => {
    if (!open) {
      setForm(initialForm);
      setExistingDocuments([]);
      setFiles([]);
      setErrors({});
      setActiveTab("general");
      return;
    }

    if (policy) {
      setForm({
        ...initialForm,
        ...policy,
        policyId: policy.policyId ?? null,
        startDate: policy.startDate ? policy.startDate.split("T")[0] : "",
        endDate: policy.endDate ? policy.endDate.split("T")[0] : "",
        loginDate: policy.loginDate ? policy.loginDate.split("T")[0] : "",
        paymentDate: policy.paymentDate ? policy.paymentDate.split("T")[0] : "",
      });

      const docs = policy.policyDocuments || [];
      const mappedDocs = docs.map((d: any) => ({
        fileName: d.fileName,
        savedFileName: d.url.split("/").pop() || "",
        type: d.type || "Policy"
      }));
      setExistingDocuments(mappedDocs);
      setFiles([]);
    } else {
      setForm({ ...initialForm, customerId: customerId || "" });
      setExistingDocuments([]);
      setFiles([]);
    }
    setErrors({});
  }, [open, policy, customerId]);

  /*   VALIDATION   */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.insuredName?.trim()) e.insuredName = "Life Assured is required";
    if (!form.policyNumber?.trim()) e.policyNumber = "Policy number is required";
    if (!form.agencyName?.trim()) e.agencyName = "Agency name is required";
    if (!form.insurerId) e.insurerId = "Company name is required";
    if (!form.productId) e.productId = "Product name is required";
    if (!form.startDate) e.startDate = "Policy start date is required";
    if (!form.sumAssured) e.sumAssured = "Sum Assured is required";

    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error("Please fix validation errors");
      return false;
    }
    return true;
  };

  /*   SAVE  */
  const handleSave = async () => {
    if (!validate()) return;

    try {
      const formData = new FormData();
      if (form.policyId) formData.append("PolicyId", form.policyId);
      
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key.toLowerCase().includes("date") && value) {
            formData.append(key, new Date(value as string + "T00:00:00").toISOString());
          } else if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      files.forEach((f) => {
        formData.append("PolicyDocuments", f.file);
        formData.append("DocumentTypes", f.type);
        formData.append("DocumentLabels", f.label);
      });

      await mutateAsync(formData);
      toast.success("Policy saved successfully");
      onClose();
      onSuccess();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  if (!open) return null;

  const nomineeTypes = [{ id: "Nominee", name: "Nominee" }];
  const relations = [{ id: "Spouse", name: "Spouse" }];
  const premiumModes = [{ id: "Y", name: "Y" }, { id: "H", name: "H" }, { id: "Q", name: "Q" }, { id: "M", name: "M" }];

  return (
    <>
      <Toaster position="top-right"/>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]" onClick={isLoading ? undefined : onClose} />

      <div 
        className="fixed top-0 right-0 w-full max-w-[70vw] h-screen bg-slate-50 z-[70] shadow-2xl flex flex-col animate-slide-in-right"
      >
        {/* HEADER */}
        <div className="px-8 py-6 bg-white border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {policy ? "Edit LI Policy" : "Add New LI Policy"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">Fill in the details to {policy ? 'update' : 'create'} the insurance policy.</p>
          </div>
          <button 
            onClick={onClose} 
            disabled={isLoading}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* TABS */}
        <div className="px-8 bg-white border-b flex gap-8">
          {[
            { id: "general", label: "General Insurance Policy Purchase", icon: ShieldCheck },
            { id: "related", label: "Policy Related Information", icon: FileText },
            { id: "documents", label: "Document Upload", icon: UploadCloud },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`
                flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-all
                ${activeTab === tab.id 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200"}
              `}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-8">
          {loadingDropdowns ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Spinner />
              <p className="text-slate-500 animate-pulse">Loading configuration...</p>
            </div>
          ) : (
            <div className="max-w-full mx-auto space-y-10">
              
              {activeTab === "general" && (
                <>
                  {/* POLICY PERSONAL INFORMATION */}
                  <section className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 space-y-6">
                      {/* ROW 1 */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-2">
                          <Select
                            label="Policy Status"
                            value={form.policyStatusId}
                            options={policyStatuses}
                            valueKey="policyStatusId"
                            labelKey="statusName"
                            onChange={(v: any) =>
                              setForm((p: any) => ({ ...p, policyStatusId: v }))
                            }
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Select
                            label="Status"
                            value={form.policyTypeId}
                            options={statusTypes}   // 👈 filtered by type=1
                            valueKey="policyStatusId"
                            labelKey="statusName"
                            onChange={(v: any) =>
                              setForm((p: any) => ({ ...p, policyTypeId: v }))
                            }
                          />
                        </div>
                        <div className="md:col-span-4">
                          <Input
                            label="Life Assured"
                            required
                            value={form.insuredName}
                            error={errors.insuredName}
                            placeholder="Insured Name"
                            onChange={(v: any) => setForm((p: any) => ({ ...p, insuredName: v }))}
                            suffix={
                              <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                                <UserPlus size={16} className="text-slate-900" />
                              </button>
                            }
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Input
                            type="date"
                            label="DOB Of LA"
                            value={form.dobOfLa}
                            onChange={(v: any) => setForm((p: any) => ({ ...p, dobOfLa: v }))}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Input
                            type="number"
                            label="Age"
                            value={form.age}
                            placeholder="Age"
                            onChange={(v: any) => setForm((p: any) => ({ ...p, age: v }))}
                          />
                        </div>
                      </div>

                      {/* ROW 2 */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-4">
                          <Input
                            label="Proposer Name"
                            value={form.proposerName}
                            placeholder="Proposer Name"
                            onChange={(v: any) => setForm((p: any) => ({ ...p, proposerName: v }))}
                          />
                        </div>
                        <div className="md:col-span-4">
                          <Input
                            label="Nominee Name"
                            value={form.nomineeName}
                            placeholder="Nominee Name"
                            onChange={(v: any) => setForm((p: any) => ({ ...p, nomineeName: v }))}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Select
                            label="Nominee Type"
                            value={form.nomineeType}
                            options={[{ id: "Nominee", name: "Nominee" }]}
                            onChange={(v: any) => setForm((p: any) => ({ ...p, nomineeType: v }))}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Select
                            label="Relation with LA"
                            value={form.relationWithLa}
                            options={[{ id: "Spouse", name: "Spouse" }, { id: "Father", name: "Father" }, { id: "Mother", name: "Mother" }]}
                            onChange={(v: any) => setForm((p: any) => ({ ...p, relationWithLa: v }))}
                          />
                        </div>
                      </div>

                      {/* ROW 3 */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-4">
                          <Input
                            label="Policy Number"
                            required
                            value={form.policyNumber}
                            error={errors.policyNumber}
                            placeholder="Policy Number"
                            onChange={(v: any) => setForm((p: any) => ({ ...p, policyNumber: v }))}
                          />
                        </div>
                        <div className="md:col-span-8">
                          <SearchableComboBox
                            label="BA Name"
                            items={[{ value: "ALPESH SHELADIYA", label: "ALPESH SHELADIYA" }]}
                            value={form.baName}
                            onSelect={(item) => setForm((p: any) => ({ ...p, baName: item?.value }))}
                          />
                        </div>
                      </div>

                      {/* ROW 4 */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-4">
                          <Select
                            label="Agency Name"
                            required
                            value={form.agencyName}
                            error={errors.agencyName}
                            options={[{ id: "Agency 1", name: "Agency 1" }]}
                            onChange={(v: any) => setForm((p: any) => ({ ...p, agencyName: v }))}
                          />
                        </div>
                        <div className="md:col-span-4">
                          <SearchableComboBox
                            label="Company Name"
                            required
                            error={errors.insurerId}
                            items={(companies || []).map((c: any) => ({
                              value: c.companyId,
                              label: c.companyName,
                            }))}
                            value={form.insurerId}
                            onSelect={(item) =>
                              setForm({
                                ...form,
                                insurerId: item?.value || "",
                                productId: "",
                              })
                            }
                          />
                        </div>
                        <div className="md:col-span-4">
                          <SearchableComboBox
                            label="Product Name"
                            required
                            error={errors.productId}
                            items={(products || []).map((p: any) => ({
                              value: p.id,
                              label: p.productName,
                            }))}
                            value={form.productId}
                            disabled={!form.insurerId}
                            onSelect={(item) =>
                              setForm((p: any) => ({ ...p, productId: item?.value }))
                            }
                          />
                        </div>
                      </div>

                      {/* ROW 5 */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-4">
                          <Select
                            label="Premium Mode"
                            value={form.premiumMode}
                            options={[{ id: "Y", name: "Y" }, { id: "H", name: "H" }, { id: "Q", name: "Q" }, { id: "M", name: "M" }]}
                            onChange={(v: any) => setForm((p: any) => ({ ...p, premiumMode: v }))}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Input
                            label="Policy Term"
                            value={form.policyTerm}
                            placeholder="Policy Term"
                            onChange={(v: any) => setForm((p: any) => ({ ...p, policyTerm: v }))}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Input
                            label="PPT"
                            value={form.ppt}
                            placeholder="PPT"
                            onChange={(v: any) => setForm((p: any) => ({ ...p, ppt: v }))}
                          />
                        </div>
                        <div className="md:col-span-4">
                          <Input
                            type="date"
                            label="Policy Start Date"
                            required
                            error={errors.startDate}
                            value={form.startDate}
                            onChange={(v: any) => setForm((p: any) => ({ ...p, startDate: v }))}
                          />
                        </div>
                      </div>

                      {/* ROW 6 */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-4">
                          <Input
                            type="date"
                            label="Completion Date"
                            value={form.completionDate}
                            onChange={(v: any) => setForm((p: any) => ({ ...p, completionDate: v }))}
                          />
                        </div>
                        <div className="md:col-span-4">
                          <Input
                            type="date"
                            label="Next Premium Due Date"
                            value={form.nextPremiumDueDate}
                            onChange={(v: any) => setForm((p: any) => ({ ...p, nextPremiumDueDate: v }))}
                          />
                        </div>
                        <div className="md:col-span-4">
                          <Input
                            type="date"
                            label="Grace Date"
                            value={form.graceDate}
                            onChange={(v: any) => setForm((p: any) => ({ ...p, graceDate: v }))}
                          />
                        </div>
                      </div>

                      {/* ROW 7 */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-4">
                          <Input
                            type="date"
                            label="Maturity Date"
                            value={form.maturityDate}
                            onChange={(v: any) => setForm((p: any) => ({ ...p, maturityDate: v }))}
                          />
                        </div>
                        <div className="md:col-span-8">
                          <Select
                            label="Objective of Insurance"
                            value={form.objective}
                            options={[{ id: "Select", name: "Select" }]}
                            onChange={(v: any) => setForm((p: any) => ({ ...p, objective: v }))}
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* PREMIUM DETAILS */}
                  <section className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-[#4a5568] px-4 py-2 text-white">
                      <h3 className="font-bold uppercase tracking-wider text-[10px]">Premium Details</h3>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        <div className="md:col-span-3">
                          <Input label="Installment Premium" type="number" value={form.installmentPremium} onChange={(v: any) => setForm(p => ({ ...p, installmentPremium: Number(v) }))} />
                        </div>
                        <div className="md:col-span-3 pb-3">
                          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={form.premiumIncludingGst}
                              onChange={(e) => setForm(p => ({ ...p, premiumIncludingGst: e.target.checked }))}
                              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                            />
                            Premium Including GST
                          </label>
                        </div>
                        <div className="md:col-span-3">
                          <Input label="Basic Premium" type="number" value={form.basicPremium} onChange={(v: any) => setForm(p => ({ ...p, basicPremium: Number(v) }))} />
                        </div>
                        <div className="md:col-span-1">
                          <Input label="GST Perc." type="number" value={form.gstPerc} onChange={(v: any) => setForm(p => ({ ...p, gstPerc: Number(v) }))} suffix={<span className="text-xs font-bold text-slate-400">%</span>} />
                        </div>
                        <div className="md:col-span-2">
                          <Input label="GST Amount" type="number" value={form.gstAmount} onChange={(v: any) => setForm(p => ({ ...p, gstAmount: Number(v) }))} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-3">
                          <Input label="Final Installment Premium" type="number" value={form.finalInstallmentPremium} onChange={(v: any) => setForm(p => ({ ...p, finalInstallmentPremium: Number(v) }))} />
                        </div>
                        <div className="md:col-span-3">
                          <Input label="Annual Premium" type="number" value={form.annualPremium} onChange={(v: any) => setForm(p => ({ ...p, annualPremium: Number(v) }))} />
                        </div>
                        <div className="md:col-span-6">
                          <Input label="Sum Assured" required error={errors.sumAssured} value={form.sumAssured} placeholder="Sum Assured" onChange={(v: any) => setForm(p => ({ ...p, sumAssured: v }))} />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* PAYMENT DETAILS */}
                  <section className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-[#4a5568] px-4 py-2 text-white">
                      <h3 className="font-bold uppercase tracking-wider text-[10px]">Payment Details</h3>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-3">
                          <Select
                            label="ECS"
                            value={form.ecs}
                            options={[{ id: "No", name: "No" }, { id: "Yes", name: "Yes" }]}
                            onChange={(v: any) => setForm(p => ({ ...p, ecs: v }))}
                          />
                        </div>
                        <div className="md:col-span-3">
                          <Select
                            label="Payment By"
                            value={form.paymentBy}
                            options={[{ id: "Select", name: "Select" }, { id: "Self", name: "Self" }]}
                            onChange={(v: any) => setForm(p => ({ ...p, paymentBy: v }))}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Input label="Payment Ref. No" value={form.payReferenceNo} placeholder="Payment Ref. No" onChange={(v: any) => setForm(p => ({ ...p, payReferenceNo: v }))} />
                        </div>
                        <div className="md:col-span-2">
                          <Input label="Payment Date" type="date" value={form.paymentDate} onChange={(v: any) => setForm(p => ({ ...p, paymentDate: v }))} />
                        </div>
                        <div className="md:col-span-2">
                          <Input label="Mandate Exp Date" type="date" value={form.mandateExpDate} onChange={(v: any) => setForm(p => ({ ...p, mandateExpDate: v }))} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-3">
                          <Input label="Account No" value={form.accountNo} placeholder="Account No" onChange={(v: any) => setForm(p => ({ ...p, accountNo: v }))} />
                        </div>
                        <div className="md:col-span-3">
                          <Input label="Bank Name" value={form.bankName} placeholder="Bank Name" onChange={(v: any) => setForm(p => ({ ...p, bankName: v }))} />
                        </div>
                        <div className="md:col-span-3">
                          <Input label="Branch Name" value={form.branchName} placeholder="Branch Name" onChange={(v: any) => setForm(p => ({ ...p, branchName: v }))} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div className="w-full space-y-1.5">
                          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">Remarks</label>
                          <textarea
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded text-sm transition-all outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 min-h-[80px]"
                            placeholder="Remarks"
                            value={form.remarks}
                            onChange={(e) => setForm(p => ({ ...p, remarks: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                  </section>
                </>
              )}

              {activeTab === "related" && (
                <PolicyFundInfo
                  form={form}
                  setForm={setForm}
                  insuranceTypeId={Number(form.insuranceType || 0)}
                />
              )}
              {activeTab === "documents" && (
                <div className="space-y-8">
                  {/* UPLOAD SECTION */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                      <div className="lg:col-span-1 space-y-6">
                        <Select
                          label="Document Name"
                          required
                          value={selectedDocName}
                          options={documentOptions}
                          onChange={(v: string) => setSelectedDocName(v)}
                        />
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertCircle size={14} className="text-blue-600" />
                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Quick Tip</p>
                          </div>
                          <p className="text-xs text-blue-700 leading-relaxed">
                            Select the document type first, then click or drag files to the upload area.
                          </p>
                        </div>
                      </div>

                      <div className="lg:col-span-2 space-y-3">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-xs">Select Document</label>
                        <div className="relative">
                          <input
                            id="policy-upload"
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            disabled={isLoading}
                            onChange={(e) => {
                              if (!e.target.files) return;
                              if (!selectedDocName) {
                                toast.error("Please select a document name first");
                                return;
                              }
                              const newFiles = Array.from(e.target.files).map(f => ({ 
                                file: f, 
                                type: "Policy", 
                                label: selectedDocName
                              }));
                              setFiles(prev => [...prev, ...newFiles]);
                              setSelectedDocName(""); 
                              e.target.value = ""; 
                            }}                  
                          />
                          <label 
                            htmlFor="policy-upload"
                            className={`
                              flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl transition-all cursor-pointer group
                              ${!selectedDocName ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-50' : 'bg-white border-blue-200 hover:bg-blue-50/50 hover:border-blue-400 shadow-sm'}
                            `}
                          >
                            <div className="flex items-center gap-6">
                              <div className={`p-4 rounded-2xl shadow-sm transition-all ${selectedDocName ? 'bg-blue-600 text-white group-hover:scale-110 group-hover:shadow-blue-200 group-hover:shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                                <UploadCloud size={28} />
                              </div>
                              <div className="text-left">
                                <p className="text-base font-bold text-slate-800">
                                  {selectedDocName ? `Click to upload ${selectedDocName}` : "Select name to enable upload"}
                                </p>
                                <p className="text-xs text-slate-400 font-medium mt-1">Supports PDF, PNG, JPG (Max 10MB per file)</p>
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FILE LISTS */}
                  <div className="space-y-8">
                    {/* NEW FILES */}
                    {files.length > 0 && (
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-4">
                          <Plus size={18} className="text-blue-600" /> New Attachments
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {files.map((f, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm">
                                  <FileText size={16} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-slate-700 truncate">{f.label}</p>
                                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{f.file.name} • {f.type}</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => setFiles(prev => prev.filter((_, i) => i !== idx))}
                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* EXISTING DOCUMENTS */}
                    {existingDocuments.length > 0 && (
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-4">
                          <ShieldCheck size={18} className="text-emerald-600" /> Existing Documents
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {existingDocuments.map((file) => (
                            <div key={file.savedFileName} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm">
                                  <FileText size={16} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-slate-700 truncate">{file.fileName}</p>
                                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{file.type}</p>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <button onClick={() => preview(policy.policyId, file.savedFileName)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                  <Eye size={16} />
                                </button>
                                <button onClick={() => download(policy.policyId, file.savedFileName, file.fileName)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                  <Download size={16} />
                                </button>
                                <button 
                                  onClick={async () => {
                                    if (!confirm("Delete this document?")) return;
                                    try {
                                      await remove(policy.policyId, file.savedFileName);
                                      setExistingDocuments(prev => prev.filter(f => f.savedFileName !== file.savedFileName));
                                    } catch {
                                      toast.error("Failed to delete document");
                                    }
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 bg-white border-t flex justify-between items-center">
          <div className="flex gap-4">
            <button
              disabled={isLoading || loadingDropdowns}
              className="px-8 py-2.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              onClick={handleSave}
            >
              {isLoading ? <Spinner className="text-white" /> : "SAVE"}
            </button>
            <button
              className="px-8 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded flex items-center justify-center gap-2 shadow-lg transition-all"
              onClick={onClose}
              disabled={isLoading}
            >
              CANCEL
            </button>
          </div>

          <div className="flex gap-4">
            {activeTab !== "general" && (
              <button
                onClick={() => setActiveTab(activeTab === "documents" ? "related" : "general")}
                className="px-6 py-2.5 text-sm font-bold text-white bg-red-400 hover:bg-red-500 rounded flex items-center gap-2 transition-all"
              >
                Previous
              </button>
            )}
            {activeTab !== "documents" && (
              <button
                onClick={() => setActiveTab(activeTab === "general" ? "related" : "documents")}
                className="px-6 py-2.5 text-sm font-bold text-white bg-blue-400 hover:bg-blue-500 rounded flex items-center gap-2 transition-all"
              >
                Next <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PolicyUpsertSheet;

/*   HELPERS   */

const Input = ({
  label,
  required,
  value,
  error,
  type = "text",
  onChange,
  placeholder,
  min,
  max,
  disabled,
  className = "",
  suffix
}: any) => (
  <div className="space-y-1.5 w-full">
    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        type={type}
        disabled={disabled}
        min={min}
        max={max}
        placeholder={placeholder}
        className={`
          w-full px-4 py-2.5 bg-white border rounded text-sm transition-all outline-none
          ${error ? "border-red-500 ring-2 ring-red-50" : "border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"}
          ${disabled ? "bg-slate-50 cursor-not-allowed opacity-60" : ""}
          ${suffix ? "pr-14" : ""}
          ${className}
        `}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
      {suffix && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {suffix}
        </div>
      )}
    </div>
    {error && <p className="text-[10px] font-medium text-red-500 mt-1">{error}</p>}
  </div>
);

const Select = ({
  label,
  required,
  options,
  value,
  onChange,
  disabled = false,
  valueKey = "id",
  labelKey = "name",
  error,
}: any) => (
  <div className="space-y-1.5 w-full">
    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <select
        disabled={disabled}
        className={`
          w-full px-4 py-2.5 bg-white border rounded text-sm transition-all outline-none appearance-none
          ${error ? "border-red-500 ring-2 ring-red-50" : "border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"}
          ${disabled ? "bg-slate-50 cursor-not-allowed opacity-60" : ""}
        `}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select</option>
        {options?.map((o: any) => (
          <option key={o[valueKey]} value={o[valueKey]}>
            {o[labelKey]}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
    {error && <p className="text-[10px] font-medium text-red-500 mt-1">{error}</p>}
  </div>
);
