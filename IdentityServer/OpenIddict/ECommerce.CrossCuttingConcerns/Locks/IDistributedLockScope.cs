using System;

namespace ECommerce.CrossCuttingConcerns.Locks;

public interface IDistributedLockScope : IDisposable
{
    bool StillHoldingLock();
}
