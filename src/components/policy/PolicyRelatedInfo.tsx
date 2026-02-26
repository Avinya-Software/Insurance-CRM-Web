import React, { useState } from "react";
import { Plus, Edit2, Trash2, X, Check, AlertCircle } from "lucide-react";

interface Props {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  insuranceTypeId: number;
}

/* ================= CONFIG ================= */

const allowedMotorTypes = [12, 13, 14, 15, 16, 17, 18];

const relationOptions = [
  "Self","Spouse","Husband","Son","Daughter","Father","Mother",
  "Brother","Sister","Father-In-Low","Mother-In-Low",
  "Grand Father","Grand Mother","Grand Son","Grand Daughter"
];

const insuranceFieldConfig: Record<number, any[]> = {

  /* ===== 1 ===== */
  1: [
    { label: "Details", key: "details" },
    { label: "Description", key: "description" },
    { label: "SA", key: "sa", type: "number" },
    { label: "Rate", key: "rate", type: "number" },
    { label: "Risk Type", key: "riskType" },
    { label: "Occupancy", key: "occupancy" }
  ],

  /* ===== 2 ===== */
  2: [
    { label: "Details", key: "details" },
    { label: "Other Details", key: "otherDetails" },
    { label: "SA", key: "sa", type: "number" },
    { label: "Type Of Machinary", key: "machineType" },
    { label: "Make", key: "make" },
    { label: "Manu. Year", key: "manufactureYear", type: "number" },
    { label: "Serial No", key: "serialNo" }
  ],

  /* ===== 4 ===== */
  4: [
    { label: "Member Name", key: "memberName" },
    { label: "Details", key: "details" },
    { label: "Description", key: "description" },
    { label: "Age", key: "age", type: "number" },
    { label: "SA", key: "sa", type: "number" },
    { label: "Relation", key: "relation", type: "select", options: relationOptions },
    { label: "C. Bonus", key: "bonus", type: "number" },
    { label: "Assignee Name", key: "assigneeName" },
    { label: "First Inception Date", key: "firstInceptionDate", type: "date" }
  ],

  /* ===== 5 ===== */
  5: [
    { label: "Member Name", key: "memberName" },
    { label: "Risk Category", key: "riskCategory" },
    { label: "Details", key: "details" },
    { label: "Age", key: "age", type: "number" },
    { label: "SA", key: "sa", type: "number" },
    { label: "Relation", key: "relation", type: "select", options: relationOptions },
    { label: "C. Bonus", key: "bonus", type: "number" },
    { label: "Assignee Name", key: "assigneeName" }
  ],

  /* ===== 6 ===== */
  6: [
    { label: "Member Name", key: "memberName" },
    { label: "Details", key: "details" },
    { label: "Description", key: "description" },
    { label: "Age", key: "age", type: "number" },
    { label: "SA", key: "sa", type: "number" },
    { label: "Relation", key: "relation", type: "select", options: relationOptions },
    { label: "C. Bonus", key: "bonus", type: "number" },
    { label: "Assignee Name", key: "assigneeName" }
  ],

  /* ===== 7 ===== */
  7: [
    { label: "Member Name", key: "memberName" },
    { label: "Details", key: "details" },
    { label: "Description", key: "description" },
    { label: "Age", key: "age", type: "number" },
    { label: "SA", key: "sa", type: "number" },
    { label: "Relation", key: "relation", type: "select", options: relationOptions },
    { label: "Assignee Name", key: "assigneeName" }
  ],

  /* ===== 8 / 11 ===== */
  8: [
    { label: "Details", key: "details" },
    { label: "Description", key: "description" },
    { label: "SA", key: "sa", type: "number" },
    { label: "Rate", key: "rate", type: "number" },
    { label: "Risk Type", key: "riskType" },
    { label: "Occupancy", key: "occupancy" }
  ],

  11: [
    { label: "Details", key: "details" },
    { label: "Description", key: "description" },
    { label: "SA", key: "sa", type: "number" },
    { label: "Rate", key: "rate", type: "number" },
    { label: "Risk Type", key: "riskType" },
    { label: "Occupancy", key: "occupancy" }
  ],

  /* ===== 19 ===== */
  19: [
    { label: "Member Name", key: "memberName" },
    { label: "Risk Category", key: "riskCategory" },
    { label: "Details", key: "details" },
    { label: "Age", key: "age", type: "number" },
    { label: "SA", key: "sa", type: "number" },
    { label: "Relation", key: "relation", type: "select", options: relationOptions },
    { label: "Assignee Name", key: "assigneeName" }
  ],

  /* ===== 20 ===== */
  20: [
    { label: "Details", key: "details" },
    { label: "Description", key: "description" },
    { label: "SA", key: "sa", type: "number" },
    { label: "Rate", key: "rate", type: "number" },
    { label: "Premium Section", key: "premiumSection" },
    { label: "Item Year", key: "itemYear" }
  ],

  /* ===== 21 ===== */
  21: [
    { label: "Member Name", key: "memberName" },
    { label: "Details", key: "details" },
    { label: "Description", key: "description" },
    { label: "Age", key: "age", type: "number" },
    { label: "SA", key: "sa", type: "number" },
    { label: "Relation", key: "relation", type: "select", options: relationOptions },
    { label: "Assignee Name", key: "assigneeName" }
  ],

  /* ===== 22 ===== */
  22: [
    { label: "Member Name", key: "memberName" },
    { label: "Details", key: "details" },
    { label: "Description", key: "description" },
    { label: "Age", key: "age", type: "number" },
    { label: "SA", key: "sa", type: "number" },
    { label: "Relation", key: "relation", type: "select", options: relationOptions },
    { label: "Duration", key: "duration" },
    { label: "Assignee Name", key: "assigneeName" },
    { label: "Passport No", key: "passportNo" },
    { label: "Destination", key: "destination" }
  ],

  /* ===== 23 ===== */
  23: [
    { label: "Details", key: "details" },
    { label: "Description", key: "description" },
    { label: "No Of Employee", key: "noOfEmployee" },
    { label: "SA", key: "sa", type: "number" },
    { label: "Rate", key: "rate", type: "number" },
    { label: "Type Of Business", key: "businessType" },
    { label: "Occupancy", key: "occupancy" }
  ]
};

