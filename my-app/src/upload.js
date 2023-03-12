import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileInputChange = (e) => {
    setSelectedFile(e.target.files[0]);
    console.log(`Selected file: ${e.target.files[0].name}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      console.log('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('/api/upload', formData);
      console.log(response.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <div>
      <h1>File Uploader</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileInputChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default App;
