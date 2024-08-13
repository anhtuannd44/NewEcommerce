export enum ProductStatus {
  Drafted = 0,
  Published = 1,
  Deleted = 2
}

export enum UserStatus {
  Pending = 0,
  Active = 1,
  Locked = 2,
  Deleted = 3
}

export enum OrderStatus {
  PriceQuote = 0,
  Processing = 1,
  Shipping = 2,
  Completed = 3,
  Canceled = 4
}

export enum ProductType {
  SimpleProduct = 0,
  GroupedProduct = 1
}

export enum DiscountType {
  Value = 0,
  Percent = 1
}

export enum MessageType {
  Error = 0,
  Success = 1,
  Warning = 2
}
