// src/components/Loader.jsx
import React from 'react';
import { ClipLoader } from 'react-spinners';
import './Loader.css';

function Loader({ loading }) {
  return (
    <div className="loader">
      <ClipLoader size={20} color="#ffffff" loading={loading} />
    </div>
  );
}

export default Loader;
