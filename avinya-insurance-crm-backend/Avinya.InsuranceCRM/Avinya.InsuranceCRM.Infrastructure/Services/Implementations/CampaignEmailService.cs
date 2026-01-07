using Avinya.InsuranceCRM.Infrastructure.Email;
using Avinya.InsuranceCRM.Infrastructure.Services.Interfaces;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;

public class CampaignEmailService : ICampaignEmailService
{
    private readonly SmtpSettings _smtp;

    public CampaignEmailService(IOptions<SmtpSettings> smtpOptions)
    {
        _smtp = smtpOptions.Value;
    }

    public async Task SendAsync(
     string toEmail,
     string subject,
     string body)
    {
        // 🛑 ABSOLUTE GUARD (prevents this exception forever)
        if (string.IsNullOrWhiteSpace(toEmail))
            return;

        if (string.IsNullOrWhiteSpace(_smtp.FromEmail))
            throw new InvalidOperationException("SMTP FromEmail is not configured");

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

        mail.To.Add(toEmail.Trim());

        await client.SendMailAsync(mail);
    }

}
