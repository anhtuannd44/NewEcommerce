export const currencyVNDFormatter = (number: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(number)
}

export const currencyWithoutVNDFormatter = (number: number) => {
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0
  }).format(number)
}

export const convertStringToNumber = (value: string | null | undefined): number | null => {
  if (!value) {
    return null
  }
  return parseFloat(value.replace(/,/g, '').replace(/^0+/, '0'));
}
