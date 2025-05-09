import React from 'react';
import { Alert } from 'antd';

const Error = ({ message }) => <Alert message={`Error: ${message}`} type="error" />;
const NotFound = ({ message }) => <Alert message={`Not Found: ${message}`} type="warning" />;
const offlineMessage = (
  <div className="offline-indicator">
    <h3>No Internet Connection</h3>
    <p>Please check your network settings and try again.</p>
  </div>
);
const Offline = () => <Alert message={offlineMessage} type="warning" />;
export { Error, NotFound, Offline };
