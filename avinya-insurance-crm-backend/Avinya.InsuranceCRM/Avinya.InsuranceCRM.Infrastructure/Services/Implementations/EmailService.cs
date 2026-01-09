using Avinya.InsuranceCRM.Infrastructure.Email;
using Avinya.InsuranceCRM.Infrastructure.Persistence;
using Avinya.InsuranceCRM.Infrastructure.Services.Interfaces;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;

public class EmailService : IEmailService
{
    private readonly AppDbContext _db;
    private readonly SmtpSettings _smtp;

    public EmailService(
        AppDbContext db,
        IOptions<SmtpSettings> smtpOptions)
    {
        _db = db;
        _smtp = smtpOptions.Value;
    }

    // =====================================================
    // RENEWAL REMINDER (EXISTING)
    // =====================================================
    public async Task SendRenewalReminderAsync(
        Guid customerId,
        Guid policyId,
        DateTime renewalDate,
        int daysBefore,
        decimal premium)
    {
        var customer = await _db.Customers.FindAsync(customerId);
        if (customer == null || string.IsNullOrEmpty(customer.Email))
            return;

        var subject = $"Policy Renewal Reminder – {daysBefore} days left";

        var body = $@"
Hello {customer.FullName},

Your insurance policy is due for renewal in {daysBefore} days.

Renewal Date: {renewalDate:dd MMM yyyy}
Premium Amount: ₹{premium}

Please contact your advisor to renew.

Regards,
Avinya Insurance CRM
";

        await SendEmailAsync(customer.Email, subject, body);
    }

    // =====================================================
    // ADVISOR APPROVAL EMAIL (NEW)
    // =====================================================
    public async Task SendAdvisorApprovalEmailAsync(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return;

        var subject = "Your Advisor Account Has Been Approved";

        var body = @"
Hello,

Good news! 🎉

Your advisor account has been approved by the administrator.
You can now log in and start using the Avinya Insurance CRM.

Login here:
https://uatinsurancecrm.avinyasoftware.com/login

Regards,
Avinya Insurance CRM Team
";

        await SendEmailAsync(email, subject, body);
    }

    // =====================================================
    // ADVISOR REJECTION EMAIL (NEW)
    // =====================================================
    public async Task SendAdvisorRejectionEmailAsync(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return;

        var subject = "Update on Your Advisor Registration";

        var body = @"
Hello,

Thank you for registering with Avinya Insurance CRM.

After review, your advisor registration was not approved at this time.
If you believe this was a mistake, please contact our support team.

Regards,
Avinya Insurance CRM Team
";

        await SendEmailAsync(email, subject, body);
    }

    // =====================================================
    // INTERNAL SMTP HELPER (REUSED)
    // =====================================================
    private async Task SendEmailAsync(
        string toEmail,
        string subject,
        string body)
    {
        using var client = new SmtpClient(_smtp.Host, _smtp.Port)
        {
            Credentials = new NetworkCredential(
                _smtp.Username,
                _smtp.Password),
            EnableSsl = true
        };

        var mail = new MailMessage
        {
            From = new MailAddress(
                _smtp.FromEmail,
                _smtp.FromName),
            Subject = subject,
            Body = body,
            IsBodyHtml = false
        };

        mail.To.Add(toEmail);

        await client.SendMailAsync(mail);
    }
}
