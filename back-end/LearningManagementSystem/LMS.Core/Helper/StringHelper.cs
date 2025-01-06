using System.Globalization;
using System.Text;

namespace LMS.Core.Helper
{
    public static class StringHelper
    {
        // This method removes Vietnamese diacritics (accents) from a string.
        public static string RemoveVietnameseDiacritics(string input)
        {
            // Normalize to decomposed form (NFD), where accents are separate from the characters.
            string normalizedString = input.Normalize(NormalizationForm.FormD);

            // Remove all non-spacing marks (accents, diacritics) using StringBuilder.
            StringBuilder stringBuilder = new StringBuilder();

            foreach (char c in normalizedString)
            {
                // Check if the character is not a non-spacing mark (accent).
                if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(c);
                }
            }

            // Return the string to composed form (NFC).
            return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
        }
    }
}
