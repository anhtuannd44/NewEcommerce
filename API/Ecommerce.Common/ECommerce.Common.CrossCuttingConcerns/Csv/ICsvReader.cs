namespace ECommerce.Common.CrossCuttingConcerns.Csv;

public interface ICsvReader<T>
{
    IEnumerable<T> Read(Stream stream);
}
