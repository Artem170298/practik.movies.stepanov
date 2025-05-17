import React from 'react';
import MoviesCardText from '../movie-card-text';
import MoviesCardPicture from '../movie-card-picture';
import './movie-card.css';

export default class MovieCard extends React.Component {
  render() {
    const { el, handleRateMovie, guestSessionId, rated, myRatingel } = this.props;

    return (
      <div className="movie-card">
        <MoviesCardPicture picture={el.poster_path} />
        <MoviesCardText
          movieId={el.id}
          title={el.title}
          date={el.release_date}
          opisanie={el.overview}
          genres={el.genre_ids}
          rating={el.vote_average}
          handleRateMovie={() => handleRateMovie}
          guestSessionId={guestSessionId}
          myRating={el.rating}
          myRatingel={myRatingel}
          rated={rated}
        />
      </div>
    );
  }
}
