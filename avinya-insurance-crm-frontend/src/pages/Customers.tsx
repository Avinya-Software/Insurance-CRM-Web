import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { useCustomers } from "../hooks/customer/useCustomers";
import CustomerTable from "../components/customer/CustomerTable";
import CustomerUpsertSheet from "../components/customer/CustomerUpsertSheet";
import PolicyUpsertSheet from "../components/policy/PolicyUpsertSheet";
import type { Customer } from "../interfaces/customer.interface";

const Customers = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");

  /* ---------------- CUSTOMER SHEET ---------------- */
  const [openCustomerSheet, setOpenCustomerSheet] = useState(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  /* ---------------- POLICY SHEET ---------------- */
  const [openPolicySheet, setOpenPolicySheet] = useState(false);

  /* ---------------- API ---------------- */
  const { data, isLoading, refetch } = useCustomers(
    pageNumber,
    pageSize,
    search
  );

  /* ---------------- HANDLERS ---------------- */

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setOpenCustomerSheet(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpenCustomerSheet(true);
  };

  const handleAddPolicy = (customer: Customer) => {
    setSelectedCustomer(customer); // 👈 ONLY customerId will be used
    setOpenPolicySheet(true);
  };

  const handleCustomerSuccess = (isEdit: boolean) => {
    setOpenCustomerSheet(false);
    refetch(); // 🔥 refresh customer list
    toast.success(
      isEdit ? "Customer Saved successfully!" : "Customer Saved successfully!"
    );
  };

  const handlePolicySuccess = () => {
    setOpenPolicySheet(false);
    setSelectedCustomer(null);
    toast.success("Policy added successfully!");
  };

  /* ================= UI ================= */

  return (
    <>
      {/* 🔔 TOASTER */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="bg-white rounded-lg border">
        {/* ================= HEADER ================= */}
        <div className="px-4 py-5 border-b bg-gray-100">
          <div className="grid grid-cols-2 gap-y-4 items-start">
            {/* LEFT */}
            <div>
              <h1 className="text-4xl font-serif font-semibold text-slate-900">
                Customers
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {data?.totalRecords ?? 0} total customers
              </p>
            </div>

            {/* RIGHT */}
            <div className="text-right">
              <button
                className="inline-flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded text-sm font-medium"
                onClick={handleAddCustomer}
              >
                <span className="text-lg leading-none">+</span>
                Add Customer
              </button>
            </div>

            {/* SEARCH */}
            <div>
              <div className="relative w-[360px]">
                <input
                  type="text"
                  placeholder="Search customers by name, email, or phone..."
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
            </div>

            <div />
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <CustomerTable
          data={data?.customers || []}
          onEdit={handleEditCustomer}
          onAddPolicy={handleAddPolicy}
        />

        {/* ================= PAGINATION ================= */}
        <div className="flex items-center justify-end gap-4 px-4 py-3 border-t text-sm">
          <button
            disabled={pageNumber === 1}
            onClick={() => setPageNumber((p) => p - 1)}
            className="disabled:text-slate-400"
          >
            Prev
          </button>

          <span>Page {pageNumber}</span>

          <button
            disabled={(data?.customers?.length ?? 0) < pageSize}
            onClick={() => setPageNumber((p) => p + 1)}
            className="disabled:text-slate-400"
          >
            Next
          </button>
        </div>

        {isLoading && (
          <div className="px-4 py-2 text-sm text-slate-500">
            Loading...
          </div>
        )}
      </div>

      {/* ================= CUSTOMER UPSERT ================= */}
      <CustomerUpsertSheet
        open={openCustomerSheet}
        customer={selectedCustomer}
        onClose={() => setOpenCustomerSheet(false)}
        onSuccess={handleCustomerSuccess}
      />

      {/* ================= POLICY UPSERT ================= */}
      <PolicyUpsertSheet
        open={openPolicySheet}
        customerId={selectedCustomer?.customerId}
        onClose={() => {
          setOpenPolicySheet(false);
          setSelectedCustomer(null);
        }}
        onSuccess={handlePolicySuccess}
      />
    </>
  );
};

export default Customers;