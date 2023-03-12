import React from 'react';
import ReactDOM from 'react-dom/client';

import Upload from './upload';

export default function App() {
  return (
    <div classname='main'>
      <Upload/>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

