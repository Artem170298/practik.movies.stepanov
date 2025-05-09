import React from 'react';
import Genre from '../genre/genre';
import './genres.css';

let key = 1;

export default function Genres({ genres }) {
  const genresMovie = genres.map((el) => {
    return (
      <li className="genre-movie" key={key++}>
        {<Genre genre={el} />}
      </li>
    );
  });

  return <ul className="genres-list">{genresMovie}</ul>;
}
