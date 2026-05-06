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
  Activity,
  Car,
  LayoutDashboard,
  IndianRupee,
  Wallet,
  Clipboard
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
  const divisionType = selectedPolicy.divisionType;

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

  const DetailItem = ({ label, value, icon: Icon, className = "" }: { label: string; value: any; icon?: any; className?: string }) => {
    if (value === "" || value === null || value === undefined) return null;
    return (
        <div className={`space-y-1.5 ${className}`}>
        <div className="flex items-center gap-2 text-slate-500">
            {Icon && <Icon size={14} className="text-slate-400" />}
            <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
        </div>
        <div className="text-sm font-medium text-slate-900 break-words">
            {value}
        </div>
        </div>
    );
  };

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
                {divisionType === 5 ? <Car size={32} /> : <Layers size={32} />}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {selectedPolicy.documentNumber || "N/A"}
                  </h2>
                  <Badge 
                    className={`rounded-full bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-50 transition-none`}
                  >
                    {selectedPolicy.detail?.divisionTypeName || "Policy"}
                  </Badge>
                  <Badge 
                    variant={selectedPolicy.type === "Renewal" ? "default" : "secondary"} 
                    className={`rounded-full transition-none ${selectedPolicy.type === "Renewal" ? "hover:bg-slate-900" : "hover:bg-slate-100"}`}
                  >
                    {selectedPolicy.type || "Fresh"}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mt-1 text-slate-500 text-sm">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-600">
                    <span>Premium: ₹{selectedPolicy.premium?.totalPremium?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <User size={14} className="text-indigo-500" />
                    <span>{selectedPolicy.firstName} {selectedPolicy.lastName}</span>
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
                    <LayoutDashboard size={14} className="mr-2" /> Overview
                  </TabsTrigger>
                  <TabsTrigger value="details" className="rounded-lg py-2 px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all text-slate-600">
                    <Clipboard size={14} className="mr-2" /> Policy Details
                  </TabsTrigger>
                  
                  {divisionType === 1 && (
                    <TabsTrigger value="members" className="rounded-lg py-2 px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all text-slate-600">
                      <User size={14} className="mr-2" /> Members
                    </TabsTrigger>
                  )}

                  {(divisionType === 2 || divisionType === 5) && selectedPolicy.riskLocations?.length > 0 && (
                    <TabsTrigger value="risk" className="rounded-lg py-2 px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all text-slate-600">
                      <MapPin size={14} className="mr-2" /> Risk Locations
                    </TabsTrigger>
                  )}

                  <TabsTrigger value="premium" className="rounded-lg py-2 px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all text-slate-600">
                    <IndianRupee size={14} className="mr-2" /> Premium & Payment
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="rounded-lg py-2 px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all text-slate-600">
                    <FileText size={14} className="mr-2" /> Documents
                  </TabsTrigger>
                  <TabsTrigger value="system" className="rounded-lg py-2 px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all text-slate-600">
                    <Clock size={14} className="mr-2" /> System Info
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* OVERVIEW TAB */}
              <TabsContent value="overview" className="space-y-6 mt-0 focus-visible:ring-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info Card */}
                  <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                    <div className="flex items-center gap-2 bg-blue-50 px-6 py-3 text-blue-900 border-b border-blue-100">
                       <FileText size={16} className="text-blue-600" />
                       <h4 className="text-[10px] font-bold uppercase tracking-widest">Basic Policy Info</h4>
                    </div>
                    <CardContent className="p-6 grid grid-cols-2 gap-6">
                      <DetailItem label="Document Number" value={selectedPolicy.documentNumber} />
                      <DetailItem label="Division" value={selectedPolicy.detail?.divisionTypeName} />
                      <DetailItem label="Segment" value={selectedPolicy.detail?.segmentName} />
                      <DetailItem label="Product" value={selectedPolicy.detail?.productName} />
                      <DetailItem label="Risk Start" value={formatDate(selectedPolicy.detail?.riskStartDate)} />
                      <DetailItem label="Risk End" value={formatDate(selectedPolicy.detail?.riskEndDate)} />
                    </CardContent>
                  </Card>

                   {/* Customer Card */}
                  <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                    <div className="flex items-center gap-2 bg-indigo-50 px-6 py-3 text-indigo-900 border-b border-indigo-100">
                       <User size={16} className="text-indigo-600" />
                       <h4 className="text-[10px] font-bold uppercase tracking-widest">Policy Holder</h4>
                    </div>
                    <CardContent className="p-6 grid grid-cols-2 gap-6">
                      <DetailItem label="Full Name" value={`${selectedPolicy.firstName} ${selectedPolicy.lastName}`} />
                      <DetailItem label="Mobile" value={selectedPolicy.mobileNumber} />
                      <DetailItem label="Email" value={selectedPolicy.email} />
                      <DetailItem label="Gender" value={selectedPolicy.gender} />
                      <DetailItem label="Relation" value={selectedPolicy.relationWithHead} />
                      <DetailItem label="City" value={selectedPolicy.city} />
                    </CardContent>
                  </Card>

                  {/* Division Specific Highlights */}
                  {divisionType === 5 && (
                    <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white md:col-span-2">
                        <div className="flex items-center gap-2 bg-amber-50 px-6 py-3 text-amber-900 border-b border-amber-100">
                        <Car size={16} className="text-amber-600" />
                        <h4 className="text-[10px] font-bold uppercase tracking-widest">Vehicle Highlights</h4>
                        </div>
                        <CardContent className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                            <DetailItem label="Previous Policy #" value={selectedPolicy.detail?.previousPolicyNumber} />
                            <DetailItem label="Vehicle Use" value={selectedPolicy.detail?.vehicleUse} />
                            <DetailItem label="Vehicle Class" value={selectedPolicy.detail?.vehicleClass} />
                            <DetailItem label="Vehicle No" value={selectedPolicy.vehicle?.vehicleNumber} />
                            <DetailItem label="Brand/Model" value={selectedPolicy.vehicle?.brand ? `${selectedPolicy.vehicle.brand} ${selectedPolicy.vehicle.vehicleName || ''}` : null} />
                            <DetailItem label="Engine No" value={selectedPolicy.vehicle?.engineNo} />
                            <DetailItem label="Chassis No" value={selectedPolicy.vehicle?.chassisNo} />
                            <DetailItem label="RTO" value={selectedPolicy.vehicle?.rto} />
                            <DetailItem label="Fuel Type" value={selectedPolicy.vehicle?.fuelType} />
                            <DetailItem label="Manufacture Year" value={selectedPolicy.vehicle?.manufactureYear} />
                            <DetailItem label="NCB (%)" value={selectedPolicy.vehicle?.ncb ? `${selectedPolicy.vehicle.ncb}%` : null} />
                            <DetailItem label="CC / GVW" value={selectedPolicy.vehicle?.cc ? `${selectedPolicy.vehicle.cc} / ${selectedPolicy.vehicle.gvw || '-'}` : null} />
                            <DetailItem label="IDV Value" value={selectedPolicy.premium?.idvValue ? `₹${selectedPolicy.premium.idvValue.toLocaleString()}` : null} />
                            <DetailItem label="TPA Premium" value={selectedPolicy.premium?.tpaPremium ? `₹${selectedPolicy.premium.tpaPremium.toLocaleString()}` : null} />
                        </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* POLICY DETAILS TAB */}
              <TabsContent value="details" className="space-y-6 mt-0 focus-visible:ring-0">
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="bg-white border-b py-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                       <Building size={16} className="text-indigo-600" /> Configuration Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8">
                    <DetailItem label="Insurance Company" value={selectedPolicy.detail?.insuranceCompanyName} />
                    <DetailItem label="Branch" value={selectedPolicy.detail?.branchName} />
                    <DetailItem label="Policy Type" value={selectedPolicy.detail?.policyTypeName} />
                    <DetailItem label="Policy Mode" value={selectedPolicy.detail?.policyModeName} />
                    <DetailItem label="Zone" value={selectedPolicy.detail?.zone} />
                    <DetailItem label="Broker Name" value={selectedPolicy.detail?.brokerName} />
                    <DetailItem label="Bank Name" value={selectedPolicy.detail?.bankName} />
                    
                    {/* Health Specific */}
                    {divisionType === 1 && (
                        <>
                            <DetailItem label="Optional Cover" value={selectedPolicy.detail?.optionalCover} />
                            <DetailItem label="AddOns" value={selectedPolicy.detail?.addOns} />
                        </>
                    )}

                    {/* Vehicle Specific */}
                    {divisionType === 5 && (
                        <>
                            <DetailItem label="Vehicle Use" value={selectedPolicy.detail?.vehicleUse} />
                            <DetailItem label="Vehicle Class" value={selectedPolicy.detail?.vehicleClass} />
                            <DetailItem label="AddOns" value={selectedPolicy.detail?.addOns} />
                        </>
                    )}

                    <DetailItem label="Nominee" value={selectedPolicy.detail?.nomineeName} />
                    <DetailItem label="Policy Received" value={selectedPolicy.detail?.isPolicyReceived ? "Yes" : "No"} />
                  </CardContent>
                </Card>

                {selectedPolicy.detail?.remarks && (
                    <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                        <CardHeader className="bg-white border-b py-4">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                            <FileText size={16} className="text-indigo-600" /> Remarks
                        </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <p className="text-sm text-slate-700">{selectedPolicy.detail.remarks}</p>
                        </CardContent>
                    </Card>
                )}
              </TabsContent>

              {/* MEMBERS TAB (Health Only) */}
              {divisionType === 1 && (
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
                                    <h4 className="font-semibold text-slate-900">{member.memberName}</h4>
                                    <div className="text-sm text-slate-500 mt-0.5">
                                        DOB: {formatDate(member.dob)}
                                    </div>
                                </div>
                                <Badge variant={member.isDeleted ? "destructive" : "outline"} className="rounded-full">
                                    {member.isDeleted ? "Removed" : "Active"}
                                </Badge>
                            </div>
                            ))}
                        </div>
                        ) : (
                        <div className="p-12 text-center text-slate-500">No members found.</div>
                        )}
                    </CardContent>
                    </Card>
                </TabsContent>
              )}

              {/* RISK LOCATIONS (Other/Vehicle) */}
              {(divisionType === 2 || divisionType === 5) && selectedPolicy.riskLocations?.length > 0 && (
                <TabsContent value="risk" className="space-y-6 mt-0">
                    <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                        <CardHeader className="bg-white border-b py-4">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                            <MapPin size={16} className="text-indigo-600" /> Risk Locations
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-bold text-slate-700">Sr No</th>
                                        <th className="px-6 py-4 text-left font-bold text-slate-700">Risk Address</th>
                                        <th className="px-6 py-4 text-left font-bold text-slate-700 font-bold">Sum Assured</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {selectedPolicy.riskLocations.map((loc: any) => (
                                        <tr key={loc.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-medium">{loc.srNo}</td>
                                            <td className="px-6 py-4">{loc.riskAddress}</td>
                                            <td className="px-6 py-4 font-bold text-emerald-600">₹{loc.sumAssured?.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </TabsContent>
              )}

              {/* PREMIUM & PAYMENT TAB */}
              <TabsContent value="premium" className="space-y-6 mt-0 focus-visible:ring-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                    <div className="flex items-center gap-2 bg-blue-50 px-6 py-3 text-blue-900 border-b border-blue-100">
                       <IndianRupee size={16} className="text-blue-600" />
                       <h4 className="text-[10px] font-bold uppercase tracking-widest">Premium Structure</h4>
                    </div>
                    <CardContent className="p-6 grid grid-cols-2 gap-6">
                      <DetailItem label="Total Premium" value={selectedPolicy.premium?.totalPremium ? `₹${selectedPolicy.premium.totalPremium.toLocaleString()}` : null} />
                      <DetailItem label="Basic Premium" value={selectedPolicy.premium?.basicPremium ? `₹${selectedPolicy.premium.basicPremium.toLocaleString()}` : null} />
                      <DetailItem label="Tax Amount" value={selectedPolicy.premium?.taxAmount ? `₹${selectedPolicy.premium.taxAmount.toLocaleString()}` : null} />
                      <DetailItem label="Sum Assured" value={selectedPolicy.premium?.sumAssured ? `₹${selectedPolicy.premium.sumAssured.toLocaleString()}` : null} />
                      <DetailItem label="IDV Value" value={selectedPolicy.premium?.idvValue ? `₹${selectedPolicy.premium.idvValue.toLocaleString()}` : null} />
                      <DetailItem label="TPA Premium" value={selectedPolicy.premium?.tpaPremium ? `₹${selectedPolicy.premium.tpaPremium.toLocaleString()}` : null} />
                      <DetailItem label="Commitment Amount" value={selectedPolicy.premium?.commitmentAmount ? `₹${selectedPolicy.premium.commitmentAmount.toLocaleString()}` : null} />
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                    <div className="flex items-center gap-2 bg-indigo-50 px-6 py-3 text-indigo-900 border-b border-indigo-100">
                       <Wallet size={16} className="text-indigo-600" />
                       <h4 className="text-[10px] font-bold uppercase tracking-widest">Payment Breakup</h4>
                    </div>
                    <CardContent className="p-6 grid grid-cols-2 gap-6">
                      <DetailItem label="Paid By Client" value={selectedPolicy.payment?.paidByClientName} />
                      <DetailItem label="Client Amount" value={selectedPolicy.payment?.clientAmount ? `₹${selectedPolicy.payment.clientAmount.toLocaleString()}` : null} />
                      <DetailItem label="Paid By Agent" value={selectedPolicy.payment?.paidByAgentName} />
                      <DetailItem label="Agent Amount" value={selectedPolicy.payment?.agentAmount ? `₹${selectedPolicy.payment.agentAmount.toLocaleString()}` : null} />
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

              {/* SYSTEM INFO TAB */}
              <TabsContent value="system" className="space-y-6 mt-0 focus-visible:ring-0">
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="bg-white border-b py-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                       <Clock size={16} className="text-indigo-600" /> System Information (Selected Version)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
                    <DetailItem label="Document No" value={selectedPolicy.documentNumber} icon={FileText} />
                    <DetailItem label="Transaction Date" value={formatDate(selectedPolicy.transactionDate)} icon={Calendar} />
                    <DetailItem label="Created At" value={formatDate(selectedPolicy.createdAt || selectedPolicy.createdat)} icon={Clock} />
                    <DetailItem 
                        label="Updated At" 
                        value={formatDate(selectedPolicy.updatedAt || selectedPolicy.updatedat) || <span className="text-slate-300">-</span>} 
                        icon={Clock} 
                    />
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
