import React, { useState} from 'react';
import axios from 'axios';
import Display from './display';
import './main.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [link, setLink] = useState("");
  const [data, setData] = useState(null);
  const [renderImg, setRenderImg] = useState(false)

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
      setRenderImg(true);
      // console.log(renderImg)
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const handleLinkInputChange = (e) => {
    setLink(e.target.value);
    console.log(e.target.value);
  };
  
  const handleLinkSubmit = async (e) => {
    e.preventDefault();
  
    if (!link) {
      console.log("Please enter a link");
      return;
    }
  
    try {
      console.log(link);
      const response = await axios.post("/api/link", { link: link });
      console.log(response.data);
      setData(response.data.observations);
      console.log(data)
      setRenderImg(true);
      // console.log(renderImg)
    } catch (error) {
       console.log(error.response.data);
    }
  };
  

  return (
    <div>
      <div className='titlecontainer'>
        <h1 className='title'>DEPENDALYTICS</h1>
      </div>
      <div className='intro'>
      <h3 className='introtext'>Dependanalytics - A Tool designed by Team 10 to find & learn comprehensively about different dependencies present in a project. This tool effectively works on showing dependencies related to C++ just by uploading the project folder you wanna work on and there you go!! You get the desired C++ Libraries/Dependencies present in a project.The best part is you can find the dependencies without running the code.
      </h3>
      </div>
      <div className="form-container">
        <h2 className='fileuploader'>FILE UPLOADER</h2>
        <form className="form" onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileInputChange} />
          <button type="submit">Upload</button>
        </form>

        <form className="link" onSubmit={handleLinkSubmit}>
          <input type="text" onChange={handleLinkInputChange} />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className='Data'>
      {/* {renderImg && <img src="./img/temp.png" height="20" width="20" alt="Dependency graph"/>} */}
      {console.log(renderImg)}
      {renderImg && <Display data={data} render={renderImg} />}
      {/* {renderImg && <img src="./img/temp.png" height="20" width="20" alt="Dependency graph"/>} */}
      </div>
      <div className='definitions-container'>
        <div className='definition'>
          <h3>Header Files</h3>
            <p>A header file in C++ is a file that contains declarations of various program elements such as functions, classes, and variables, which can be utilized in a C++ program.</p>
        </div>
        <div className='definition'>
          <h3>Target Link Libraries</h3>
          <p>Target-link dependencies refer to the relationship between a software target and the libraries or objects it depends on to be built successfully. Managing target-link dependencies is an important part of software development, as it ensures that the final output is complete and functional. Build systems such as Make, CMake, and Gradle provide tools for specifying and managing these dependencies, making it easier for developers to build complex software projects with multiple targets and dependencies.</p>
        </div>
        <div className='definition'>
          <h3>External Library Dependencies</h3>
          <p>When developing software, an External library dependency occurs when a project or application relies on an external library or module for its proper functioning. However, managing these dependencies can be challenging, as they may introduce version compatibility issues, security vulnerabilities, or licensing conflicts. To manage external library dependencies, developers use package managers or build systems that automate the process of downloading, installing, and linking the required libraries. Some popular package managers include npm, pip, and Maven, while build systems such as CMake, Make, and Gradle provide tools for specifying and managing external library dependencies in build scripts.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
