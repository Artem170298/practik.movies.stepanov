import React from 'react';
import './genre.css';
import getResourse from '../../services/swapi-servic';

const genresList = await getResourse('https://api.themoviedb.org/3/genre/movie/list'); // получение списка жанров

export default function Genre({ genre }) {
  const genreName = genresList.genres.filter((el) => el.id === genre); // поиск жанра по Id

  return <div className="genre-element">{genreName[0].name}</div>;
}
