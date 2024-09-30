using System.Globalization;
using CsvHelper;
using ECommerce.Common.CrossCuttingConcerns.Csv;

namespace ECommerce.Common.Infrastructure.Csv;

public class CsvReader<T> : ICsvReader<T>
{
    public IEnumerable<T> Read(Stream stream)
    {
        using var reader = new StreamReader(stream);
        using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
        return csv.GetRecords<T>().ToList();
    }
}
