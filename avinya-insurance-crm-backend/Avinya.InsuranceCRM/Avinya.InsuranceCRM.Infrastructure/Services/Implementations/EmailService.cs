using Avinya.InsuranceCRM.Infrastructure.Email;
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

        mail.To.Add(customer.Email);

        await client.SendMailAsync(mail);
    }
}
