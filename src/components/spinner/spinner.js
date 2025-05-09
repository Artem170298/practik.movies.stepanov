import React from 'react';
import './spinner.css';
import { Flex, Spin } from 'antd';

const Spinner = () => (
  <div className="spinner-container">
    <Flex align="center" gap="middle">
      <Spin size="large" />
    </Flex>
  </div>
);

export default Spinner;
