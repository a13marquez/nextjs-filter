import { Product } from "./ShopifyProduct";

export type ShopifyResponse = {
  data: {
    allContentfulProductPage: {
      edges: Product[]
    }
  }
}