import React, { useState, createContext } from 'react';
import './app.css';
import { Pagination } from 'antd';
import Movies from '../movies/movies';
import SearchInput from '../searchInput/search-input';
import Tabs from '../tabs';

export default function App() {
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(1);

  const onChange = (page) => {
    console.log(page);
    setCurrent(page);
  };

  return (
    <div className="app">
      <Tabs />
      <SearchInput />
      <Movies page={current} />
      <Pagination current={current} onChange={onChange} total={10000} showSizeChanger={false} defaultPageSize={20} />
    </div>
  );
}
