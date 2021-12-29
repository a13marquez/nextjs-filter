import Slider from '@mui/material/Slider';
import { useProductFilter } from 'context/productFilterProvider';
import { useState } from 'react';
import styles from './Filter.module.css';
import { FiltersKeys } from './Filters';

type FilterItemProps = {
  name: string;
  type: string;
  values: unknown[];
  onValueChange: (value: unknown, filterName: FiltersKeys) => void;
  onFilterClear: (filterName: FiltersKeys) => void;
};

const FilterItem = ({
  name,
  type,
  values,
  onValueChange,
  onFilterClear,
}: FilterItemProps) => {
  const [value, setValue] = useState(values);

  const handleValueChange = (e) => {
    onValueChange(e.target.value, name);
    setValue(e.target.value);
  };

  const handleClearvalue = (e) => {
    onFilterClear(name);
    setValue(defaultValues[type]);
  };
  const defaultValues = {
    select: '',
    range: [0, 1000],
  };
  const filterComponents = {
    select: (
      <select onChange={handleValueChange} value={value as string}>
        <option>Select an option</option>
        {values.map((v, index) => (
          <option key={`${name}-${index}`}>{String(v)}</option>
        ))}
      </select>
    ),
    range: (
      <Slider
        getAriaLabel={() => 'Price range'}
        value={value as number[]}
        min={0}
        max={1000}
        defaultValue={defaultValues.range}
        onChange={handleValueChange}
        valueLabelDisplay="auto"
        disableSwap
      />
    ),
  };

  return (
    <div className={styles['filter-item']}>
      {filterComponents[type]}
      <span className={styles['clear-filter']} onClick={handleClearvalue}>
        clear
      </span>
    </div>
  );
};

export function Filter() {
  const { products, filters, selectFilter, clearFilter, clearAllFilters } =
    useProductFilter();
  const [showFilters, setShowFilters] = useState(false);
  const handleValueChange = (value: unknown, filterName: FiltersKeys) => {
    selectFilter(filterName, value);
  };

  const handleFilterClear = (filterName: FiltersKeys) => {
    clearFilter(filterName);
  };

  return (
    <div>
      <span
        onClick={() => setShowFilters(!showFilters)}
        className={styles['show-filter']}
      >
        Filter
      </span>
      {showFilters && (
        <div className={styles.filters}>
          <div className={styles['filters-header']}>
            <span
              className={styles['filters-header__item']}
              onClick={clearAllFilters}
            >
              Clear filters
            </span>
            <span
              className={styles['filters-header__item']}
              onClick={() => setShowFilters(false)}
            >
              X
            </span>
          </div>
          {Object.keys(filters).map((filterName) => {
            const filter = filters[filterName];
            return (
              <div className={styles.filter} key={filter.label}>
                <span className="filter-label">{filter.label}</span>
                <FilterItem
                  name={filterName.toString()}
                  onValueChange={handleValueChange}
                  onFilterClear={handleFilterClear}
                  type={filter.type}
                  values={filter.values}
                ></FilterItem>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
