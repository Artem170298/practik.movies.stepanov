import React, { useState, useEffect, useCallback } from 'react';
import './search-input.css';

function SearchInput({ searchMov, value }) {
  const [valueInp, setValueInp] = useState(value || '');

  function debounce(func, wait) {
    let timeout;
    const debounced = (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
    debounced.cancel = () => clearTimeout(timeout);
    return debounced;
  }

  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      searchMov(searchValue);
    }, 800),
    [searchMov]
  );

  useEffect(() => {
    debouncedSearch(valueInp);
    // Очистка при размонтировании
    return () => debouncedSearch.cancel();
  }, [valueInp, debouncedSearch]);

  return (
    <input
      className="input-search"
      placeholder="Type to search..."
      onChange={(e) => {
        setValueInp(e.target.value);
      }}
      value={valueInp}
    ></input>
  );
}

export default React.memo(SearchInput);
