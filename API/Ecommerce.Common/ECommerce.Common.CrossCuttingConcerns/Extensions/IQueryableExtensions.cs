using System.Linq.Expressions;

namespace ECommerce.Common.CrossCuttingConcerns.Extensions;

public static class IQueryableExtensions
{
    public static IQueryable<T> Paged<T>(this IQueryable<T> source, int page, int pageSize)
    {
        return pageSize > 0 ? source.Skip((page - 1) * pageSize).Take(pageSize) : source;
    }

    public static IQueryable<T> WhereIf<T>(this IQueryable<T> query, bool condition, Expression<Func<T, bool>> predicate)
    {
        return condition ? query.Where(predicate) : query;
    }

    public static IQueryable<TSource> OrderByIf<TSource, TKey>(
        this IQueryable<TSource> query,
        Expression<Func<TSource,
            TKey>> keySelector,
        bool ascending)
    {
        return ascending ? query.OrderBy(keySelector) : query.OrderByDescending(keySelector);
    }

    public static IQueryable<TSource> OrderByIf<TSource, TKey>(
        this IQueryable<TSource> query,
        bool condition, Expression<Func<TSource,
            TKey>> keySelector,
        bool ascending)
    {
        if (condition)
        {
            return ascending ? query.OrderBy(keySelector) : query.OrderByDescending(keySelector);
        }

        return query;
    }

    public static IQueryable<TSource> OrderByIf<TSource, TKey>(
        this IQueryable<TSource> query,
        bool condition,
        Expression<Func<TSource, TKey>> keySelector1,
        Expression<Func<TSource, TKey>> keySelector2,
        bool ascending)
    {
        if (condition)
        {
            return ascending ? query.OrderBy(keySelector1).ThenBy(keySelector2) : query.OrderByDescending(keySelector1).ThenByDescending(keySelector2);
        }

        return query;
    }

    public static IQueryable<TSource> OrderByIf<TSource, TKey>(
        this IQueryable<TSource> query,
        bool condition,
        Expression<Func<TSource, TKey>> keySelector1,
        Expression<Func<TSource, TKey>> keySelector2,
        Expression<Func<TSource, TKey>> keySelector3,
        bool ascending)
    {
        if (condition)
        {
            return ascending
                ? query.OrderBy(keySelector1).ThenBy(keySelector2).ThenBy(keySelector3)
                : query.OrderByDescending(keySelector1).ThenByDescending(keySelector2).ThenByDescending(keySelector3);
        }

        return query;
    }
}