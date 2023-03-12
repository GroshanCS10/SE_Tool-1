import React from 'react';
import ReactDOM from 'react-dom/client';

import Upload from './upload';

export default function App() {
  return (

    <div>
      {/* <h1 className='heading'>DEPENDALYTICS</h1> */}
      <div classname='main'>
        <Upload/>
      </div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

