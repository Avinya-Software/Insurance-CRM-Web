import { Pencil } from "lucide-react";
import { PolicyType } from "../../interfaces/PolicyType.interface";
import { useUpdatePolicyTypeStatus } from "../../hooks/PolicyType/useUpdatePolicyTypeStatus";
import TableSkeleton from "../common/TableSkeleton";

interface Props {
  data: PolicyType[];
  loading?: boolean;
  onEdit?: (item: PolicyType) => void;
}

const PolicyTypeTable = ({ data = [], loading = false, onEdit }: Props) => {
  const { mutate: updateStatus, isPending: isUpdating, variables } = useUpdatePolicyTypeStatus();

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-slate-100 sticky top-0 z-10">
          <tr>
            <Th>Division</Th>
            <Th>Segment</Th>
            <Th>Policy Type Name</Th>
            <Th>Created Date</Th>
            <Th>Status</Th>
            <Th className="text-center">Actions</Th>
          </tr>
        </thead>

        {loading ? (
          <TableSkeleton rows={6} columns={6} />
        ) : (
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-500 font-medium">
                  No policy types found
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="border-t h-[52px] hover:bg-slate-50 transition-colors duration-150"
                >
                  <Td className="font-medium text-slate-900">{item.divisionName}</Td>
                  <Td>{item.segmentName}</Td>
                  <Td>{item.policyTypeName}</Td>
                  <Td className="whitespace-nowrap font-medium text-slate-600">
                    {item.createdDate ? item.createdDate.split("T")[0] : "-"}
                  </Td>
                  <Td>
                    <Toggle 
                      active={item.status} 
                      onChange={() => updateStatus({ id: item.id, status: !item.status })}
                      loading={isUpdating && variables?.id === item.id}
                    />
                  </Td>
                  <Td className="text-center">
                    <button
                      onClick={() => onEdit?.(item)}
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edit Policy Type"
                    >
                      <Pencil size={18} />
                    </button>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default PolicyTypeTable;

/*   HELPERS   */

const Th = ({ children, className = "" }: any) => (
  <th className={`px-4 py-3 text-left font-semibold ${className}`}>
    {children}
  </th>
);

const Td = ({ children, className = "" }: any) => (
  <td className={`px-4 py-3 ${className}`}>{children}</td>
);

const Toggle = ({ active = false, onChange, loading = false }: { active?: boolean; onChange: () => void; loading?: boolean }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      if (!loading) onChange();
    }}
    disabled={loading}
    type="button"
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 transition-all duration-200 ease-in-out focus:outline-none ${
      active 
        ? "bg-blue-600 border-blue-600 shadow-sm" 
        : "bg-white border-blue-100 shadow-[0_0_8px_rgba(37,99,235,0.1)]"
    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-sm transition duration-200 ease-in-out ${
        active 
          ? "translate-x-5 bg-white" 
          : "translate-x-0 bg-slate-300"
      }`}
    />
  </button>
);
