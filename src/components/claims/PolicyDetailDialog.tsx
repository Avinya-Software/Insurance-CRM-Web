import { X, Shield, FileText, User, Calendar, CreditCard, Activity } from "lucide-react";
import { useGeneralPolicyById, useLifePolicyById } from "../../hooks/policy/usePolicies";

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

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${policyType === 1 ? "bg-rose-100 text-rose-600" : "bg-teal-100 text-teal-600"}`}>
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {policyType === 1 ? "Life Policy Details" : "General Policy Details"}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {data?.policyNumber || "Fetching details..."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-sm font-medium text-slate-500">Loading policy information...</p>
            </div>
          ) : !data ? (
            <div className="text-center py-20 text-slate-500">
              No policy data found.
            </div>
          ) : (
            <div className="space-y-8">
              {/* Basic Info Section */}
              <Section title="Basic Information" icon={<User size={16} />}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InfoBlock 
                    label="Customer Name" 
                    value={policyType === 1 ? data.customerName : data.policyHolderName} 
                  />
                  <InfoBlock 
                    label="Policy Number" 
                    value={data.policyNumber || data.documentNumber} 
                  />
                  {policyType === 1 ? (
                    <>
                      <InfoBlock label="Product Name" value={data.productName} />
                      <InfoBlock label="Company" value={data.companyName} />
                      <InfoBlock label="Premium Mode" value={data.premiumModeName} />
                    </>
                  ) : (
                    <>
                      <InfoBlock label="Division" value={data.detail?.divisionTypeName} />
                      <InfoBlock label="Company" value={data.detail?.insuranceCompanyName} />
                      <InfoBlock label="Product" value={data.detail?.productName} />
                    </>
                  )}
                </div>
              </Section>

              {/* Dates Section */}
              <Section title="Policy Tenure" icon={<Calendar size={16} />}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {policyType === 1 ? (
                    <>
                      <InfoBlock label="Start Date" value={formatDate(data.policyStartDate)} />
                      <InfoBlock label="Maturity Date" value={formatDate(data.maturityDate)} />
                      <InfoBlock label="Next Premium" value={formatDate(data.nextPremiumDueDate)} />
                    </>
                  ) : (
                    <>
                      <InfoBlock label="Risk Start" value={formatDate(data.detail?.riskStartDate)} />
                      <InfoBlock label="Risk End" value={formatDate(data.detail?.riskEndDate)} />
                      <InfoBlock label="Transaction Date" value={formatDate(data.transactionDate)} />
                    </>
                  )}
                </div>
              </Section>

              {/* Financials Section */}
              <Section title="Financial Details" icon={<CreditCard size={16} />}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {policyType === 1 ? (
                    <>
                      <InfoBlock label="Sum Assured" value={formatCurrency(data.sumAssured)} highlight />
                      <InfoBlock 
                        label="Basic Premium" 
                        value={formatCurrency(data.premiumDetails?.basicPremium)} 
                      />
                      <InfoBlock 
                        label="Final Premium" 
                        value={formatCurrency(data.premiumDetails?.finalInstallmentPremium)} 
                      />
                    </>
                  ) : (
                    <>
                      <InfoBlock label="Sum Assured" value={formatCurrency(data.premium?.sumAssured)} highlight />
                      <InfoBlock 
                        label="Basic Premium" 
                        value={formatCurrency(data.premium?.basicPremium)} 
                      />
                      <InfoBlock 
                        label="Total Premium" 
                        value={formatCurrency(data.premium?.totalPremium)} 
                      />
                    </>
                  )}
                </div>
              </Section>

              {/* Additional Sections for Life Policy */}
              {policyType === 1 && (
                <>
                  <Section title="Nominee Details" icon={<Activity size={16} />}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <InfoBlock label="Nominee Name" value={data.nomineeName} />
                      <InfoBlock label="Relation" value={data.relationWithLA} />
                      <InfoBlock label="Nominee Type" value={data.nomineeType} />
                    </div>
                  </Section>

                  <Section title="Payment Details" icon={<CreditCard size={16} />}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <InfoBlock label="Bank Name" value={data.paymentDetails?.bankName} />
                      <InfoBlock label="Account No" value={data.paymentDetails?.accountNo} />
                      <InfoBlock label="Payment Method" value={data.paymentDetails?.paymentMethod} />
                    </div>
                  </Section>
                </>
              )}

              {/* Additional Sections for General Policy */}
              {policyType === 2 && data.vehicle && data.vehicle.vehicleNumber && (
                <Section title="Vehicle Details" icon={<Activity size={16} />}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InfoBlock label="Vehicle Number" value={data.vehicle.vehicleNumber} />
                    <InfoBlock label="Brand" value={data.vehicle.brand} />
                    <InfoBlock label="Engine No" value={data.vehicle.engineNo} />
                  </div>
                </Section>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-all shadow-md active:scale-95"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
      <span className="text-slate-400">{icon}</span>
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{title}</h3>
    </div>
    {children}
  </div>
);

const InfoBlock = ({ label, value, highlight = false }: { label: string; value: any; highlight?: boolean }) => (
  <div className="space-y-1">
    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{label}</p>
    <p className={`text-sm font-medium ${highlight ? "text-blue-600 font-bold" : "text-slate-700"}`}>
      {value || "-"}
    </p>
  </div>
);
