import React from 'react';
import { Flex, Progress } from 'antd';
import './rating.css';

const Rating = ({ rating, color }) => (
  <Flex gap="small" wrap>
    <Progress
      type="circle"
      percent={10 * 10}
      strokeColor={color}
      trailColor="#e6f7ff"
      size={35}
      format={() => (
        <span
          style={{
            color: ` #000000`,
            fontWeight: 'bold',
          }}
        >
          {rating}
        </span>
      )}
    />
  </Flex>
);
export default Rating;
