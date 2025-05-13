import React from 'react';
import './tabs.css';

export default function Tabs({ onClickRated, onInciliz, onClickSearch }) {
  return (
    <div className="tabs">
      <button className="search-button" onClick={onClickSearch}>
        Search
      </button>
      <button
        className="rated-button"
        onClick={() => {
          onClickRated();
          onInciliz();
        }}
      >
        Rated
      </button>
    </div>
  );
}
