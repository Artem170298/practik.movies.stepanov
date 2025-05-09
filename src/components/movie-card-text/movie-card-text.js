import React, { useRef, useEffect } from 'react';
import './movie-card-text.css';
import Genres from '../genres';
import RateMovie from '../rate-movie';
import Rating from '../rating';

export default function MoviesCardText({ title, date, opisanie, genres }) {
  const truncateDescription = (text, maxLength = 200) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;

    let truncated = text.substr(0, maxLength);
    truncated = truncated.substr(0, truncated.lastIndexOf(' '));

    return truncated.length > 0 ? `${truncated}...` : `${text.substr(0, maxLength)}...`;
  };

  return (
    <div className="card-text">
      <div className="text-ram">
        <h2 className="movie-name">
          {title}
          {<Rating />}
        </h2>

        <p className="data-relis">{date}</p>
        <Genres genres={genres} />
        <p className="opisanie">{truncateDescription(opisanie, 140)}</p>
      </div>
      <RateMovie />
    </div>
  );
}
