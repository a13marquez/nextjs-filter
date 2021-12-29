import { Filters, PriceRange } from 'models/Filter';
import { Product } from 'models/Product';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import useSWR from 'swr';
import fetcher from 'utils/fetcher';

const filters: Filters<Product> = {
  byPrice: {
    label: 'Price',
    values: [],
    type: 'range',
    filter: (prices: number[]) => (item: Product) => {
      const l = prices.length;
      const sortedPrices = prices.sort((a, b) => a - b);
      const min = sortedPrices[0];
      const max = sortedPrices[l - 1];
      return item.price >= min && item.price <= max;
    },
  },
  byColor: {
    label: 'Color',
    values: [],
    type: 'select',
    filter: (colorFamily: string) => (item: Product) => {
      return !!item.colorFamily?.includes(colorFamily);
    },
  },
  byCategory: {
    label: 'Category',
    values: [],
    type: 'select',
    filter: (category: string) => (item: Product) =>
      !!item.categoryTags?.includes(category),
  },
};

export type FiltersKeys = keyof typeof filters;

export const setFiltersValues = (f: Record<FiltersKeys, unknown[]> = {}) => {
  for (const key of Object.keys(f) as FiltersKeys[]) {
    filters[key].values = f[key];
  }
  return filters;
};

type ExposedContext = {
  products: Product[];
  filters: Filters<Product>;
  selectFilter: (filterName: FiltersKeys, value: any) => void;
  clearFilter: (filterName: FiltersKeys) => void;
  clearAllFilters: () => void;
};

const Context = createContext<ExposedContext>({
  products: [],
  selectFilter: () => {},
  clearFilter: () => {},
  clearAllFilters: () => {},
  filters: {},
});

const Provider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { data: prod } = useSWR<Product[]>('/api/products', fetcher);
  const { data: colors } = useSWR<string[]>('/api/colors', fetcher);
  const { data: categories } = useSWR<string[]>('/api/categories', fetcher);
  const { data: priceRange } = useSWR<PriceRange>('/api/price-range', fetcher);
  const [products, setProducts] = useState<Product[]>(prod || []);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [filters, setFilters] = useState<Filters<Product>>({});
  const [selectedFilters, setSelectedFilters] = useState({});

  const [filterValues, setFilterValues] = useState({
    byColor: colors || [],
    byCategory: categories || [],
    byPrice: [priceRange?.minPrice, priceRange?.maxPrice],
  });

  useEffect(() => {
    const filters = setFiltersValues(filterValues);
    setFilters(filters);
    setIsLoading(false);
  }, [products, filterValues]);

  useEffect(() => {
    let filtersFns = [];
    for (const filterName of Object.keys(selectedFilters)) {
      filtersFns.push(selectedFilters[filterName]);
    }
    const fp = filtersFns.reduce((d, f) => d.filter(f), products);
    setFilteredProducts(fp);
  }, [selectedFilters, products]);

  const selectFilter = (filterName: FiltersKeys, value: any) => {
    setSelectedFilters({
      ...selectedFilters,
      [filterName]: filters[filterName].filter(value),
    });
  };

  const clearFilter = (filterName: FiltersKeys) => {
    const newSelectedFilters = delete selectedFilters[filterName];
    setSelectedFilters(newSelectedFilters);
  };

  const clearAllFilters = (filterName: FiltersKeys) => {
    setSelectedFilters({});
  };

  const exposed = {
    products: filteredProducts,
    filters,
    selectFilter,
    clearFilter,
    clearAllFilters,
  };

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
};

export const useProductFilter = () => useContext(Context);

export default Provider;
