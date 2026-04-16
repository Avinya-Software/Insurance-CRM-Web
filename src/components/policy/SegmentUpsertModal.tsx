import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { useUpsertSegment } from "../../hooks/segment/useUpsertSegment";
import { useDivisionDropdown } from "../../hooks/division/useDivisionDropdown";
import SearchableComboBox from "../common/SearchableComboBox";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: (newSegment: any) => void;
  initialDivisionId?: string | number;
  initialDivisionName?: string;
}

const SegmentTypeEnum = {
  PackagePolicy: 1,
  TPLPolicy: 2,
  SAODPolicy: 3,
  WC: 4,
  NonWC: 5,
};

const SegmentUpsertModal = ({ open, onClose, onSuccess, initialDivisionId, initialDivisionName }: Props) => {
  const [formData, setFormData] = useState({
    segmentId: 0,
    segmentName: "",
    divisionId: "",
    segmentType: null as number | null,
    isActive: true,
  });

  const { data: divisions } = useDivisionDropdown();
  const { mutate: upsertSegment, isPending } = useUpsertSegment();

  useEffect(() => {
    if (open) {
      setFormData({
        segmentId: 0,
        segmentName: "",
        divisionId: initialDivisionId?.toString() || "",
        segmentType: null,
        isActive: true,
      });
    }
  }, [open, initialDivisionId]);

  const selectedDivisionName = divisions?.find(d => d.divisionId.toString() === formData.divisionId)?.divisionName || initialDivisionName;

  const isOtherGeneral = selectedDivisionName === "Other General Insurance";
  const isVehicle = selectedDivisionName === "Vehicle Insurance";

  const handleSubmit = () => {
    if (!formData.segmentName || !formData.divisionId) return;

    const payload: any = {
      segmentId: formData.segmentId,
      segmentName: formData.segmentName,
      divisionId: Number(formData.divisionId),
      isActive: formData.isActive,
      createdDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString(),
    };

    // Only pass segmentType if it's one of the specific divisions
    if (isOtherGeneral || isVehicle) {
      payload.segmentType = formData.segmentType;
    }

    upsertSegment(payload, {
      onSuccess: (res: any) => {
        // Assume res.data contains the new segment object or we just pass the name
        onSuccess(res.data);
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
          <h3 className="font-bold uppercase tracking-wider text-xs">Add New Segment</h3>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <SearchableComboBox
                label="Division"
                required
                items={divisions?.map(d => ({ label: d.divisionName, value: d.divisionId.toString() })) || []}
                value={formData.divisionId}
                onSelect={(item) => setFormData(prev => ({ ...prev, divisionId: item?.value || "", segmentType: null }))}
                placeholder="Select Division"
              />

              <div className="space-y-1.5 transition-all">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Segment Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded text-sm transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none"
                  placeholder="Enter segment name"
                  value={formData.segmentName}
                  onChange={(e) => setFormData(prev => ({ ...prev, segmentName: e.target.value }))}
                />
              </div>
            </div>

            {isOtherGeneral && (
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Type of this segment? <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer group whitespace-nowrap">
                    <input
                      type="radio"
                      name="segmentType"
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                      checked={formData.segmentType === SegmentTypeEnum.WC}
                      onChange={() => setFormData(prev => ({ ...prev, segmentType: SegmentTypeEnum.WC }))}
                    />
                    <span className="text-[11px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">WC (Workmen Compensation)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group whitespace-nowrap">
                    <input
                      type="radio"
                      name="segmentType"
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                      checked={formData.segmentType === SegmentTypeEnum.NonWC}
                      onChange={() => setFormData(prev => ({ ...prev, segmentType: SegmentTypeEnum.NonWC }))}
                    />
                    <span className="text-[11px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Non WC (Workmen Compensation)</span>
                  </label>
                </div>
              </div>
            )}
            
            {isVehicle && (
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Type of this segment? <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer group whitespace-nowrap">
                    <input
                      type="radio"
                      name="segmentType"
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                      checked={formData.segmentType === SegmentTypeEnum.PackagePolicy}
                      onChange={() => setFormData(prev => ({ ...prev, segmentType: SegmentTypeEnum.PackagePolicy }))}
                    />
                    <span className="text-[11px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Package</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group whitespace-nowrap">
                    <input
                      type="radio"
                      name="segmentType"
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                      checked={formData.segmentType === SegmentTypeEnum.TPLPolicy}
                      onChange={() => setFormData(prev => ({ ...prev, segmentType: SegmentTypeEnum.TPLPolicy }))}
                    />
                    <span className="text-[11px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">TPL (Third party liability)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group whitespace-nowrap">
                    <input
                      type="radio"
                      name="segmentType"
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                      checked={formData.segmentType === SegmentTypeEnum.SAODPolicy}
                      onChange={() => setFormData(prev => ({ ...prev, segmentType: SegmentTypeEnum.SAODPolicy }))}
                    />
                    <span className="text-[11px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">SAOD (Standalone On Damage)</span>
                  </label>
                </div>
              </div>
            )}
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
            disabled={isPending || !formData.segmentName || !formData.divisionId || ((isOtherGeneral || isVehicle) && !formData.segmentType)}
            className="px-8 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold rounded shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isPending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Add Segment"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SegmentUpsertModal;
