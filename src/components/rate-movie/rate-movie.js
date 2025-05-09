import React from 'react';
import { Rate } from 'antd';
import './rate-movie.css';

const RateMovie = () => <Rate className="rate-movie" count={10} allowHalf={true} />;
export default RateMovie;
