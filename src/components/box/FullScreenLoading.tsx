import React, {FC} from 'react';
import {Spin} from 'antd';

const FullScreenLoading: FC = () => (
  <div style={{height: '100vh', width: '100vw'}} className="flex-center">
    <Spin size="large" />
  </div>
);
export default FullScreenLoading;
