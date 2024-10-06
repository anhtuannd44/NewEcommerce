using ECommerce.Common.CrossCuttingConcerns.Excel;
using ECommerce.Common.CrossCuttingConcerns.Exceptions;
using ECommerce.Configuration.Entities;
using ExcelDataReader;

namespace ECommerce.Configuration.Excel.ExcelDataReader;

public class ConfigurationEntryExcelReader : IExcelReader<List<ConfigurationEntry>>
{
    public List<ConfigurationEntry> Read(Stream stream)
    {
        var rows = new List<ConfigurationEntry>();
        const int headerIndex = 0;

        using var reader = ExcelReaderFactory.CreateReader(stream);
        do
        {
            var sheetName = reader.Name;
            if (sheetName != "Sheet1")
            {
                continue;
            }

            var rowIndex = 0;
            while (reader.Read())
            {
                switch (rowIndex)
                {
                    case < headerIndex:
                        rowIndex++;
                        continue;
                    case headerIndex:
                    {
                        if (GetCorrectHeaders().Any(header => !string.Equals(reader.GetValue(header.Key).ToString(), header.Value, StringComparison.OrdinalIgnoreCase)))
                        {
                            throw new ValidationException("Wrong Template!");
                        }

                        rowIndex++;
                        continue;
                    }
                }

                var row = new ConfigurationEntry
                {
                    Key = reader.GetValue(0).ToString(),
                    Value = reader.GetValue(1).ToString(),
                };

                rows.Add(row);
                rowIndex++;
            }
        }
        while (reader.NextResult());

        return rows;
    }

    private static Dictionary<int, string> GetCorrectHeaders()
    {
        return new Dictionary<int, string>
        {
            { 0, "Key" },
            { 1, "Value" },
        };
    }
}
