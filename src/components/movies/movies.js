import React, { Component, useContext } from 'react';
import getResourse from '../../services/swapi-servic';
import MovieCard from '../movie-card';
import './movies.css';
import Spinner from '../spinner';
import { Error, NotFound, Offline } from '../error';

// import Offline from '../offline/offline';

// const movies = await getResourse('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1');

export default class Movies extends Component {
  // constructor() {
  //   super();
  // }

  state = {
    loading: true,
    movies: null,
    error: {
      status: false,
      message: null,
    },
    isOffline: false,
  };

  componentDidMount() {
    this.handleConnectionChange();

    window.addEventListener('online', this.handleConnectionChange);
    window.addEventListener('offline', this.handleConnectionChange);

    this.fetchMovies();
  }

  componentDidUpdate(prevProps) {
    if (this.props.page !== prevProps.page) {
      this.fetchMovies();
    }
  }

  componentWillUnmount() {
    // Отписываемся от событий при размонтировании
    window.removeEventListener('online', this.handleConnectionChange);
    window.removeEventListener('offline', this.handleConnectionChange);
  }

  handleConnectionChange = () => {
    this.setState({ isOffline: !navigator.onLine });
  };

  fetchMovies = async () => {
    if (this.state.isOffline) {
      this.setState({
        loading: false,
        error: { message: 'No internet connection' },
      });
      return;
    }

    try {
      const { page, setTotal } = this.props;
      const movies = await getResourse(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`);
      this.setState({
        movies: movies.results,
        loading: false,
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

  render() {
    const { movies, loading, error, isOffline } = this.state;

    if (isOffline) {
      return <Offline />;
    }

    if (loading) {
      return <Spinner />;
    }

    const { message } = error;
    if (error.status) {
      return <Error message={message} />;
    }

    if (!movies || movies.length === 0) {
      return <NotFound message={'No movies found'} />;
    }

    const moviesList = movies.map((el) => (
      <li key={el.id}>
        <MovieCard el={el} />
      </li>
    ));

    return <ul className="movies">{moviesList}</ul>;
  }
}
