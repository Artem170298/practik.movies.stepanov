import React from 'react';
import Movies from '../movies/movies';

export default function Reted({ state, onChange, handleRateMovie }) {
  return <Movies state={state} onChange={onChange} handleRateMovie={handleRateMovie} />;
}
