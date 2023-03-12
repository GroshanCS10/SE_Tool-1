import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Upload from './upload';

export default function App() {
  return (
    <div>
      <h1>Hello ! This is Bharat Sai</h1>
      <Upload/>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

