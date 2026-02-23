import { useEffect, useState } from "react";
import { X, Eye, Download, Trash2, Plus, FileText, ShieldCheck, CreditCard, UploadCloud, ChevronRight, ChevronDown, UserPlus, AlertCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Spinner from "../common/Spinner";
import SearchableComboBox from "../common/SearchableComboBox";

// --- MOCK HOOKS (Replace with real ones in production) ---
const useUpsertPolicy = () => ({ mutateAsync: async (d: any) => { console.log("Saving...", d); await new Promise(r => setTimeout(r, 1000)); }, isPending: false });
const usePolicyTypesDropdown = () => ({ data: [{ policyTypeId: 1, typeName: "Fresh" }, { policyTypeId: 2, typeName: "Renewal" }, { policyTypeId: 3, typeName: "Portability" }, { policyTypeId: 4, typeName: "Rollover" }], isLoading: false });
const usePolicyStatusesDropdown = () => ({ data: [{ policyStatusId: 1, statusName: "Policy" }, { policyStatusId: 2, statusName: "Proposal" }], isLoading: false });
const useCustomerDropdown = () => ({ data: [{ customerId: "1", fullName: "John Doe" }], isLoading: false });
const useInsurerDropdown = () => ({ data: [{ insurerId: "1", insurerName: "LIC" }, { insurerId: "2", insurerName: "HDFC ERGO" }], isLoading: false });
const useProductDropdown = (id?: string) => ({ data: [{ productId: "1", productName: "Term Life" }, { productId: "2", productName: "Health Insurance" }], isLoading: false });
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
    insurerId: "",
    productId: "",
    policyTypeId: undefined as number | undefined,
    policyStatusId: undefined as number | undefined,
    renewable: "Yes",
    insuredName: "",
    groupHeadName: "",
    policyNumber: "",
    agencyName: "",
    baName: "",
    companyName: "",
    insuranceType: "",
    productName: "",
    loginDate: "",
    startDate: "",
    endDate: "",
    addOnName: "",
    hpaName: "",
    hpaBranch: "",

    // Premium Details
    premiumNet: 0,
    premiumGross: 0,
    basicODPremium: 0,
    tpPremium: 0,
    otherTPPremium: 0,
    addOnCover: 0,
    ncb: 0,
    discount: 0,
    terrorismPremium: 0,
    gstPerc: 0,
    gstAmount: 0,
    finalPremium: 0,
    claimProcess: "Select",
    brokerageOnIRDA: "",
    brokeragePerIRDA: 0,
    brokerageAmtIRDA: 0,
    brokerageOnReward: "",
    brokeragePerReward: 0,
    brokerageAmtReward: 0,
    baBrokerageOn: "",
    baBrokeragePer: 0,
    baBrokerageAmt: 0,
    
    // Checkboxes
    calcIrda: false,
    calcReward: false,
    calcBa: false,

    // Payment Details
    paymentMode: "",
    paymentType: "",
    payReferenceNo: "",
    paymentDate: "",
    paymentNo: "",
    bankBranchName: "",
    paymentAmount: 0,
    cashAmount: 0,
    totalAmount: 0,
    diffAmount: 0,
    remarks: "",
    claimExist: "No",
    noOfEndorsement: "",
    paymentDueDate: "",
    renewalDate: "",
    brokerCode: "",
    policyCode: "",
    paymentDone: false,

    // Related Info
    itemDetails: [] as any[],
    totalIdvSa: 0,
    vehicleValue: 0,
    nonElecAccessories: 0,
    elecAccessories: 0,
    cngLpgKit: 0,
    trailerTotalValue: 0,
    make: "",
    model: "",
    fuelType: "",
    color: "",
    registrationNo: "",
    placeOfRegistration: "",
    mfgYear: "",
    registrationDate: "",
    seatingCapacity: "",
    cubicCapacity: "",
    engineNumber: "",
    chasisNumber: "",
    vehicleWeight: "",
    permit: "",
    trailerNo: "",
    fitnessExpiryDate: "",
    roadTax: "",
  };

  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState<{ file: File; type: string; label: string }[]>([]);
  const [selectedDocName, setSelectedDocName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  useEffect(() => {
    const premiumNet =
      (form.basicODPremium || 0) +
      (form.tpPremium || 0) +
      (form.otherTPPremium || 0) +
      (form.addOnCover || 0);
  
    const gstAmount = (premiumNet * (form.gstPerc || 0)) / 100;
  
    const finalPremium =
      premiumNet +
      gstAmount +
      (form.terrorismPremium || 0);
  
    setForm(prev => {
      const roundedGST = parseFloat(gstAmount.toFixed(2));
      const roundedFinal = parseFloat(finalPremium.toFixed(2));
  
      if (
        prev.premiumNet === premiumNet &&
        prev.gstAmount === roundedGST &&
        prev.finalPremium === roundedFinal
      ) {
        return prev;
      }
  
      return {
        ...prev,
        premiumNet,
        gstAmount: roundedGST,
        finalPremium: roundedFinal
      };
    });
  }, [
    form.basicODPremium,
    form.tpPremium,
    form.otherTPPremium,
    form.addOnCover,
    form.gstPerc,
    form.terrorismPremium
  ]);
  
  /*   API HOOKS   */
  const { mutateAsync, isPending } = useUpsertPolicy();
  const { data: insurers, isLoading: iLoading } = useInsurerDropdown();
  const { data: products, isLoading: pLoading } = useProductDropdown(form.insurerId || undefined);
  const { data: policyTypes, isLoading: tLoading } = usePolicyTypesDropdown();
  const { data: policyStatuses, isLoading: sLoading } = usePolicyStatusesDropdown();

  const loadingDropdowns = iLoading || pLoading || tLoading || sLoading;
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
    if (!form.policyNumber?.trim()) e.policyNumber = "Policy number is required";
    if (!form.policyStatusId) e.policyStatusId = "Policy status is required";
    if (!form.policyTypeId) e.policyTypeId = "Policy type is required";
    if (!form.startDate) e.startDate = "Start date is required";
    if (!form.endDate) e.endDate = "End date is required";
    if (!form.finalPremium && form.finalPremium !== 0) e.finalPremium = "Final premium is required";

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

  return (
    <>
      <Toaster position="top-right"/>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]" onClick={isLoading ? undefined : onClose} />

      <div 
        className="fixed top-0 right-0 w-full max-w-[85vw] h-screen bg-slate-50 z-[70] shadow-2xl flex flex-col animate-slide-in-right"
      >
        {/* HEADER */}
        <div className="px-8 py-6 bg-white border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {policy ? "Edit Policy" : "Add New Policy"}
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
                  {/* BASIC INFO */}
                  <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="flex items-center gap-2 bg-slate-800 px-6 py-3 text-white">
                      <div className="p-1.5 bg-white/10 text-white rounded">
                        <ShieldCheck size={16} />
                      </div>
                      <h3 className="font-bold uppercase tracking-wider text-[10px]">General Insurance Policy Purchase</h3>
                    </div>
                    
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <Select
                        label="Policy Status"
                        required
                        value={form.policyStatusId}
                        error={errors.policyStatusId}
                        options={policyStatuses}
                        valueKey="policyStatusId"
                        labelKey="statusName"
                        onChange={(v: any) => setForm(p => ({ ...p, policyStatusId: v ? Number(v) : undefined }))}
                      />
                      <Select
                        label="Policy Type"
                        required
                        value={form.policyTypeId}
                        error={errors.policyTypeId}
                        options={policyTypes}
                        valueKey="policyTypeId"
                        labelKey="typeName"
                        onChange={(v: any) => setForm(p => ({ ...p, policyTypeId: v ? Number(v) : undefined }))}
                      />
                      <Select
                        label="Renewable"
                        value={form.renewable}
                        options={[{ id: "Yes", name: "Yes" }, { id: "No", name: "No" }]}
                        onChange={(v: any) => setForm(p => ({ ...p, renewable: v }))}
                      />
                      <Input
                        label="Insured Name"
                        required
                        value={form.insuredName}
                        placeholder="Insured Name"
                        onChange={(v: any) => setForm(p => ({ ...p, insuredName: v }))}
                        suffix={<UserPlus size={14} className="text-slate-400" />}
                      />
                      <Input
                        label="Group Head Name"
                        value={form.groupHeadName}
                        placeholder="Group Head Name"
                        onChange={(v: any) => setForm(p => ({ ...p, groupHeadName: v }))}
                      />
                      <Input
                        label="Policy Number"
                        required
                        value={form.policyNumber}
                        error={errors.policyNumber}
                        placeholder="Policy Number"
                        onChange={(v: any) => setForm(p => ({ ...p, policyNumber: v }))}
                      />
                      <Select
                        label="Agency Name"
                        required
                        value={form.agencyName}
                        options={[{ id: "Agency 1", name: "Agency 1" }]}
                        onChange={(v: any) => setForm(p => ({ ...p, agencyName: v }))}
                      />
                      <Select
                        label="BA Name"
                        value={form.baName}
                        options={[{ id: "BA 1", name: "BA 1" }]}
                        onChange={(v: any) => setForm(p => ({ ...p, baName: v }))}
                      />
                      <SearchableComboBox
                        label="Company Name"
                        required
                        items={(insurers || []).map((i: any) => ({ value: i.insurerId, label: i.insurerName }))}
                        value={form.insurerId}
                        error={errors.insurerId}
                        onSelect={(item) => setForm({ ...form, insurerId: item?.value as string || "", productId: "" })}
                      />
                      <Select
                        label="Insurance Type"
                        required
                        value={form.insuranceType}
                        options={[{ id: "Jewellery Insurance", name: "Jewellery Insurance" }, { id: "Motor Insurance", name: "Motor Insurance" }]}
                        onChange={(v: any) => setForm(p => ({ ...p, insuranceType: v }))}
                      />
                      <SearchableComboBox
                        label="Product Name"
                        required
                        items={(products || []).map((p: any) => ({ value: p.productId, label: p.productName }))}
                        value={form.productId}
                        error={errors.productId}
                        disabled={!form.insurerId}
                        onSelect={(item) => setForm({ ...form, productId: item?.value as string || "" })}
                      />
                      <Input
                        type="date"
                        label="Login Date"
                        required
                        value={form.loginDate}
                        onChange={(v: any) => setForm({ ...form, loginDate: v })}
                      />
                      <Input
                        type="date"
                        label="Period From"
                        required
                        value={form.startDate}
                        error={errors.startDate}
                        onChange={(v: any) => setForm({ ...form, startDate: v })}
                      />
                      <Input
                        type="date"
                        label="Period To"
                        required
                        value={form.endDate}
                        error={errors.endDate}
                        min={form.startDate}
                        onChange={(v: any) => setForm({ ...form, endDate: v })}
                      />
                      <Input
                        label="AddOn Name"
                        value={form.addOnName}
                        placeholder="AddOn Name"
                        onChange={(v: any) => setForm(p => ({ ...p, addOnName: v }))}
                      />
                      <Select
                        label="HPA Name"
                        value={form.hpaName}
                        options={[{ id: "HPA 1", name: "HPA 1" }]}
                        onChange={(v: any) => setForm(p => ({ ...p, hpaName: v }))}
                      />
                      <Input
                        label="HPA Branch"
                        value={form.hpaBranch}
                        placeholder="HPA Branch"
                        onChange={(v: any) => setForm(p => ({ ...p, hpaBranch: v }))}
                      />
                    </div>
                  </section>

                  {/* PREMIUM DETAILS */}
                  <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="flex items-center gap-2 bg-slate-800 px-6 py-3 text-white">
                      <div className="p-1.5 bg-white/10 text-white rounded">
                        <CreditCard size={16} />
                      </div>
                      <h3 className="font-bold uppercase tracking-wider text-[10px]">Premium Details</h3>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      {/* First 3 rows of premium details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Input label="Basic/OD Premium" type="number" value={form.basicODPremium} onChange={(v: any) => setForm(p => ({ ...p, basicODPremium: Number(v) }))} />
                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <Input 
                              label="TP Premium" 
                              type="number" 
                              value={form.tpPremium} 
                              onChange={(v: any) =>
                                setForm(p => ({ ...p, tpPremium: Number(v) }))
                              }
                            />
                          </div>

                          <label className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                            <input type="checkbox" className="accent-blue-600" />
                            12%
                          </label>
                        </div>
                        <Input label="Other TP Premium" type="number" value={form.otherTPPremium} onChange={(v: any) => setForm(p => ({ ...p, otherTPPremium: Number(v) }))} />
                        <Input label="Add On Cover" type="number" value={form.addOnCover} onChange={(v: any) => setForm(p => ({ ...p, addOnCover: Number(v) }))} />
                        
                        <Input label="NCB %" type="number" value={form.ncb} onChange={(v: any) => setForm(p => ({ ...p, ncb: Number(v) }))} />
                        <Input label="Discount %" type="number" value={form.discount} onChange={(v: any) => setForm(p => ({ ...p, discount: Number(v) }))} />
                        <Input label="Net Premium" type="number" value={form.premiumNet} onChange={(v: any) => setForm(p => ({ ...p, premiumNet: Number(v) }))} />
                        <Input label="Terrorism Premium" type="number" value={form.terrorismPremium} onChange={(v: any) => setForm(p => ({ ...p, terrorismPremium: Number(v) }))} />
                        
                        <Input label="GST Perc." type="number" value={form.gstPerc} onChange={(v: any) => setForm(p => ({ ...p, gstPerc: Number(v) }))} />
                        <Input label="GST Amount" type="number" value={form.gstAmount} onChange={(v: any) => setForm(p => ({ ...p, gstAmount: Number(v) }))} />
                        <Input label="Final Premium" required type="number" value={form.finalPremium} error={errors.finalPremium} onChange={(v: any) => setForm(p => ({ ...p, finalPremium: Number(v) }))} />
                        <Select label="Claim Process" value={form.claimProcess} options={[{ id: "Select", name: "Select" }]} onChange={(v: any) => setForm(p => ({ ...p, claimProcess: v }))} />
                      </div>

                      {/* Brokerage Rows with Checkboxes */}
                      <div className="space-y-6 pt-4 border-t border-slate-50">
                        {/* IRDA Brokerage */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                          <Select label="Brokerage On IRDA" value={form.brokerageOnIRDA} options={[{ id: "Select", name: "Select" }]} onChange={(v: any) => setForm(p => ({ ...p, brokerageOnIRDA: v }))} />
                          <Input label="Brokerage Per IRDA" type="number" value={form.brokeragePerIRDA} onChange={(v: any) => setForm(p => ({ ...p, brokeragePerIRDA: Number(v) }))} />
                          <Input label="Brokerage Amt IRDA" type="number" value={form.brokerageAmtIRDA} onChange={(v: any) => setForm(p => ({ ...p, brokerageAmtIRDA: Number(v) }))} />
                          <div className="flex items-center gap-2 pb-3">
                            <input 
                              type="checkbox" 
                              id="calcIrda"
                              checked={form.calcIrda}
                              onChange={(e) => setForm(p => ({ ...p, calcIrda: e.target.checked }))}
                              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                            />
                            <label htmlFor="calcIrda" className="text-[10px] font-bold text-slate-600 uppercase tracking-wider cursor-pointer">Calculate Percentage</label>
                          </div>
                        </div>

                        {/* Reward Brokerage */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                          <Select label="Brokerage On Reward" value={form.brokerageOnReward} options={[{ id: "Select", name: "Select" }]} onChange={(v: any) => setForm(p => ({ ...p, brokerageOnReward: v }))} />
                          <Input label="Brokerage Per Reward" type="number" value={form.brokeragePerReward} onChange={(v: any) => setForm(p => ({ ...p, brokeragePerReward: Number(v) }))} />
                          <Input label="Brokerage Amt Reward" type="number" value={form.brokerageAmtReward} onChange={(v: any) => setForm(p => ({ ...p, brokerageAmtReward: Number(v) }))} />
                          <div className="flex items-center gap-2 pb-3">
                            <input 
                              type="checkbox" 
                              id="calcReward"
                              checked={form.calcReward}
                              onChange={(e) => setForm(p => ({ ...p, calcReward: e.target.checked }))}
                              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                            />
                            <label htmlFor="calcReward" className="text-[10px] font-bold text-slate-600 uppercase tracking-wider cursor-pointer">Calculate Percentage</label>
                          </div>
                        </div>

                        {/* BA Brokerage */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                          <Select label="BA Brokerage On" value={form.baBrokerageOn} options={[{ id: "Select", name: "Select" }]} onChange={(v: any) => setForm(p => ({ ...p, baBrokerageOn: v }))} />
                          <Input label="BA Brokerage Per" type="number" value={form.baBrokeragePer} onChange={(v: any) => setForm(p => ({ ...p, baBrokeragePer: Number(v) }))} />
                          <Input label="BA Brokerage Amt" type="number" value={form.baBrokerageAmt} onChange={(v: any) => setForm(p => ({ ...p, baBrokerageAmt: Number(v) }))} />
                          <div className="flex items-center gap-2 pb-3">
                            <input 
                              type="checkbox" 
                              id="calcBa"
                              checked={form.calcBa}
                              onChange={(e) => setForm(p => ({ ...p, calcBa: e.target.checked }))}
                              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                            />
                            <label htmlFor="calcBa" className="text-[10px] font-bold text-slate-600 uppercase tracking-wider cursor-pointer">Calculate Percentage</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* PAYMENT DETAILS */}
                  <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="flex items-center gap-2 bg-slate-800 px-6 py-3 text-white">
                      <div className="p-1.5 bg-white/10 text-white rounded">
                        <CreditCard size={16} />
                      </div>
                      <h3 className="font-bold uppercase tracking-wider text-[10px]">Payment Details</h3>
                    </div>
                    
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                      <Select
                        label="Payment Type"
                        value={form.paymentType}
                        options={[{ id: "Online", name: "Online" }, { id: "Cheque", name: "Cheque" }, { id: "Cash", name: "Cash" }]}
                        onChange={(v: any) => setForm(p => ({ ...p, paymentType: v }))}
                      />
                      <Input label="Pay. Reference No." value={form.payReferenceNo} onChange={(v: any) => setForm(p => ({ ...p, payReferenceNo: v }))} />
                      <Input label="Payment Date" type="date" value={form.paymentDate} onChange={(v: any) => setForm(p => ({ ...p, paymentDate: v }))} />
                      <Input label="Payment No." value={form.paymentNo} onChange={(v: any) => setForm(p => ({ ...p, paymentNo: v }))} />
                      <Input label="Bank & Branch Name" value={form.bankBranchName} onChange={(v: any) => setForm(p => ({ ...p, bankBranchName: v }))} />
                      
                      <Input label="Payment Amount" type="number" value={form.paymentAmount} onChange={(v: any) => setForm(p => ({ ...p, paymentAmount: Number(v) }))} />
                      <Input label="Cash Amount" type="number" value={form.cashAmount} onChange={(v: any) => setForm(p => ({ ...p, cashAmount: Number(v) }))} />
                      <Input label="Total Amount" type="number" value={form.totalAmount} onChange={(v: any) => setForm(p => ({ ...p, totalAmount: Number(v) }))} />
                      <Input label="Diff. Amount" type="number" value={form.diffAmount} onChange={(v: any) => setForm(p => ({ ...p, diffAmount: Number(v) }))} />
                      
                      <div className="lg:col-span-2">
                        <Input label="Remarks" value={form.remarks} onChange={(v: any) => setForm(p => ({ ...p, remarks: v }))} />
                      </div>
                      <Select label="Claim Exist" value={form.claimExist} options={[{ id: "No", name: "No" }, { id: "Yes", name: "Yes" }]} onChange={(v: any) => setForm(p => ({ ...p, claimExist: v }))} />
                      <Input label="No Of Endorsement" value={form.noOfEndorsement} onChange={(v: any) => setForm(p => ({ ...p, noOfEndorsement: v }))} />
                    </div>
                  </section>
                </>
              )}

              {activeTab === "related" && (
                <div className="space-y-8">
                  {/* IDV DETAILS */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-6 py-3 bg-slate-700 text-white">
                      <h3 className="font-bold text-xs uppercase tracking-widest">IDV DETAILS</h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                      <Input label="Vehicle Value" type="number" value={form.vehicleValue} onChange={(v: any) => setForm(p => ({ ...p, vehicleValue: Number(v) }))} />
                      <Input label="Non Elec. Accesories" type="number" value={form.nonElecAccessories} onChange={(v: any) => setForm(p => ({ ...p, nonElecAccessories: Number(v) }))} />
                      <Input label="Electrical Accesories" type="number" value={form.elecAccessories} onChange={(v: any) => setForm(p => ({ ...p, elecAccessories: Number(v) }))} />
                      <Input label="CNG/LPG Kit" type="number" value={form.cngLpgKit} onChange={(v: any) => setForm(p => ({ ...p, cngLpgKit: Number(v) }))} />
                      <Input label="Trailer Total Value" type="number" value={form.trailerTotalValue} onChange={(v: any) => setForm(p => ({ ...p, trailerTotalValue: Number(v) }))} />
                    </div>
                  </div>

                  {/* TOTAL IDV / SA */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-6 py-3 bg-slate-700 text-white">
                      <h3 className="font-bold text-xs uppercase tracking-widest">TOTAL IDV / SA</h3>
                    </div>
                    <div className="p-6 flex justify-end">
                      <div className="w-full max-w-xs">
                        <Input 
                          label="TOTAL IDV / SA" 
                          required 
                          type="number" 
                          value={form.totalIdvSa} 
                          placeholder="Total SA / IDV"
                          onChange={(v: any) => setForm(p => ({ ...p, totalIdvSa: Number(v) }))} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Motor/Vehicle Details */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-6 py-3 bg-slate-700 text-white">
                      <h3 className="font-bold text-xs uppercase tracking-widest">Motor/Vehicle Details</h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <Select label="Make" value={form.make} options={[{id: "Make 1", name: "Make 1"}]} onChange={(v: any) => setForm(p => ({ ...p, make: v }))} />
                      <Select label="Model" value={form.model} options={[{id: "Model 1", name: "Model 1"}]} onChange={(v: any) => setForm(p => ({ ...p, model: v }))} />
                      <Select label="Fuel Type" value={form.fuelType} options={[{id: "Petrol", name: "Petrol"}, {id: "Diesel", name: "Diesel"}]} onChange={(v: any) => setForm(p => ({ ...p, fuelType: v }))} />
                      <Input label="Color" value={form.color} onChange={(v: any) => setForm(p => ({ ...p, color: v }))} />
                      
                      <Input label="Registration No" value={form.registrationNo} onChange={(v: any) => setForm(p => ({ ...p, registrationNo: v }))} />
                      <Input label="Place of Registration" value={form.placeOfRegistration} onChange={(v: any) => setForm(p => ({ ...p, placeOfRegistration: v }))} />
                      <Input label="MFG Year" value={form.mfgYear} onChange={(v: any) => setForm(p => ({ ...p, mfgYear: v }))} />
                      <Input label="Registration Date" type="date" value={form.registrationDate} onChange={(v: any) => setForm(p => ({ ...p, registrationDate: v }))} />
                      
                      <Input label="Seating Capacity" value={form.seatingCapacity} onChange={(v: any) => setForm(p => ({ ...p, seatingCapacity: v }))} />
                      <Input label="Cubic Capacity" value={form.cubicCapacity} onChange={(v: any) => setForm(p => ({ ...p, cubicCapacity: v }))} />
                      <Input label="Engine Number" value={form.engineNumber} onChange={(v: any) => setForm(p => ({ ...p, engineNumber: v }))} />
                      <Input label="Chasis Number" value={form.chasisNumber} onChange={(v: any) => setForm(p => ({ ...p, chasisNumber: v }))} />
                      
                      <Input label="Vehicle Weight" value={form.vehicleWeight} onChange={(v: any) => setForm(p => ({ ...p, vehicleWeight: v }))} />
                      <Select label="Permit" value={form.permit} options={[{id: "Permit 1", name: "Permit 1"}]} onChange={(v: any) => setForm(p => ({ ...p, permit: v }))} />
                      <Input label="Trailer no" value={form.trailerNo} onChange={(v: any) => setForm(p => ({ ...p, trailerNo: v }))} />
                      <Input label="Fitness Expiry Date" type="date" value={form.fitnessExpiryDate} onChange={(v: any) => setForm(p => ({ ...p, fitnessExpiryDate: v }))} />
                      
                      <Input label="Road Tax" value={form.roadTax} onChange={(v: any) => setForm(p => ({ ...p, roadTax: v }))} />
                    </div>
                  </div>
                </div>
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
  <div className="space-y-1.5">
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
  <div className="space-y-1.5">
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
