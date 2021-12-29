import { useProductFilter } from 'context/productFilterProvider';
import { Product } from 'models/Product';
import { useState } from 'react';
import { Filter } from '../Filter/Filter';
import styles from './Products.module.css';

function Products() {
  const { products, filters } = useProductFilter();
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 9;
  const maxPages = Math.round(products.length / 9);
  const filterValues = Object.keys(filters).map(
    (filterName) => filters[filterName].values
  );
  const productList = (products: Product[]) =>
    products.slice(pageIndex, pageIndex + pageSize).map((product) => (
      <div className="product" key={product.id}>
        <img
          className={styles.image}
          src={product.imageUrl as string}
          alt="product image"
        />
        <div className="product__subtitle">
          <span>{product.name}</span>
          <span>{product.price}</span>
        </div>
      </div>
    ));

  return (
    <>
      <Filter filterValues={filterValues} />
      <div className={styles.products}>
        {products.length ? (
          productList(products)
        ) : (
          <div>There is no product with the selected options</div>
        )}
      </div>
      <button onClick={() => pageIndex > 0 && setPageIndex(pageIndex - 1)}>
        Previous
      </button>
      <span>
        page {pageIndex} of {maxPages}
      </span>
      <button
        onClick={() => pageIndex < maxPages && setPageIndex(pageIndex + 1)}
      >
        Next
      </button>
    </>
  );
}

export default Products;
