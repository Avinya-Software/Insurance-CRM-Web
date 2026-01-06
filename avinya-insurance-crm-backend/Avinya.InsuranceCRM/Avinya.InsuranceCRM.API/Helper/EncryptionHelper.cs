using System.Text;
using System.Security.Cryptography;

namespace Avinya.InsuranceCRM.API.Helper
{
    public static class EncryptionHelper
    {
        // ⚠️ Move these to appsettings / vault later
        private static readonly string Key = "12345678901234567890123456789012"; // 32 chars
        private static readonly string IV = "1234567890123456";                 // 16 chars

        public static string Encrypt(string plainText)
        {
            using var aes = Aes.Create();
            aes.Key = Encoding.UTF8.GetBytes(Key);
            aes.IV = Encoding.UTF8.GetBytes(IV);

            var encryptor = aes.CreateEncryptor();
            var bytes = Encoding.UTF8.GetBytes(plainText);

            return Convert.ToBase64String(
                encryptor.TransformFinalBlock(bytes, 0, bytes.Length)
            );
        }

        public static string Decrypt(string cipherText)
        {
            using var aes = Aes.Create();
            aes.Key = Encoding.UTF8.GetBytes(Key);
            aes.IV = Encoding.UTF8.GetBytes(IV);

            var decryptor = aes.CreateDecryptor();
            var bytes = Convert.FromBase64String(cipherText);

            return Encoding.UTF8.GetString(
                decryptor.TransformFinalBlock(bytes, 0, bytes.Length)
            );
        }
    }
}
