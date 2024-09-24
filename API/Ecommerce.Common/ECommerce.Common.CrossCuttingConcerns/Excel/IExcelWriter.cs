namespace ECommerce.Common.CrossCuttingConcerns.Excel;

public interface IExcelWriter<T>
{
    void Write(T data, Stream stream);
}
