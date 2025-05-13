import React, { Component } from 'react';
import { Pagination } from 'antd';
import MovieCard from '../movie-card';
import './movies.css';
import Spinner from '../spinner';
import { Error, NotFound, Offline } from '../error';

export default class Movies extends Component {
  render() {
    const { state, onChange, handleRateMovie } = this.props;
    const { movies, loading, error, isOffline, current, totalPages, ratedMovies, rated, guestSessionId } = state;

    if (isOffline) {
      return <Offline />;
    }

    if (loading) {
      return <Spinner />;
    }

    if (error && error.status) {
      return <Error message={error.message} />;
    }

    if (!movies || movies.length === 0) {
      return <NotFound message={'No movies found'} />;
    }

    let liMovies;
    if (!rated) {
      liMovies = [...movies];
    } else {
      liMovies = [...ratedMovies];
    }
    const moviesList = liMovies.map((el) => (
      <li key={el.id}>
        <MovieCard el={el} handleRateMovie={handleRateMovie} guestSessionId={guestSessionId} />
      </li>
    ));

    return (
      <React.Fragment>
        <ul className="movies">{moviesList}</ul>
        <Pagination
          current={current}
          onChange={onChange()}
          total={totalPages * 20}
          showSizeChanger={false}
          defaultPageSize={20}
        />
      </React.Fragment>
    );
  }
}
