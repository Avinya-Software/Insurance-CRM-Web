import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Search, Plus, Filter } from "lucide-react";
import UserDetailsTable from "../components/UserMaster/UserDetailsTable";
import Pagination from "../components/leads/Pagination";
import AddUserUpsertSheet from "../components/UserMaster/AddUserUpsertSheet";
import { useUserMaster } from "../hooks/UserMaster/useUserMaster";
import { useUserTypes } from "../hooks/UserMaster/useUserTypes";
import { UserDetail } from "../interfaces/UserMaster.interface";

const UserTeamMaster = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedUserType, setSelectedUserType] = useState<string>("");

  const [openSheet, setOpenSheet] = useState(false);
  const [selectedItem, setSelectedItem] = useState<UserDetail | null>(null);

  // Fetch User Types for dropdown
  const { data: userTypesRes } = useUserTypes();
  const userTypes = userTypesRes?.data || [];

  // Fetch User Master Data
  const { data: userMasterRes, isLoading, refetch } = useUserMaster(
    selectedUserType || null,
    pageNumber,
    pageSize
  );

  const apiData = userMasterRes?.data?.data || [];
  const totalCount = userMasterRes?.data?.totalCount || 0;
  const totalPages = userMasterRes?.data?.totalPages || 1;

  // Client-side search filtering (optional)
  const filteredData = apiData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.email.toLowerCase().includes(search.toLowerCase()) ||
    item.mobile.includes(search)
  );

  /* HANDLERS */
  const handleAddItem = () => {
    setSelectedItem(null);
    setOpenSheet(true);
  };

  const handleEditItem = (item: UserDetail) => {
    setSelectedItem(item);
    setOpenSheet(true);
  };

  const handleSuccess = () => {
    setOpenSheet(false);
    refetch();
  };

  const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUserType(e.target.value);
    setPageNumber(1);
  };

  /* UI */
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <div className="bg-white rounded-lg border">
        {/* HEADER */}
        <div className="px-4 py-5 border-b bg-gray-100">
          <div className="grid grid-cols-2 gap-y-4 items-start">
            {/* TITLE */}
            <div>
              <h1 className="text-4xl font-serif font-semibold text-slate-900">
                User Master
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {totalCount} total users
              </p>
            </div>

            {/* ADD BUTTON */}
            <div className="text-right">
              <button
                className="inline-flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded text-sm font-medium"
                onClick={handleAddItem}
              >
                <Plus size={16} />
                Add User
              </button>
            </div>

            {/* SEARCH + FILTER */}
            <div className="flex gap-4 mt-4 col-span-2">
              {/* SEARCH INPUT */}
              <div className="relative w-full sm:w-[360px]">
                <input
                  type="text"
                  placeholder="Search by name, email or mobile..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPageNumber(1);
                  }}
                  className="h-10 w-full border rounded px-3 text-sm"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                </span>
              </div>

              {/* USER TYPE FILTER */}
              <div className="relative w-full sm:w-[220px]">
                <select
                  value={selectedUserType}
                  onChange={handleUserTypeChange}
                  className="h-10 w-full border rounded px-3 text-sm cursor-pointer"
                >
                  <option value="">All User Types</option>
                  {userTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <UserDetailsTable
          data={filteredData}
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

      {/* UPSERT SHEET */}
      <AddUserUpsertSheet
        open={openSheet}
        item={selectedItem}
        onClose={() => setOpenSheet(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default UserTeamMaster;