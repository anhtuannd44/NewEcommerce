using System.Globalization;

namespace ECommerce.Common.CrossCuttingConcerns.Extensions;

public static class DecimalExtensions
{
    public static decimal RemoveTrailingZeros(this decimal d)
    {
        return d / 1.0000000000000000000000000000M;
    }

    public static decimal? ZeroIfNull(this decimal? d)
    {
        return d ?? 0;
    }

    public static string AddCommaThousandSeparator(this decimal d)
    {
        return d.ToString("#,##0.00");
    }

    public static string AddCommaThousandSeparatorWithBracket(this decimal d)
    {
        return d < 0 ? $"({d.AddCommaThousandSeparator()})" : d.AddCommaThousandSeparator();
    }

    public static string AddCommaThousandSeparator(this decimal? d)
    {
        return d.HasValue ? d.Value.AddCommaThousandSeparator() : string.Empty;
    }

    public static string AddPointThousandSeparator(this decimal? d)
    {
        return d.HasValue ? d.Value.AddPointThousandSeparator() : string.Empty;
    }

    public static string AddPointThousandSeparator(this decimal d)
    {
        return string.Format(CultureInfo.GetCultureInfo("es-es"), "{0:#,##0.00}", d);
    }
}