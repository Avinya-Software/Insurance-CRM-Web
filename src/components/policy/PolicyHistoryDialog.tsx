import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  X,
  FileText,
  ShieldCheck,
  User,
  Clock,
  Briefcase,
  Layers,
  MapPin,
  Calendar,
  Building,
  CreditCard,
  Eye,
  Download,
  Activity
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { getGeneralPolicyHistoryApi } from "../../api/policy.api";
import { useKycFileActions } from "../../hooks/customer/useKycFileActions";

interface PolicyHistoryDialogProps {
  policyId: string | null;
  onClose: () => void;
  open: boolean;
}

export const PolicyHistoryDialog: React.FC<PolicyHistoryDialogProps> = ({
  policyId,
  onClose,
  open
}) => {
  const [policies, setPolicies] = useState<any[]>([]);
  const [selectedPolicyIndex, setSelectedPolicyIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { preview, download } = useKycFileActions();

  useEffect(() => {
    if (!open || !policyId) {
      setPolicies([]);
      setSelectedPolicyIndex(0);
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getGeneralPolicyHistoryApi(policyId);
        if (Array.isArray(res.data) && res.data.length > 0) {
          const sorted = [...res.data].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setPolicies(sorted);
          setSelectedPolicyIndex(0);
        } else {
          setError("No policy history found.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch policy history.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, [open, policyId]);

  if (!open) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-[100]">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-96 text-center animate-pulse">
           <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Layers className="text-blue-600 animate-bounce" />
           </div>
           <p className="text-slate-600 font-medium">Fetching policy history...</p>
        </div>
      </div>
    );
  }

  if (error || policies.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-[100]">
        <div className="bg-white p-6 rounded-2xl shadow-xl w-96 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="text-red-600" />
          </div>
          <p className="text-slate-800 font-semibold">{error || "Data not available."}</p>
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

  const selectedPolicy = policies[selectedPolicyIndex];
  const allDocs = policies.flatMap((p) => p.documents || []);

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return null;
    try {
      return format(new Date(dateStr), "dd MMM yyyy");
    } catch {
      return dateStr;
    }
  };

  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const getVersionLabel = (p: any, idx: number) => {
    const totalCount = policies.length;
    const positionFromBottom = totalCount - 1 - idx;

    if (idx === 0) {
      if (totalCount === 1) return "Latest Policy (Fresh)";
      return `Latest Policy (Renewal ${getOrdinal(totalCount - 1)})`;
    }
    
    if (positionFromBottom === 0) {
       return "Fresh Policy";
    }
    
    return `Renewal ${getOrdinal(positionFromBottom)}`;
  };

  const DetailItem = ({ label, value, icon: Icon, className = "" }: { label: string; value: any; icon?: any; className?: string }) => (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center gap-2 text-slate-500">
        {Icon && <Icon size={14} className="text-slate-400" />}
        <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-sm font-medium text-slate-900 break-words">
        {value || <span className="text-slate-300">N/A</span>}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300" onClick={onClose}>
      <div 
        className="bg-slate-50 w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-[2rem] shadow-2xl flex flex-col relative border border-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all duration-200 z-[110] group"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Header Section */}
        <div className="bg-white border-b">
          <div className="px-8 py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pr-20">
            <div className="flex items-center gap-5 shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 shrink-0">
                <Layers size={32} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {selectedPolicy.documentNumber || "N/A"}
                  </h2>
                  <Badge 
                    variant={selectedPolicy.type === "Renewal" ? "default" : "secondary"} 
                    className={`rounded-full transition-none ${selectedPolicy.type === "Renewal" ? "hover:bg-slate-900" : "hover:bg-slate-100"}`}
                  >
                    {selectedPolicy.type || "Policy"}
                  </Badge>
                  {selectedPolicyIndex === 0 && (
                    <Badge className="rounded-full bg-green-100 text-green-700 border-none transition-none hover:bg-green-100">Latest</Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mt-1 text-slate-500 text-sm">
                  <div className="flex items-center gap-1.5 font-medium text-emerald-600">
                    <span>Premium: ₹{selectedPolicy.premium?.totalPremium?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Clock size={14} className="text-indigo-500" />
                    <span>Trans: {formatDate(selectedPolicy.transactionDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Version Timeline Selector in Header */}
            <div className="flex-1 max-w-[650px] overflow-hidden min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <Activity size={14} className="text-indigo-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">Policy History Timeline</span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar scroll-smooth">
                {policies.map((p, idx) => {
                  const isSelected = selectedPolicyIndex === idx;
                  const isLatest = idx === 0;
                  return (
                    <button
                      key={p.policyId}
                      onClick={() => setSelectedPolicyIndex(idx)}
                      className={`flex-shrink-0 w-[150px] px-4 py-3 rounded-2xl border text-left relative transition-colors duration-200 ${
                        isSelected 
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" 
                          : "bg-white border-slate-200 text-slate-600 shadow-sm hover:border-indigo-400"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1 min-h-[16px]">
                        <span className="text-[10px] font-bold pr-1 leading-tight">
                          {getVersionLabel(p, idx)}
                        </span>
                        {isLatest && (
                          <Badge 
                            className={`text-[8px] h-3.5 px-1 transition-none border-none ${
                               isSelected 
                               ? "bg-white text-indigo-600 hover:bg-white" 
                               : "bg-green-100 text-green-700 hover:bg-green-100"
                            }`}
                          >
                            Active
                          </Badge>
                        )}
                      </div>
                      <div className={`text-[10px] font-medium whitespace-nowrap ${isSelected ? "text-indigo-100/80" : "text-slate-400"}`}>
                        {formatDate(p.transactionDate)}
                      </div>
                      {isSelected && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-600 rotate-45 border-r border-b border-indigo-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50">
          <div className="p-8">
            <Tabs defaultValue="overview" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 h-auto flex flex-wrap justify-center md:justify-start gap-1">
                  <TabsTrigger value="overview" className="rounded-lg py-2 px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all text-slate-600">
                    <User size={16} className="mr-2" /> Overview
                  </TabsTrigger>
                  <TabsTrigger value="details" className="rounded-lg py-2 px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all text-slate-600">
                    <ShieldCheck size={16} className="mr-2" /> Policy Details
                  </TabsTrigger>
                  <TabsTrigger value="members" className="rounded-lg py-2 px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all text-slate-600">
                    <User size={16} className="mr-2" /> Members
                  </TabsTrigger>
                  <TabsTrigger value="premium" className="rounded-lg py-2 px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all text-slate-600">
                    <CreditCard size={16} className="mr-2" /> Premium & Payment
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="rounded-lg py-2 px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all text-slate-600">
                    <FileText size={16} className="mr-2" /> Documents
                  </TabsTrigger>
                  <TabsTrigger value="agent" className="rounded-lg py-2 px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all text-slate-600">
                    <Briefcase size={16} className="mr-2" /> Agent Info
                  </TabsTrigger>
                  <TabsTrigger value="system" className="rounded-lg py-2 px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all text-slate-600">
                    <Clock size={16} className="mr-2" /> System Info
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* OVERVIEW TAB */}
              <TabsContent value="overview" className="space-y-6 mt-0 focus-visible:ring-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                    <div className="flex items-center gap-2 bg-blue-50 px-6 py-3 text-blue-900 border-b border-blue-100">
                       <FileText size={16} className="text-blue-600" />
                       <h4 className="text-[10px] font-bold uppercase tracking-widest">Basic Policy Info</h4>
                    </div>
                    <CardContent className="p-6 grid grid-cols-2 gap-6">
                      <DetailItem label="Document Number" value={selectedPolicy.documentNumber} />
                      <DetailItem label="Type (Fresh/Renewal)" value={selectedPolicy.type} />
                      <DetailItem label="Transaction Date" value={formatDate(selectedPolicy.transactionDate)} />
                      <DetailItem label="Created Date" value={formatDate(selectedPolicy.createdAt)} />
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                    <div className="flex items-center gap-2 bg-indigo-50 px-6 py-3 text-indigo-900 border-b border-indigo-100">
                       <User size={16} className="text-indigo-600" />
                       <h4 className="text-[10px] font-bold uppercase tracking-widest">Customer Details</h4>
                    </div>
                    <CardContent className="p-6 grid grid-cols-2 gap-6">
                      <DetailItem label="Policy Holder Name" value={`${selectedPolicy.firstName || ''} ${selectedPolicy.lastName || ''}`.trim()} />
                      <DetailItem label="Mobile" value={selectedPolicy.mobileNumber} />
                      <DetailItem label="Gender" value={selectedPolicy.gender} />
                      <DetailItem label="Relation" value={selectedPolicy.relationWithHead} />
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                    <div className="flex items-center gap-2 bg-purple-50 px-6 py-3 text-purple-900 border-b border-purple-100">
                       <ShieldCheck size={16} className="text-purple-600" />
                       <h4 className="text-[10px] font-bold uppercase tracking-widest">Policy Details</h4>
                    </div>
                    <CardContent className="p-6 grid grid-cols-2 gap-6">
                      <DetailItem label="Division" value={selectedPolicy.detail?.divisionTypeName} />
                      <DetailItem label="Policy Mode" value={selectedPolicy.detail?.policyModeName} />
                      <DetailItem label="Policy Type" value={selectedPolicy.detail?.policyTypeName} />
                      <DetailItem label="Nominee" value={selectedPolicy.detail?.nomineeName} />
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                    <div className="flex items-center gap-2 bg-emerald-50 px-6 py-3 text-emerald-900 border-b border-emerald-100">
                       <Calendar size={16} className="text-emerald-600" />
                       <h4 className="text-[10px] font-bold uppercase tracking-widest">Risk & Premium</h4>
                    </div>
                    <CardContent className="p-6 grid grid-cols-2 gap-6">
                      <DetailItem label="Risk Start" value={formatDate(selectedPolicy.detail?.riskStartDate)} />
                      <DetailItem label="Risk End" value={formatDate(selectedPolicy.detail?.riskEndDate)} />
                      <DetailItem label="Total Premium" value={selectedPolicy.premium?.totalPremium != null ? `₹${selectedPolicy.premium.totalPremium.toLocaleString()}` : null} />
                      <DetailItem label="Sum Assured" value={selectedPolicy.premium?.sumAssured != null ? `₹${selectedPolicy.premium.sumAssured.toLocaleString()}` : null} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* POLICY DETAILS TAB */}
              <TabsContent value="details" className="space-y-6 mt-0 focus-visible:ring-0">
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="bg-white border-b py-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                       <Building size={16} className="text-indigo-600" /> Full Policy Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8">
                    <DetailItem label="Insurance Company" value={selectedPolicy.detail?.insuranceCompanyName} />
                    <DetailItem label="Branch" value={selectedPolicy.detail?.branchName} />
                    <DetailItem label="Product" value={selectedPolicy.detail?.productName} />
                    <DetailItem label="Segment" value={selectedPolicy.detail?.segmentName} />
                    <DetailItem label="Zone" value={selectedPolicy.detail?.zone} />
                    <DetailItem label="AddOns" value={selectedPolicy.detail?.addOns} />
                    <DetailItem label="Optional Cover" value={selectedPolicy.detail?.optionalCover} />
                    <DetailItem label="Previous Policy No" value={selectedPolicy.detail?.previousPolicyNumber} />
                    <DetailItem label="Current Policy No" value={selectedPolicy.detail?.currentPolicyNumber} />
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="bg-white border-b py-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                       <FileText size={16} className="text-indigo-600" /> Remarks
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                     <p className="text-sm text-slate-700">{selectedPolicy.detail?.remarks || "No remarks provided."}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* MEMBERS TAB */}
              <TabsContent value="members" className="space-y-6 mt-0 focus-visible:ring-0">
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="bg-white border-b py-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                       <User size={16} className="mr-2 text-indigo-600" /> Insured Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {selectedPolicy.members && selectedPolicy.members.length > 0 ? (
                      <div className="divide-y divide-slate-100">
                        {selectedPolicy.members.map((member: any) => (
                           <div key={member.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                              <div>
                                <h4 className="font-semibold text-slate-900">{member.memberName || "Unknown"}</h4>
                                <div className="flex gap-4 mt-1 text-sm text-slate-500">
                                  <span>DOB: {formatDate(member.dob) || "N/A"}</span>
                                </div>
                              </div>
                              <Badge variant={member.isDeleted ? "destructive" : "default"} className="transition-none">
                                {member.isDeleted ? "Deleted" : "Active"}
                              </Badge>
                           </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-12 text-center text-slate-500">No members associated with this policy version.</div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* PREMIUM & PAYMENT TAB */}
              <TabsContent value="premium" className="space-y-6 mt-0 focus-visible:ring-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                    <div className="flex items-center gap-2 bg-blue-50 px-6 py-3 text-blue-900 border-b border-blue-100">
                       <CreditCard size={16} className="text-blue-600" />
                       <h4 className="text-[10px] font-bold uppercase tracking-widest">Premium Structure</h4>
                    </div>
                    <CardContent className="p-6 grid grid-cols-2 gap-6">
                      <DetailItem label="Total Premium" value={selectedPolicy.premium?.totalPremium != null ? `₹${selectedPolicy.premium.totalPremium.toLocaleString()}` : null} />
                      <DetailItem label="Basic Premium" value={selectedPolicy.premium?.basicPremium != null ? `₹${selectedPolicy.premium.basicPremium.toLocaleString()}` : null} />
                      <DetailItem label="Tax Amount" value={selectedPolicy.premium?.taxAmount != null ? `₹${selectedPolicy.premium.taxAmount.toLocaleString()}` : null} />
                      <DetailItem label="Sum Assured" value={selectedPolicy.premium?.sumAssured != null ? `₹${selectedPolicy.premium.sumAssured.toLocaleString()}` : null} />
                      <DetailItem label="IDV Value" value={selectedPolicy.premium?.idvValue} />
                      <DetailItem label="TPA Premium" value={selectedPolicy.premium?.tpaPremium} />
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                    <div className="flex items-center gap-2 bg-indigo-50 px-6 py-3 text-indigo-900 border-b border-indigo-100">
                       <CreditCard size={16} className="text-indigo-600" />
                       <h4 className="text-[10px] font-bold uppercase tracking-widest">Payment Breakup</h4>
                    </div>
                    <CardContent className="p-6 grid grid-cols-2 gap-6">
                      <DetailItem label="Paid By Client" value={selectedPolicy.payment?.paidByClientName} />
                      <DetailItem label="Client Amount" value={selectedPolicy.payment?.clientAmount != null ? `₹${selectedPolicy.payment.clientAmount.toLocaleString()}` : null} />
                      <DetailItem label="Paid By Agent" value={selectedPolicy.payment?.paidByAgentName} />
                      <DetailItem label="Agent Amount" value={selectedPolicy.payment?.agentAmount != null ? `₹${selectedPolicy.payment.agentAmount.toLocaleString()}` : null} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* DOCUMENTS TAB */}
              <TabsContent value="documents" className="space-y-6 mt-0 focus-visible:ring-0">
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="bg-white border-b py-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                       <FileText size={16} className="text-indigo-600" /> Documents
                    </CardTitle>
                    <p className="text-xs text-slate-500 mt-1">Showing all documents across all policy history versions</p>
                  </CardHeader>
                  <CardContent className="p-6">
                    {allDocs.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {allDocs.map((file: any) => (
                           <div
                            key={file.id}
                            className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl group transition-all duration-200 hover:border-indigo-300 shadow-sm"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                <FileText size={20} />
                              </div>
                              <div className="max-w-[200px]">
                                <p className="text-sm font-bold text-slate-900 truncate">
                                  {file.documentName || file.fileName}
                                </p>
                                {file.documentName && (
                                  <p className="text-[10px] text-slate-500 truncate">
                                    {file.fileName}
                                  </p>
                                )}
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                                  Uploaded: {formatDate(file.uploadedAt)}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => preview(file.url)}
                                className="p-2.5 bg-slate-50 text-slate-600 hover:bg-indigo-100 hover:text-indigo-700 rounded-xl transition-all"
                                title="Preview"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                onClick={() => download(file.url, file.fileName)}
                                className="p-2.5 bg-slate-50 text-slate-600 hover:bg-indigo-100 hover:text-indigo-700 rounded-xl transition-all"
                                title="Download"
                              >
                                <Download size={18} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                        <FileText size={48} className="mb-3 opacity-20" />
                        <p className="text-sm font-medium">No documents uploaded across all history versions</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* AGENT INFO TAB */}
              <TabsContent value="agent" className="space-y-6 mt-0 focus-visible:ring-0">
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="bg-white border-b py-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                       <Briefcase size={16} className="text-indigo-600" /> Broker & Agent Business Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8">
                    <DetailItem label="Broker Name" value={selectedPolicy.detail?.brokerName} />
                    <DetailItem label="Bank Name" value={selectedPolicy.detail?.bankName} />
                    <DetailItem label="Agent Payment" value={selectedPolicy.payment?.agentAmount != null ? `₹${selectedPolicy.payment.agentAmount.toLocaleString()}` : null} />
                    <DetailItem label="Commission Entry" value={selectedPolicy.premium?.commissionEntry} />
                    <DetailItem label="Is Commission?" value={selectedPolicy.premium?.isCommission ? "Yes" : "No"} />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SYSTEM INFO TAB */}
              <TabsContent value="system" className="space-y-6 mt-0 focus-visible:ring-0">
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="bg-white border-b py-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                       <Clock size={16} className="text-indigo-600" /> System Information (Selected Version)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                    <DetailItem label="Created At" value={formatDate(selectedPolicy.createdAt || selectedPolicy.createdat)} />
                    <DetailItem label="Updated At" value={formatDate(selectedPolicy.updatedAt || selectedPolicy.updatedat)} />
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
             className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all border border-slate-200"
           >
            Close Detail View
           </button>
        </div>
      </div>
    </div>
  );
};
