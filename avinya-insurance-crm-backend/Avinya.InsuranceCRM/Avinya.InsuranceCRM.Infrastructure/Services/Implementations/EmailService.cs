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

    public async Task SendRenewalExpiryReminderAsync(
    string toEmail,
    string policyNumber,
    DateTime renewalDate,
    decimal premium)
    {
        var subject = $"Policy Renewal Reminder – {policyNumber}";

        var body = $@"
        Dear Customer,

        This is a reminder that your insurance policy is due for renewal tomorrow.

        Policy Number: {policyNumber}
        Renewal Date: {renewalDate:dd-MMM-yyyy}
        Renewal Premium: ₹{premium:N2}

        Please renew your policy before the due date to ensure uninterrupted coverage.

        Regards,
        Avinya Insurance Team
        ";

        await SendEmailAsync(toEmail, subject, body);
    }
    // =====================================================
    // POLICY PAYMENT – CUSTOMER REMINDER (T-1)
    // =====================================================
    public async Task SendPolicyPaymentReminderToCustomerAsync(
        string customerEmail,
        string policyNumber,
        DateTime dueDate,
        decimal premium)
    {
        if (string.IsNullOrWhiteSpace(customerEmail))
            return;

        var subject = $"Payment Reminder – Policy {policyNumber}";

        var body = $@"
Hello,

This is a reminder that the premium payment for your policy is due tomorrow.

Policy Number : {policyNumber}
Payment Due   : {dueDate:dd MMM yyyy}
Amount        : ₹{premium:N2}

Please complete the payment before the due date to avoid policy lapse.

Regards,
Avinya Insurance CRM
";

        await SendEmailAsync(customerEmail, subject, body);
    }


    // =====================================================
    // POLICY PAYMENT – ADVISOR REMINDER (T-1)
    // =====================================================
    public async Task SendPolicyPaymentReminderToAdvisorAsync(
        string advisorEmail,
        string policyNumber,
        string customerName,
        DateTime dueDate,
        decimal premium)
    {
        if (string.IsNullOrWhiteSpace(advisorEmail))
            return;

        var subject = $"Customer Payment Due – Policy {policyNumber}";

        var body = $@"
            Hello,

            The following customer has a policy payment due tomorrow.

            Customer Name : {customerName}
            Policy Number : {policyNumber}
            Payment Due   : {dueDate:dd MMM yyyy}
            Amount        : ₹{premium:N2}

            Please follow up with the customer to ensure timely payment.

            Regards,
            Avinya Insurance CRM
            ";

        await SendEmailAsync(advisorEmail, subject, body);
    }


    // =====================================================
    // POLICY CANCELLATION – CUSTOMER WARNING (T)
    // =====================================================
    public async Task SendPolicyCancellationWarningToCustomerAsync(
        string customerEmail,
        string policyNumber,
        DateTime dueDate,
        decimal premium)
    {
        if (string.IsNullOrWhiteSpace(customerEmail))
            return;

        var subject = $"URGENT: Policy Payment Due Today – {policyNumber}";

        var body = $@"
            Hello,

            Your policy payment is due TODAY.

            Policy Number : {policyNumber}
            Due Date      : {dueDate:dd MMM yyyy}
            Amount        : ₹{premium:N2}

            Failure to pay today will result in policy lapse.

            Please make the payment immediately.

            Regards,
            Avinya Insurance CRM
            ";

        await SendEmailAsync(customerEmail, subject, body);
    }


    // =====================================================
    // POLICY CANCELLATION – ADVISOR WARNING (T)
    // =====================================================
    public async Task SendPolicyCancellationWarningToAdvisorAsync(
        string advisorEmail,
        string policyNumber,
        string customerName,
        DateTime dueDate,
        decimal premium)
    {
        if (string.IsNullOrWhiteSpace(advisorEmail))
            return;

        var subject = $"URGENT: Policy Lapse Risk – {policyNumber}";

        var body = $@"
            Hello,

            The following policy is at risk of lapse TODAY due to non-payment.

            Customer Name : {customerName}
            Policy Number : {policyNumber}
            Due Date      : {dueDate:dd MMM yyyy}
            Amount        : ₹{premium:N2}

            Immediate action is recommended.

            Regards,
            Avinya Insurance CRM
            ";

        await SendEmailAsync(advisorEmail, subject, body);
    }
    public async Task SendRenewalReminderToAdvisorAsync(
    string advisorEmail,
    string customerName,
    string policyNumber,
    DateTime renewalDate,
    int daysBefore,
    decimal premium)
    {
        if (string.IsNullOrWhiteSpace(advisorEmail))
            return;

        var subject = $"Renewal Reminder – {daysBefore} days left | Policy {policyNumber}";

        var body = $@"
Hello Advisor,

This is a reminder that a customer's policy is due for renewal.

Customer Name: {customerName}
Policy Number: {policyNumber}
Renewal Date: {renewalDate:dd MMM yyyy}
Premium Amount: ₹{premium:N2}
Days Remaining: {daysBefore}

Please follow up with the customer to ensure timely renewal.

Regards,
Avinya Insurance CRM
";

        await SendEmailAsync(advisorEmail, subject, body);
    }

}
