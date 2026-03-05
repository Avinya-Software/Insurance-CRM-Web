import { useEffect, useState } from "react";
import { X, Building2, ChevronDown } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useMake } from "../../hooks/Make/useMake";
import { useModel } from "../../hooks/Model/useModel";

interface Props {
  open: boolean;
  agency?: any;
  type: number; // 0 = General, 1 = Life
  onClose: () => void;
  onSuccess: () => void;
}

export default function MakeModelUpsertSheet({
    open,
    agency,
    type,
    onClose,
    onSuccess
  }: Props) {
  
    const isEdit = !!agency;
  
    const { getList, saveMake } = useMake();
    const { saveModel } = useModel();
  
    const [makeOptions, setMakeOptions] = useState<any[]>([]);
    const [loadingMake, setLoadingMake] = useState(false);
  
    const [form, setForm] = useState<any>({
      id: "",
      makeId: "",
      makeName: "",
      modelName: ""
    });
  
    useEffect(() => {
  
      if (!open) return;
  
      if (isEdit) {
        setForm({
          ...agency
        });
      } else {
        setForm({
          id: "",
          makeId: "",
          makeName: "",
          modelName: ""
        });
      }
  
      loadMakeDropdown();
  
    }, [open, agency]);
  
    const loadMakeDropdown = async () => {
  
      if (type !== 2) return;
  
      setLoadingMake(true);
  
      const res = await getList(1, 100);
  
      setMakeOptions(res?.data || []);
  
      setLoadingMake(false);
    };
  
    const validate = () => {
  
      if (type === 1 && !form.makeName) {
        toast.error("Make name required");
        return false;
      }
  
      if (type === 2) {
  
        if (!form.makeId) {
          toast.error("Make selection required");
          return false;
        }
  
        if (!form.modelName) {
          toast.error("Model name required");
          return false;
        }
      }
  
      return true;
    };
  
    const handleSave = async () => {
  
      if (!validate()) return;
  
      let payload: any = {};
  
      if (type === 1) {
        payload = {
          id: isEdit ? form.id : undefined,
          makeName: form.makeName
        };
  
        await saveMake(payload);
      }
  
      if (type === 2) {
        payload = {
          id: isEdit ? form.id : undefined,
          make: form.makeId,
          modelName: form.modelName
        };
  
        await saveModel(payload);
      }
  
      onSuccess();
      onClose();
    };
  
    if (!open) return null;
  
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex justify-end">
  
        <div className="w-[30vw] bg-white h-full flex flex-col">
  
          <div className="p-6 border-b flex justify-between">
  
            <h2 className="text-xl font-bold">
              {isEdit ? "Edit" : "Add"} {type === 1 ? "Make" : "Model"}
            </h2>
  
            <button onClick={onClose}>
              <X size={20}/>
            </button>
  
          </div>
  
          <div className="p-6 flex flex-col gap-4 flex-1 overflow-auto">
  
            {type === 1 && (
              <Input
                label="Make Name"
                value={form.makeName}
                onChange={(v:any)=>setForm({...form,makeName:v})}
              />
            )}
  
            {type === 2 && (
              <>
                <Select
                  label="Select Make"
                  value={form.makeId}
                  loading={loadingMake}
                  options={makeOptions.map(m=>({
                    id:m.id,
                    name:m.makeName
                  }))}
                  onChange={(v:any)=>setForm({...form,makeId:v})}
                />
  
                <Input
                  label="Model Name"
                  value={form.modelName}
                  onChange={(v:any)=>setForm({...form,modelName:v})}
                />
              </>
            )}
  
          </div>
  
          <div className="p-6 border-t flex gap-3">
  
            <button
              onClick={handleSave}
              className="bg-slate-800 text-white px-6 py-2 rounded"
            >
              Save
            </button>
  
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-6 py-2 rounded"
            >
              Cancel
            </button>
  
          </div>
  
        </div>
  
      </div>
    );
  }
  

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