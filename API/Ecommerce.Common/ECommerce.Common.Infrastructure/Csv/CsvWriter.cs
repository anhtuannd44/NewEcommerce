using System.Globalization;
using CsvHelper;
using ECommerce.Common.CrossCuttingConcerns.Csv;

namespace ECommerce.Common.Infrastructure.Csv;

public class CsvWriter<T> : ICsvWriter<T>
{
    public void Write(IEnumerable<T> collection, Stream stream)
    {
        using var writer = new StreamWriter(stream);
        using var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);
        csv.WriteRecords(collection);
    }
}
