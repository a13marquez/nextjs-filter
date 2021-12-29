export type Filters<T> = {
  [key: string]: {
    label: string;
    values: unknown[],
    type: string,
    filter: (...args) => (item: T) => boolean
  }
}

export type PriceRange = {
  maxPrice: number;
  minPrice: number;
}