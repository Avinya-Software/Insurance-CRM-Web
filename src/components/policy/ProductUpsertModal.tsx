import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAddGeneralProduct } from "../../hooks/product/useAddGeneralProduct";
import { useDivisionDropdown } from "../../hooks/division/useDivisionDropdown";
import { useCompanyList } from "../../hooks/policy/useCompany";
import { useSegmentDropdown } from "../../hooks/segment/useSegmentDropdown";
import SearchableComboBox from "../common/SearchableComboBox";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: (newProduct: any) => void;
  initialDivisionId?: string;
  initialCompanyId?: string;
  initialSegmentId?: string;
}

const ProductUpsertModal = ({ 
  open, 
  onClose, 
  onSuccess,
  initialDivisionId,
  initialCompanyId,
  initialSegmentId
}: Props) => {
  const [formData, setFormData] = useState({
    divisionId: "",
    insuranceCompanyId: "",
    segmentId: "",
    productName: ""
  });

  const { data: divisions } = useDivisionDropdown(0);
  const { data: companies } = useCompanyList(false);
  const { data: segments } = useSegmentDropdown(Number(formData.divisionId) || 0);
  
  const { mutate: addProduct, isPending } = useAddGeneralProduct();

  useEffect(() => {
    if (open) {
      setFormData({
        divisionId: initialDivisionId || "",
        insuranceCompanyId: initialCompanyId || "",
        segmentId: initialSegmentId || "",
        productName: ""
      });
    }
  }, [open, initialDivisionId, initialCompanyId, initialSegmentId]);

  const handleSubmit = () => {
    if (!formData.divisionId || !formData.insuranceCompanyId || !formData.segmentId || !formData.productName.trim()) return;

    addProduct({
      divisionId: Number(formData.divisionId),
      companyId: formData.insuranceCompanyId,
      segmentId: formData.segmentId, // API might expect GUID string
      productName: formData.productName
    }, {
      onSuccess: (res: any) => {
        const result = res.data || res;
        const productData = typeof result === 'object' ? result : { id: result };
        onSuccess({ 
          ...productData, 
          name: productData.productName || productData.name || formData.productName 
        });
        onClose();
      },
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-hidden">
      <div className="bg-white rounded-xl shadow-2xl w-[600px] animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-800 px-6 py-4 flex items-center justify-between text-white rounded-t-xl">
          <h3 className="font-bold uppercase tracking-wider text-xs">Add New Product</h3>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <SearchableComboBox
              label="Select Division"
              required
              items={divisions?.map(d => ({ label: d.divisionName, value: d.divisionId.toString() })) || []}
              value={formData.divisionId}
              onSelect={(item) => setFormData(prev => ({ ...prev, divisionId: item?.value || "", segmentId: "" }))}
              placeholder="Select Division"
            />
            <SearchableComboBox
              label="Select Insurance Company"
              required
              items={companies?.map((c: any) => ({ label: c.companyName, value: c.companyId })) || []}
              value={formData.insuranceCompanyId}
              onSelect={(item) => setFormData(prev => ({ ...prev, insuranceCompanyId: item?.value || "" }))}
              placeholder="Select Company"
            />
          </div>

          <SearchableComboBox
            label="Select Segment"
            required
            items={segments?.map(s => ({ label: s.segmentName, value: s.segmentId.toString() })) || []}
            value={formData.segmentId}
            onSelect={(item) => setFormData(prev => ({ ...prev, segmentId: item?.value || "" }))}
            placeholder={formData.divisionId ? "Select Segment" : "Select Division first"}
            disabled={!formData.divisionId}
          />

          <div className="space-y-1.5 transition-all">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded text-sm transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none"
              placeholder="Enter product name"
              value={formData.productName}
              onChange={(e) => setFormData(prev => ({ ...prev, productName: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-3 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending || !formData.divisionId || !formData.insuranceCompanyId || !formData.segmentId || !formData.productName.trim()}
            className="px-8 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold rounded shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isPending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductUpsertModal;
