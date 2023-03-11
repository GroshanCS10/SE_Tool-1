import React from 'react';
import ReactDOM from 'react-dom/client';
import './upload.css';
import reportWebVitals from './reportWebVitals';
import Upload from './upload';

export default function App() {
  return (
    <div>
      <Upload/>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

