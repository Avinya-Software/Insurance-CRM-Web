import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import Spinner from "../common/Spinner";
import { Product } from "../../interfaces/product.interface";
import { useAddGeneralProduct } from "../../hooks/product/useAddGeneralProduct";
import { useAddLifeProduct } from "../../hooks/product/useAddLifeProduct";
import { useDivisionDropdown } from "../../hooks/division/useDivisionDropdown";
import { useSegmentDropdown } from "../../hooks/segment/useSegmentDropdown";
import { useCompanyDropdown } from "../../hooks/product/useCompanyDropdown";
import SearchableComboBox from "../common/SearchableComboBox";
import { useInsuranceTypes } from "../../hooks/policy/useInsuranceTypes";

interface Props {
  open: boolean;
  onClose: () => void;
  item?: Product | null;
  onSuccess: () => void;
}

const ProductUpsertSheet = ({ open, onClose, item, onSuccess }: Props) => {

  const isEdit = !!item;

  const initialForm: any = {
    productName: "",
    companyId: "",
    policyType: false,
    insurance: 0,
    divisionId: "",
    segmentId: "",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<any>({});

  const { mutate: addGeneral, isPending: addingGeneral } = useAddGeneralProduct();
  const { mutate: addLife, isPending: addingLife } = useAddLifeProduct();

  const { data: companies = [] } = useCompanyDropdown();
  const { data: insuranceTypes = [] } = useInsuranceTypes();
  const { data: divisions = [] } = useDivisionDropdown();
  const { data: segments = [] } = useSegmentDropdown(form.divisionId);

  const saving = addingGeneral || addingLife;

  const insuranceOptions = insuranceTypes.map((item: any) => ({
    value: item.id,
    label: item.type,
  }));

  /* PREFILL */

  useEffect(() => {
    if (!open) return;

    if (isEdit && item) {
      setForm({
        id: item.id,
        productId: item.productId || item.id,
        productName: item.productName,
        companyId: item.companyId,
        companyName: item.companyName,
        policyType: item.policyType,
        insurance: item.insuranceTypeId || item.insurance,
        divisionId: item.divisionId || "",
        segmentId: item.segmentId || "",
      });
    } else {
      setForm(initialForm);
    }

    setErrors({});
  }, [open, item]);

  /* VALIDATION */

  const validate = () => {
    const e: any = {};

    if (!form.productName)
      e.productName = "Product name required";

    if (!form.companyId)
      e.companyId = "Company is required";

    setErrors(e);

    if (Object.keys(e).length) {
      toast.error("Please fill all required fields");
      return false;
    }

    return true;
  };

  /* SAVE */

  const handleSave = () => {
    if (!validate()) return;

    if (form.policyType) {
      // LIFE PRODUCT
      const payload: any = {
        companyId: form.companyId,
        policyType: true,
        insurance: Number(form.insurance),
        productName: form.productName,
      };

      if (isEdit && form.productId) {
        payload.productId = form.productId;
      }

      addLife(payload, {
        onSuccess: () => {
          onSuccess();
          onClose();
        },
      });
    } else {
      // GENERAL PRODUCT
      const payload: any = {
        companyId: form.companyId,
        productName: form.productName,
        divisionId: Number(form.divisionId),
        segmentId: Number(form.segmentId),
      };

      if (isEdit && form.id) {
        payload.id = form.id;
      }

      addGeneral(payload, {
        onSuccess: () => {
          onSuccess();
          onClose();
        },
      });
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay */}

      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />

      {/* Sheet */}

      <div className="fixed top-0 right-0 w-full max-w-[20vw] h-screen bg-slate-50 z-[70] shadow-2xl flex flex-col animate-slide-in-right">

        {/* Header */}

        <div className="px-8 py-6 bg-white border-b flex justify-between items-center">

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {isEdit ? "Edit Product" : "Add Product"}
            </h2>

            <p className="text-slate-500 text-sm mt-1">
              Manage product information
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full"
          >
            <X size={22} />
          </button>

        </div>

        {/* Body */}

        <div className="flex-1 overflow-y-auto p-4">

          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">

            <div className="grid grid-cols-1 gap-x-6 gap-y-5">

                {/* Policy Type */}

                <div className="space-y-1.5">

                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Policy Type
                </label>

                <div className="flex gap-3">

                  <button
                    type="button"
                    onClick={() => setForm({ ...form, policyType: false })}
                    className={`px-4 py-2.5 text-sm font-medium border rounded transition-all
                    ${!form.policyType
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : "bg-white border-slate-200"
                      }`}
                  >
                    General
                  </button>

                  <button
                    type="button"
                    onClick={() => setForm({ ...form, policyType: true })}
                    className={`px-4 py-2.5 text-sm font-medium border rounded transition-all
                    ${form.policyType
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-white border-slate-200"
                      }`}
                  >
                    Life
                  </button>

                </div>

                </div>

              {/* LIFE POLICY */}
              {form.policyType && (
                <>
                  <Input
                    label="Product Name"
                    required
                    value={form.productName}
                    error={errors.productName}
                    onChange={(v: any) => setForm({ ...form, productName: v })}
                  />

                  <SearchableComboBox
                    label="Company"
                    required
                    error={errors.companyId}
                    items={companies.map((c: any) => ({
                      value: c.companyId,
                      label: c.companyName,
                    }))}
                    value={form.companyId}
                    onSelect={(item: any) =>
                      setForm((p: any) => ({
                        ...p,
                        companyId: item?.value || "",
                        companyName: item?.label || "",
                      }))
                    }
                  />

                  <SearchableComboBox
                    label="Insurance Type"
                    required
                    items={insuranceOptions}
                    value={form.insurance}
                    onSelect={(item: any) =>
                      setForm((p: any) => ({
                        ...p,
                        insurance: item?.value || null,
                        insuranceName: item?.label || "",
                      }))
                    }
                  />
                </>
              )}

              {/* GENERAL POLICY */}
              {!form.policyType && (
                <>
                  <Input
                    label="Product Name"
                    required
                    value={form.productName}
                    error={errors.productName}
                    onChange={(v: any) => setForm({ ...form, productName: v })}
                  />

                  <SearchableComboBox
                    label="Company"
                    required
                    error={errors.companyId}
                    items={companies.map((c: any) => ({
                      value: c.companyId,
                      label: c.companyName,
                    }))}
                    value={form.companyId}
                    onSelect={(item: any) =>
                      setForm((p: any) => ({
                        ...p,
                        companyId: item?.value || "",
                        companyName: item?.label || "",
                      }))
                    }
                  />

                  <SearchableComboBox
                    label="Division"
                    required
                    items={divisions.map((d: any) => ({
                      value: d.divisionId,
                      label: d.divisionName,
                    }))}
                    value={form.divisionId}
                    onSelect={(item: any) =>
                      setForm((p: any) => ({
                        ...p,
                        divisionId: item?.value || "",
                        segmentId: "", // reset segment
                      }))
                    }
                  />

                  <SearchableComboBox
                    label="Segment"
                    required
                    items={segments.map((s: any) => ({
                      value: s.segmentId,
                      label: s.segmentName,
                    }))}
                    value={form.segmentId}
                    onSelect={(item: any) =>
                      setForm((p: any) => ({
                        ...p,
                        segmentId: item?.value || "",
                      }))
                    }
                  />
                </>
              )}

              

            </div>

          </section>

        </div>

        {/* Footer */}

        <div className="px-8 py-6 bg-white border-t flex gap-4">

          <button
            disabled={saving}
            onClick={handleSave}
            className="px-8 py-2.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded flex items-center gap-2"
          >
            {saving ? <Spinner className="text-white" /> : "SAVE"}
          </button>

          <button
            onClick={onClose}
            className="px-8 py-2.5 text-sm font-bold text-white bg-red-500 rounded"
          >
            CANCEL
          </button>

        </div>

      </div>
    </>
  );
};

export default ProductUpsertSheet;

/* INPUT HELPER */

const Input = ({
  label,
  required,
  value,
  error,
  type = "text",
  onChange,
  placeholder,
  disabled,
  className = "",
}: any) => (
  <div className="space-y-1.5">
    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
      {label} {required && <span className="text-red-500">*</span>}
    </label>

    <input
      type={type}
      disabled={disabled}
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

    {error && (
      <p className="text-[10px] font-medium text-red-500 mt-1">
        {error}
      </p>
    )}
  </div>
);