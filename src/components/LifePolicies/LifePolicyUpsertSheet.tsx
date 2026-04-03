import { useEffect, useState } from "react";
import { X, Eye, Download, Trash2, Plus, FileText, ShieldCheck, CreditCard, UploadCloud, ChevronRight, ChevronDown, UserPlus, AlertCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Spinner from "../common/Spinner";
import SearchableComboBox from "../common/SearchableComboBox";
import { useInsuranceTypes } from "../../hooks/policy/useInsuranceTypes";
import { useCompanyList } from "../../hooks/policy/useCompany";
import { useCompanyWiseProduct } from "../../hooks/policy/useProducts";
import { usePolicyStatusesDropdown } from "../../hooks/policy/usePolicyStatusesDropdown";
import { useCustomerDropdown } from "../../hooks/customer/useCustomerDropdown";
import { useAgencyDropdown } from "../../hooks/LifePolicy/useAgencyDropdown";
import { useUserDropdown } from "../../hooks/LifePolicy/useUserDropdown";
import PolicyFundInfo from "./PolicyFundInfo";
import { useUpsertLifePolicy } from "../../hooks/LifePolicy/useUpsertLifePolicy";
import { useUploadPolicyDocument } from "../../hooks/LifePolicy/useUploadPolicyDocument";
import { usePolicyDocumentActions } from "../../hooks/LifePolicy/usePolicyDocumentActions";


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
  const { data: companies } = useCompanyList(true);

  /*   POLICY DOCUMENT ACTIONS   */
  const [existingDocuments, setExistingDocuments] = useState<
    {fileName: string; url: string; id: string; type: string}[]
  >([]);

  const { preview, download, remove } = usePolicyDocumentActions(
    (deletedId: string) => {
      setExistingDocuments((prev) =>
        prev.filter((f) => f.id !== deletedId)
      );
    }
  );

  /*   FORM STATE   */
  const initialForm = {
    policyId: null as string | null,
    customerId: "",
    cashflows: [],
    riders: [],
    funds: [],
    policyStatusId: undefined as number | undefined,
    policyTypeId: undefined as number | undefined,
    insuredName: "",
    dobOfLa: "",
    age: "",
    proposerName: "",
    nomineeName: "",
    nomineeType: "",
    relationWithLa: "",
    policyNumber: "",
    baName: "",
    agencyName: "",
    insurerId: "",
    productId: "",
    premiumMode: "",
    policyTerm: "",
    ppt: "",
    startDate: "",
    completionDate: "",
    nextPremiumDueDate: "",
    graceDate: "",
    maturityDate: "",
    objective: "",
    insuranceType: "",
    installmentPremium: 0,
    premiumIncludingGst: false,
    basicPremium: 0,
    gstPerc: 0,
    gstAmount: 0,
    finalInstallmentPremium: 0,
    annualPremium: 0,
    sumAssured: "",
    ecs: "",
    paymentBy: "",
    payReferenceNo: "",
    paymentDate: "",
    mandateExpDate: "",
    accountNo: "",
    bankName: "",
    branchName: "",
    remarks: ""
  };

  const [form, setForm] = useState(initialForm);
  const [originalForm, setOriginalForm] = useState<any>(null);
  const [files, setFiles] = useState<{ file: File; type: string; label: string }[]>([]);
  const [selectedDocName, setSelectedDocName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: products } = useCompanyWiseProduct(
    form.insurerId,
    undefined,
    1
  );

  const getMultiplier = (mode: string) => {
    switch (mode) {
      case "Y": return 1;
      case "H": return 2;
      case "Q": return 4;
      case "M": return 12;
      case "S": return 1;
      default: return 1;
    }
  };

  const addMonths = (dateStr: string, months: number) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    d.setMonth(d.getMonth() + months);
    return d.toISOString().split("T")[0];
  };
  
  const addYears = (dateStr: string, years: number) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    d.setFullYear(d.getFullYear() + years);
    return d.toISOString().split("T")[0];
  };

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
  const { mutateAsync, isPending } = useUpsertLifePolicy();
  const { data: policyStatuses, isLoading: sLoading } = usePolicyStatusesDropdown();
  const { data: statusTypes, isLoading: stLoading } = usePolicyStatusesDropdown(1);
  const loadingDropdowns = sLoading || stLoading;

  // ── FIX: use isPending from the upload hook directly (same pattern as CustomerSheet) ──
  const { mutateAsync: uploadPolicyDocument, isPending: isUploading } = useUploadPolicyDocument();

  // ── FIX: combined loading flag — spinner shows during policy save OR document upload ──
  const isLoading = isPending || isUploading;

  const isEditMode = !!policy;
  const { data: customers } = useCustomerDropdown();
  const { data: agencies } = useAgencyDropdown();
  const { data: users } = useUserDropdown();

  /*   PREFILL   */
  useEffect(() => {
    if (!open) {
      setForm(initialForm);
      setOriginalForm(null);
      setExistingDocuments([]);
      setFiles([]);
      setErrors({});
      setActiveTab("general");
      return;
    }
  
    if (policy) {
      const mappedForm = {
        ...initialForm,
        policyId: policy.policyId,
        customerId: policy.customerId,
        policyStatusId: policy.policyStatusId,
        policyTypeId: policy.statusId,
        insuredName: policy.customerName || "",
        dobOfLa: policy.dob?.split("T")[0] || "",
        age: policy.age || "",
        proposerName: policy.proposerName || "",
        nomineeName: policy.nomineeName || "",
        nomineeType: policy.nomineeType || "",
        relationWithLa: policy.relationWithLA || "",
        policyNumber: policy.policyNumber || "",
        baName: policy.baId || "",
        agencyName: policy.agencyId || "",
        insurerId: policy.companyId || "",
        productId: policy.productId || "",
        premiumMode: policy.premiumMode || "",
        policyTerm: policy.policyTerm || "",
        ppt: policy.ppt || "",
        startDate: policy.policyStartDate?.split("T")[0] || "",
        completionDate: policy.completionDate?.split("T")[0] || "",
        nextPremiumDueDate: policy.nextPremiumDueDate?.split("T")[0] || "",
        graceDate: policy.graceDate?.split("T")[0] || "",
        maturityDate: policy.maturityDate?.split("T")[0] || "",
        objective: policy.objectiveOfInsurance || "",
        sumAssured: policy.sumAssured || "",
        installmentPremium: policy.premiumDetails?.installmentPremium || 0,
        premiumIncludingGst: policy.premiumDetails?.premiumIncludingGST || false,
        basicPremium: policy.premiumDetails?.basicPremium || 0,
        gstPerc: policy.premiumDetails?.gstPercentage || 0,
        gstAmount: policy.premiumDetails?.gstAmount || 0,
        finalInstallmentPremium: policy.premiumDetails?.finalInstallmentPremium || 0,
        annualPremium: policy.premiumDetails?.annualPremium || 0,
        ecs: policy.paymentDetails?.ecs || "",
        paymentBy: policy.paymentDetails?.paymentBy || "",
        payReferenceNo: policy.paymentDetails?.paymentRefNo || "",
        paymentDate: policy.paymentDetails?.paymentDate?.split("T")[0] || "",
        mandateExpDate: policy.paymentDetails?.mandateExpDate?.split("T")[0] || "",
        accountNo: policy.paymentDetails?.accountNo || "",
        bankName: policy.paymentDetails?.bankName || "",
        branchName: policy.paymentDetails?.branchName || "",
        remarks: policy.paymentDetails?.remarks || "",
        cashflows: (policy.cashflowDetails || []).map((c: any) => ({
          id: c.id,
          maturityDate: c.maturityDate?.split("T")[0],
          noOfYears: c.noOfYears,
          amount: c.amountPerYear,
          description: c.description,
          isDeleted: c.isDeleted ?? false
        })),
        funds: (policy.fundDetails || []).map((f: any) => ({
          id: f.id,
          fmcName: f.fmcName,
          fmcPercentage: f.fmcPercentage,
          fundDate: f.fundDate?.split("T")[0],
          unitBalance: f.unitBalance,
          isDeleted: f.isDeleted ?? false
        })),
        riders: (policy.riderDetails || []).map((r: any) => ({
          id: r.id,
          name: r.riderName,
          commDate: r.commDate?.split("T")[0],
          sa: r.sumAssured,
          term: r.term,
          ppt: r.ppt,
          yearlyPrem: r.yearlyPremium,
          isDeleted: r.isDeleted ?? false
        })),
      };

      setForm(mappedForm);
      setOriginalForm(mappedForm);

      const mappedDocs = (policy.documents || []).map((d: any) => ({
        id: d.id,
        fileName: d.fileName,
        url: d.url,
        type: d.documentType || "Policy",
      }));
      setExistingDocuments(mappedDocs);

    } else {
      setForm({ ...initialForm, customerId: customerId || "" });
      setOriginalForm(null);
      setExistingDocuments([]);
      setFiles([]);
    }

    setErrors({});
    console.log("POLICY DATA", policy);

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

  useEffect(() => {
    if (!form.startDate || !form.premiumMode) return;
    const nextMonths = getMultiplier(form.premiumMode);
    let next = "";
    let grace = "";
    if (form.premiumMode !== "S") {
      next = addMonths(form.startDate, nextMonths);
      if (form.premiumMode === "Q") {
        grace = next;
      } else {
        grace = addMonths(next, 1);
      }
    }
    const maturity =
      form.policyTerm && form.startDate
        ? addYears(form.startDate, Number(form.policyTerm))
        : "";
    setForm((prev: any) => ({
      ...prev,
      completionDate: prev.completionDate || form.startDate,
      nextPremiumDueDate: next,
      graceDate: grace,
      maturityDate: maturity,
    }));
  }, [form.startDate, form.premiumMode, form.policyTerm]);

  useEffect(() => {
    if (!form.nextPremiumDueDate || form.premiumMode === "S") return;
    let grace = "";
    if (form.premiumMode === "Q") {
      grace = form.nextPremiumDueDate;
    } else {
      grace = addMonths(form.nextPremiumDueDate, 1);
    }
    setForm((prev: any) => ({ ...prev, graceDate: grace }));
  }, [form.nextPremiumDueDate]);

  useEffect(() => {
    if (form.premiumMode === "S" && form.completionDate) {
      setForm((prev: any) => ({ ...prev, maturityDate: prev.completionDate }));
    }
  }, [form.completionDate]);

  useEffect(() => {
    const installment = Number(form.installmentPremium) || 0;
    const gstPerc = Number(form.gstPerc) || 0;
    const multiplier = getMultiplier(form.premiumMode);
    if (!installment) {
      setForm((prev: any) => ({
        ...prev,
        basicPremium: 0,
        gstAmount: 0,
        finalInstallmentPremium: 0,
        annualPremium: 0
      }));
      return;
    }
    let basic = 0;
    let gstAmount = 0;
    let finalInstallment = 0;
    if (form.premiumIncludingGst) {
      basic = installment / (1 + gstPerc / 100);
      gstAmount = installment - basic;
      finalInstallment = installment;
    } else {
      basic = installment;
      gstAmount = basic * (gstPerc / 100);
      finalInstallment = basic + gstAmount;
    }
    const annual = finalInstallment * multiplier;
    setForm((prev: any) => ({
      ...prev,
      basicPremium: Math.round(basic),
      gstAmount: Math.round(gstAmount),
      finalInstallmentPremium: Math.round(finalInstallment),
      annualPremium: Math.round(annual)
    }));
  }, [form.installmentPremium, form.gstPerc, form.premiumIncludingGst, form.premiumMode]);
  
  useEffect(() => {
    if (!form.policyTerm) return;
    setForm((prev: any) => {
      if (form.premiumMode === "S") {
        if (prev.ppt === "1") return prev;
        return { ...prev, ppt: "1" };
      }
      if (!prev.ppt || prev.ppt === "1") {
        return { ...prev, ppt: form.policyTerm };
      }
      return prev;
    });
  }, [form.policyTerm, form.premiumMode]);

  const mapCashflows = (cashflows: any[]) =>
    (cashflows || []).map((c) => {
      const obj: any = {
        maturityDate: toIso(c.maturityDate),
        noOfYears: Number(c.noOfYears) || 0,
        amountPerYear: Number(c.amount) || 0,
        description: c.description || "",
        isDeleted: c.isDeleted ?? false
      };
      if (c.id) obj.id = c.id;
      return obj;
    });
  
  const mapRiders = (riders: any[]) =>
    (riders || []).map((r) => {
      const obj: any = {
        riderName: r.name || "",
        commDate: toIso(r.commDate),
        sumAssured: Number(r.sa) || 0,
        term: Number(r.term) || 0,
        ppt: Number(r.ppt) || 0,
        yearlyPremium: Number(r.yearlyPrem) || 0,
        isDeleted: r.isDeleted ?? false
      };
      if (r.id) obj.id = r.id;
      return obj;
    });
  
  const mapFunds = (funds: any[]) =>
    (funds || []).map((f) => {
      const obj: any = {
        fmcName: f.fmcName || "",
        fmcPercentage: Number(f.fmcPercentage) || 0,
        fundDate: toIso(f.fundDate),
        unitBalance: Number(f.unitBalance) || 0,
        isDeleted: f.isDeleted ?? false
      };
      if (f.id) obj.id = f.id;
      return obj;
    });

  const toIso = (date?: string) =>
    date ? new Date(date).toISOString() : undefined;

  const checkPolicyChanges = (form: any, originalForm: any) => {
    if (!originalForm) return true;
    const fieldsToCheck = [
      "customerId", "policyStatusId", "policyTypeId", "dobOfLa", "age",
      "proposerName", "nomineeName", "nomineeType", "relationWithLa",
      "policyNumber", "baName", "agencyName", "insurerId", "productId",
      "premiumMode", "policyTerm", "ppt", "startDate", "completionDate",
      "nextPremiumDueDate", "graceDate", "maturityDate", "objective",
      "sumAssured", "installmentPremium", "premiumIncludingGst", "basicPremium",
      "gstPerc", "gstAmount", "finalInstallmentPremium", "annualPremium",
      "ecs", "paymentBy", "payReferenceNo", "paymentDate", "mandateExpDate",
      "accountNo", "bankName", "branchName", "remarks"
    ];
    return fieldsToCheck.some((field) => form[field] !== originalForm[field]);
  };

  /*   SAVE   */
  const handleSave = async () => {
    if (!validate()) return;
  
    try {
      let policyId = form.policyId;
      let policyUpdated = false;
      let documentUploaded = false;
  
      const hasPolicyChanged = originalForm ? checkPolicyChanges(form, originalForm) : true;
  
      if (hasPolicyChanged) {
        const payload = {
          policyId: form.policyId || undefined,
          customerId: form.customerId,
          policyStatusId: Number(form.policyStatusId) || 0,
          statusId: Number(form.policyTypeId) || 0,
          dob: toIso(form.dobOfLa),
          age: Number(form.age) || 0,
          proposerName: form.proposerName || "",
          nomineeName: form.nomineeName || "",
          nomineeType: form.nomineeType || "",
          relationWithLA: form.relationWithLa || "",
          policyNumber: form.policyNumber,
          baId: form.baName || null,
          agencyId: form.agencyName || null,
          companyId: form.insurerId || null,
          productId: Number(form.productId) || 0,
          premiumMode: form.premiumMode || "",
          policyTerm: Number(form.policyTerm) || 0,
          ppt: Number(form.ppt) || 0,
          policyStartDate: toIso(form.startDate),
          completionDate: toIso(form.completionDate),
          nextPremiumDueDate: toIso(form.nextPremiumDueDate),
          graceDate: toIso(form.graceDate),
          maturityDate: toIso(form.maturityDate),
          objectiveOfInsurance: form.objective || "",
          sumAssured: Number(form.sumAssured) || 0,
          premium: {
            installmentPremium: Number(form.installmentPremium) || 0,
            premiumIncludingGST: form.premiumIncludingGst,
            basicPremium: Number(form.basicPremium) || 0,
            gstPercentage: Number(form.gstPerc) || 0,
            gstAmount: Number(form.gstAmount) || 0,
            finalInstallmentPremium: Number(form.finalInstallmentPremium) || 0,
            annualPremium: Number(form.annualPremium) || 0,
          },
          payment: {
            ecs: form.ecs || "",
            paymentBy: form.paymentBy || "",
            paymentRefNo: form.payReferenceNo || "",
            paymentDate: toIso(form.paymentDate),
            mandateExpDate: toIso(form.mandateExpDate),
            accountNo: form.accountNo || "",
            bankName: form.bankName || "",
            branchName: form.branchName || "",
            remarks: form.remarks || "",
          },
          cashflows: mapCashflows(form.cashflows),
          riders: mapRiders(form.riders),
          funds: mapFunds(form.funds),
        };
  
        const response = await mutateAsync(payload);
        policyId = response?.data?.policyId || response?.policyId || form.policyId;
        policyUpdated = true;
  
        if (response?.statusMessage) {
          toast.success(response.statusMessage);
        }
      }
  
      // ── FIX: no manual setIsUploading — isUploading comes from hook isPending ──
      if (files.length > 0 && policyId) {
        await Promise.all(
          files.map((f) => {
            const formData = new FormData();
            formData.append("Id", policyId);
            formData.append("Type", "2");
            formData.append("PolicyType", "1");
            formData.append("DocumentType", f.label);
            formData.append("Files", f.file);
            return uploadPolicyDocument(formData);
          })
        );

        documentUploaded = true;
  
        if (!policyUpdated) {
          toast.success("Policy documents uploaded successfully");
        }
      }
  
      onClose();
      onSuccess();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  if (!open) return null;

  return (
    <>
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
            <div className="flex flex-col items-center justify-center h-full"><Spinner /></div>
          ) : (
            <div className="space-y-10">
              {activeTab === "general" && (
                <div className="space-y-6">
                  {/* POLICY PERSONAL INFORMATION */}
                  <section className="bg-white rounded-lg shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 bg-slate-800 px-6 py-3 text-white">
                      <div className="p-1.5 bg-white/10 text-white rounded">
                        <ShieldCheck size={16} />
                      </div>
                      <h3 className="font-bold uppercase tracking-wider text-[10px]">Policy Personal Information</h3>
                    </div>
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
                              setForm((p: any) => ({ ...p, policyStatusId: Number(v) }))
                            }
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Select
                            label="Status"
                            value={form.policyTypeId}
                            options={statusTypes}
                            valueKey="statusId"
                            labelKey="statusName"
                            onChange={(v: any) =>
                              setForm((p: any) => ({ ...p, policyTypeId: Number(v) }))
                            }
                          />
                        </div>
                        <div className="md:col-span-4">
                          <SearchableComboBox
                            label="Life Assured"
                            required
                            error={errors.insuredName}
                            items={(customers || []).map((c: any) => ({
                              value: c.customerId,
                              label: c.clientName
                            }))}
                            value={form.customerId}
                            onSelect={(item: any) =>
                              setForm((p: any) => ({
                                ...p,
                                customerId: item?.value || "",
                                insuredName: item?.label || ""
                              }))
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
                            options={[
                              { id: "Nominee", name: "Nominee" },
                              { id: "Assignee", name: "Assignee" },
                              { id: "Beneficiary", name: "Beneficiary" },
                              { id: "Proposer", name: "Proposer" },
                            ]}
                            onChange={(v: any) => setForm((p: any) => ({ ...p, nomineeType: v }))}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <SearchableComboBox
                            label="RELATION WITH LA"
                            value={form.relationWithLa}
                            items={[
                              { label: "Self", value: "Self" },
                              { label: "Spouse", value: "Spouse" },
                              { label: "Husband", value: "Husband" },
                              { label: "Son", value: "Son" },
                              { label: "Daughter", value: "Daughter" },
                              { label: "Father", value: "Father" },
                              { label: "Mother", value: "Mother" },
                              { label: "Brother", value: "Brother" },
                              { label: "Sister", value: "Sister" },
                              { label: "Father-In-Law", value: "Father-In-Law" },
                              { label: "Mother-In-Law", value: "Mother-In-Law" },
                              { label: "Grand Father", value: "Grand Father" },
                              { label: "Grand Mother", value: "Grand Mother" },
                              { label: "Grand Son", value: "Grand Son" },
                              { label: "Grand Daughter", value: "Grand Daughter" },
                            ]}
                            onSelect={(item: any) => {
                              setForm((prev) => ({
                                ...prev,
                                relationWithLa: item?.value || "",
                              }));
                            }}
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
                            label="BA NAME"
                            items={(users || []).map((u: any) => ({
                              value: u.id,
                              label: u.name
                            }))}
                            value={form.baName}
                            onSelect={(item: any) =>
                              setForm((p: any) => ({
                                ...p,
                                baName: item?.value || ""
                              }))
                            }
                          />
                        </div>
                      </div>

                      {/* ROW 4 */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-4">
                          <SearchableComboBox
                            label="Agency Name"
                            required
                            error={errors.agencyName}
                            items={(agencies || []).map((a: any) => ({
                              value: a.id,
                              label: a.agencyName
                            }))}
                            value={form.agencyName}
                            onSelect={(item: any) =>
                              setForm((p: any) => ({
                                ...p,
                                agencyName: item?.value || ""
                              }))
                            }
                          />
                        </div>
                        <div className="md:col-span-4">
                          <SearchableComboBox
                            label="COMPANY NAME"
                            required
                            error={errors.insurerId}
                            items={(companies || []).map((c: any) => ({
                              value: c.companyId,
                              label: c.companyName,
                            }))}
                            value={form.insurerId}
                            onSelect={(item: any) =>
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
                            label="PRODUCT NAME"
                            required
                            error={errors.productId}
                            items={(products || []).map((p: any) => ({
                              value: p.id,
                              label: p.productName,
                            }))}
                            value={form.productId}
                            disabled={!form.insurerId}
                            onSelect={(item: any) =>
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
                            options={[
                              { id: "Y", name: "Yearly" },
                              { id: "H", name: "Half Yearly" },
                              { id: "Q", name: "Quarterly" },
                              { id: "M", name: "Monthly" },
                              { id: "S", name: "Single" },
                            ]}
                            onChange={(v: any) =>
                              setForm((prev: any) => ({
                                ...prev,
                                premiumMode: v,
                                ppt: v === "S" ? "1" : prev.policyTerm
                              }))
                            }
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Input
                            label="Policy Term"
                            value={form.policyTerm}
                            placeholder="Policy Term"
                            max={999}
                            onChange={(v: any) => {
                              const value = v.slice(0, 3);
                              setForm((p: any) => ({
                                ...p,
                                policyTerm: value,
                                ppt: p.premiumMode === "S" ? "1" : value
                              }));
                            }}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Input
                            label="PPT"
                            value={form.ppt}
                            placeholder="PPT"
                            disabled={form.premiumMode === "S"}
                            onChange={(v: any) => {
                              if (form.premiumMode === "S") return;
                              const value = v.slice(0, 3);
                              if (Number(value) > Number(form.policyTerm)) {
                                toast.error("Term should be greater than or equal to PPT.");
                                return;
                              }
                              setForm((p: any) => ({ ...p, ppt: value }));
                            }}
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
                            disabled={form.premiumMode === "S"}
                            onChange={(v: any) => setForm((p: any) => ({ ...p, nextPremiumDueDate: v }))}
                          />
                        </div>
                        <div className="md:col-span-4">
                          <Input
                            type="date"
                            label="Grace Date"
                            value={form.graceDate}
                            disabled={form.premiumMode === "S"}
                            onChange={(v: any) => setForm(p => ({ ...p, graceDate: v }))}
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
                            disabled
                          />
                        </div>
                        <div className="md:col-span-8">
                          <SearchableComboBox
                            label="OBJECTIVE OF INSURANCE"
                            value={form.objective}
                            items={[
                              { label: "Saving", value: "Saving" },
                              { label: "Investment", value: "Investment" },
                              { label: "Taxation", value: "Taxation" },
                              { label: "Education", value: "Education" },
                              { label: "Protection", value: "Protection" },
                              { label: "Pension", value: "Pension" },
                              { label: "Retirement", value: "Retirement" },
                            ]}
                            onSelect={(item: any) => {
                              setForm((prev: any) => ({
                                ...prev,
                                objective: item?.value || "",
                              }));
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* PREMIUM DETAILS */}
                  <section className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="flex items-center gap-2 bg-slate-800 px-6 py-3 text-white">
                      <div className="p-1.5 bg-white/10 text-white rounded">
                        <CreditCard size={16} />
                      </div>
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
                          <Input label="Basic Premium" type="number" value={form.basicPremium} onChange={(v: any) => setForm(p => ({ ...p, basicPremium: v }))} />
                        </div>
                        <div className="md:col-span-1">
                          <Input label="GST Perc." type="number" value={form.gstPerc} onChange={(v: any) => setForm(p => ({ ...p, gstPerc: Number(v) }))} suffix={<span className="text-xs font-bold text-slate-400">%</span>} />
                        </div>
                        <div className="md:col-span-2">
                          <Input label="GST Amount" type="number" value={form.gstAmount} onChange={(v: any) => setForm(p => ({ ...p, gstAmount: v }))} />
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
                    <div className="flex items-center gap-2 bg-slate-800 px-6 py-3 text-white">
                      <div className="p-1.5 bg-white/10 text-white rounded">
                        <CreditCard size={16} />
                      </div>
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
                          <SearchableComboBox
                            label="PAYMENT BY"
                            value={form.paymentBy}
                            items={[
                              { label: "Cash", value: "Cash" },
                              { label: "Cheque", value: "Cheque" },
                              { label: "Credit Card", value: "Credit Card" },
                              { label: "Demand Draft", value: "Demand Draft" },
                              { label: "ECS", value: "ECS" },
                              { label: "Online", value: "Online" },
                            ]}
                            onSelect={(item: any) =>
                              setForm((prev: any) => ({ ...prev, paymentBy: item?.value || "" }))
                            }
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
                </div>
              )}

              {activeTab === "related" && (
                <PolicyFundInfo 
                  form={form}
                  setForm={setForm}
                />
              )}

              {activeTab === "documents" && (
                <div className="space-y-8">
                  {!isEditMode && (
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-3">
                      <AlertCircle size={16} className="text-amber-600 shrink-0" />
                      <p className="text-xs text-amber-700 leading-relaxed">
                        Documents will be uploaded automatically when you click <strong>SAVE</strong>.
                      </p>
                    </div>
                  )}

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
                            <div key={file.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group">
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
                                <button onClick={() => preview(file.url)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                  <Eye size={16} />
                                </button>
                                <button onClick={() => download(file.url, file.fileName)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                  <Download size={16} />
                                </button>
                                <button 
                                  onClick={async () => {
                                    if (!confirm("Delete this document?")) return;
                                    try {
                                      await remove(policy.policyId, file.id);
                                      setExistingDocuments(prev =>
                                        prev.filter(f => f.id !== file.id)
                                      );
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
              disabled={isLoading}
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