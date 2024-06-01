using System.Globalization;
using System.IO.Compression;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;

namespace ECommerce.Common.CrossCuttingConcerns.Extensions;

public static class StringExtensions
{
    /// <summary>Check whether current string is contains TEXT only.</summary>
    /// <param name="inputString">input string</param>
    /// <returns>TRUE if source contains only Alphabet (a-z, A-Z).Else return FALSE</returns>
    public static bool IsAlphabets(this string inputString)
    {
        if (string.IsNullOrEmpty(inputString))
        {
            return false;
        }

        var r = new Regex("^[a-zA-Z ]+$");
        return r.IsMatch(inputString);
    }

    /// <summary>Check whether current string is contains NUMBER only.</summary>
    /// <param name="inputString">input string</param>
    /// <returns>TRUE if source contains only Number (0-9).Else return FALSE</returns>
    public static bool IsNumbers(this string inputString)
    {
        if (string.IsNullOrWhiteSpace(inputString))
        {
            return false;
        }

        var r = new Regex("^[0-9]*$");
        return r.IsMatch(inputString);
    }

    /// <summary>Check whether current string is contains NUMBER only.</summary>
    /// <param name="inputString">input string</param>
    /// <returns>TRUE if source contains only Number (0-9) and spaces. Else return FALSE</returns>
    public static bool IsNumberWithSpaces(this string inputString)
    {
        if (string.IsNullOrEmpty(inputString))
        {
            return false;
        }

        var r = new Regex("^[0-9 ]*$");
        return r.IsMatch(inputString);
    }

    public static bool IsPhoneNumber(this string inputString)
    {
        if (string.IsNullOrEmpty(inputString))
        {
            return false;
        }

        var r = new Regex("^[+(0-9) -]*$");
        return r.IsMatch(inputString);
    }

    /// <summary>Check whether current string is contains TEXT and NUMBER only.</summary>
    /// <param name="inputString">input string</param>
    /// <returns>
    /// TRUE if source contains only Text (a-z or A-Z) Number (0-9).Else return FALSE
    /// </returns>
    public static bool IsAlphabetOrDigit(this string inputString)
    {
        if (string.IsNullOrEmpty(inputString))
        {
            return false;
        }

        var r = new Regex("^[a-zA-Z0-9 ]*$");
        return r.IsMatch(inputString);
    }

    /// <summary>Remove all redundant white spaces in the string and Trim.</summary>
    /// <param name="str">' this is example '</param>
    /// <returns>'this is example'</returns>
    public static string TrimAndReduce(this string str)
    {
        return ConvertWhitespacesToSingleSpaces(str).Trim();
    }

    /// <summary>Remove all redundant white spaces in the string.</summary>
    /// <param name="value">' this is example '</param>
    /// <returns>' this is example '</returns>
    public static string ConvertWhitespacesToSingleSpaces(this string value)
    {
        return Regex.Replace(value, @"\s+", " ");
    }

