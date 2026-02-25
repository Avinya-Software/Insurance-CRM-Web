import { useEffect, useState } from "react";
import { X, Eye, Download, Trash2, Plus, FileText, ShieldCheck, CreditCard, UploadCloud, ChevronRight, ChevronDown, UserPlus, AlertCircle, Home, Briefcase, Globe } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Spinner from "../common/Spinner";
import { useUploadCustomerDocument } from "../../hooks/customer/useUploadCustomerDocument";
import { useUpsertCustomer } from "../../hooks/customer/useCreateCustomer";
import { useKycFileActions } from "../../hooks/customer/useKycFileActions";


interface Props {
  open: boolean;
  onClose: () => void;
  customer?: any;
  leadId?: string;
  onSuccess: () => void;
}

type TabType = "basic" | "residential" | "documents";

const CustomerUpsertSheet = ({
  open,
  onClose,
  customer,
  leadId,
  onSuccess,
}: Props) => {
  const [activeTab, setActiveTab] = useState<TabType>("basic");

  /*   LOCK BODY SCROLL   */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  /*   KYC DOCUMENT ACTIONS   */
  const [existingDocuments, setExistingDocuments] = useState<
    { fileName: string; url: string; id: string; type: string }[]
  >([]);

  const { preview, download, remove } = useKycFileActions(
    (deletedId: string) => {
      setExistingDocuments((prev) =>
        prev.filter((f) => f.id !== deletedId)
      );
    }
  );

  /*   FORM STATE   */
  const initialForm = {
    customerId: null as string | null,
    title: "Mr.",
    fullName: "",
    groupHeadName: "",
    groupCode: "",
    clientCategory: "",
    fatherSpouseName: "",
    email: "",
    mobileNumber: "",
    dob: "",
    passedAway: false,
    age: "",
    anniversaryDate: "",
    gender: "",
    maritalStatus: "",
    nationality: "Indian",
    birthPlace: "",
    aadharNumber: "",
    panNumber: "",
    gstNumber: "",
    drivingLicenceNo: "",
    drivingLicenceExpDate: "",
    ckycNumber: "",
    eInsuranceNumber: "",
    education: "",
    passportNumber: "",
    passportExpDate: "",
    reference: "",
    remarks: "",

    // Residential Information
    resHouseNo: "",
    resStreet: "",
    resArea: "",
    resCity: "",
    resPincode: "",
    resState: "",
    resCountry: "India",
    resTelR: "",
    resTelO: "",
    resOtherNo: "",
    resEmail2: "",
    resWebsite: "",

    // Office Address
    occDetails: "",
    designation: "",
    grossIncome: "",
    employerName: "",
    offBuildingNo: "",
    offStreet: "",
    offLandmark: "",
    offCity: "",
    offPincode: "",
    offState: "",

    // Overseas
    osHouseNo: "",
    osStreet: "",
    osArea: "",
    osCity: "",
    osPincode: "",
    osState: "",
    osCountry: "",
    osTelO: "",
    osMobile: "",
    osEmail: "",
    
    leadId: leadId || "",
  };

  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState<{ file: File; type: string; label: string }[]>([]);
  const [selectedDocName, setSelectedDocName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const documentOptions = [
    { id: "Aadhar Card", name: "Aadhar Card" },
    { id: "PAN Card", name: "PAN Card" },
    { id: "Voter ID", name: "Voter ID" },
    { id: "Passport", name: "Passport" },
    { id: "Driving License", name: "Driving License" },
    { id: "Others", name: "Others" },
  ];

  const resolveSecondaryEmail = () => {
    if (form.resEmail2?.trim()) return form.resEmail2;
    if (form.osEmail?.trim()) return form.osEmail;
    return null;
  };

  const buildAddressPayload = (type: "RESIDENCE" | "OFFICE" | "OVERSEAS") => {

    const mapCommon = (prefix: string) => ({
      houseFlatNumber: form[`${prefix}HouseNo`] || null,
      buildingName: form[`${prefix}BuildingNo`] || null,
      street: form[`${prefix}Street`] || null,
      area: form[`${prefix}Area`] || null,
      landmark: form[`${prefix}Landmark`] || null,
      city: form[`${prefix}City`] || null,
      pincode: form[`${prefix}Pincode`] || null,
      state: form[`${prefix}State`] || null,
      country: form[`${prefix}Country`] || "India",
      telephoneResidence: form[`${prefix}TelR`] || null,
      telephoneOffice: form[`${prefix}TelO`] || null,
      otherNumber: form[`${prefix}OtherNo`] || null,
      mobileNumber: form[`${prefix}Mobile`] || null,
      email2: resolveSecondaryEmail(),
      website: form[`${prefix}Website`] || null
    });
  
    if (type === "RESIDENCE") {
      if (!form.resHouseNo && !form.resStreet && !form.resCity) return null;
  
      return {
        addressType: "RESIDENCE",
        ...mapCommon("res")
      };
    }
  
    if (type === "OFFICE") {
      if (!form.offCity && !form.offStreet) return null;
  
      return {
        addressType: "OFFICE",
        occupationType: form.occDetails || null,
        designation: form.designation || null,
        grossIncome: Number(form.grossIncome) || 0,
        employerName: form.employerName || null,
        ...mapCommon("off")
      };
    }
  
    if (type === "OVERSEAS") {
      if (!form.osCity && !form.osStreet) return null;
  
      return {
        addressType: "OVERSEAS",
        ...mapCommon("os")
      };
    }
  
    return null;
  };

  /*   API HOOKS   */
  const { mutateAsync, isPending } = useUpsertCustomer();
  const isLoading = isPending;
  const isEditMode = !!customer;
  const { mutateAsync: uploadDocument, isPending: isUploading } =
  useUploadCustomerDocument();


  /*   PREFILL   */
  useEffect(() => {
    if (!open) {
      setForm(initialForm);
      setExistingDocuments([]);
      setFiles([]);
      setErrors({});
      setActiveTab("basic");
      return;
    }
  
    if (customer) {
      setForm({
        ...initialForm,
  
        customerId: customer.customerId || null,
  
        title: customer.title || "Mr.",
  
        fullName: customer.clientName || "",
        groupHeadName: customer.groupHeadName || "",
        groupCode: customer.groupCode || "",
        clientCategory: customer.clientCategory || "",
  
        fatherSpouseName: customer.fatherSpouseCompanyName || "",
  
        mobileNumber: customer.primaryMobile || "",
        email: customer.email || "",
  
        dob: customer.dob ? customer.dob.split("T")[0] : "",
        anniversaryDate: customer.anniversaryDate
          ? customer.anniversaryDate.split("T")[0]
          : "",
  
        age: customer.age || "",
        gender: customer.gender || "",
        maritalStatus: customer.maritalStatus || "",
        nationality: customer.nationality || "Indian",
        birthPlace: customer.birthPlace || "",
  
        passedAway: customer.isPassedAway || false,
        education: customer.education || "",
        reference: customer.referenceName || "",
        remarks: customer.remarks || "",
  
        occDetails: customer.occupation?.occupationType || "",
        designation: customer.occupation?.designation || "",
        grossIncome: customer.occupation?.grossIncome || "",
        employerName: customer.occupation?.employerName || "",
  
        aadharNumber: customer.identityDetails?.aadharNumber || "",
        panNumber: customer.identityDetails?.panNumber || "",
        gstNumber: customer.identityDetails?.gstNumber || "",
        drivingLicenceNo:
          customer.identityDetails?.drivingLicenceNumber || "",
  
        drivingLicenceExpDate: customer.identityDetails
          ?.drivingLicenceExpDate
          ? customer.identityDetails.drivingLicenceExpDate.split("T")[0]
          : "",
  
        ckycNumber: customer.identityDetails?.ckycNumber || "",
        eInsuranceNumber: customer.identityDetails?.eInsuranceNumber || "",
  
        passportNumber: customer.identityDetails?.passportNumber || "",
  
        passportExpDate: customer.identityDetails?.passportExpDate
          ? customer.identityDetails.passportExpDate.split("T")[0]
          : "",
  
        ...(mapAddressToForm?.(customer.addresses || []) || {}),
  
        leadId: leadId || ""
      });
  
      setExistingDocuments(customer.kycFiles || []);
    } else {
      setForm({ ...initialForm, leadId: leadId || "" });
    }
  
    setErrors({});
  }, [open, customer, leadId]);

  /*   VALIDATION   */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName?.trim()) e.fullName = "Full name is required";
    if (!form.mobileNumber?.trim()) e.mobileNumber = "Mobile number is required";
    
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
      const payload: any = {
        customerId: form.customerId || undefined,
        title: form.title,
        clientName: form.fullName,
        groupHeadName: form.groupHeadName || null,
        groupCode: form.groupCode || null,
        clientCategory: form.clientCategory || null,
        fatherSpouseCompanyName: form.fatherSpouseName || null,
        primaryMobile: form.mobileNumber,
        email: form.email || null,
        dob: form.dob ? new Date(form.dob).toISOString() : null,
        anniversaryDate: form.anniversaryDate
          ? new Date(form.anniversaryDate).toISOString()
          : null,
        age: Number(form.age) || 0,
        gender: form.gender || null,
        maritalStatus: form.maritalStatus || null,
        nationality: form.nationality || null,
        birthPlace: form.birthPlace || null,
        isPassedAway: form.passedAway || false,
        education: form.education || null,
        referenceName: form.reference || null,
        notes: "",
        remarks: form.remarks || null,
        leadId: form.leadId || null,
  
        occupation: {
          occupationType: form.occDetails || null,
          designation: form.designation || null,
          grossIncome: Number(form.grossIncome) || 0,
          employerName: form.employerName || null
        },
  
        addresses: [
          buildAddressPayload("RESIDENCE"),
          buildAddressPayload("OFFICE"),
          buildAddressPayload("OVERSEAS")
        ].filter(Boolean),
  
        identityDetails: {
          aadharNumber: form.aadharNumber || null,
          panNumber: form.panNumber || null,
          gstNumber: form.gstNumber || null,
          drivingLicenceNumber: form.drivingLicenceNo || null,
          drivingLicenceExpDate: form.drivingLicenceExpDate
            ? new Date(form.drivingLicenceExpDate).toISOString()
            : null,
          ckycNumber: form.ckycNumber || null,
          eInsuranceNumber: form.eInsuranceNumber || null,
          passportNumber: form.passportNumber || null,
          passportExpDate: form.passportExpDate
            ? new Date(form.passportExpDate).toISOString()
            : null
        },
  
      };
  
      const response = await mutateAsync(payload);

    if (response?.customerId) {
      setForm(prev => ({
        ...prev,
        customerId: response.customerId
      }));
    }
  
      onSuccess();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
  
    if (!selectedDocName) {
      toast.error("Please select a document type first");
      return;
    }
  
    if (!form.customerId) {
      toast.error("Please save customer first");
      return;
    }
  
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  
    const newFiles = Array.from(e.target.files).map(file => {
      if (file.size > MAX_SIZE) {
        toast.error(`${file.name} exceeds 10MB limit`);
        return null;
      }
  
      return {
        file,
        type: "KYC",
        label: selectedDocName
      };
    }).filter(Boolean) as { file: File; type: string; label: string }[];
  
    if (newFiles.length === 0) return;
  
    setFiles(prev => [...prev, ...newFiles]);
    setSelectedDocName("");
    e.target.value = "";
  };

  const handleUploadDocuments = async () => {
    if (!form.customerId) {
      toast.error("Please save customer before uploading documents");
      return;
    }

    if (files.length === 0) {
      toast.error("Please select at least one document");
      return;
    }

    try {
      for (const item of files) {
        const formData = new FormData();
        formData.append("Id", form.customerId);
        formData.append("Type", "1");
        formData.append("DocumentType", item.label);
        formData.append("Files", item.file);
        
        const response = await uploadDocument(formData);

      setExistingDocuments(prev => [
        ...prev,
        {
          id: response?.data?.id || crypto.randomUUID(), 
          fileName: item.file.name,
          url: response?.data?.url || "",
          type: item.label,
        }
      ]);
      }

      toast.success("All documents uploaded successfully");
      setFiles([]);

    } catch (error) {
      console.error(error);
      toast.error("Document upload failed");
    }
  };

  const blockDocumentAccess = () => {
    if (!isEditMode) {
      toast.error("Please save customer first to access documents");
      return true;
    }
    return false;
  };


  const mapAddressToForm = (addresses: any[] = []) => {
    const get = (type: string) =>
      addresses?.find(a => a.addressType === type) || {};
  
    const residence = get("RESIDENCE");
    const office = get("OFFICE");
    const overseas = get("OVERSEAS");
  
    return {
      resHouseNo: residence.houseFlatNumber || "",
      resStreet: residence.street || "",
      resArea: residence.area || "",
      resCity: residence.city || "",
      resPincode: residence.pincode || "",
      resState: residence.state || "",
      resCountry: residence.country || "India",
      resTelR: residence.telephoneResidence || "",
      resTelO: residence.telephoneOffice || "",
      resOtherNo: residence.otherNumber || "",
      resEmail2: residence.email2 || "",
      resWebsite: residence.website || "",
  
      offBuildingNo:
        office.houseFlatNumber ||
        office.buildingName ||
        "",
  
      offStreet: office.street || "",
      offLandmark: office.landmark || "",
      offCity: office.city || "",
      offPincode: office.pincode || "",
      offState: office.state || "",
  
      osHouseNo: overseas.houseFlatNumber || "",
      osStreet: overseas.street || "",
      osArea: overseas.area || "",
      osCity: overseas.city || "",
      osPincode: overseas.pincode || "",
      osState: overseas.state || "",
      osCountry: overseas.country || "India",
      osTelO: overseas.telephoneOffice || "",
      osMobile: overseas.mobileNumber || "",
      osEmail: overseas.email2 || ""
    };
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
              {customer ? "Edit Customer" : "Add New Customer"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">Manage insured member's profile and documents.</p>
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
            { id: "basic", label: "Insured Member's Basic Information", icon: UserPlus },
            { id: "residential", label: "Residential Information", icon: Home },
            ...(isEditMode
              ? [{ id: "documents", label: "Personal Documents", icon: FileText }]
              : [{ id: "documents", label: "Personal Documents", icon: FileText, disabled: true }]),
          ].map((tab: any) => {

            const isDisabled = tab.id === "documents" && !isEditMode;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === "documents" && blockDocumentAccess()) return;
                
                  setActiveTab(tab.id as TabType);
                }}
                className={`
                  flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-all
                  ${activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200"}
                  ${isDisabled ? "opacity-40 cursor-not-allowed pointer-events-auto" : ""}
                `}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-full mx-auto space-y-10">
            
            {activeTab === "basic" && (
              <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="flex items-center gap-2 bg-slate-800 px-6 py-3 text-white">
                  <div className="p-1.5 bg-white/10 text-white rounded">
                    <UserPlus size={16} />
                  </div>
                  <h3 className="font-bold uppercase tracking-wider text-[10px]">Basic Information</h3>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <div className="flex gap-2">
                    <div className="w-24">
                      <Select
                        label="Title"
                        value={form.title}
                        options={[{id: "Mr.", name: "Mr."}, {id: "Mrs.", name: "Mrs."}, {id: "Master", name: "Master"},{id: "M/S", name: "M/S"},{id: "Miss.", name: "Miss."},
                        {id: "Ms.", name: "Ms."},{id: "Dr.", name: "Dr."},{id: "Ar.", name: "Ar."},
                        ]}
                        onChange={(v: any) => setForm(p => ({ ...p, title: v }))}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        label="Client Full Name"
                        required
                        value={form.fullName}
                        error={errors.fullName}
                        placeholder="Client Name"
                        onChange={(v: any) => setForm(p => ({ ...p, fullName: v }))}
                      />
                    </div>
                  </div>
                  <Input label="Group Head Name" value={form.groupHeadName} placeholder="Group Head Name" onChange={(v: any) => setForm(p => ({ ...p, groupHeadName: v }))} />
                  <Input label="Group Code" value={form.groupCode} placeholder="Group Code" onChange={(v: any) => setForm(p => ({ ...p, groupCode: v }))} />
                  <Select label="Client Category" value={form.clientCategory} options={[{id: "Retail", name: "Retail"}, {id: "Corporate", name: "Corporate"}]} onChange={(v: any) => setForm(p => ({ ...p, clientCategory: v }))} />
                  
                  <Input label="Father / Spouse / Company Name" value={form.fatherSpouseName} placeholder="Father / Spouse / Company Name" onChange={(v: any) => setForm(p => ({ ...p, fatherSpouseName: v }))} />
                  <Input label="E-Mail Id" type="email" value={form.email} placeholder="E-mail ID" onChange={(v: any) => setForm(p => ({ ...p, email: v }))} />
                  <Input label="Mobile Number" required value={form.mobileNumber} error={errors.mobileNumber} placeholder="Mobile No" onChange={(v: any) => setForm(p => ({ ...p, mobileNumber: v }))} />
                  
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <Input label="Date of Birth" type="date" value={form.dob} onChange={(v: any) => setForm(p => ({ ...p, dob: v }))} />
                    </div>
                    <div className="flex flex-col items-center pb-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1">Passed away</label>
                      <input 
                        type="checkbox" 
                        checked={form.passedAway} 
                        onChange={(e) => setForm(p => ({ ...p, passedAway: e.target.checked }))}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  <Input label="Age" value={form.age} placeholder="Age" onChange={(v: any) => setForm(p => ({ ...p, age: v }))} />
                  <Input label="Anniversary Date" type="date" value={form.anniversaryDate} onChange={(v: any) => setForm(p => ({ ...p, anniversaryDate: v }))} />
                  <Select label="Gender" value={form.gender} options={[{id: "Male", name: "Male"}, {id: "Female", name: "Female"}, {id: "Other", name: "Other"}]} onChange={(v: any) => setForm(p => ({ ...p, gender: v }))} />
                  <Select label="Marital Status" value={form.maritalStatus} options={[{id: "Single", name: "Single"}, {id: "Married", name: "Married"}, {id: "Divorced", name: "Divorced"}, {id: "Widow", name: "Widow"}]} onChange={(v: any) => setForm(p => ({ ...p, maritalStatus: v }))} />
                  <Input label="Nationality" value={form.nationality || "Indian"} placeholder="Nationality" onChange={(v: any) => setForm(p => ({ ...p, nationality: v })) }/>                  <Input label="Birth Place" value={form.birthPlace} placeholder="Birth Place" onChange={(v: any) => setForm(p => ({ ...p, birthPlace: v }))} />
                  <Input label="Aadhar Number" value={form.aadharNumber} placeholder="Aadhar No" onChange={(v: any) => setForm(p => ({ ...p, aadharNumber: v }))} />
                  <Input label="PAN Number" value={form.panNumber} placeholder="PAN No" onChange={(v: any) => setForm(p => ({ ...p, panNumber: v }))} />
                  <Input label="GST Number" value={form.gstNumber} placeholder="GST Number" onChange={(v: any) => setForm(p => ({ ...p, gstNumber: v }))} />
                  <Input label="Driving Licence Number" value={form.drivingLicenceNo} placeholder="Driving Licence No" onChange={(v: any) => setForm(p => ({ ...p, drivingLicenceNo: v }))} />
                  <Input label="Driving Licence Exp. Date" type="date" value={form.drivingLicenceExpDate} onChange={(v: any) => setForm(p => ({ ...p, drivingLicenceExpDate: v }))} />
                  <Input label="CKYC Number" value={form.ckycNumber} placeholder="CKYC Number" onChange={(v: any) => setForm(p => ({ ...p, ckycNumber: v }))} />
                  <Input label="E-Insurance Number" value={form.eInsuranceNumber} placeholder="E-Insurance Number" onChange={(v: any) => setForm(p => ({ ...p, eInsuranceNumber: v }))} />
                  <Input label="Education" value={form.education} placeholder="Education Qualification" onChange={(v: any) => setForm(p => ({ ...p, education: v }))} />
                  <Input label="Passport Number" value={form.passportNumber} placeholder="Passport No" onChange={(v: any) => setForm(p => ({ ...p, passportNumber: v }))} />
                  <Input label="Passport Exp. Date" type="date" value={form.passportExpDate} onChange={(v: any) => setForm(p => ({ ...p, passportExpDate: v }))} />
                  
                  <div className="lg:col-span-2">
                    <Input label="Reference" value={form.reference} placeholder="Reference Name" onChange={(v: any) => setForm(p => ({ ...p, reference: v }))} />
                  </div>
                  <div className="lg:col-span-4">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">Remarks</label>
                    <textarea 
                      value={form.remarks} 
                      onChange={(e) => setForm(p => ({ ...p, remarks: e.target.value }))}
                      placeholder="Remarks"
                      className="w-full mt-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all h-24"
                    />
                  </div>
                </div>
              </section>
            )}

            {activeTab === "residential" && (
              <div className="space-y-10">
                {/* RESIDENCE ADDRESS */}
                <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="flex items-center justify-between bg-slate-800 px-6 py-3 text-white">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-white/10 text-white rounded">
                        <Home size={16} />
                      </div>
                      <h3 className="font-bold uppercase tracking-wider text-[10px]">Residence Address</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="sameAsGroup" className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                      <label htmlFor="sameAsGroup" className="text-[10px] font-bold uppercase tracking-wider">Same As Group Head</label>
                    </div>
                  </div>
                  
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Input label="House / Flat Number" value={form.resHouseNo} placeholder="House / Flat No" onChange={(v: any) => setForm(p => ({ ...p, resHouseNo: v }))} />
                    <Input label="Street" value={form.resStreet} placeholder="Street" onChange={(v: any) => setForm(p => ({ ...p, resStreet: v }))} />
                    <Input label="Area" value={form.resArea} placeholder="Area" onChange={(v: any) => setForm(p => ({ ...p, resArea: v }))} />
                    <Input label="City" value={form.resCity} placeholder="City" onChange={(v: any) => setForm(p => ({ ...p, resCity: v }))} />
                    <Input label="Pincode" value={form.resPincode} placeholder="Pincode" onChange={(v: any) => setForm(p => ({ ...p, resPincode: v }))} />
                    <Input label="State" value={form.resState} placeholder="State" onChange={(v: any) => setForm(p => ({ ...p, resState: v }))} />
                    <Input label="Country" value={form.resCountry} placeholder="India" onChange={(v: any) => setForm(p => ({ ...p, resCountry: v }))} />
                    <Input label="Telephone No (R)" value={form.resTelR} placeholder="Telephone No (R)" onChange={(v: any) => setForm(p => ({ ...p, resTelR: v }))} />
                    <Input label="Telephone No (O)" value={form.resTelO} placeholder="Telephone No (O)" onChange={(v: any) => setForm(p => ({ ...p, resTelO: v }))} />
                    <Input label="Other Number" value={form.resOtherNo} placeholder="Other No" onChange={(v: any) => setForm(p => ({ ...p, resOtherNo: v }))} />
                    <Input label="E-mail ID 2" value={form.resEmail2} placeholder="E-mail ID 2" onChange={(v: any) => setForm(p => ({ ...p, resEmail2: v }))} />
                    <Input label="Website" value={form.resWebsite} placeholder="Website" onChange={(v: any) => setForm(p => ({ ...p, resWebsite: v }))} />
                  </div>
                </section>

                {/* OFFICE ADDRESS */}
                <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="flex items-center justify-between bg-slate-800 px-6 py-3 text-white">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-white/10 text-white rounded">
                        <Briefcase size={16} />
                      </div>
                      <h3 className="font-bold uppercase tracking-wider text-[10px]">Office Address</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="sameAsGroupOff" className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                      <label htmlFor="sameAsGroupOff" className="text-[10px] font-bold uppercase tracking-wider">Same As Group Head</label>
                    </div>
                  </div>
                  
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Select label="Present Occupation Details" value={form.occDetails} options={[{id: "Salaried", name: "Salaried"}, {id: "Self Employed", name: "Self Employed"}]} onChange={(v: any) => setForm(p => ({ ...p, occDetails: v }))} />
                    <Input label="Designation" value={form.designation} placeholder="Designation" onChange={(v: any) => setForm(p => ({ ...p, designation: v }))} />
                    <Input label="Gross Income" value={form.grossIncome} placeholder="Gross Income" onChange={(v: any) => setForm(p => ({ ...p, grossIncome: v }))} />
                    <Input label="Name of Employer" value={form.employerName} placeholder="Name of Employer" onChange={(v: any) => setForm(p => ({ ...p, employerName: v }))} />
                    <Input label="Building Name / Number" value={form.offBuildingNo} placeholder="Building Name / No" onChange={(v: any) => setForm(p => ({ ...p, offBuildingNo: v }))} />
                    <Input label="Street / Area" value={form.offStreet} placeholder="Street / Area" onChange={(v: any) => setForm(p => ({ ...p, offStreet: v }))} />
                    <Input label="Landmark" value={form.offLandmark} placeholder="Landmark" onChange={(v: any) => setForm(p => ({ ...p, offLandmark: v }))} />
                    <Input label="City" value={form.offCity} placeholder="City" onChange={(v: any) => setForm(p => ({ ...p, offCity: v }))} />
                    <Input label="Pincode" value={form.offPincode} placeholder="Pincode" onChange={(v: any) => setForm(p => ({ ...p, offPincode: v }))} />
                    <div className="lg:col-span-3">
                      <Input label="State" value={form.offState} placeholder="State" onChange={(v: any) => setForm(p => ({ ...p, offState: v }))} />
                    </div>
                  </div>
                </section>

                {/* OVERSEAS */}
                <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="flex items-center justify-between bg-slate-800 px-6 py-3 text-white">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-white/10 text-white rounded">
                        <Globe size={16} />
                      </div>
                      <h3 className="font-bold uppercase tracking-wider text-[10px]">Overseas</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="sameAsGroupOS" className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                      <label htmlFor="sameAsGroupOS" className="text-[10px] font-bold uppercase tracking-wider">Same As Group Head</label>
                    </div>
                  </div>
                  
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Input label="House / Flat Number" value={form.osHouseNo} placeholder="House / Flat No" onChange={(v: any) => setForm(p => ({ ...p, osHouseNo: v }))} />
                    <Input label="Street" value={form.osStreet} placeholder="Street" onChange={(v: any) => setForm(p => ({ ...p, osStreet: v }))} />
                    <Input label="Area" value={form.osArea} placeholder="Area" onChange={(v: any) => setForm(p => ({ ...p, osArea: v }))} />
                    <Input label="City" value={form.osCity} placeholder="City" onChange={(v: any) => setForm(p => ({ ...p, osCity: v }))} />
                    <Input label="Pincode" value={form.osPincode} placeholder="Pincode" onChange={(v: any) => setForm(p => ({ ...p, osPincode: v }))} />
                    <Input label="State" value={form.osState} placeholder="State" onChange={(v: any) => setForm(p => ({ ...p, osState: v }))} />
                    <Input label="Country" value={form.osCountry} placeholder="Country" onChange={(v: any) => setForm(p => ({ ...p, osCountry: v }))} />
                    <Input label="Telephone No (O)" value={form.osTelO} placeholder="Telephone No (O)" onChange={(v: any) => setForm(p => ({ ...p, osTelO: v }))} />
                    <Input label="Mobile Number" value={form.osMobile} placeholder="Mobile No" onChange={(v: any) => setForm(p => ({ ...p, osMobile: v }))} />
                    <div className="lg:col-span-3">
                      <Input label="E-mail Id" type="email" value={form.osEmail} placeholder="E-mail Address" onChange={(v: any) => setForm(p => ({ ...p, osEmail: v }))} />
                    </div>
                  </div>
                </section>
              </div>
            )}

              {isEditMode && activeTab === "documents" && (
              <div className="space-y-8">
                {/* UPLOAD SECTION */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-1 space-y-6">
                      <Select
                        label="Select Document"
                        required
                        value={selectedDocName}
                        options={documentOptions}
                        onChange={(v: string) => setSelectedDocName(v)}
                      />
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertCircle size={14} className="text-blue-600" />
                          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">KYC Requirement</p>
                        </div>
                        <p className="text-xs text-blue-700 leading-relaxed">
                          Please upload clear scanned copies of the documents for verification.
                        </p>
                      </div>
                    </div>

                    <div className="lg:col-span-2 space-y-3">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-xs">Upload Files</label>
                      <div className="relative">
                        <input
                          id="kyc-upload"
                          type="file"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          disabled={isLoading || !selectedDocName}
                          onChange={handleFileChange}     
                        />
                        <label 
                          htmlFor="kyc-upload"
                          className={`
                            flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl transition-all group
                            ${!selectedDocName
                              ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-50'
                              : 'bg-white border-blue-200 hover:bg-blue-50/50 hover:border-blue-400 shadow-sm cursor-pointer'
                            }
                          `}
                        >
                          <div className="flex items-center gap-6">
                            <div className={`p-4 rounded-2xl shadow-sm transition-all ${selectedDocName ? 'bg-blue-600 text-white group-hover:scale-110 group-hover:shadow-blue-200 group-hover:shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                              <UploadCloud size={28} />
                            </div>
                            <div className="text-left">
                              <p className="text-base font-bold text-slate-800">
                                {selectedDocName ? `Choose files for ${selectedDocName}` : "Select document type to enable"}
                              </p>
                              <p className="text-xs text-slate-400 font-medium mt-1">PDF, PNG, JPG (Max 10MB)</p>
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

                      {/* Header */}
                      <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-4">
                        <Plus size={18} className="text-blue-600" /> 
                        New Attachments
                      </h4>

                      {/* File List */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {files.map((f, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm">
                                <FileText size={16} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-700 truncate">
                                  {f.label}
                                </p>
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                                  {f.file.name}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() =>
                                setFiles(prev => prev.filter((_, i) => i !== idx))
                              }
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Upload Button */}
                      <div className="flex justify-end">
                        <button
                          onClick={handleUploadDocuments}
                          disabled={isUploading}
                          className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          {isUploading ? "Uploading..." : "Upload Documents"}
                        </button>
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
                                    await remove(customer.customerId, file.id);
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
            {activeTab !== "basic" && (
              <button
              onClick={() => {
                if (activeTab === "documents") {
                  setActiveTab("residential");
                } else if (activeTab === "residential") {
                  setActiveTab("basic");
                }
              }}
                className="px-6 py-2.5 text-sm font-bold text-white bg-red-400 hover:bg-red-500 rounded flex items-center gap-2 transition-all"
              >
                Previous
              </button>
            )}
            {activeTab !== "documents" && (
              <button
              onClick={() => {
                if (activeTab === "basic") {
                  setActiveTab("residential");
                  return;
                }
              
                if (activeTab === "residential") {
                  if (blockDocumentAccess()) return;
              
                  setActiveTab("documents");
                }
              }}
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

export default CustomerUpsertSheet;

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
  className = ""
}: any) => (
  <div className="space-y-1.5">
    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
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
        ${className}
      `}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
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
