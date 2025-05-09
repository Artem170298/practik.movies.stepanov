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
  };

  componentDidMount() {
    this.handleConnectionChange();

    window.addEventListener('online', this.handleConnectionChange);
    window.addEventListener('offline', this.handleConnectionChange);

    this.fetchMovies();
  }

  componentDidUpdate(prevState) {
    if (this.state.current !== prevState.current) {
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
      const { current: page } = this.state;
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

  onChange = (page) => {
    this.setState({
      current: page,
    });
  };

  render() {
    const { current } = this.state;
    return (
      <div className="app">
        <Tabs />
        <SearchInput />
        <Movies state={this.state} onChange={() => this.onChange} />
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