    public static bool IsDateTime(this string text)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            return false;
        }

        string[] formats = { "yyyy-MM-dd", "yyyy/MM/dd", "yyyyMMdd", "yyyy-dd-MM", "dd/MM/yyyy", "dd-MM-yyyy", "ddMMyyyy", "dd-MMM-yyyy" };

        DateTime result;
        var isDatetime = true;
        isDatetime = DateTime.TryParseExact(text, formats, CultureInfo.InvariantCulture, DateTimeStyles.None, out result);

        // Try parse from Long value
        if (!isDatetime)
        {
            long oleDate;
            if (long.TryParse(text, out oleDate))
            {
                try
                {
                    var parsedate = DateTime.FromOADate(oleDate);
                    isDatetime = true;
                }
                catch (ArgumentException)
                {
                }
            }
        }

        return isDatetime;
    }

    public static bool IsNumberic(this string text)
    {
        decimal outDecimal = 0;
        return decimal.TryParse(text, NumberStyles.Any, new CultureInfo("en-US"), out outDecimal);
    }

    public static bool IsEmail(this string text)
    {
        try
        {
            var m = new MailAddress(text);

            return true;
        }
        catch (FormatException)
        {
            return false;
        }
    }

    public static string ToCurrency(this string stringNumber)
    {
        if (string.IsNullOrEmpty(stringNumber))
        {
            return string.Empty;
        }

        return string.Format("{0:n2}", decimal.Parse(stringNumber));
    }

    public static string ToCurrencyDecimal4(this string stringNumber)
    {
        if (string.IsNullOrEmpty(stringNumber))
        {
            return string.Empty;
        }

        return string.Format("{0:n4}", decimal.Parse(stringNumber));
    }

    public static string ReplaceFirstOccurrence(this string source, string find, string replace)
    {
        var place = source.IndexOf(find);
        if (place == -1)
        {
            return source;
        }

        var result = source.Remove(place, find.Length).Insert(place, replace);
        return result;
    }

    public static string ReplaceLastOccurrence(this string source, string find, string replace)
    {
        var place = source.LastIndexOf(find);
        if (place == -1)
        {
            return source;
        }

        var result = source.Remove(place, find.Length).Insert(place, replace);
        return result;
    }

    public static IEnumerable<string> SplitByComma(this string commaSeparatedValue)
    {
        return (commaSeparatedValue ?? string.Empty).Split(',');
    }

    public static bool Contains(this string source, string toCheck, StringComparison comp)
    {
        return source != null && toCheck != null && source.IndexOf(toCheck, comp) >= 0;
    }

    public static string Divide100(this string valueString)
    {
        if (!string.IsNullOrEmpty(valueString))
        {
            try
            {
                var valueNumber = decimal.Parse(valueString);
                return (valueNumber / 100).ToString();
            }
            catch
            {
                return valueString;
            }
        }

        return string.Empty;
    }

    public static string Multiple100(this string valueString)
    {
        if (!string.IsNullOrEmpty(valueString))
        {
            try
            {
                var valueNumber = decimal.Parse(valueString);
                return (valueNumber * 100).ToString("n4").Replace(",", string.Empty);
            }
            catch
            {
                return valueString;
            }
        }

        return string.Empty;
    }

    public static string RemoveDiacritics(this string text)
    {
        if (string.IsNullOrEmpty(text))
        {
            return text;
        }

        var normalizedString = text.Normalize(NormalizationForm.FormD);
        var stringBuilder = new StringBuilder();

        foreach (var c in normalizedString)
        {
            var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
            if (unicodeCategory != UnicodeCategory.NonSpacingMark)
            {
                stringBuilder.Append(c);
            }
        }

        return stringBuilder.ToString().Normalize(NormalizationForm.FormKD);
    }

    public static string RemoveSpecialCharacters(this string text)
    {
        if (string.IsNullOrEmpty(text))
        {
            return text;
        }

        var result = Regex.Replace(text, @"[(!@#$%^&*~`){}[\]|\\<,>.?/\-=_+:';""""]", string.Empty);
        result = Regex.Replace(result, @"\s{2,}", " ");

        return result.Trim();
    }

    public static bool EqualIgnoreCase(this string source, string toCheck)
    {
        return string.Equals(source, toCheck, StringComparison.OrdinalIgnoreCase);
    }

    public static bool EqualIgnoreCaseAndWhiteSpace(this string source, string toCheck)
    {
        source = source != null ? source.Trim() : source;
        toCheck = toCheck != null ? toCheck.Trim() : toCheck;
        return string.Equals(source, toCheck, StringComparison.OrdinalIgnoreCase);
    }

    public static decimal? StringToDecimal(this string number)
    {
        if (string.IsNullOrEmpty(number))
        {
            return null;
        }

        decimal value;
        if (decimal.TryParse(number, out value))
        {
            return value;
        }

        return null;
    }

    public static string Round(this string decimalString, int decimalPlaces)
    {
        if (string.IsNullOrEmpty(decimalString))
        {
            return decimalString;
        }

        return Math.Round(decimal.Parse(decimalString), decimalPlaces, MidpointRounding.AwayFromZero).ToString();
    }

    public static string Left(this string value, int maxLength)
    {
        if (string.IsNullOrEmpty(value))
        {
            return value;
        }

        maxLength = Math.Abs(maxLength);

        return value.Length <= maxLength
            ? value
            : value.Substring(0, maxLength);
    }

    public static string Right(this string value, int maxLength)
    {
        if (string.IsNullOrEmpty(value))
        {
            return value;
        }

        maxLength = Math.Abs(maxLength);

        return value.Length < maxLength
            ? value
            : value.Substring(value.Length - maxLength);
    }

    public static string Divide100WithoutTrailingZero(this string valueString)
    {
        if (!string.IsNullOrEmpty(valueString))
        {
            try
            {
                var valueNumber = decimal.Parse(valueString).RemoveTrailingZeros();
                return (valueNumber / 100).ToString(CultureInfo.InvariantCulture);
            }
            catch
            {
                return valueString;
            }
        }

        return string.Empty;
    }

    public static string GenerateSaltedHash(this string plainText, string saltText)
    {
        HashAlgorithm algorithm = SHA256.Create();
        var saltBytes = Encoding.UTF8.GetBytes(saltText);
        var plainBytes = Encoding.UTF8.GetBytes(plainText);
        var plainTextWithSaltBytes = new byte[plainBytes.Length + saltBytes.Length];

        for (var i = 0;i < plainText.Length;i++)
        {
            plainTextWithSaltBytes[i] = plainBytes[i];
        }

        for (var i = 0;i < saltBytes.Length;i++)
        {
            plainTextWithSaltBytes[plainText.Length + i] = saltBytes[i];
        }

        var result = Convert.ToBase64String(algorithm.ComputeHash(plainTextWithSaltBytes));

        return result;
    }

    public static string TrimBackSlashOfFileName(this string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        value = value.Trim().Replace("%20", " ");

        if (value.StartsWith("\"") && value.EndsWith("\""))
        {
            value = value.Trim('"');
        }

        if (value.Contains(@"/") || value.Contains(@"\"))
        {
            value = Path.GetFileName(value);
        }

        return value;
    }

    public static byte[] Compress(this string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        var inputBytes = Encoding.UTF8.GetBytes(value);

        using (var outputStream = new MemoryStream())
        {
            using (var gZipStream = new GZipStream(outputStream, CompressionMode.Compress))
            {
                gZipStream.Write(inputBytes, 0, inputBytes.Length);
            }

            var outputBytes = outputStream.ToArray();

            return outputBytes;
        }
    }

    public static string Decompress(this byte[] value)
    {
        if (value == null)
        {
            return string.Empty;
        }

        using (var inputStream = new MemoryStream(value))
        using (var gZipStream = new GZipStream(inputStream, CompressionMode.Decompress))
        using (var streamReader = new StreamReader(gZipStream))
        {
            return streamReader.ReadToEnd();
        }
    }

    public static string CompressToBase64(this string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return string.Empty;
        }

        var inputBytes = Encoding.UTF8.GetBytes(value);

        using (var outputStream = new MemoryStream())
        {
            using (var gZipStream = new GZipStream(outputStream, CompressionMode.Compress))
            {
                gZipStream.Write(inputBytes, 0, inputBytes.Length);
            }

            var outputBytes = outputStream.ToArray();

            return Convert.ToBase64String(outputBytes);
        }
    }

    public static string DecompressFromBase64(this string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return string.Empty;
        }

        var inputBytes = Convert.FromBase64String(value);

        using var inputStream = new MemoryStream(inputBytes);
        using var gZipStream = new GZipStream(inputStream, CompressionMode.Decompress);
        using var streamReader = new StreamReader(gZipStream);
        return streamReader.ReadToEnd();
    }

    public static string Serialize<TObject>(this TObject value, JsonSerializerOptions format)
    {
        if (value == null)
        {
            return string.Empty;
        }

        return JsonSerializer.Serialize(value, format);
    }

    public static TObject Deserialize<TObject>(this string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return default(TObject);
        }

        return JsonSerializer.Deserialize<TObject>(value);
    }

    public static string SerializeAndCompressToBase64<TObject>(this TObject value, JsonSerializerOptions format = null)
    {
        if (format == null)
        {
            format = new JsonSerializerOptions { DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull };
        }

        if (value == null)
        {
            return string.Empty;
        }

        format.WriteIndented = true;

        var valueStr = JsonSerializer.Serialize(value, format);

        var inputBytes = Encoding.UTF8.GetBytes(valueStr);

        using (var outputStream = new MemoryStream())
        {
            using (var gZipStream = new GZipStream(outputStream, CompressionMode.Compress))
            {
                gZipStream.Write(inputBytes, 0, inputBytes.Length);
            }

            var outputBytes = outputStream.ToArray();

            return Convert.ToBase64String(outputBytes);
        }
    }

    public static TObject DecompressFromBase64AndDeserialize<TObject>(this string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return default(TObject);
        }

        var inputBytes = Convert.FromBase64String(value);

        using (var inputStream = new MemoryStream(inputBytes))
        using (var gZipStream = new GZipStream(inputStream, CompressionMode.Decompress))
        using (var streamReader = new StreamReader(gZipStream))
        {
            return JsonSerializer.Deserialize<TObject>(streamReader.ReadToEnd());
        }
    }

    public static bool In(this string str, List<string> list)
    {
        return list.Contains(str, StringComparer.OrdinalIgnoreCase);
    }

    public static bool NotIn(this string str, List<string> list)
    {
        return !In(str, list);
    }

    public static string ToTitleCase(this string str)
    {
        if (string.IsNullOrWhiteSpace(str))
        {
            return string.Empty;
        }

        return System.Threading.Thread.CurrentThread.CurrentCulture.TextInfo.ToTitleCase(str.ToLower());
    }

    public static bool IsLiteralOrNegativeAmount(this string amount)
    {
        if (string.IsNullOrEmpty(amount))
        {
            return false;
        }
        else
        {
            try
            {
                return decimal.Parse(amount) < 0 ? true : false;
            }
            catch
            {
                return true;
            }
        }
    }

    public static Guid? ToGuid(this string str)
    {
        Guid guid;
        return Guid.TryParse(str, out guid) ? (Guid?)guid : null;
    }

    public static string Replicate(this char value, int count)
    {
        return string.Empty.PadRight(count, value);
    }

    public static int? StringToInt(this string number)
    {
        if (string.IsNullOrEmpty(number))
        {
            return null;
        }

        int value;
        if (int.TryParse(number, out value))
        {
            return value;
        }

        return null;
    }

    public static bool? StringToBool(this string text)
    {
        if (string.IsNullOrEmpty(text))
        {
            return null;
        }

        bool value;
        if (bool.TryParse(text, out value))
        {
            return value;
        }

        return null;
    }

    public static string TextFileAlphanumericFormat(this string value, int length, char pad)
    {
        value = string.IsNullOrEmpty(value) ? string.Empty : value.Length < length ? value : value.Substring(0, length);
        return value.PadRight(length, pad).ToUpper();
    }

    public static string TextFileNumericFormat(this string value, int length, char pad)
    {
        if (string.IsNullOrEmpty(value))
        {
            return string.Empty.PadLeft(length, pad);
        }

        value = Regex.Replace(value, @"[%,. ]", string.Empty);
        value = value.Length < length ? value : value.Substring(0, length);
        return value.PadLeft(length, pad);
    }

    public static decimal? ZeroIfEmpty(this string value)
    {
        return value == string.Empty ? 0 : value.StringToDecimal().ZeroIfNull();
    }

    public static string TrimBackslash(this string value)
    {
        value = value.Trim().Replace("%20", " ");

        if (value.StartsWith("\"") && value.EndsWith("\""))
        {
            value = value.Trim('"');
        }

        if (value.Contains(@"/") || value.Contains(@"\"))
        {
            value = Path.GetFileName(value);
        }

        return value;
    }

    public static bool IsValidJson(this string inputString)
    {
        if (string.IsNullOrWhiteSpace(inputString))
        {
            return false;
        }

        inputString = inputString.Trim();
        return (inputString.StartsWith("{") && inputString.EndsWith("}")) || (inputString.StartsWith("[") && inputString.EndsWith("]"));
    }

    public static bool ContainIgnoreCase(this string source, string toCheck)
    {
        return source?.IndexOf(toCheck, StringComparison.OrdinalIgnoreCase) >= 0;
    }

    public static string RemoveMultipleSpaces(this string value)
    {
        return Regex.Replace(value, @"\s+", " ");
    }

    public static ParseResultDto FormatDecimalNumber(this string decimalString, int roundNumber)
    {
        var parseResult = new ParseResultDto();
        var cultureInfo = GetCultureInfo();
        decimalString = decimalString.TryToFormatToDecimalNumber(roundNumber, cultureInfo);

        var stringToDecimalResult = decimalString.StringToDecimal();
        parseResult.IsParseFail = !stringToDecimalResult.HasValue;
        parseResult.StringValue = decimalString;
        parseResult.Value = stringToDecimalResult;

        return parseResult;
    }

    public static ParseResultDto FormatPercentageToDecimalNumber(this string percentageString, int roundNumber)
    {
        var parseResult = new ParseResultDto();
        var cultureInfo = GetCultureInfo();
        percentageString = percentageString.Replace("%", string.Empty);
        percentageString = percentageString.TryToFormatToDecimalNumber(roundNumber, cultureInfo);
        var stringToDecimalResult = percentageString.StringToDecimal();
        parseResult.IsParseFail = !stringToDecimalResult.HasValue;
        parseResult.StringValue = percentageString;
        parseResult.Value = stringToDecimalResult;

        return parseResult;
    }

    public static string TryToFormatToDecimalNumber(this string decimalString, int roundNumber, CultureInfo cultureInfo)
    {
        var style = NumberStyles.AllowDecimalPoint
                    | NumberStyles.AllowLeadingSign
                    | NumberStyles.AllowThousands
                    | NumberStyles.AllowExponent;

        if (!string.IsNullOrEmpty(decimalString))
        {
            decimalString = decimalString.Replace(" ", string.Empty);
            decimal decimalNumber;

            if (decimal.TryParse(decimalString, style, cultureInfo, out decimalNumber))
            {
                decimalString = decimal.Round(decimalNumber, roundNumber, MidpointRounding.AwayFromZero).ToString($"N{roundNumber}");
            }
        }

        return decimalString;
    }

    public static string ToDateTimeStringFormat(
        this string dateTime,
        string[] acceptFormats,
        string expectedFormat)
    {
        DateTime parsedDateTime;

        if (DateTime.TryParseExact(dateTime,
                acceptFormats,
                CultureInfo.InvariantCulture,
                DateTimeStyles.None,
                out parsedDateTime))
        {
            return parsedDateTime.ToString(expectedFormat);
        }

        return dateTime;
    }

    public static string ToDateTimeStringFormat(
        this string dateTime,
        string acceptFormat,
        string expectedFormat)
    {
        return dateTime.ToDateTimeStringFormat(new[] { acceptFormat }, expectedFormat);
    }

    public static string ToDateTimeStringFormat(this string dateTime, string expectedFormat)
    {
        DateTime parsedDateTime;

        if (DateTime.TryParse(dateTime, out parsedDateTime))
        {
            return parsedDateTime.ToString(expectedFormat);
        }

        return dateTime;
    }

    public static DateTime? ToDateTime(
        this string dateTime,
        string[] acceptFormats)
    {
        DateTime parsedDateTime;

        if (DateTime.TryParseExact(dateTime,
                acceptFormats,
                CultureInfo.InvariantCulture,
                DateTimeStyles.None,
                out parsedDateTime))
        {
            return parsedDateTime;
        }

        return null;
    }

    private static CultureInfo GetCultureInfo() => CultureInfo.CreateSpecificCulture("en-GB");
    public static T ToEnum<T>(this string value, T defaultValue)
    {
        if (!value.HasValue())
        {
            return defaultValue;
        }

        try
        {
            return (T)Enum.Parse(typeof(T), value, true);
        }
        catch (ArgumentException)
        {
            return defaultValue;
        }
    }
    public static bool HasValue(this string value)
    {
        return !string.IsNullOrEmpty(value);
    }
}

public class ParseResultDto
{
    public string StringValue { get; set; }

    public bool IsParseFail { get; set; }

    public decimal? Value { get; set; }
}