/* ================= COMPONENT ================= */

const PolicyRelatedInfo = ({ form, setForm, insuranceTypeId }: Props) => {

  const [newItem, setNewItem] = useState<any>({});
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const fieldList = insuranceFieldConfig[insuranceTypeId] || [];

  const handleAddItem = () => {
    if (editingIndex !== null) {
      const updated = [...(form.itemDetails || [])];
      updated[editingIndex] = newItem;

      setForm((p: any) => ({
        ...p,
        itemDetails: updated
      }));

      setEditingIndex(null);
    } else {
      setForm((p: any) => ({
        ...p,
        itemDetails: [...(p.itemDetails || []), newItem]
      }));
    }

    resetForm();
  };

  const resetForm = () => {
    setNewItem({});
    setEditingIndex(null);
    setIsAdding(false);
  };

  const handleEditItem = (index: number) => {
    setNewItem({ ...(form.itemDetails?.[index] || {}) });
    setEditingIndex(index);
    setIsAdding(true);
  };

  const handleDeleteItem = (index: number) => {
    const updated = form.itemDetails?.filter((_: any, i: number) => i !== index) || [];
    setForm((p: any) => ({ ...p, itemDetails: updated }));
  };

  const renderItemInput = (field: any) => {

    const { label, key, type = "text", options } = field;

    if (type === "select") {
      return (
        <div key={key} className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            {label}
          </label>

          <select
            value={newItem[key] ?? ""}
            onChange={(e) =>
              setNewItem((p: any) => ({ ...p, [key]: e.target.value }))
            }
            className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all"
          >
            <option value="">Select</option>
            {options?.map((opt: string) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div key={key} className="space-y-1">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          {label}
        </label>

        <input
          type={type}
          value={newItem[key] ?? ""}
          className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all"
          onChange={(e) =>
            setNewItem((p: any) => ({
              ...p,
              [key]: type === "number" ? Number(e.target.value) : e.target.value
            }))
          }
        />
      </div>
    );
  };

  /* ================= MOTOR UI ================= */

  if (allowedMotorTypes.includes(insuranceTypeId)) {
    return (
      <div className="space-y-8">

        {/* IDV DETAILS */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-3 bg-slate-800 text-white">
            <h3 className="font-bold text-xs uppercase tracking-widest">
              IDV DETAILS
            </h3>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { label: "Vehicle Value", key: "vehicleValue", type: "number" },
              { label: "Non Elec. Accessories", key: "nonElecAccessories", type: "number" },
              { label: "Electrical Accessories", key: "elecAccessories", type: "number" },
              { label: "CNG/LPG Kit", key: "cngLpgKit", type: "number" },
              { label: "Trailer Total Value", key: "trailerTotalValue", type: "number" }
            ].map(renderItemInput)}
          </div>
        </div>

        {/* TOTAL IDV / SA */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-3 bg-slate-800 text-white">
            <h3 className="font-bold text-xs uppercase tracking-widest">
              TOTAL IDV / SA
            </h3>
          </div>

          <div className="p-6 flex justify-end">
            <div className="w-full max-w-xs">
              {renderItemInput({
                label: "TOTAL IDV / SA",
                key: "totalIdvSa",
                type: "number"
              })}
            </div>
          </div>
        </div>

        {/* VEHICLE DETAILS */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-3 bg-slate-800 text-white">
            <h3 className="font-bold text-xs uppercase tracking-widest">
              Vehicle Details
            </h3>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Make", key: "make" },
              { label: "Model", key: "model" },
              { label: "Fuel Type", key: "fuelType" },
              { label: "Color", key: "color" },
              { label: "Registration No", key: "registrationNo" },
              { label: "Place of Registration", key: "placeOfRegistration" },
              { label: "MFG Year", key: "mfgYear" },
              { label: "Registration Date", key: "registrationDate", type: "date" },
              { label: "Seating Capacity", key: "seatingCapacity" },
              { label: "Cubic Capacity", key: "cubicCapacity" },
              { label: "Engine Number", key: "engineNumber" },
              { label: "Chasis Number", key: "chasisNumber" },
              { label: "Vehicle Weight", key: "vehicleWeight" },
              { label: "Permit", key: "permit" },
              { label: "Trailer No", key: "trailerNo" },
              { label: "Fitness Expiry Date", key: "fitnessExpiryDate", type: "date" },
              { label: "Road Tax", key: "roadTax" }
            ].map(renderItemInput)}
          </div>
        </div>

      </div>
    );
  }

  /* ================= CONFIG UI ================= */

  if (fieldList.length > 0) {

    return (
      <div className="space-y-6">

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

          <div className="px-6 py-4 flex justify-between items-center border-b">
            <h3 className="font-bold text-sm text-slate-800">
              Policy Related Info
            </h3>

            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md text-xs font-bold hover:bg-blue-50 transition-all"
              >
                <Plus size={14}/>
                Add Item
              </button>
            )}
          </div>

          {isAdding && (
            <div className="p-6 bg-slate-50 border-b animate-in fade-in slide-in-from-top-2 duration-200">

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fieldList.map(renderItemInput)}
              </div>

              <div className="mt-6 flex justify-end gap-3">

                <button
                  onClick={resetForm}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-md flex items-center gap-1.5"
                >
                  <X size={14}/>
                  Cancel
                </button>

                <button
                  onClick={handleAddItem}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center gap-1.5"
                >
                  <Check size={14}/>
                  {editingIndex !== null ? "Update Item" : "Save Item"}
                </button>

              </div>

            </div>
          )}

          {/* LIST VIEW */}

          <div className="divide-y">

            {(!form.itemDetails || form.itemDetails.length === 0) && !isAdding ? (
              <div className="py-12 flex flex-col items-center text-slate-400">
                <AlertCircle size={32} className="opacity-20 mb-2"/>
                <p className="text-sm font-medium">No records found</p>
              </div>
            ) : (

              (form.itemDetails || []).map((item: any, idx: number) => (

                <div key={idx} className="p-4 flex justify-between group hover:bg-slate-50 transition">

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 flex-1">

                    {fieldList.map(field => (
                      <div key={field.key}>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">
                          {field.label}
                        </p>
                        <p className="text-sm text-slate-700">
                          {item[field.key] || "-"}
                        </p>
                      </div>
                    ))}

                  </div>

                  <div className="flex gap-1 ml-4 opacity-0 group-hover:opacity-100 transition">

                    <button
                      onClick={() => handleEditItem(idx)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 size={14}/>
                    </button>

                    <button
                      onClick={() => handleDeleteItem(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={14}/>
                    </button>

                  </div>

                </div>

              ))

            )}

          </div>
        </div>

        {/* TOTAL IDV / SA */}

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

          <div className="px-6 py-3 bg-slate-800 text-white">
            <h3 className="font-bold text-xs uppercase tracking-widest">
              TOTAL IDV / SA
            </h3>
          </div>

          <div className="p-6 flex justify-end">
            <div className="w-full max-w-xs space-y-1.5">
              {renderItemInput({
                label: "TOTAL IDV / SA",
                key: "totalIdvSa",
                type: "number"
              })}
            </div>
          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-dashed text-slate-400">
      <AlertCircle size={40} className="opacity-20 mb-3"/>
      <p className="text-sm font-medium">
        No related information template for this insurance type
      </p>
      <p className="text-xs mt-1">
        Insurance Type ID: {insuranceTypeId}
      </p>
    </div>
  );
};

export default PolicyRelatedInfo;