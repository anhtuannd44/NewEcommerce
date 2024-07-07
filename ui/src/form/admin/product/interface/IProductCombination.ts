export interface IProductAttributeCombination {
  id: string
  name: string
  sku: string
  barCode: string
  price?: number | null
  stockQuantity?: number | null
  productCost?: number | null
  attributeJson: IAttributeJson[]
}

export interface IAttributeJson {
  productAttributeId: string
  productAttributeValue: string
}
