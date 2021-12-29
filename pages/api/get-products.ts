
import axios from "axios";
import Product from "models/Product";
import { ShopifyProduct } from "models/ShopifyProduct";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const url = process.env.DATABASE_URL
  const { data } = await axios.get(`${url}/products`, {});
  const products: ShopifyProduct[] = data.data.allContentfulProductPage.edges;
  const convertedProducts = products
    .map((product) => new Product(product))
    .filter((product) => product.price > 0);
  res.send({
    products: convertedProducts
  })
}

export default handler