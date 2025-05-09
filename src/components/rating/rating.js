import React from 'react';
import { Flex, Progress } from 'antd';
import './rating.css';

const Rating = () => (
  <Flex gap="small" wrap>
    <Progress
      type="circle"
      percent={7.5 * 10} // 7.5 → 75%
      strokeColor="#E9D100"
      trailColor="#e6f7ff"
      size={35}
      format={() => <span style={{ color: '#52c41a', fontWeight: 'bold' }}>7.5</span>}
    />
  </Flex>
);
export default Rating;
