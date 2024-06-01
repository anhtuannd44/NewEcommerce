namespace ECommerce.Common.Domain.DTOs.BaseDto;

public abstract class BaseDto<TId>
{
    public TId Id { get; set; }

    public virtual byte[] Version { get; set; }
}

public abstract class BaseDto : BaseDto<Guid>
{
    public Guid? CreatedById { get; set; }
    public Guid? UpdatedById { get; set; }
    public DateTime? CreatedDate { get; set; }
    public DateTime? UpdatedDate { get; set; }
}