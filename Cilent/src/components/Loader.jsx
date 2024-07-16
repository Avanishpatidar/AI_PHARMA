import React from 'react';
import { ClipLoader } from 'react-spinners';
import './Loader.css';

function Loader({ loading, size = 20, color = "#ffffff" }) {
  return (
    <div className={`loader-container ${loading ? 'loading' : ''}`}>
      <ClipLoader size={size} color={color} loading={loading} />
    </div>
  );
}

export default Loader;
