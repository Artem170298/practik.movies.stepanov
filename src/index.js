import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import getResourse from './services/swapi-servic';
import App from './components/app/app';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

const movies = await getResourse('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1');
