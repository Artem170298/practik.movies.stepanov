import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import getResourse from './services/swapi-servic';
import App from './components/app/app';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// const options = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization:
//       'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYTBhYmU4Njk5MTM0M2I2OGViMzkxOTdkMDc1YjM4MSIsIm5iZiI6MTc0NTY4OTE1My45NjYsInN1YiI6IjY4MGQxYTQxNzFkZWRjYjhhY2VhYjdjYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.w-TG7uj-ySI6DaATbIizi4u8TcNiKMwsNDW-2dG-wYw',
//   },
// };

const movies = await getResourse('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1');
console.log(movies);
