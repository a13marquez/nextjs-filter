import Products from '@/components/Products/Products';
import axios from 'axios';
import { Product } from 'models/Product';
import type { NextPage } from 'next';
import Head from 'next/head';
import { SWRConfig } from 'swr';
import ProductFilterProvider from '../context/productFilterProvider';
import styles from '../styles/Home.module.css';

const Home: NextPage = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <ProductFilterProvider>
        <div className={styles.container}>
          <Head>
            <title>Product filter</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <main className={styles.main}>
            <Products />
          </main>

          <footer className={styles.footer}></footer>
        </div>
      </ProductFilterProvider>
    </SWRConfig>
  );
};

export const getStaticProps = async () => {
  const url = process.env.NEXT_API_URL;
  const { data } = await axios.get(`${url}/get-products`);
  const { products }: { products: Product[] } = data;
  const colors = new Set(products.map((product) => product.colorFamily));
  const categories = products.reduce(
    (acc: string[], curr: Product) =>
      curr.categoryTags?.length ? [...acc, ...curr.categoryTags] : acc,
    []
  );
  const prices = products.map((product) => product.price).filter(Boolean);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  return {
    props: {
      fallback: {
        '/api/products': products,
        '/api/colors': Array.from(colors).filter(Boolean),
        '/api/categories': Array.from(new Set(categories)).filter(Boolean),
        '/api/price-range': {
          maxPrice,
          minPrice,
        },
      },
    },
  };
};

export default Home;
