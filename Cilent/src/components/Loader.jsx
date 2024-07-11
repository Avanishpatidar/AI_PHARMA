import React from 'react';
import { ClipLoader } from 'react-spinners';
import './Loader.css';

function Loader({ loading }) {
  return (
    <div className={`loader ${loading ? 'active' : ''}`}>
      <ClipLoader size={50} color="#ffffff" loading={loading} />
    </div>
  );
}

export default Loader;
