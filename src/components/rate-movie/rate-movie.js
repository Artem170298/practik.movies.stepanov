/* eslint-disable no-undef */
import React, { Component } from 'react';
import { Rate } from 'antd';
import './rate-movie.css';

class RateMovie extends Component {
  state = {
    rating: 0,
    loading: false,
  };

  handleRatingChange = async (value) => {
    this.setState({ rating: value, loading: true });

    try {
      await this.rateMovieOnServer(value);
      this.setState({
        rating: value,
      });
    } catch (error) {
      console.log(error.message);
    } finally {
      this.setState({ loading: false });
    }
  };

  rateMovieOnServer = async (ratingValue) => {
    const { movieId, guestSessionId } = this.props;

    // Валидация параметров
    if (!movieId || !guestSessionId) {
      throw new Error('Не указаны обязательные параметры');
    }

    const API_KEY =
      'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYTBhYmU4Njk5MTM0M2I2OGViMzkxOTdkMDc1YjM4MSIsIm5iZiI6MTc0NTY4OTE1My45NjYsInN1YiI6IjY4MGQxYTQxNzFkZWRjYjhhY2VhYjdjYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.w-TG7uj-ySI6DaATbIizi4u8TcNiKMwsNDW-2dG-wYw'; // Из .env

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/rating` +
        `?api_key=${API_KEY}` +
        `&guest_session_id=${guestSessionId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`, // Добавляем Bearer token
        },
        body: JSON.stringify({ value: ratingValue }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.status_message || `Ошибка ${response.status}: ${response.statusText}`);
    }

    return response.json();
  };

  render() {
    const { myRating, rated, myRatingel, updateRatedMovies } = this.props;

    let value; // доработать
    if (rated) {
      value = myRating;
    } else {
      value = myRatingel || 0;
    }

    return (
      <Rate
        className="rate-movie"
        count={10}
        allowHalf
        value={value}
        onChange={this.handleRatingChange}
        disabled={this.state.loading}
      />
    );
  }
}

export default RateMovie;
