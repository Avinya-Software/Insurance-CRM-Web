import React from "react";
import { Pencil } from "lucide-react";
import TableSkeleton from "../common/TableSkeleton";
import Toggle from "../common/Toggle";
import { Broker } from "../../interfaces/broker.interface";

interface Props {
  data: Broker[];
  loading?: boolean;
  page: number;
  pageSize: number;
  onEdit: (item: Broker) => void;
  onStatusChange: (item: Broker) => void;
}

const BrokerTable = ({ data = [], loading = false, page, pageSize, onEdit, onStatusChange }: Props) => {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-slate-100 sticky top-0 z-10">
          <tr>
            <Th>Sr No</Th>
            <Th>Broker Name</Th>
            <Th>Status</Th>
            <Th>Created Date</Th>
            <Th className="text-center">Action</Th>
          </tr>
        </thead>

        {loading ? (
          <TableSkeleton rows={10} columns={5} />
        ) : (
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-slate-500">
                  No brokers found
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id} className="border-t h-[52px] hover:bg-slate-50">
                  <Td>{(page - 1) * pageSize + index + 1}</Td>
                  <Td className="font-medium text-slate-900">{item.name}</Td>
                  <Td>
                    <Toggle 
                      active={item.status} 
                      onChange={() => onStatusChange(item)}
                    />
                  </Td>
                  <Td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-GB") : "-"}</Td>
                  <Td className="text-center">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edit Broker"
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

export default BrokerTable;

const Th = ({ children, className = "" }: any) => (
  <th className={`px-4 py-3 font-semibold text-slate-700 text-left ${className}`}>
    {children}
  </th>
);

const Td = ({ children, className = "" }: any) => (
  <td className={`px-4 py-3 text-slate-600 ${className}`}>{children}</td>
);
