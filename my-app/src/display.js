import React from 'react';

export default function DataDisplay(props) {
  const { identified_header_libraries, required_packages, target_link_libraries } = props.data;

  return (
    <div>
      <h1>Data Display</h1>
      <h2>Identified Header Libraries</h2>
      <table>
        <thead>
          <tr>
            <th>Library Name</th>
          </tr>
        </thead>
        <tbody>
          {identified_header_libraries.map((library, index) => (
            <tr key={index}>
              <td>{library}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Required Packages</h2>
      <table>
        <thead>
          <tr>
            <th>Package Name</th>
          </tr>
        </thead>
        <tbody>
          {required_packages.map((pkg, index) => (
            <tr key={index}>
              <td>{pkg}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Target Link Libraries</h2>
      <table>
        <thead>
          <tr>
            <th>Library Name</th>
          </tr>
        </thead>
        <tbody>
          {target_link_libraries.map((library, index) => (
            <tr key={index}>
              <td>{library}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
