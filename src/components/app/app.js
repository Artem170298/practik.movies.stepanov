import React, { useState, Component } from 'react';
import './app.css';
import { Pagination } from 'antd';
import getResourse from '../../services/swapi-servic';
import Movies from '../movies/movies';
import SearchInput from '../searchInput/search-input';
import Tabs from '../tabs';

export default class App extends Component {
  state = {
    loading: true,
    movies: null,
    error: {
      status: false,
      message: null,
    },
    isOffline: false,
    current: 1,
    query: '',
    totalPages: null,
  };

  loadFirstPageMovies = async () => {
    try {
      const movies = await getResourse(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`);
      this.setState({
        movies: movies.results,
        loading: false,
        totalPages: 10000,
      });
    } catch (error) {
      // Обработка ошибок
    }
  };

  componentDidMount() {
    this.handleConnectionChange();

    window.addEventListener('online', this.handleConnectionChange);
    window.addEventListener('offline', this.handleConnectionChange);
    this.loadFirstPageMovies();
  }

  componentDidUpdate(prevState) {}

  componentWillUnmount() {
    // Отписываемся от событий при размонтировании
    window.removeEventListener('online', this.handleConnectionChange);
    window.removeEventListener('offline', this.handleConnectionChange);
    clearTimeout(this.timer);
    if (this.controller) this.controller.abort();
  }

  handleConnectionChange = () => {
    this.setState({ isOffline: !navigator.onLine });
  };

  handleSearchChange = (query) => {
    // отслеживание изменения инпута
    this.setState({ query }, () => {
      this.debouncedSearch();
    });
  };

  debouncedSearch = () => {
    // задержка запроса
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.searchMovies(1);
    }, 500);
  };

  searchMovies = async (page = 1) => {
    // запрос по названию
    const { query } = this.state;
    clearTimeout(this.timer);
    if (!query.trim()) {
      this.loadFirstPageMovies();
      // this.setState({ movies: [], current: 1, totalPages: 1 });
      return;
    }

    // Отменяем предыдущий запрос
    if (this.controller) this.controller.abort();
    this.controller = new AbortController();

    this.setState({ loading: true });

    try {
      const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&page=${page}`;
      const data = await getResourse(url, { signal: this.controller.signal });
      console.log(data);

      this.setState({
        movies: data?.results || [],
        loading: false,
        error: null,
        totalPages: data.total_pages,
        current: page,
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        this.setState({
          loading: false,
          error: 'Ошибка при поиске фильмов',
        });
      }
    }
  };

  fetchMovies = async () => {
    // запрос на получение списка фильмов по страницам
    if (this.state.isOffline) {
      this.setState({
        loading: false,
        error: { message: 'No internet connection' },
      });
      return;
    }

    try {
      const { current: page } = this.state;
      const movies = await getResourse(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`);
      this.setState({
        movies: movies.results,
        loading: false,
        totalPages: 10000,
      });

      // throw new TypeError(` object of type 'int' has no len()`);
    } catch (error) {
      const errorMessage =
        error.message === 'Failed to fetch' ? 'Network error. Please check your internet connection.' : error.message;

      this.setState({
        error: {
          status: true,
          message: errorMessage,
          originalError: error,
          isNetworkError: error.message === 'Failed to fetch',
        },
        loading: false,
      });
    }
  };

  onChange = (page) => {
    // отслеживание текущей страницы
    this.setState({
      current: page,
    });
    this.fetchMovies(page);
  };

  render() {
    const { query } = this.state;
    return (
      <div className="app">
        <Tabs />
        <SearchInput value={query} onChange={this.handleSearchChange} />
        <Movies state={this.state} onChange={() => this.searchMovies} />
        {/* <Pagination
          current={current}
          onChange={this.onChange}
          total={10000}
          showSizeChanger={false}
          defaultPageSize={20}
        /> */}
      </div>
    );
  }
}
