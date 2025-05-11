import React from 'react';
import './movie-card-picture.css';

export default function MovieCardPicture({ picture }) {
  let image = `https://image.tmdb.org/t/p/w500/${picture}`;
  if (!picture) {
    image =
      'https://png.pngtree.com/png-clipart/20190925/original/pngtree-no-avatar-vector-isolated-on-white-background-png-image_4979074.jpg';
  }
  return <img className="picture-card" alt="No image" src={image} width={100} height={100} />;
}
