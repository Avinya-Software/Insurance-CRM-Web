using Avinya.InsuranceCRM.API.Models;
using Avinya.InsuranceCRM.API.RequestModels;
using Avinya.InsuranceCRM.API.ResponseModels;
using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Avinya.InsuranceCRM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "ApprovedAdvisor")]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly ILeadRepository _leadRepository;
        private readonly ILogger<CustomerController> _logger;
        private readonly IWebHostEnvironment _env;

        public CustomerController(
            ICustomerRepository customerRepository,
            ILeadRepository leadRepository,
            ILogger<CustomerController> logger,
            IWebHostEnvironment env)
        {
            _customerRepository = customerRepository;
            _leadRepository = leadRepository;
            _logger = logger;
            _env = env;
        }

        // -------- CREATE OR UPDATE CUSTOMER --------
        [HttpPost]
        public async Task<IActionResult> CreateOrUpdateCustomer(
     [FromForm] CreateCustomerRequest request)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(advisorId))
            {
                return Unauthorized(ApiResponse<string>.Fail(401, "Invalid advisor token"));
            }

            Customer customer;

            /* ================= UPDATE ================= */
            if (request.CustomerId.HasValue)
            {
                customer = await _customerRepository.GetByIdAsync(
                    advisorId,
                    request.CustomerId.Value
                );

                if (customer == null)
                {
                    return NotFound(ApiResponse<string>.Fail(404, "Customer not found"));
                }

                if (!string.IsNullOrWhiteSpace(request.PrimaryMobile))
                {
                    var mobileExists =
                        await _customerRepository.ExistsByMobileAsync(
                            advisorId,
                            request.PrimaryMobile,
                            customer.CustomerId
                        );

                    if (mobileExists)
                    {
                        return BadRequest(ApiResponse<string>.Fail(400, "Mobile number already exists"));
                    }
                }

                if (!string.IsNullOrWhiteSpace(request.Email))
                {
                    var emailExists =
                        await _customerRepository.ExistsByEmailAsync(
                            advisorId,
                            request.Email,
                            customer.CustomerId
                        );

                    if (emailExists)
                    {
                        return BadRequest(ApiResponse<string>.Fail(400, "Email already exists"));
                    }
                }

                customer.FullName = request.FullName;
                customer.PrimaryMobile = request.PrimaryMobile;
                customer.SecondaryMobile = request.SecondaryMobile;
                customer.Email = request.Email;
                customer.Address = request.Address;
                customer.KYCStatus = request.KYCStatus;
                customer.DOB = request.DOB;
                customer.Anniversary = request.Anniversary;
                customer.Notes = request.Notes;
                customer.UpdatedAt = DateTime.UtcNow;

                await _customerRepository.UpdateAsync(customer);
            }
            /* ================= CREATE ================= */
            else
            {
                if (await _customerRepository.ExistsByMobileAsync(
                    advisorId,
                    request.PrimaryMobile))
                {
                    return BadRequest(ApiResponse<string>.Fail(400, "Mobile number already exists"));
                }

                if (!string.IsNullOrWhiteSpace(request.Email) &&
                    await _customerRepository.ExistsByEmailAsync(
                        advisorId,
                        request.Email))
                {
                    return BadRequest(ApiResponse<string>.Fail(400, "Email already exists"));
                }

                customer = new Customer
                {
                    CustomerId = Guid.NewGuid(),
                    FullName = request.FullName,
                    PrimaryMobile = request.PrimaryMobile,
                    SecondaryMobile = request.SecondaryMobile,
                    Email = request.Email,
                    Address = request.Address,
                    KYCStatus = request.KYCStatus,
                    DOB = request.DOB,
                    Anniversary = request.Anniversary,
                    Notes = request.Notes,
                    AdvisorId = advisorId,
                    LeadId = request.LeadId,
                    CreatedAt = DateTime.UtcNow
                };

                await _customerRepository.AddAsync(customer);

                if (request.LeadId.HasValue)
                {
                    var lead = await _leadRepository.GetByIdAsync(
                        advisorId,
                        request.LeadId.Value
                    );

                    if (lead != null && !lead.IsConverted)
                    {
                        lead.IsConverted = true;
                        lead.CustomerId = customer.CustomerId;
                        lead.LeadStatusId = 5; // Converted
                        lead.UpdatedAt = DateTime.UtcNow;

                        await _leadRepository.UpdateAsync(lead);
                    }
                }
            }

            /* ================= KYC FILE UPLOAD ================= */
            if (request.KycFiles != null && request.KycFiles.Any())
            {
                var uploadRoot = Path.Combine(
                    _env.ContentRootPath,
                    "Uploads",
                    "KYC",
                    customer.CustomerId.ToString()
                );

                Directory.CreateDirectory(uploadRoot);

                var savedFiles = new List<string>();

                foreach (var file in request.KycFiles)
                {
                    if (file.Length == 0) continue;

                    var fileName = $"{Guid.NewGuid()}_{file.FileName}";
                    var filePath = Path.Combine(uploadRoot, fileName);

                    using var stream = new FileStream(filePath, FileMode.Create);
                    await file.CopyToAsync(stream);

                    savedFiles.Add(fileName);
                }

                var existingFiles = string.IsNullOrWhiteSpace(customer.KYCFiles)
                    ? new List<string>()
                    : customer.KYCFiles.Split(",", StringSplitOptions.RemoveEmptyEntries).ToList();

                existingFiles.AddRange(savedFiles);

                customer.KYCFiles = string.Join(",", existingFiles);
                customer.KYCStatus = "Uploaded";
                customer.UpdatedAt = DateTime.UtcNow;

                await _customerRepository.UpdateAsync(customer);
            }

            return Ok(ApiResponse<object>.Success(
                new
                {
                    customer.CustomerId,
                    customer.FullName,
                    customer.PrimaryMobile,
                    customer.Email,
                    customer.KYCFiles
                },
                request.CustomerId.HasValue
                    ? "Customer updated successfully"
                    : "Customer created successfully"
            ));
        }


        /* ================= GET ALL ================= */

        [HttpGet]
        public async Task<IActionResult> GetAllCustomers(
    int pageNumber = 1,
    int pageSize = 10,
    string? search = null)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(advisorId))
            {
                return Unauthorized(ApiResponse<string>.Fail(401, "Invalid advisor token"));
            }

            var result = await _customerRepository.GetAllAsync(
                advisorId,
                pageNumber,
                pageSize,
                search
            );

            return Ok(ApiResponse<object>.Success(
                new
                {
                    result.TotalRecords,
                    result.PageNumber,
                    result.PageSize,
                    TotalPages = (int)Math.Ceiling(result.TotalRecords / (double)pageSize),
                    Customers = result.Data.Select(c => new
                    {
                        c.CustomerId,
                        c.FullName,
                        c.PrimaryMobile,
                        c.SecondaryMobile,
                        c.Email,
                        c.Address,
                        c.KYCFiles,
                        c.CreatedAt,
                        c.Anniversary,
                        c.DOB,
                        c.Notes
                    })
                },
                "Customers fetched successfully"
            ));
        }


        /* ================= KYC PREVIEW ================= */

        [HttpGet("{customerId:guid}/kyc/{documentId}/preview")]
        public IActionResult PreviewKyc(Guid customerId, string documentId)
        {
            var folder = Path.Combine(
                _env.ContentRootPath,
                "Uploads",
                "KYC",
                customerId.ToString()
            );

            if (!Directory.Exists(folder))
                return NotFound();

            var filePath = Directory.GetFiles(folder)
                .FirstOrDefault(f =>
                    Path.GetFileName(f).StartsWith(documentId + "_"));

            if (filePath == null)
                return NotFound();

            var contentType = GetContentType(filePath);

            return PhysicalFile(
                filePath,
                contentType,
                enableRangeProcessing: true // ✅ allows inline preview
            );
        }

        /* ================= KYC DOWNLOAD ================= */

        [HttpGet("{customerId:guid}/kyc/{documentId}/download")]
        public IActionResult DownloadKyc(Guid customerId, string documentId)
        {
            var folder = Path.Combine(
                _env.ContentRootPath,
                "Uploads",
                "KYC",
                customerId.ToString()
            );

            if (!Directory.Exists(folder))
                return NotFound();

            var filePath = Directory.GetFiles(folder)
                .FirstOrDefault(f =>
                    Path.GetFileName(f).StartsWith(documentId + "_"));

            if (filePath == null)
                return NotFound();

            var contentType = GetContentType(filePath);
            var fileName = Path.GetFileName(filePath);

            return PhysicalFile(
                filePath,
                contentType,
                fileName // forces download
            );
        }
        [HttpDelete("{customerId:guid}")]
        public async Task<IActionResult> DeleteCustomer(Guid customerId)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(advisorId))
            {
                return Unauthorized(ApiResponse<string>.Fail(401, "Invalid advisor token"));
            }

            var customer = await _customerRepository.GetByIdAsync(advisorId, customerId);

            if (customer == null)
            {
                return NotFound(ApiResponse<string>.Fail(404, "Customer not found"));
            }

            var kycFolder = Path.Combine(
                _env.ContentRootPath,
                "Uploads",
                "KYC",
                customer.CustomerId.ToString()
            );

            if (Directory.Exists(kycFolder))
            {
                Directory.Delete(kycFolder, recursive: true);
            }

            await _customerRepository.DeleteAsync(advisorId, customerId);

            return Ok(ApiResponse<string>.Success("Customer deleted successfully"));
        }

        /* ================= DELETE KYC FILE ================= */

        [HttpDelete("{customerId:guid}/kyc/{documentId}")]
        public async Task<IActionResult> DeleteKycFile(
     Guid customerId,
     string documentId)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(advisorId))
            {
                return Unauthorized(ApiResponse<string>.Fail(401, "Invalid advisor token"));
            }

            var customer = await _customerRepository.GetByIdAsync(advisorId, customerId);

            if (customer == null)
            {
                return NotFound(ApiResponse<string>.Fail(404, "Customer not found"));
            }

            if (string.IsNullOrWhiteSpace(customer.KYCFiles))
            {
                return BadRequest(ApiResponse<string>.Fail(400, "No KYC files found"));
            }

            var files = customer.KYCFiles
                .Split(",", StringSplitOptions.RemoveEmptyEntries)
                .ToList();

            var fileName = files.FirstOrDefault(f =>
                f.StartsWith(documentId + "_"));

            if (fileName == null)
            {
                return NotFound(ApiResponse<string>.Fail(404, "Document not found"));
            }

            var filePath = Path.Combine(
                _env.ContentRootPath,
                "Uploads",
                "KYC",
                customerId.ToString(),
                fileName
            );

            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }

            files.Remove(fileName);
            customer.KYCFiles = files.Any() ? string.Join(",", files) : null;
            customer.UpdatedAt = DateTime.UtcNow;

            await _customerRepository.UpdateAsync(customer);

            return Ok(ApiResponse<string>.Success("KYC document deleted successfully"));
        }




        /* ================= DROPDOWN ================= */
        [HttpGet("dropdown")]
        public async Task<IActionResult> GetCustomerDropdown()
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(advisorId))
            {
                return Unauthorized(ApiResponse<string>.Fail(401, "Invalid advisor token"));
            }

            var customers = await _customerRepository.GetDropdownAsync(advisorId);

            return Ok(customers.Select(c => new
            {
                c.CustomerId,
                c.FullName,
                c.Email,
                c.DOB,
                c.Anniversary,
                c.Address,
                c.PrimaryMobile
            }));
        }


        /* ================= HELPERS ================= */

        private static string GetContentType(string path)
        {
            var ext = Path.GetExtension(path).ToLowerInvariant();

            return ext switch
            {
                ".pdf" => "application/pdf",
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".txt" => "text/plain",
                _ => "application/octet-stream"
            };
        }
    }
}
