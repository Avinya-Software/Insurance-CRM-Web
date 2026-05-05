import React from "react";
import { 
  X, Shield, FileText, User, Calendar, CreditCard, Activity, 
  MapPin, Car, IndianRupee, Wallet, Clipboard, ExternalLink, Download,
  Briefcase, Building2, Info, Clock, Globe, LayoutDashboard,
  Gem,
  Tag,
  ArrowRight,
  Eye
} from "lucide-react";
import { useGeneralPolicyById, useLifePolicyById } from "../../hooks/policy/usePolicies";
import { useKycFileActions } from "../../hooks/customer/useKycFileActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  open: boolean;
  onClose: () => void;
  policyId: string | null;
  policyType: number; // 1 for Life, 2 for General
}

export const PolicyDetailDialog = ({ open, onClose, policyId, policyType }: Props) => {
  const { data: generalData, isLoading: loadingGeneral } = useGeneralPolicyById(
    policyType === 2 ? policyId : null
  );
  const { data: lifeData, isLoading: loadingLife } = useLifePolicyById(
    policyType === 1 ? policyId : null
  );
  const { preview, download } = useKycFileActions();

  if (!open) return null;

  const loading = policyType === 1 ? loadingLife : loadingGeneral;
  const data = policyType === 1 ? lifeData : generalData;

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "₹ 0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-[100]">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-96 text-center">
           <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-blue-600 animate-pulse" />
           </div>
           <p className="text-slate-600 font-medium">Fetching policy details...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-[100]">
        <div className="bg-white p-6 rounded-2xl shadow-xl w-96 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="text-red-600" />
          </div>
          <p className="text-slate-800 font-semibold">Policy not found.</p>
          <button
            className="mt-6 w-full py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            onClick={onClose}
          >
            Close Window
          </button>
        </div>
      </div>
    );
  }

  const DetailItem = ({ label, value, icon: Icon, className = "" }: { label: string; value: any; icon?: any; className?: string }) => {
    if (value === "" || value === null || value === undefined) return null;
    return (
      <div className={`space-y-1.5 ${className}`}>
        <div className="flex items-center gap-2 text-slate-500">
          {Icon && <Icon size={14} className="text-slate-400" />}
          <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
        </div>
        <div className={cn(
          "text-sm font-medium text-slate-900 break-words",
          label.toLowerCase().includes("premium") || label.toLowerCase().includes("amount") || label.toLowerCase().includes("assured") ? "text-blue-700 font-bold" : ""
        )}>
          {value}
        </div>
      </div>
    );
  };

  const policyNumber = policyType === 2 ? data.detail?.currentPolicyNumber : data.policyNumber;
  const policyStatus = data.type || data.policyStatusName;
  const riskStart = formatDate(policyType === 1 ? data.policyStartDate : data.detail?.riskStartDate);
  const riskEnd = formatDate(policyType === 1 ? data.maturityDate : data.detail?.riskEndDate);
  const totalPremium = formatCurrency(policyType === 1 ? data.premiumDetails?.finalInstallmentPremium : data.premium?.totalPremium);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300" onClick={onClose}>
      <div 
        className="bg-slate-50 w-full max-w-5xl max-h-[95vh] overflow-hidden rounded-[2rem] shadow-2xl flex flex-col relative border border-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button (Consistent with Customer Details) */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all duration-200 z-[110] group"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Header Section (Top Summary - MOST IMPORTANT) */}
        <div className="bg-white px-8 py-6 border-b flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mr-12">
            <div className="flex items-start gap-5">
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0",
                policyType === 1 ? "bg-gradient-to-br from-rose-500 to-rose-700 shadow-rose-200" : "bg-gradient-to-br from-teal-500 to-teal-700 shadow-teal-200"
              )}>
                <Shield size={32} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center flex-wrap gap-3">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {policyNumber}
                  </h2>
                  <Badge className={cn(
                    "rounded-full px-3 py-0.5 font-bold transition-none",
                    policyStatus === "Renewal" ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-blue-100 text-blue-700 hover:bg-blue-100"
                  )}>
                    {policyStatus}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-slate-500 text-sm font-medium">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                     <User size={14} className="text-blue-500" />
                     <span>{policyType === 1 ? data.proposerName : data.policyHolderName}</span>
                  </div>
                  {data.mobileNumber && (
                    <div className="flex items-center gap-1.5">
                       <Tag size={14} className="text-blue-500" />
                       <span>{data.mobileNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                     <Building2 size={14} className="text-blue-500" />
                     <span>{policyType === 1 ? data.companyName : data.detail?.insuranceCompanyName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                     <Gem size={14} className="text-blue-500" />
                     <span>{policyType === 1 ? data.productName : data.detail?.productName}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Stats Highlight - Moved slightly left with margin-right */}
            <div className="flex items-center gap-8 bg-slate-50 p-4 px-6 rounded-2xl border border-slate-100 mr-4">
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-1">Policy Period</p>
                   <div className="flex items-center gap-2 text-slate-700 font-bold">
                      <span>{riskStart}</span>
                      <ArrowRight size={14} className="text-slate-300" />
                      <span>{riskEnd}</span>
                   </div>
                </div>
                <div className="w-px h-10 bg-slate-200 hidden md:block" />
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-1">Total Premium</p>
                   <p className="text-xl font-black text-blue-700">{totalPremium}</p>
                </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50">
          <div className="p-8">
            <Tabs defaultValue="summary" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 h-auto flex flex-wrap justify-center sm:justify-start">
                  <TabsTrigger value="summary" className="rounded-lg py-2.5 px-5 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-none text-slate-600">
                    <LayoutDashboard size={14} className="mr-2" /> Summary
                  </TabsTrigger>
                  <TabsTrigger value="details" className="rounded-lg py-2.5 px-5 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-none text-slate-600">
                    <Clipboard size={14} className="mr-2" /> Policy Details
                  </TabsTrigger>
                  {data.members?.length > 0 && (
                    <TabsTrigger value="members" className="rounded-lg py-2.5 px-5 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-none text-slate-600">
                      <User size={14} className="mr-2" /> Members
                    </TabsTrigger>
                  )}
                  {(data.riskLocations?.length > 0 || (data.vehicle && data.vehicle.vehicleNumber)) && (
                    <TabsTrigger value="asset" className="rounded-lg py-2.5 px-5 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-none text-slate-600">
                      {data.vehicle?.vehicleNumber ? <Car size={14} className="mr-2" /> : <MapPin size={14} className="mr-2" />} Asset / Risk
                    </TabsTrigger>
                  )}
                  <TabsTrigger value="financials" className="rounded-lg py-2.5 px-5 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-none text-slate-600">
                    <IndianRupee size={14} className="mr-2" /> Financials
                  </TabsTrigger>
                  <TabsTrigger value="payment" className="rounded-lg py-2.5 px-5 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-none text-slate-600">
                    <Wallet size={14} className="mr-2" /> Payment
                  </TabsTrigger>
                  {data.documents?.length > 0 && (
                    <TabsTrigger value="documents" className="rounded-lg py-2.5 px-5 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-none text-slate-600">
                      <FileText size={14} className="mr-2" /> Documents
                    </TabsTrigger>
                  )}
                  <TabsTrigger value="extra" className="rounded-lg py-2.5 px-5 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-none text-slate-600">
                    <Clock size={14} className="mr-2" /> Extra Info
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* TABS CONTENT */}
              <TabsContent value="summary" className="space-y-6 mt-0">
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="bg-white border-b py-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                       <Info size={16} className="text-blue-600" /> Basic Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6">
                    <DetailItem label="Policy Holder" value={policyType === 1 ? data.proposerName : data.policyHolderName} />
                    <DetailItem label="Mobile" value={data.mobileNumber} />
                    <DetailItem label="Division" value={policyType === 2 ? data.detail?.divisionTypeName : "Life Insurance"} />
                    <DetailItem label="Product" value={policyType === 1 ? data.productName : data.detail?.productName} />
                    <DetailItem label="Risk Start" value={riskStart} />
                    <DetailItem label="Risk End" value={riskEnd} />
                    <DetailItem label="Total Premium" value={totalPremium} />
                    <DetailItem label="Sum Assured" value={formatCurrency(policyType === 1 ? data.sumAssured : data.premium?.sumAssured)} />
                    <DetailItem label="Company" value={policyType === 1 ? data.companyName : data.detail?.insuranceCompanyName} />
                    <DetailItem label="Policy Mode" value={policyType === 1 ? data.premiumMode : data.detail?.policyModeName} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="space-y-6 mt-0">
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="bg-white border-b py-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                       <Clipboard size={16} className="text-blue-600" /> Detailed Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6">
                    <DetailItem label="Division" value={data.detail?.divisionTypeName} />
                    <DetailItem label="Segment" value={data.detail?.segmentName} />
                    <DetailItem label="Policy Type" value={data.detail?.policyTypeName} />
                    <DetailItem label="Policy Mode" value={data.detail?.policyModeName} />
                    <DetailItem label="Branch" value={data.detail?.branchName} />
                    <DetailItem label="Broker Name" value={data.detail?.brokerName} />
                    <DetailItem label="Current Policy #" value={data.detail?.currentPolicyNumber} />
                    <DetailItem label="Previous Policy #" value={data.detail?.previousPolicyNumber} />
                    <DetailItem label="Zone" value={data.detail?.zone} />
                    <DetailItem label="Policy Received" value={data.detail?.isPolicyReceived ? "Yes" : "No"} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="members" className="mt-0">
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="bg-white border-b py-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                       <User size={16} className="text-blue-600" /> Insured Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 border-b">
                        <tr>
                          <th className="px-6 py-4 text-left font-bold text-slate-700">Member Name</th>
                          <th className="px-6 py-4 text-left font-bold text-slate-700">DOB</th>
                          <th className="px-6 py-4 text-left font-bold text-slate-700">Relation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {data.members.map((member: any) => (
                          <tr key={member.id} className="hover:bg-slate-50 transition-none">
                            <td className="px-6 py-4 font-medium">{member.memberName}</td>
                            <td className="px-6 py-4">{formatDate(member.dob)}</td>
                            <td className="px-6 py-4">{member.relationWithHead || "Family Member"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="asset" className="space-y-6 mt-0">
                {data.riskLocations?.length > 0 && (
                  <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-white border-b py-4">
                      <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                         <MapPin size={16} className="text-blue-600" /> Risk Locations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b">
                          <tr>
                            <th className="px-6 py-3 text-left font-bold text-slate-700 w-16">Sr No</th>
                            <th className="px-6 py-3 text-left font-bold text-slate-700">Address</th>
                            <th className="px-6 py-3 text-left font-bold text-slate-700">Sum Assured</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {data.riskLocations.map((loc: any, index: number) => (
                            <tr key={loc.id}>
                              <td className="px-6 py-4 font-medium text-slate-500">{index + 1}</td>
                              <td className="px-6 py-4 font-medium">{loc.riskAddress}</td>
                              <td className="px-6 py-4 font-bold text-blue-700">{formatCurrency(loc.sumAssured)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                )}

                {data.vehicle && data.vehicle.vehicleNumber && (
                  <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-white border-b py-4">
                      <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                         <Car size={16} className="text-blue-600" /> Vehicle Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6">
                      <DetailItem label="Vehicle Number" value={data.vehicle.vehicleNumber} icon={Tag} />
                      <DetailItem label="Model / Brand" value={`${data.vehicle.brand} ${data.vehicle.vehicleName}`} />
                      <DetailItem label="Engine Number" value={data.vehicle.engineNo} />
                      <DetailItem label="Chassis Number" value={data.vehicle.chassisNo} />
                      <DetailItem label="Fuel Type" value={data.vehicle.fuelType} />
                      <DetailItem label="RTO" value={data.vehicle.rto} />
                      <DetailItem label="Manufacture Year" value={data.vehicle.manufactureYear} />
                      <DetailItem label="NCB (%)" value={data.vehicle.ncb} />
                      <DetailItem label="CC / GVW" value={`${data.vehicle.cc} / ${data.vehicle.gvw}`} />
                      <DetailItem label="Fitness Certificate" value={data.vehicle.fitnessCertificate ? "Yes" : "No"} />
                      <DetailItem label="BH Series" value={data.vehicle.bhSeries ? "Yes" : "No"} />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="financials" className="space-y-6 mt-0">
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="bg-white border-b py-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                       <IndianRupee size={16} className="text-blue-600" /> Premium & Sum Assured
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6">
                    <DetailItem label="Basic Premium" value={formatCurrency(data.premium?.basicPremium)} />
                    <DetailItem label="Tax Amount" value={formatCurrency(data.premium?.taxAmount)} />
                    <DetailItem label="Total Premium" value={totalPremium} />
                    <DetailItem label="Sum Assured" value={formatCurrency(data.premium?.sumAssured)} />
                    <DetailItem label="IDV Value" value={formatCurrency(data.premium?.idvValue)} />
                    <DetailItem label="TPA Premium" value={formatCurrency(data.premium?.tpaPremium)} />
                    <DetailItem label="Commissionable Amount" value={formatCurrency(data.premium?.commissionableAmount)} />
                    <DetailItem label="Is Commissionable" value={data.premium?.isCommission ? "Yes" : "No"} />
                    <DetailItem label="TP Policy Mode" value={data.premium?.tpPolicyMode} />
                    <DetailItem label="TP Due Date" value={formatDate(data.premium?.tpDueDate)} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payment" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                    <div className="bg-emerald-600 px-6 py-3 text-white">
                       <h4 className="text-[10px] font-bold uppercase tracking-widest">Paid By Client</h4>
                    </div>
                    <CardContent className="p-6 grid grid-cols-1 gap-4">
                      <DetailItem label="Payment Method" value={data.payment?.paidByClientName || data.payment?.paidByClient} icon={Wallet} />
                      <DetailItem label="Amount Paid" value={formatCurrency(data.payment?.clientAmount)} />
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                    <div className="bg-indigo-600 px-6 py-3 text-white">
                       <h4 className="text-[10px] font-bold uppercase tracking-widest">Paid By Agent</h4>
                    </div>
                    <CardContent className="p-6 grid grid-cols-1 gap-4">
                      <DetailItem label="Payment Method" value={data.payment?.paidByAgentName || data.payment?.paidByAgent} icon={Briefcase} />
                      <DetailItem label="Amount Paid" value={formatCurrency(data.payment?.agentAmount)} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="mt-0">
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="bg-white border-b py-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                       <FileText size={16} className="text-blue-600" /> Policy Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.documents?.map((doc: any) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 transition-none group">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                              <FileText size={20} />
                            </div>
                            <div className="max-w-[200px]">
                              <p className="text-sm font-bold text-slate-900 truncate">{doc.documentName}</p>
                              <p className="text-[10px] text-slate-400 truncate">{doc.fileName}</p>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Uploaded: {formatDate(doc.uploadedAt)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                                onClick={() => preview(doc.url)}
                                className="p-2.5 bg-slate-50 text-slate-600 hover:bg-blue-100 hover:text-blue-700 rounded-xl transition-all"
                                title="Preview"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                onClick={() => download(doc.url, doc.fileName)}
                                className="p-2.5 bg-slate-50 text-slate-600 hover:bg-blue-100 hover:text-blue-700 rounded-xl transition-all"
                                title="Download"
                              >
                                <Download size={18} />
                              </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="extra" className="space-y-6 mt-0">
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="bg-white border-b py-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                       <Clock size={16} className="text-blue-600" /> System Information & Remarks
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
                    <DetailItem label="Customer Name" value={policyType === 1 ? data.proposerName : data.policyHolderName} icon={User} />
                    <DetailItem label="Created At" value={formatDate(data.createdat || data.createdAt)} icon={Clock} />
                    <DetailItem label="Updated At" value={formatDate(data.updatedAt) || "N/A"} icon={Clock} />
                    <div className="col-span-1 md:col-span-2 lg:col-span-3">
                      <DetailItem label="Remarks" value={data.detail?.remarks} className="bg-slate-50 p-4 rounded-xl border border-slate-100 italic" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Footer Area */}
        <div className="bg-white px-8 py-4 border-t flex justify-end gap-3">
           <button 
             onClick={onClose}
             className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-none border border-slate-200"
           >
             Close Detail View
           </button>
        </div>
      </div>
    </div>
  );
};
