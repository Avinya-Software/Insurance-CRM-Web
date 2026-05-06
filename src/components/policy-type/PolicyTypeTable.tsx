import { Pencil } from "lucide-react";
import { PolicyType } from "../../interfaces/PolicyType.interface";
import { useUpdatePolicyTypeStatus } from "../../hooks/PolicyType/useUpdatePolicyTypeStatus";
import TableSkeleton from "../common/TableSkeleton";
import Toggle from "../common/Toggle";

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


