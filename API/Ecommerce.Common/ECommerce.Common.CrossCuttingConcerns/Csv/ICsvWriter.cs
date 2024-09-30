namespace ECommerce.Common.CrossCuttingConcerns.Csv;

public interface ICsvWriter<T>
{
    void Write(IEnumerable<T> collection, Stream stream);
}
