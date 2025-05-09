import React from 'react';
import './movie-card-picture.css';

export default function MovieCardPicture({ picture }) {
  return <img className="picture-card" src={`https://image.tmdb.org/t/p/w500/${picture}`} width={100} height={100} />;
}
