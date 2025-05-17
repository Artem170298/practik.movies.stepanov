import React, { useRef, useEffect, useContext } from 'react';
import './movie-card-text.css';
import Genres from '../genres';
import RateMovie from '../rate-movie';
import Rating from '../rating';

export default function MoviesCardText({
  title,
  date,
  opisanie,
  genres,
  rating,
  handleRateMovie,
  movieId,
  guestSessionId,
  myRating,
  myRatingel,
  rated,
}) {
  const truncateDescription = (text, maxLength = 200) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;

    let truncated = text.substr(0, maxLength);
    truncated = truncated.substr(0, truncated.lastIndexOf(' '));

    return truncated.length > 0 ? `${truncated}...` : `${text.substr(0, maxLength)}...`;
  };

  const rate = +rating.toFixed(1);
  let strokeColor = '';

  if (rate <= 3) {
    strokeColor = ' #E90000';
  } else if (rate > 3 && rate <= 5) {
    strokeColor = ' #E97E00';
  } else if (rate > 5 && rate <= 7) {
    strokeColor = ' #E9D100';
  } else {
    strokeColor = ' #66E900';
  }

  return (
    <div className="card-text">
      <div className="text-ram">
        <h2 className="movie-name">
          {title}
          {<Rating rating={rate} color={strokeColor} />}
        </h2>

        <p className="data-relis">{date}</p>
        <Genres genres={genres} />
        <p className="opisanie">{truncateDescription(opisanie, 140)}</p>
      </div>
      <RateMovie
        handleRateMovie={() => handleRateMovie}
        movieId={movieId}
        guestSessionId={guestSessionId}
        myRating={myRating}
        myRatingel={myRatingel}
        rated={rated}
      />
    </div>
  );
}
