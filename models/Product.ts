import { v4 } from 'uuid';
import { ShopifyProduct } from "./ShopifyProduct";

export const convertProduct = (product: ShopifyProduct): Product => ({
  id: v4(),
  name: product.node.name,
  locale: product.node.node_locale,
  imageUrl: product.node.thumbnailImage.file.url,
  colorFamily: product.node.colorFamily
    ? product.node.colorFamily.map((color) => color.name)[0]
    : null,
  categoryTags: product.node.categoryTags,
  price: Number(product.node.shopifyProductEu.variants.edges[0].node.price),
});

export class Product {
  public id: string | null = null;
  public name: string | null = null;
  public locale: string | null = null;
  public imageUrl: string | null = null;
  public colorFamily: string | null = null;
  public categoryTags: string[] | null = null;
  public price: number = 0;

  constructor(shopifyProduct: ShopifyProduct) {
    const product = convertProduct(shopifyProduct)
    this.id = product.id;
    this.name = product.name;
    this.locale = product.locale
    this.imageUrl = product.imageUrl
    this.colorFamily = product.colorFamily
    this.categoryTags = product.categoryTags
    this.price = product.price
  }
}

export default Product