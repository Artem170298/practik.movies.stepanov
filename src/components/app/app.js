import React, { useState, Component, createContext } from 'react';
import './app.css';
import { message } from 'antd';

import getResourse from '../../services/swapi-servic';
import Movies from '../movies/movies';
import SearchInput from '../searchInput/search-input';
import Tabs from '../tabs';
import Reted from '../rated';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.controller = null;
  }

  state = {
    loading: true,
    movies: [],
    error: {
      status: false,
      message: null,
    },
    isOffline: false,
    current: 1,
    query: '',
    totalPages: null,
    guestSessionId: localStorage.getItem('tmdb_guest_session') || null,
    ratedMovies: [],
    rated: false,

    moviesLoading: false,
    selectedMovie: null,
    rating: 0,
    initialized: false,
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
    this.initializeGuestSession();
  }

  initializeGuestSession = async () => {
    // иницилизация сессии
    // Если уже есть сессия, не создаём новую
    if (this.state.guestSessionId) return;

    this.setState({ loading: true, error: null });

    const sessionId = await this.createGuestSession();

    try {
      this.setState({ guestSessionId: sessionId });
      localStorage.setItem('tmdb_guest_session', sessionId);
    } catch (error) {
      this.setState({ error: error.message });
      console.error('Не удалось создать сессию');
    } finally {
      this.setState({ loading: false });
    }
  };

  createGuestSession = async () => {
    // создание гостевой сессии
    const response = await getResourse(`https://api.themoviedb.org/3/authentication/guest_session/new`);

    if (!response.success) {
      throw new Error('Ошибка создания сессии');
    }
    return response.guest_session_id;
  };

  fetchRatedMovies = async () => {
    // запрос оценнёных фильмов
    const { guestSessionId } = this.state;

    this.setState({ moviesLoading: true });

    try {
      const response = await getResourse(`https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies`);
      const data = await response.json();

      this.setState({
        ratedMovies: data.results || [],
        moviesLoading: false,
      });
    } catch (error) {
      console.error('Ошибка загрузки оценок');
      this.setState({
        moviesLoading: false,
        error: {
          message: 'Ошибка загрузки оценок',
        },
      });
    }
  };

  handleRateMovie = async (movieId, rating) => {
    const { guestSessionId } = this.props;

    try {
      const response = await getResourse(
        `https://api.themoviedb.org/3/movie/${movieId}/rating?guest_session_id=${guestSessionId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            value: rating, // Конвертация 5★ → 10★
          }),
        }
      );

      if (response.success) {
        console.log('Оценка сохранена!');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  componentDidUpdate(prevState) {}

  componentWillUnmount() {
    // Отписываемся от событий при размонтировании
    window.removeEventListener('online', this.handleConnectionChange);
    window.removeEventListener('offline', this.handleConnectionChange);
    if (this.controller) this.controller.abort();
    clearTimeout(this.timer);
  }

  handleConnectionChange = () => {
    this.setState({ isOffline: !navigator.onLine });
  };

  handleSearchChange = (query) => {
    // отслеживание изменения инпута

    this.setState(
      {
        query,
        loading: true,
      },
      () => {
        this.searchMovies(1);
        this.setState({
          loading: false,
        });
      }
    );
  };

  // debounce = (func, delay) => {
  //   let timer;
  //   return (...args) => {
  //     clearTimeout(timer);
  //     timer = setTimeout(() => {
  //       func.apply(this, args);
  //     }, delay);
  //   };
  // };

  searchMovies = async (page = 1) => {
    // запрос по названию
    const { query } = this.state;
    clearTimeout(this.timer);
    if (!query || !query.trim()) {
      this.loadFirstPageMovies();
      return;
    }

    // Отменяем предыдущий запрос
    this.controller = new AbortController();
    if (this.controller) this.controller.abort();

    this.setState({ loading: true });

    try {
      const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&page=${page}`;
      const data = await getResourse(url, { signal: this.controller.signal });

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
    this.setState({ current: page }, () => {
      this.state.query ? this.searchMovies(page) : this.fetchMovies();
    });
  };

  onRated = () => {
    this.setState({ rated: true });
  };

  onSearch = () => {
    this.setState({ rated: false }, () => console.log(this.state.rated));
  };

  render() {
    const { query, rated, movies, loading } = this.state;

    return (
      <div className="app">
        <Tabs
          onClickRated={() => {
            this.onRated();
          }}
          onClickSearch={() => {
            this.onSearch();
          }}
          onInciliz={() => {
            this.initializeGuestSession();
          }}
        />

        <SearchInput value={query} searchMov={this.handleSearchChange} />

        <Movies
          state={this.state}
          selectMovie={(id, title) => this.selectMovie(id, title)}
          onChange={() => this.onChange}
        />
      </div>
    );
  }
}
