import { useState } from "react";
import { usePolicyTypes } from "../hooks/PolicyType/usePolicyTypes";
import PolicyTypeTable from "../components/policy-type/PolicyTypeTable";
import PolicyTypeUpsertModal from "../components/policy-type/PolicyTypeUpsertModal";

import { PolicyType as IPolicyType } from "../interfaces/PolicyType.interface";

const PolicyType = () => {
  const { data: policyTypes = [], isLoading } = usePolicyTypes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<IPolicyType | null>(null);
  const [search, setSearch] = useState("");

  const filteredData = policyTypes.filter((item) =>
    item.policyTypeName.toLowerCase().includes(search.toLowerCase()) ||
    item.divisionName.toLowerCase().includes(search.toLowerCase()) ||
    item.segmentName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      {/*   HEADER   */}
      <div className="px-4 py-3 border-b bg-gray-100">
        <div className="grid grid-cols-2 gap-y-4 items-start">
          <div>
            <h1 className="text-4xl font-serif font-semibold text-slate-900">
              Policy Type
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {filteredData.length} total policy types
            </p>
          </div>

          <div className="text-right">
            <button
              className="bg-blue-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-800 transition-colors"
                onClick={() => {
                setSelectedType(null);
                setIsModalOpen(true);
              }}
            >
              + Add Policy Type
            </button>
          </div>

          {/* 🔍 SEARCH */}
          <div>
            <div className="relative w-[360px]">
              <input
                placeholder="Search by policy type, division or segment..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="">
        <PolicyTypeTable 
          data={filteredData} 
          loading={isLoading} 
          onEdit={(item) => {
            setSelectedType(item);
            setIsModalOpen(true);
          }}
        />
      </div>

      <PolicyTypeUpsertModal
        isOpen={isModalOpen}
        item={selectedType}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default PolicyType;
