using Avinya.InsuranceCRM.Application.Interfaces.Customer;
using Avinya.InsuranceCRM.Application.RepositoryInterface;
using Avinya.InsuranceCRM.Application.RequestModels;
using Microsoft.AspNetCore.Mvc;
using VaraPrints.Application.Models;

namespace Avinya.InsuranceCRM.Application.Services.Customer
{
    public class CustomerServices : ICustomerServices
    {
        private readonly ICustomerRepository _repo;

        public CustomerServices(ICustomerRepository repo)
        {
            _repo = repo;
        }

        public async Task<ResponseModel> CreateOrUpdateAsync(
            string advisorId,
            Guid? companyId,
            CreateCustomerRequest request)
        {
            if (string.IsNullOrEmpty(advisorId))
                return new ResponseModel(401, "Invalid advisor token");

            if (!companyId.HasValue)
                return new ResponseModel(401, "Invalid CompanyId in token");

            var (customer, isUpdate) =
                await _repo.CreateOrUpdateAsync(advisorId, companyId.Value, request);

            return new ResponseModel(
                200,
                isUpdate ? "Customer updated successfully" : "Customer created successfully",
                new
                {
                    customer.CustomerId,
                    customer.FullName,
                    customer.PrimaryMobile,
                    customer.Email,
                    customer.KYCFiles
                });
        }

        public async Task<ResponseModel> GetPagedAsync(
            string advisorId,
            string role,
            Guid? companyId,
            int pageNumber,
            int pageSize,
            string? search)
        {
            var (data, totalCount) =
                await _repo.GetPagedAsync(advisorId, role,companyId, pageNumber, pageSize, search);

            return new ResponseModel(200, "Customers fetched successfully", new
            {
                TotalCount = totalCount,
                Page = pageNumber,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                Data = data
            });
        }

        public async Task<ResponseModel> DeleteAsync(string advisorId, Guid customerId)
            => await _repo.DeleteAsync(advisorId, customerId)
                ? new ResponseModel(200, "Customer deleted successfully")
                : new ResponseModel(404, "Customer not found");

        public async Task<ResponseModel> GetDropdownAsync(string advisorId)
            => new ResponseModel(200, "Fetched successfully",
                await _repo.GetDropdownAsync(advisorId));

        public async Task<ResponseModel> DeleteKycAsync(
            string advisorId,
            Guid customerId,
            string documentId)
            => await _repo.DeleteKycFileAsync(advisorId, customerId, documentId)
                ? new ResponseModel(200, "KYC document deleted successfully")
                : new ResponseModel(404, "Document not found");

        public async Task<ResponseModel> PreviewKyc(Guid customerId, string documentId)
        {
            var file = _repo.GetKycFilePath(customerId, documentId);

            if (file == null)
                return new ResponseModel(404, "KYC document not found", null);

            return new ResponseModel(200, "KYC Document", file);
        }

        public async Task<ResponseModel> DownloadKyc(Guid customerId, string documentId)
        {
            var file = _repo.GetKycFilePath(customerId, documentId);

            if (file == null)
                return new ResponseModel(404, "KYC document not found", null);

            return new ResponseModel(200, "KYC Document", file);
        }
    }
}
