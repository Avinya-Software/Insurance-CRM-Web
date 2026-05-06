import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  KycFile,
  CustomerDetails as CustomerDetailsType,
  CustomerDetailsResponse,
  Address,
} from "../../interfaces/customer.interface";
import { 
  Download, 
  Eye, 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  Calendar, 
  Info, 
  FileText,
  Clock,
  ExternalLink,
  Map,
  Globe,
  Building2,
  Trash2
} from "lucide-react";
import { useKycFileActions } from "../../hooks/customer/useKycFileActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { format } from "date-fns";

interface CustomerDetailsProps {
  customerId: string;
  onClose: () => void;
}



export const CustomerDetails: React.FC<CustomerDetailsProps> = ({
  customerId,
  onClose,
}) => {
  const [customer, setCustomer] = useState<CustomerDetailsType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { preview, download } = useKycFileActions();

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<CustomerDetailsResponse>(
          `/Customer/${customerId}`
        );
        setCustomer(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch customer details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomerDetails();
  }, [customerId]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-[100]">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-96 text-center animate-pulse">
           <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="text-blue-600 animate-bounce" />
           </div>
           <p className="text-slate-600 font-medium">Fetching details...</p>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-[100]">
        <div className="bg-white p-6 rounded-2xl shadow-xl w-96 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="text-red-600" />
          </div>
          <p className="text-slate-800 font-semibold">{error || "Customer not found."}</p>
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

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return null;
    try {
      return format(new Date(dateStr), "dd MMM yyyy");
    } catch {
      return dateStr;
    }
  };

  const formatAddress = (addr: Address) => {
    const parts = [
      addr.houseFlatNumber,
      addr.buildingName,
      addr.street,
      addr.area,
      addr.landmark,
      addr.cityName,
      addr.stateName,
      addr.pincode,
      addr.country
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Address not provided";
  };

  const getAddressByType = (type: string) => {
    return customer.addresses?.find(a => a.addressType === type);
  }

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
        <div className="bg-white px-8 py-6 pr-20 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <User size={32} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-900">
                  {customer.title} {customer.clientName}
                </h2>
                {customer.isPassedAway && (
                  <Badge variant="destructive" className="rounded-full">Passed Away</Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mt-1 text-slate-500 text-sm">
                <div className="flex items-center gap-1.5">
                   <Phone size={14} className="text-blue-500" />
                   <span>{customer.primaryMobile}</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                   <Mail size={14} className="text-blue-500" />
                   <span>{customer.email || "No email"}</span>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50">
          <div className="p-8">
            <Tabs defaultValue="basic" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 h-auto flex flex-wrap justify-center sm:justify-start">
                  <TabsTrigger value="basic" className="rounded-lg py-2.5 px-5 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all text-slate-600">
                    <User size={16} className="mr-2" /> Basic Info
                  </TabsTrigger>
                  <TabsTrigger value="kyc" className="rounded-lg py-2.5 px-5 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all text-slate-600">
                    <ShieldCheck size={16} className="mr-2" /> Identity
                  </TabsTrigger>
                  <TabsTrigger value="occupation" className="rounded-lg py-2.5 px-5 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all text-slate-600">
                    <Briefcase size={16} className="mr-2" /> Occupation
                  </TabsTrigger>
                  <TabsTrigger value="addresses" className="rounded-lg py-2.5 px-5 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all text-slate-600">
                    <MapPin size={16} className="mr-2" /> Addresses
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="rounded-lg py-2.5 px-5 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all text-slate-600">
                    <FileText size={16} className="mr-2" /> Documents
                  </TabsTrigger>
                   <TabsTrigger value="system" className="rounded-lg py-2.5 px-5 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all text-slate-600">
                    <Clock size={16} className="mr-2" /> System Info
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* TABS CONTENT */}
              <TabsContent value="basic" className="space-y-6 mt-0 focus-visible:ring-0">
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="bg-white border-b py-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                       <User size={16} className="text-blue-600" /> Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6">
                    <DetailItem label="Full Name" value={`${customer.title} ${customer.clientName}`} />
                    <DetailItem label="Gender" value={customer.gender} />
                    <DetailItem label="Date of Birth" value={formatDate(customer.dob)} />
                    <DetailItem label="Age" value={customer.age ? `${customer.age} Years` : null} />
                    <DetailItem label="Marital Status" value={customer.maritalStatus} />
                    <DetailItem label="Nationality" value={customer.nationality} />
                    <DetailItem label="Birth Place" value={customer.birthPlace} />
                    <DetailItem label="Anniversary Date" value={formatDate(customer.anniversaryDate)} />
                    <DetailItem label="Education" value={customer.education} />
                    <DetailItem label="Reference Name" value={customer.referenceName} />
                    <DetailItem label="Client Category" value={customer.clientCategory} />
                    <DetailItem label="Father/Spouse/Co. Name" value={customer.fatherSpouseCompanyName} />
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-6">
                   <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-white border-b py-4">
                      <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                         <Phone size={16} className="text-blue-600" /> Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <DetailItem label="Primary Mobile" value={customer.primaryMobile} icon={Phone} />
                      <DetailItem label="Email" value={customer.email} icon={Mail} />
                       {/* Checking if we have extra contact info in addresses */}
                      {customer.addresses?.map((addr, idx) => (
                        <React.Fragment key={idx}>
                          {addr.email2 && <DetailItem label={`Alternate Email (${addr.addressType.toLowerCase()})`} value={addr.email2} icon={Mail} />}
                          {addr.telephoneResidence && <DetailItem label="Telephone (Res)" value={addr.telephoneResidence} icon={Phone} />}
                          {addr.telephoneOffice && <DetailItem label="Telephone (Off)" value={addr.telephoneOffice} icon={Phone} />}
                          {addr.otherNumber && <DetailItem label="Other Number" value={addr.otherNumber} icon={Phone} />}
                          {addr.mobileNumber && <DetailItem label="Mobile Number" value={addr.mobileNumber} icon={Phone} />}
                        </React.Fragment>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-white border-b py-4">
                      <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                         <Info size={16} className="text-blue-600" /> Remarks
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <DetailItem label="Client Remarks" value={customer.remarks} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="kyc" className="space-y-6 mt-0 focus-visible:ring-0">
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="bg-white border-b py-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                       <ShieldCheck size={16} className="text-blue-600" /> Identity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
                    <DetailItem label="Aadhar Number" value={customer.identityDetails?.aadharNumber} />
                    <DetailItem label="PAN Number" value={customer.identityDetails?.panNumber} />
                    <DetailItem label="GST Number" value={customer.identityDetails?.gstNumber} />
                    <DetailItem label="Passport Number" value={customer.identityDetails?.passportNumber} />
                    <DetailItem label="Passport Expiry" value={formatDate(customer.identityDetails?.passportExpDate)} />
                    <DetailItem label="Driving License" value={customer.identityDetails?.drivingLicenceNumber} />
                    <DetailItem label="License Expiry" value={formatDate(customer.identityDetails?.drivingLicenceExpDate)} />
                    <DetailItem label="CKYC Number" value={customer.identityDetails?.ckycNumber} />
                    <DetailItem label="eInsurance Number" value={customer.identityDetails?.eInsuranceNumber} />

                  </CardContent>
                </Card>
                

              </TabsContent>

              <TabsContent value="occupation" className="space-y-6 mt-0 focus-visible:ring-0">
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="bg-white border-b py-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                       <Briefcase size={16} className="text-blue-600" /> Occupation Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                    <DetailItem label="Occupation Type" value={customer.occupation?.occupationType} icon={Briefcase} />
                    <DetailItem label="Designation" value={customer.occupation?.designation} />
                    <DetailItem label="Employer Name" value={customer.occupation?.employerName} icon={Building2} />
                    <DetailItem label="Gross Income" value={customer.occupation?.grossIncome ? `₹ ${customer.occupation.grossIncome.toLocaleString()}` : null} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="addresses" className="space-y-6 mt-0 focus-visible:ring-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* RESIDENCE */}
                  <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                     <div className="flex items-center gap-2 bg-slate-800 px-6 py-3 text-white">
                        <MapPin size={16} />
                        <h4 className="text-[10px] font-bold uppercase tracking-widest">Residence Address</h4>
                     </div>
                     <CardContent className="p-6 space-y-4">
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                          {getAddressByType("RESIDENCE") ? formatAddress(getAddressByType("RESIDENCE")!) : "No residence address provided"}
                        </p>
                        {getAddressByType("RESIDENCE")?.pincode && (
                          <div className="flex gap-4">
                            <DetailItem label="Pincode" value={getAddressByType("RESIDENCE")?.pincode} />
                            <DetailItem label="City" value={getAddressByType("RESIDENCE")?.cityName} />
                          </div>
                        )}
                        {getAddressByType("RESIDENCE")?.website && (
                           <DetailItem label="Website" value={getAddressByType("RESIDENCE")?.website} icon={Globe} />
                        )}
                     </CardContent>
                  </Card>

                   {/* OFFICE */}
                   <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                     <div className="flex items-center gap-2 bg-slate-100 px-6 py-3 text-slate-800">
                        <Building2 size={16} className="text-blue-600" />
                        <h4 className="text-[10px] font-bold uppercase tracking-widest">Office Address</h4>
                     </div>
                     <CardContent className="p-6 space-y-4">
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                          {getAddressByType("OFFICE") ? formatAddress(getAddressByType("OFFICE")!) : "No office address provided"}
                        </p>
                         {getAddressByType("OFFICE")?.pincode && (
                          <div className="flex gap-4">
                            <DetailItem label="Pincode" value={getAddressByType("OFFICE")?.pincode} />
                            <DetailItem label="City" value={getAddressByType("OFFICE")?.cityName} />
                          </div>
                        )}
                     </CardContent>
                  </Card>

                  {/* OVERSEAS */}
                  <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                     <div className="flex items-center gap-2 bg-blue-50 px-6 py-3 text-blue-900 border-b border-blue-100">
                        <Globe size={16} />
                        <h4 className="text-[10px] font-bold uppercase tracking-widest">Overseas Address</h4>
                     </div>
                     <CardContent className="p-6 space-y-4">
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                          {getAddressByType("OVERSEAS") ? formatAddress(getAddressByType("OVERSEAS")!) : "No overseas address provided"}
                        </p>
                         {getAddressByType("OVERSEAS")?.pincode && (
                          <div className="flex gap-4">
                            <DetailItem label="Pincode" value={getAddressByType("OVERSEAS")?.pincode} />
                            <DetailItem label="City" value={getAddressByType("OVERSEAS")?.cityName} />
                          </div>
                        )}
                     </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-6 mt-0 focus-visible:ring-0">
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="bg-white border-b py-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                       <FileText size={16} className="text-blue-600" /> KYC Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {customer.kycFiles && customer.kycFiles.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {customer.kycFiles.map((file: KycFile) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
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
                                className="p-2.5 bg-slate-50 text-slate-600 hover:bg-blue-100 hover:text-blue-700 rounded-xl transition-all"
                                title="Preview"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                onClick={() => download(file.url, file.fileName)}
                                className="p-2.5 bg-slate-50 text-slate-600 hover:bg-blue-100 hover:text-blue-700 rounded-xl transition-all"
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
                        <p className="text-sm font-medium">No documents uploaded</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="system" className="space-y-6 mt-0 focus-visible:ring-0">
                 <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="bg-white border-b py-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                       <Clock size={16} className="text-blue-600" /> System Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
                    <DetailItem label="Customer Name" value={customer.clientName} icon={User} />
                    <DetailItem label="Group Head" value={customer.groupHeadName} />
                    <DetailItem label="Group Code" value={customer.groupCode} />
                    <DetailItem label="Created At" value={formatDate(customer.createdAt)} icon={Clock} />
                    <DetailItem label="Updated At" value={formatDate(customer.updatedAt)} icon={Clock} />
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
