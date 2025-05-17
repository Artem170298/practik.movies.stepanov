import React, { useState, useEffect } from 'react';
import './tabs.css';

export default function Tabs({ onClickRated, onInciliz, onClickSearch, fetchRatedMovies, loadFirstPageMovies, rated }) {
  const [activeTab, setActiveTab] = useState('search');

  return (
    <div className="tabs">
      <button
        className={`search-button ${activeTab === 'search' ? ':active,' : ''}`}
        onClick={() => {
          setActiveTab('search');
          onClickSearch();
          loadFirstPageMovies();
        }}
      >
        Search
      </button>
      <button
        className={`rated-button button ${activeTab === 'rated' ? ':active' : ''}`}
        onClick={() => {
          onClickRated();
          onInciliz();
          fetchRatedMovies();
          setActiveTab('rated');
        }}
      >
        Rated
      </button>
    </div>
  );
}
