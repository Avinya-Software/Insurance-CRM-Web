import { useState } from "react";
import { Toaster } from "react-hot-toast";
import Pagination from "../components/leads/Pagination";
import CompanyTable from "../components/Company/CompanyTable";
import CompanyUpsertSheet from "../components/Company/CompanyUpsertSheet";
import { Company } from "../interfaces/company.interface";
import { useCompanies } from "../hooks/Company/useCompanies";

const CompanyPage = () => {

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
  
    const [search, setSearch] = useState("");
    const [policyType, setPolicyType] = useState<boolean | undefined>(undefined);
  
    const [openSheet, setOpenSheet] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Company | null>(null);
  
    const { data, isLoading, refetch } = useCompanies(
      pageNumber,
      pageSize,
      policyType,
      search
    );
  
    const allData = data?.companies ?? [];
    const totalPages = data?.totalPages ?? 1;
    const totalCount = data?.totalRecords ?? 0;
  
    /* HANDLERS */
  
    const handleAddItem = () => {
      setSelectedItem(null);
      setOpenSheet(true);
    };
  
    const handleEditItem = (item: Company) => {
      setSelectedItem(item);
      setOpenSheet(true);
    };
  
    const handleSuccess = () => {
      setOpenSheet(false);
      refetch();
    };
  
    const handlePolicyChange = (e: any) => {
      const value = e.target.value;
  
      if (value === "") {
        setPolicyType(undefined);
      } else {
        setPolicyType(value === "true");
      }
  
      setPageNumber(1);
    };
  
    return (
      <>
        <Toaster position="top-right" />
  
        <div className="bg-white rounded-lg border">
  
          {/* HEADER */}
  
          <div className="px-4 py-5 border-b bg-gray-100">
  
            <div className="grid grid-cols-2 gap-y-4 items-start">
  
              <div>
                <h1 className="text-4xl font-serif font-semibold text-slate-900">
                  Companies
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  {totalCount} total companies
                </p>
              </div>
  
              <div className="text-right">
                <button
                  className="inline-flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded text-sm font-medium"
                  onClick={handleAddItem}
                >
                  + Add Company
                </button>
              </div>
  
              {/* SEARCH */}
  
              <div className="flex gap-4">
  
                <div className="relative w-[300px]">
                  <input
                    type="text"
                    placeholder="Search Company..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPageNumber(1);
                    }}
                    className="w-full h-10 pl-10 pr-3 border rounded text-sm"
                  />
  
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    🔍
                  </span>
                </div>
  
                {/* POLICY TYPE DROPDOWN */}
  
                <div className="relative w-[220px]">
  
                  <select
                    value={policyType === undefined ? "" : policyType.toString()}
                    onChange={handlePolicyChange}
                    className="h-10 w-full border rounded px-3 text-sm cursor-pointer"
                  >
                    <option value="">All Types</option>
                    <option value="true">Life</option>
                    <option value="false">General</option>
                  </select>
  
                </div>
  
              </div>
  
            </div>
  
          </div>
  
          {/* TABLE */}
  
          <CompanyTable
            data={allData}
            loading={isLoading}
            onEdit={handleEditItem}
          />
  
          {/* PAGINATION */}
  
          <Pagination
            page={pageNumber}
            totalPages={totalPages}
            onChange={(page) => setPageNumber(page)}
          />
  
        </div>
  
        <CompanyUpsertSheet
          open={openSheet}
          item={selectedItem}
          onClose={() => setOpenSheet(false)}
          onSuccess={handleSuccess}
        />
  
      </>
    );
  };
export default CompanyPage;