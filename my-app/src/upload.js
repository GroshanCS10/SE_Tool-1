import React, { useState } from "react";
import axios from "axios";
import Display from "./display";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [data, setData] = useState(null);

  const handleFileInputChange = (e) => {
    setSelectedFile(e.target.files[0]);
    console.log(`Selected file: ${e.target.files[0].name}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      console.log("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("/api/upload", formData);
      console.log(response.data);
      setData(response.data.observations);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <div>
      <div className="upload-form">
        <h4>Upload your Zip file here</h4>
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileInputChange} />
          <br />
          <button type="submit" className="button">
            Upload
          </button>
        </form>
      </div>
      {/* <div class="div-container">
        <div class="box">Box 1</div>
        <div class="box">Box 2</div>
        <div class="box">Box 3</div>
      </div> */}
      {data && <Display data={data} />}
    </div>
  );
}

export default App;
