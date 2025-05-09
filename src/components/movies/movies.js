import React, { Component } from 'react';
import { Pagination } from 'antd';
import MovieCard from '../movie-card';
import './movies.css';
import Spinner from '../spinner';
import { Error, NotFound, Offline } from '../error';

export default class Movies extends Component {
  render() {
    const { state, onChange } = this.props;
    const { movies, loading, error, isOffline, current } = state;

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

    return (
      <React.Fragment>
        <ul className="movies">{moviesList}</ul>
        <Pagination
          current={current}
          onChange={onChange()}
          total={10000}
          showSizeChanger={false}
          defaultPageSize={20}
        />
      </React.Fragment>
    );
  }
}
