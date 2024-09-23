export const ensurePrefix = (str: string, prefix: string) => (str.startsWith(prefix) ? str : `${prefix}${str}`)

export const withoutSuffix = (str: string, suffix: string) =>
  str.endsWith(suffix) ? str.slice(0, -suffix.length) : str

export const withoutPrefix = (str: string, prefix: string) => (str.startsWith(prefix) ? str.slice(prefix.length) : str)

export const formatString = (str: string, ...values: (string | number)[]): string =>
  str.replace(/{(\d+)}/g, (match, index) => {
    const value = values[parseInt(index)]

    return value !== undefined ? value.toString() : match
  })
