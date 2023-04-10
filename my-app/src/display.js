import React from 'react';

export default function DataDisplay(props) {
  const { identified_header_libraries, required_packages, target_link_libraries, cmake_minimum_required_version, cpp_standard } = props.data;


  return (
    <div className="div-container">
      <div className="box">
        <div className='subbox'>
          <h2>Identified Header Libraries</h2>
        </div>
        <ul>
          {identified_header_libraries.map((library, index) => (
            <li key={index} className='list'>{library}</li>
          ))}
        </ul>
      </div>

      <div className="box">
        <div className='subbox'>
          <h2>Required Packages</h2>
        </div>
        <ul>
          {required_packages.map((pkg, index) => (
            <li key={index} className='list'>{pkg}</li>
          ))}
        </ul>
      </div>

      <div className="box">
        <div className='subbox'>
          <h2>Target Link Libraries</h2>
        </div>
        <ul>
          {target_link_libraries.map((library, index) => (
            <li key={index} className='list'>{library}</li>
          ))}
        </ul>
      </div>

      <div className="box">
        <div className='subbox'>
          <h2>Versions</h2>
        </div>
        <ul>
        <li className='list'>CMake version: {cmake_minimum_required_version}</li>
        <li className='list'>C++ standard: {cpp_standard}</li>
        </ul>
      </div>
    </div>
  );
}
