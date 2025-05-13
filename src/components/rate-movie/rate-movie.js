import React, { Component } from 'react';
import { Rate } from 'antd';
import getResourse from '../../services/swapi-servic';
import './rate-movie.css';

class RateMovie extends Component {
  state = {
    rating: 0,
  };

  handleRatingChange = async (value) => {
    this.setState({ rating: value });
    console.log(`Вы поставили оценку: ${value}`);

    await this.handleRateMovie(value * 2);
  };

  componentDidMount() {}

  handleRateMovie = async (rating) => {
    const { movieId, guestSessionId } = this.props;

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

  render() {
    return (
      <Rate
        className="rate-movie"
        count={10}
        allowHalf={true}
        onChange={this.handleRatingChange}
        value={this.state.rating}
      />
    );
  }
}
export default RateMovie;
