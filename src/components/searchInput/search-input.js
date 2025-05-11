import React from 'react';
import './search-input.css';

export default function SearchInput({ onChange, value }) {
  return (
    <input
      className="input-search"
      placeholder="Type to search..."
      onChange={(e) => onChange(e.target.value)}
      value={value}
    ></input>
  );
}
