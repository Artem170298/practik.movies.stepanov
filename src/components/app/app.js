import React, { Component } from 'react';
import './app.css';

import { message } from 'antd';
import { indexOf, update } from 'lodash';
import getResourse from '../../services/swapi-servic';
import Movies from '../movies/movies';
import SearchInput from '../searchInput/search-input';
import Tabs from '../tabs';
import { Error } from '../error';

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
    ratedMoviesTotalPages: null,
    allRatedMovies: [],
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
    this.loadDataStart();
  }

  loadDataStart = async () => {
    await this.initializeGuestSession();
    await this.fetchRatedMoviesAll();
    await this.loadFirstPageMovies();
  };

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
      this.setState({ error: { message: error.message } });
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

  fetchPage = async (page) => {
    const { guestSessionId } = this.state;
    try {
      const res = await getResourse(
        `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?page=${page}&per_page=500`
      );

      return res.results || [];
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
      return [];
    }
  };

  fetchRatedMoviesAll = async () => {
    // получение полного списка проголосованных фильмов

    try {
      const { guestSessionId } = this.state;
      const response = await getResourse(`https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies`);

      const pagesArr = Array.from({ length: response.total_pages }, (_, i) => i + 1);

      this.setState({ loading: true });
      const allResults = await Promise.all(
        pagesArr.map((page) =>
          getResourse(`https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?page=${page}`)
        )
      );

      // Объединяем результаты
      const allMovies = allResults.flatMap((res) => res.results || []);

      this.setState({
        allRatedMovies: allMovies,
        loading: false,
      });
    } catch (error) {
      this.setState({
        loading: false,
        error: 'Failed to load movies',
      });
    }
  };

  fetchRatedMovies = async (page = 1) => {
    // запрос оценнёных фильмов
    const { guestSessionId } = this.state;

    this.setState({ moviesLoading: true });

    try {
      const response = await getResourse(
        `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?page=${page}&per_page=500`
      );
      this.setState({
        ratedMovies: response.results || [],
        totalPages: response.total_results || 1, // или response.total_pages || 1 (значение по умолчанию)
        moviesLoading: false,
      });

      return response.results || [];
    } catch (error) {
      this.setState({
        moviesLoading: false,
        error: {
          message: 'Ошибка загрузки оценок',
        },
      });
      return [];
    }
  };

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
        rated: false,
      },
      () => {
        this.searchMovies(1);
        this.setState({
          loading: false,
        });
      }
    );
  };

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
          error: { message: 'Ошибка при поиске фильмов' },
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
    if (!this.state.rated) {
      this.setState({ current: page }, () => {
        this.state.query ? this.searchMovies(page) : this.fetchMovies();
      });
    }

    this.setState({ current: page }, () => {
      this.fetchRatedMovies(page);
    });
  };

  onRated = () => {
    this.setState({ rated: true, query: '' });
  };

  onSearch = () => {
    this.setState({ rated: false, query: '' });
  };

  render() {
    const { query, rated, error } = this.state;

    return (
      <div className="app">
        <Tabs
          rated={rated}
          onClickRated={() => {
            this.onRated();
          }}
          onClickSearch={() => {
            this.onSearch();
          }}
          onInciliz={() => {
            this.initializeGuestSession();
          }}
          fetchRatedMovies={() => {
            this.fetchRatedMovies();
          }}
          loadFirstPageMovies={() => {
            this.loadFirstPageMovies();
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
