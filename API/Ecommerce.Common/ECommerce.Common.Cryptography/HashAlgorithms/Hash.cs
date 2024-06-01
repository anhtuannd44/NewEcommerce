﻿using System.Security.Cryptography;
using ECommerce.Common.Cryptography.Extensions;

namespace ECommerce.Common.Cryptography.HashAlgorithms;

public abstract class Hash
{
    private readonly byte[] _bytesToBeHashed;
    private readonly Stream _streamToBeHashed;
    private readonly FileInfo _fileToBeHashed;
    protected byte[] _key;

    public Hash(byte[] bytesToBeHashed, Stream streamToBeHashed)
    {
        _bytesToBeHashed = bytesToBeHashed;
        _streamToBeHashed = streamToBeHashed;
    }

    public Hash(FileInfo fileToBeHashed)
    {
        _fileToBeHashed = fileToBeHashed;
    }

    public Hash WithKey(byte[] key)
    {
        _key = key;
        return this;
    }

    protected abstract HashAlgorithm GetHashAlgorithm();

    public byte[] ComputeHash()
    {
        using (var algorithm = GetHashAlgorithm())
        {
            if (_fileToBeHashed != null)
            {
                using (var stream = File.Open(_fileToBeHashed.FullName, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
                {
                    return algorithm.ComputeHash(stream);
                }
            }

            return _streamToBeHashed != null
                ? algorithm.ComputeHash(_streamToBeHashed)
                : algorithm.ComputeHash(_bytesToBeHashed);
        }
    }

    public string ComputeHashedString()
    {
        return ComputeHash().ToHashedString();
    }
}