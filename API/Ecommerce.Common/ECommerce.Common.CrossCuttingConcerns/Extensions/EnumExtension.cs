using System.ComponentModel;

namespace ECommerce.Common.CrossCuttingConcerns.Extensions;

public static class EnumExtension
{
    /// <summary>
    /// Retrieve the description on the enum, e.g.
    /// [Description("Bright Pink")]
    /// BrightPink = 2,
    /// Then when you pass in the enum, it will retrieve the description
    /// </summary>
    /// <param name="en">The Enumeration</param>
    /// <returns>A string representing the friendly name</returns>
    public static string GetDescription(this Enum en)
    {
        var type = en.GetType();

        var memInfo = type.GetMember(en.ToString());

        if (memInfo.Length <= 0) return en.ToString();
        var attrs = memInfo[0].GetCustomAttributes(typeof(DescriptionAttribute), false);

        return attrs.Length > 0 ? ((DescriptionAttribute)attrs[0]).Description : en.ToString();
    }

    public static TEnum GetEnumValue<TEnum>(this string description)
        where TEnum : struct, Enum
    {
        return (from field in typeof(TEnum).GetFields()
            let attribute = Attribute.GetCustomAttribute(field, typeof(DescriptionAttribute)) as DescriptionAttribute
            where attribute != null
            where attribute.Description.Equals(description, StringComparison.InvariantCultureIgnoreCase)
            select (TEnum)field.GetValue(null)!).FirstOrDefault();
    }
}