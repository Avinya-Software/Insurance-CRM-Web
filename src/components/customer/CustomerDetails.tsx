import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  CustomerDetailsProps,
  KycFile,
  CustomerDetails as CustomerDetailsType,
  CustomerDetailsResponse,
} from "../../interfaces/customer.interface";
import { Download, Eye, X } from "lucide-react";
import { useKycFileActions } from "../../hooks/customer/useKycFileActions";

const kycStatusStyles: Record<string, string> = {
  Pending: "bg-slate-100 text-slate-700 border-slate-200",
  "Under Review": "bg-amber-100 text-amber-700 border-amber-200",
  Verified: "bg-green-100 text-green-700 border-green-200",
  Rejected: "bg-red-100 text-red-700 border-red-200",
};

export const CustomerDetails: React.FC<CustomerDetailsProps> = ({
  customerId,
  onClose,
}) => {
  const [customer, setCustomer] = useState<CustomerDetailsType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { preview , download } = useKycFileActions();

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<CustomerDetailsResponse>(
          `/Customer/${customerId}`
        );
        setCustomer(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch customer details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomerDetails();
  }, [customerId]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
        <div className="bg-white p-4 rounded shadow w-96 text-center">
          Loading...
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
        <div className="bg-white p-4 rounded shadow w-96 text-center">
          <p>{error || "Customer not found."}</p>
          <button
            className="mt-3 px-3 py-1 bg-blue-600 text-white rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div className="bg-white w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-lg shadow-lg relative" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <h2 className="text-lg font-semibold mb-4">
          Customer Name : {customer.fullName}
        </h2>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <strong>Primary Mobile :</strong>{" "}
            {customer.primaryMobile || "N/A"}
          </div>
          <div>
            <strong>Secondary Mobile :</strong>{" "}
            {customer.secondaryMobile || "N/A"}
          </div>
          <div>
            <strong>Email :</strong> {customer.email || "N/A"}
          </div>
          <div>
            <strong>Date of Birth :</strong>{" "}
            {customer.dob
              ? new Date(customer.dob).toLocaleDateString()
              : "N/A"}
          </div>
          <div>
            <strong>Anniversary :</strong>{" "}
            {customer.anniversary
              ? new Date(customer.anniversary).toLocaleDateString()
              : "N/A"}
          </div>
          <div>
            <strong>KYC Uploaded Date :</strong>{" "}
            {customer.kycUploadedDate
              ? new Date(customer.kycUploadedDate).toLocaleString()
              : "N/A"}
          </div>
          <div>
            <strong>KYC Status :</strong>{" "}
            <span
              className={`px-2 py-1 text-xs rounded-full border ${
                kycStatusStyles[customer.kycStatus] ||
                "bg-gray-100 text-gray-700 border-gray-200"
              }`}
            >
              {customer.kycStatus || "N/A"}
            </span>
          </div>
          <div>
            <strong>Created At :</strong>{" "}
            {customer.createdAt
              ? new Date(customer.createdAt).toLocaleString()
              : "N/A"}
          </div>
          <div>
            <strong>Updated At :</strong>{" "}
            {customer.updatedAt
              ? new Date(customer.updatedAt).toLocaleString()
              : "N/A"}
          </div>
        </div>

        {/* Address */}
        <div className="mt-4">
          <strong>Address :</strong>
          <p className="mt-1 bg-gray-50 rounded-md p-2 text-sm">
            {customer.address || "N/A"}
          </p>
        </div>

        {/* Notes */}
        <div className="mt-4">
          <strong>Notes :</strong>
          <p className="mt-1 bg-gray-50 rounded-md p-2 text-sm">
            {customer.notes || "N/A"}
          </p>
        </div>

        {/* KYC Files */}
        <div className="mt-4">
        <strong>KYC Files :</strong>

        <ul className="mt-2 space-y-2">
            {customer.kycFiles && customer.kycFiles.length > 0 ? (
            customer.kycFiles.map((file: KycFile) => (
                <li
                key={file.fileName}
                className="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                <span className="text-sm truncate max-w-[60%]">
                    {file.fileName}
                </span>

                <div className="flex items-center gap-2">
                    <button
                    onClick={() => preview(file.url)}
                    className="p-2 hover:bg-gray-200 rounded transition"
                    title="Preview"
                    >
                    <Eye size={16} />
                    </button>

                    <button
                    onClick={() => download(file.url, file.fileName)}
                    className="p-2 hover:bg-gray-200 rounded transition"
                    title="Download"
                    >
                    <Download size={16} />
                    </button>
                </div>
                </li>
            ))
            ) : (
            <li className="text-sm text-gray-500">
                No files uploaded
            </li>
            )}
        </ul>
        </div>

      </div>
    </div>
  );
};
