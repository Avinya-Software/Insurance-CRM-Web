import React, { useEffect, useState } from "react";
import { 
  X, Shield, FileText, User, Calendar, CreditCard, Activity, 
  MapPin, Car, IndianRupee, Wallet, Clipboard, ExternalLink, Download,
  Briefcase, Building2, Info, Clock, Globe, LayoutDashboard,
  Gem,
  Tag,
  ArrowRight,
  Eye,
  TrendingUp,
  ShieldCheck,
  Heart
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { getLifePolicyByIdApi } from "../../api/policy.api";
import { useKycFileActions } from "../../hooks/customer/useKycFileActions";

interface Props {
  open: boolean;
  onClose: () => void;
  policyId: string | null;
}

export const LifePolicyDetailDialog = ({ open, onClose, policyId }: Props) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { preview, download } = useKycFileActions();

  useEffect(() => {
    if (open && policyId) {
      const fetchDetail = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await getLifePolicyByIdApi(policyId);
          if (res.data) {
            setData(res.data);
          } else {
            setError("Policy not found.");
          }
        } catch (err) {
          setError("Failed to fetch policy details.");
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    } else if (!open) {
      setData(null);
    }
  }, [open, policyId]);

  if (!open) return null;

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
           <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-rose-600 animate-pulse" />
           </div>
           <p className="text-slate-600 font-medium">Fetching policy details...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-[100]">
        <div className="bg-white p-6 rounded-2xl shadow-xl w-96 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="text-red-600" />
          </div>
          <p className="text-slate-800 font-semibold">{error || "Policy not found."}</p>
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
    if (value === "" || value === null || value === undefined || value === 0) {
        if (typeof value !== 'number' || value === 0) return null;
    }
    return (
      <div className={`space-y-1.5 ${className}`}>
        <div className="flex items-center gap-2 text-slate-500">
          {Icon && <Icon size={14} className="text-slate-400" />}
          <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
        </div>
        <div className={cn(
          "text-sm font-medium text-slate-900 break-words",
          label.toLowerCase().includes("premium") || label.toLowerCase().includes("amount") || label.toLowerCase().includes("assured") ? "text-rose-700 font-bold" : ""
        )}>
          {value}
        </div>
      </div>
    );
  };

  const riskStart = formatDate(data.policyStartDate);
  const riskEnd = formatDate(data.maturityDate);
  const totalPremium = formatCurrency(data.premiumDetails?.finalInstallmentPremium);

  const hasBenefits = (data.cashflowDetails?.length > 0 || data.fundDetails?.length > 0 || data.riderDetails?.length > 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300" onClick={onClose}>
      <div 
        className="bg-slate-50 w-full max-w-5xl max-h-[95vh] overflow-hidden rounded-[2rem] shadow-2xl flex flex-col relative border border-white"
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
        <div className="bg-white px-8 py-6 border-b flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mr-12">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-700 shadow-rose-200 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                <Heart size={32} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center flex-wrap gap-3">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {data.policyNumber}
                  </h2>
                  <Badge className="rounded-full px-3 py-0.5 font-bold transition-none bg-rose-100 text-rose-700 hover:bg-rose-100">
                    {data.policyStatusName || "Life Policy"}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-slate-500 text-sm font-medium">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                     <User size={14} className="text-rose-500" />
                     <span>{data.customerName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                     <Building2 size={14} className="text-rose-500" />
                     <span>{data.companyName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                     <Gem size={14} className="text-rose-500" />
                     <span>{data.productName}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Stats Highlight */}
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
                   <p className="text-xl font-black text-rose-700">{totalPremium}</p>
                </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50">
          <div className="p-8">
            <Tabs defaultValue="summary" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 h-auto flex flex-wrap justify-center sm:justify-start gap-1">
                  <TabsTrigger value="summary" className="rounded-lg py-2 px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all text-slate-600">
                    <LayoutDashboard size={14} className="mr-2" /> Summary
                  </TabsTrigger>
                  <TabsTrigger value="details" className="rounded-lg py-2 px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all text-slate-600">
                    <Clipboard size={14} className="mr-2" /> Policy Details
                  </TabsTrigger>
                  <TabsTrigger value="nominee" className="rounded-lg py-2 px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all text-slate-600">
                    <ShieldCheck size={14} className="mr-2" /> Nominee
                  </TabsTrigger>
                  <TabsTrigger value="financials" className="rounded-lg py-2 px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all text-slate-600">
                    <IndianRupee size={14} className="mr-2" /> Financials
                  </TabsTrigger>
                  {hasBenefits && (
                    <TabsTrigger value="benefits" className="rounded-lg py-2 px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all text-slate-600">
                      <TrendingUp size={14} className="mr-2" /> Benefits & Assets
                    </TabsTrigger>
                  )}
                  <TabsTrigger value="documents" className="rounded-lg py-2 px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all text-slate-600">
                    <FileText size={14} className="mr-2" /> Documents
                  </TabsTrigger>
                  <TabsTrigger value="extra" className="rounded-lg py-2 px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all text-slate-600">
                    <Clock size={14} className="mr-2" /> Extra Info
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* TABS CONTENT */}
              <TabsContent value="summary" className="space-y-6 mt-0 focus-visible:ring-0">
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                  <div className="flex items-center gap-2 bg-blue-50 px-6 py-3 text-blue-900 border-b border-blue-100">
                    <Info size={16} className="text-blue-600" />
                    <h4 className="text-[10px] font-bold uppercase tracking-widest">Basic Overview</h4>
                  </div>
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6">
                    <DetailItem label="Policy Holder" value={data.customerName} />
                    <DetailItem label="Proposer" value={data.proposerName} />
                    <DetailItem label="Product" value={data.productName} />
                    <DetailItem label="Policy Status" value={data.policyStatusName} />
                    <DetailItem label="Status" value={data.statusName} />
                    <DetailItem label="Start Date" value={riskStart} />
                    <DetailItem label="Maturity Date" value={riskEnd} />
                    <DetailItem label="Sum Assured" value={formatCurrency(data.sumAssured)} />
                    <DetailItem label="Premium Mode" value={data.premiumModeName} />
                    <DetailItem label="Annual Premium" value={formatCurrency(data.premiumDetails?.annualPremium)} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="space-y-6 mt-0">
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                  <div className="flex items-center gap-2 bg-indigo-50 px-6 py-3 text-indigo-900 border-b border-indigo-100">
                    <Clipboard size={16} className="text-indigo-600" />
                    <h4 className="text-[10px] font-bold uppercase tracking-widest">Full Configuration</h4>
                  </div>
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6">
                    <DetailItem label="Policy Term" value={data.policyTerm} />
                    <DetailItem label="PPT" value={data.ppt} />
                    <DetailItem label="Completion Date" value={formatDate(data.completionDate)} />
                    <DetailItem label="Grace Date" value={formatDate(data.graceDate)} />
                    <DetailItem label="Maturity Date" value={formatDate(data.maturityDate)} />
                    <DetailItem label="Objective" value={data.objectiveOfInsurance} className="md:col-span-3 lg:col-span-4" />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="nominee" className="mt-0">
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                  <div className="flex items-center gap-2 bg-purple-50 px-6 py-3 text-purple-900 border-b border-purple-100">
                    <ShieldCheck size={16} className="text-purple-600" />
                    <h4 className="text-[10px] font-bold uppercase tracking-widest">Nominee Information</h4>
                  </div>
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                     <DetailItem label="Nominee Name" value={data.nomineeName} icon={User} />
                     <DetailItem label="Nominee Type" value={data.nomineeType} />
                     <DetailItem label="Relation with LA" value={data.relationWithLA} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="financials" className="space-y-6 mt-0 focus-visible:ring-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Premium Structure */}
                  <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                    <div className="flex items-center gap-2 bg-emerald-50 px-6 py-3 text-emerald-900 border-b border-emerald-100">
                      <IndianRupee size={16} className="text-emerald-600" />
                      <h4 className="text-[10px] font-bold uppercase tracking-widest">Premium Structure</h4>
                    </div>
                    <CardContent className="p-6 grid grid-cols-2 gap-6">
                      <DetailItem label="Installment" value={formatCurrency(data.premiumDetails?.installmentPremium)} />
                      <DetailItem label="Basic" value={formatCurrency(data.premiumDetails?.basicPremium)} />
                      <DetailItem label="GST %" value={data.premiumDetails?.gstPercentage ? `${data.premiumDetails.gstPercentage}%` : null} />
                      <DetailItem label="GST Amount" value={formatCurrency(data.premiumDetails?.gstAmount)} />
                      <DetailItem label="Final Installment" value={formatCurrency(data.premiumDetails?.finalInstallmentPremium)} />
                      <DetailItem label="Annual Premium" value={formatCurrency(data.premiumDetails?.annualPremium)} />
                      <DetailItem label="Includes GST?" value={data.premiumDetails?.premiumIncludingGST ? "Yes" : "No"} />
                    </CardContent>
                  </Card>

                  {/* Transaction Info */}
                  <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                    <div className="flex items-center gap-2 bg-indigo-50 px-6 py-3 text-indigo-900 border-b border-indigo-100">
                      <Wallet size={16} className="text-indigo-600" />
                      <h4 className="text-[10px] font-bold uppercase tracking-widest">Transaction Info</h4>
                    </div>
                    <CardContent className="p-6 grid grid-cols-2 gap-6">
                      <DetailItem label="Method" value={data.paymentDetails?.paymentMethod} icon={CreditCard} />
                      <DetailItem label="Paid By" value={data.paymentDetails?.paymentBy} />
                      <DetailItem label="Ref No" value={data.paymentDetails?.paymentRefNo} />
                      <DetailItem label="Date" value={formatDate(data.paymentDetails?.paymentDate)} />
                      <DetailItem label="Bank" value={data.paymentDetails?.bankName} icon={Building2} className="col-span-2" />
                      <DetailItem label="Account" value={data.paymentDetails?.accountNo} />
                      <DetailItem label="Mandate Exp" value={formatDate(data.paymentDetails?.mandateExpDate)} />
                    </CardContent>
                  </Card>
                </div>

                {data.paymentDetails?.remarks && (
                  <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                    <div className="flex items-center gap-2 bg-slate-50 px-6 py-3 text-slate-900 border-b border-slate-100">
                      <Info size={16} className="text-slate-600" />
                      <h4 className="text-[10px] font-bold uppercase tracking-widest">Payment Remarks</h4>
                    </div>
                    <CardContent className="p-6">
                       <p className="text-sm text-slate-600 italic">"{data.paymentDetails.remarks}"</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {hasBenefits && (
                <TabsContent value="benefits" className="space-y-6 mt-0">
                  {/* Cashflow Section */}
                  {data.cashflowDetails?.length > 0 && (
                    <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                      <div className="bg-amber-50 px-6 py-3 text-amber-900 border-b border-amber-100 flex items-center gap-2">
                         <TrendingUp size={16} className="text-amber-600" />
                         <h4 className="text-[10px] font-bold uppercase tracking-widest">Maturity Cashflow</h4>
                      </div>
                      <CardContent className="p-0">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left font-bold text-slate-700">Maturity Date</th>
                                    <th className="px-6 py-3 text-left font-bold text-slate-700">Years</th>
                                    <th className="px-6 py-3 text-right font-bold text-slate-700">Amount/Year</th>
                                    <th className="px-6 py-3 text-left font-bold text-slate-700">Description</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 italic font-medium">
                                {data.cashflowDetails.map((cf: any) => (
                                    <tr key={cf.id}>
                                        <td className="px-6 py-4">{formatDate(cf.maturityDate)}</td>
                                        <td className="px-6 py-4">{cf.noOfYears}</td>
                                        <td className="px-6 py-4 text-right font-bold text-emerald-600">{formatCurrency(cf.amountPerYear)}</td>
                                        <td className="px-6 py-4 text-slate-500">{cf.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                      </CardContent>
                    </Card>
                  )}

                  {/* Fund Details */}
                  {data.fundDetails?.length > 0 && (
                    <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                      <div className="bg-blue-50 px-6 py-3 text-blue-900 border-b border-blue-100 flex items-center gap-2">
                         <Activity size={16} className="text-blue-600" />
                         <h4 className="text-[10px] font-bold uppercase tracking-widest">Investment Funds</h4>
                      </div>
                      <CardContent className="p-0">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left font-bold text-slate-700">FMC Name</th>
                                    <th className="px-6 py-3 text-center font-bold text-slate-700">Percentage</th>
                                    <th className="px-6 py-3 text-center font-bold text-slate-700">Unit Balance</th>
                                    <th className="px-6 py-3 text-right font-bold text-slate-700">As of Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                {data.fundDetails.map((fund: any) => (
                                    <tr key={fund.id}>
                                        <td className="px-6 py-4 font-bold text-slate-900">{fund.fmcName}</td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge className="bg-blue-100 text-blue-700 border-none hover:bg-blue-100 shadow-none selection:bg-transparent cursor-default transition-none">
                                              {fund.fmcPercentage}%
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-center">{fund.unitBalance}</td>
                                        <td className="px-6 py-4 text-right text-slate-500">{formatDate(fund.fundDate)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                      </CardContent>
                    </Card>
                  )}

                  {/* Riders */}
                  {data.riderDetails?.length > 0 && (
                    <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                      <div className="bg-rose-50 px-6 py-3 text-rose-900 border-b border-rose-100 flex items-center gap-2">
                         <ShieldCheck size={16} className="text-rose-600" />
                         <h4 className="text-[10px] font-bold uppercase tracking-widest">Plan Riders</h4>
                      </div>
                      <CardContent className="p-0">
                         <div className="divide-y divide-slate-100">
                            {data.riderDetails.map((rider: any) => (
                                <div key={rider.id} className="p-6 grid grid-cols-2 md:grid-cols-6 gap-6 transition-none">
                                    <DetailItem label="Rider Name" value={rider.riderName} className="md:col-span-2" />
                                    <DetailItem label="Sum Assured" value={formatCurrency(rider.sumAssured)} />
                                    <DetailItem label="Term/PPT" value={`${rider.term} / ${rider.ppt}`} />
                                    <DetailItem label="Yearly Premium" value={formatCurrency(rider.yearlyPremium)} />
                                    <DetailItem label="Comm Date" value={formatDate(rider.commDate)} />
                                </div>
                            ))}
                         </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              )}

              <TabsContent value="documents" className="space-y-6 mt-0 focus-visible:ring-0">
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="bg-white border-b py-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                       <FileText size={16} className="text-indigo-600" /> Documents
                    </CardTitle>
                    <p className="text-xs text-slate-500 mt-1">Verified documents attached to this life policy</p>
                  </CardHeader>
                  <CardContent className="p-6">
                    {data.documents?.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.documents.map((doc: any) => (
                           <div
                            key={doc.id}
                            className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl group transition-all duration-200 hover:border-indigo-300 shadow-sm"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                <FileText size={20} />
                              </div>
                              <div className="max-w-[200px]">
                                <p className="text-sm font-bold text-slate-900 truncate">
                                  {doc.documentName || doc.fileName}
                                </p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                                  Uploaded: {formatDate(doc.uploadedAt)}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => preview(doc.url)}
                                className="p-2.5 bg-slate-50 text-slate-600 hover:bg-indigo-100 hover:text-indigo-700 rounded-xl transition-all"
                                title="Preview"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                onClick={() => download(doc.url, doc.fileName)}
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
                        <p className="text-sm font-medium">No documents uploaded for this policy</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="extra" className="space-y-6 mt-0 focus-visible:ring-0">
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                  <CardHeader className="bg-white border-b py-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                       <Clock size={16} className="text-indigo-600" /> Technical & Business Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
                    <DetailItem label="Created At" value={formatDate(data.createdAt)} icon={Clock} />
                    <DetailItem label="Updated At" value={formatDate(data.updatedAt) || <span className="text-slate-300">-</span>} icon={Clock} />
                    <DetailItem label="Broker" value={data.brokerName} icon={Briefcase} />
                    <DetailItem label="BA Name" value={data.baName} />
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
             className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-none border border-slate-200 shadow-sm"
           >
             Close Detail View
           </button>
        </div>
      </div>
    </div>
  );
};
