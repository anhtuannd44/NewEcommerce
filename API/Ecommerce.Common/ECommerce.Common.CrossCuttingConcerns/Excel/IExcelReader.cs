namespace ECommerce.Common.CrossCuttingConcerns.Excel;

public interface IExcelReader<T>
{
    T Read(Stream stream);
}
