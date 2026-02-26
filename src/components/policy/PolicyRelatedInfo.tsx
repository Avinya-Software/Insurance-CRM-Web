import React, { useState } from "react";
import { Plus, Edit2, Trash2, X, Check, AlertCircle } from "lucide-react";

interface Props {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  insuranceTypeId: number;
}

const allowedMotorTypes = [12, 13, 14, 15, 16, 17, 18];

const PolicyRelatedInfo = ({ form, setForm, insuranceTypeId }: Props) => {
  const [newItem, setNewItem] = useState({
    details: "",
    description: "",
    sa: 0,
    rate: 0,
    riskType: "",
    occupancy: "",
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddItem = () => {
    if (editingIndex !== null) {
      const updatedItems = [...(form.itemDetails || [])];
      updatedItems[editingIndex] = newItem;
      setForm((p: any) => ({ ...p, itemDetails: updatedItems }));
      setEditingIndex(null);
    } else {
      setForm((p: any) => ({
        ...p,
        itemDetails: [...(p.itemDetails || []), newItem],
      }));
    }
    resetForm();
  };

  const resetForm = () => {
    setNewItem({
      details: "",
      description: "",
      sa: 0,
      rate: 0,
      riskType: "",
      occupancy: "",
    });
    setEditingIndex(null);
    setIsAdding(false);
  };

  const handleEditItem = (index: number) => {
    setNewItem(form.itemDetails[index]);
    setEditingIndex(index);
    setIsAdding(true);
  };

  const handleDeleteItem = (index: number) => {
    const updatedItems = form.itemDetails.filter((_: any, i: number) => i !== index);
    setForm((p: any) => ({ ...p, itemDetails: updatedItems }));
  };

  const renderInput = (label: string, value: any, field: string, type = "text") => (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={value ?? ""}
        className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
        onChange={(e) =>
          setForm((p: any) => ({
            ...p,
            [field]: type === "number" ? Number(e.target.value) : e.target.value,
          }))
        }
      />
    </div>
  );

  const renderItemInput = (label: string, value: any, field: string, type = "text") => (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={value ?? ""}
        className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all bg-white"
        onChange={(e) =>
          setNewItem((p: any) => ({
            ...p,
            [field]: type === "number" ? Number(e.target.value) : e.target.value,
          }))
        }
      />
    </div>
  );

  // MOTOR / VEHICLE UI
  if (allowedMotorTypes.includes(insuranceTypeId)) {
    return (
      <div className="space-y-8">
        {/* IDV DETAILS */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-3 bg-slate-800 text-white">
            <h3 className="font-bold text-xs uppercase tracking-widest">IDV DETAILS</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {renderInput("Vehicle Value", form.vehicleValue, "vehicleValue", "number")}
            {renderInput("Non Elec. Accessories", form.nonElecAccessories, "nonElecAccessories", "number")}
            {renderInput("Electrical Accessories", form.elecAccessories, "elecAccessories", "number")}
            {renderInput("CNG/LPG Kit", form.cngLpgKit, "cngLpgKit", "number")}
            {renderInput("Trailer Total Value", form.trailerTotalValue, "trailerTotalValue", "number")}
          </div>
        </div>

        {/* TOTAL IDV / SA */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-3 bg-slate-800 text-white">
            <h3 className="font-bold text-xs uppercase tracking-widest">TOTAL IDV / SA</h3>
          </div>
          <div className="p-6 flex justify-end">
            <div className="w-full max-w-xs">
              {renderInput("TOTAL IDV / SA", form.totalIdvSa, "totalIdvSa", "number")}
            </div>
          </div>
        </div>

        {/* MOTOR DETAILS */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-3 bg-slate-800 text-white">
            <h3 className="font-bold text-xs uppercase tracking-widest">Motor / Vehicle Details</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {renderInput("Make", form.make, "make")}
            {renderInput("Model", form.model, "model")}
            {renderInput("Fuel Type", form.fuelType, "fuelType")}
            {renderInput("Color", form.color, "color")}
            {renderInput("Registration No", form.registrationNo, "registrationNo")}
            {renderInput("Place of Registration", form.placeOfRegistration, "placeOfRegistration")}
            {renderInput("MFG Year", form.mfgYear, "mfgYear")}
            {renderInput("Registration Date", form.registrationDate, "registrationDate", "date")}
            {renderInput("Seating Capacity", form.seatingCapacity, "seatingCapacity")}
            {renderInput("Cubic Capacity", form.cubicCapacity, "cubicCapacity")}
            {renderInput("Engine Number", form.engineNumber, "engineNumber")}
            {renderInput("Chasis Number", form.chasisNumber, "chasisNumber")}
            {renderInput("Vehicle Weight", form.vehicleWeight, "vehicleWeight")}
            {renderInput("Permit", form.permit, "permit")}
            {renderInput("Trailer No", form.trailerNo, "trailerNo")}
            {renderInput("Fitness Expiry Date", form.fitnessExpiryDate, "fitnessExpiryDate", "date")}
            {renderInput("Road Tax", form.roadTax, "roadTax")}
          </div>
        </div>
      </div>
    );
  }

  // BURGLARY UI (insuranceTypeId === 1)
  if (insuranceTypeId === 1) {
    return (
      <div className="space-y-6">
        {/* BURGLARY SECTION */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-white border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-800">Burglary</h3>
            {!isAdding && (
              <button 
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md text-xs font-bold hover:bg-blue-50 transition-all"
              >
                <Plus size={14} />
                Add Item
              </button>
            )}
          </div>
          
          <div className="p-0">
            {isAdding && (
              <div className="p-6 bg-slate-50 border-b border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {renderItemInput("Details", newItem.details, "details")}
                  {renderItemInput("Description", newItem.description, "description")}
                  {renderItemInput("SA", newItem.sa, "sa", "number")}
                  {renderItemInput("Rate", newItem.rate, "rate", "number")}
                  {renderItemInput("Risk Type", newItem.riskType, "riskType")}
                  {renderItemInput("Occupancy", newItem.occupancy, "occupancy")}
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button 
                    onClick={resetForm}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-md transition-all flex items-center gap-1.5"
                  >
                    <X size={14} />
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddItem}
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Check size={14} />
                    {editingIndex !== null ? "Update Item" : "Save Item"}
                  </button>
                </div>
              </div>
            )}

            <div className="divide-y divide-slate-100">
              {(!form.itemDetails || form.itemDetails.length === 0) && !isAdding ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                  <AlertCircle size={32} strokeWidth={1.5} className="mb-2 opacity-20" />
                  <p className="text-sm font-medium">No records found</p>
                </div>
              ) : (
                (form.itemDetails || []).map((item: any, idx: number) => (
                  <div key={idx} className="p-4 hover:bg-slate-50 transition-colors group flex items-start justify-between">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 flex-1">
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Details</p>
                        <p className="text-sm text-slate-700 font-medium">{item.details || "-"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Description</p>
                        <p className="text-sm text-slate-700">{item.description || "-"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">SA</p>
                        <p className="text-sm text-slate-700 font-mono">{item.sa || "0"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Rate</p>
                        <p className="text-sm text-slate-700 font-mono">{item.rate || "0"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Risk Type</p>
                        <p className="text-sm text-slate-700">{item.riskType || "-"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Occupancy</p>
                        <p className="text-sm text-slate-700">{item.occupancy || "-"}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEditItem(idx)} 
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteItem(idx)} 
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* TOTAL IDV / SA */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-3 bg-slate-800 text-white">
            <h3 className="font-bold text-xs uppercase tracking-widest">TOTAL IDV / SA</h3>
          </div>
          <div className="p-6 flex justify-end">
            <div className="w-full max-w-xs space-y-1.5">
              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                TOTAL IDV / SA <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.totalIdvSa ?? ""}
                placeholder="Total SA / IDV"
                className="w-full border border-slate-200 rounded px-4 py-2.5 text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                onChange={(e) => setForm((p: any) => ({ ...p, totalIdvSa: Number(e.target.value) }))}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-slate-200 border-dashed text-slate-400">
      <AlertCircle size={40} strokeWidth={1} className="mb-3 opacity-20" />
      <p className="text-sm font-medium">No related information template for this insurance type</p>
      <p className="text-xs mt-1">Insurance Type ID: {insuranceTypeId}</p>
    </div>
  );
};

export default PolicyRelatedInfo;
