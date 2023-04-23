// import React from "react";

// export default function DataDisplay(props) {
//   const {
//     identified_header_libraries,
//     required_packages,
//     target_link_libraries,
//     identified_stl_libraries,
//     cmake_minimum_required_version,
//     cpp_standard,
//   } = props.data;
//   const { renderImg } = props.render;
//   console.log(renderImg);

//   return (
//     <>
//       <div className="div-container">
//         <div className="box">
//           <div className="subbox">
//             <h2>Identified Header Libraries</h2>
//           </div>
//           <ul>
//             {identified_header_libraries.map((library, index) => (
//               <li key={index} className="list">
//                 {library}
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div className="box">
//           <div className="subbox">
//             <h2>Required Packages</h2>
//           </div>
//           <ul>
//             {required_packages.map((pkg, index) => (
//               <li key={index} className="list">
//                 {pkg}
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div className="box">
//           <div className="subbox">
//             <h2>Target Link Libraries</h2>
//           </div>
//           <ul>
//             {target_link_libraries.map((library, index) => (
//               <li key={index} className="list">
//                 {library}
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div className="box">
//           <div className="subbox">
//             <h2>Versions</h2>
//           </div>
//           <ul>
//             <li className="list">
//               CMake version: {cmake_minimum_required_version}
//             </li>
//             <li className="list">C++ standard: {cpp_standard}</li>
//             {identified_stl_libraries.map((library, index) => (
//               <li key={index} className="list">
//                 {library} : 8.1.0
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </>
//   );
// }

import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DataDisplay(props) {
  // Extract props
  const {
    identified_header_libraries,
    required_packages,
    target_link_libraries,
    identified_stl_libraries,
    cmake_minimum_required_version,
    cpp_standard,
  } = props.data;

  // Calculate percentages
  const totalLibraries =
    identified_header_libraries.length +
    required_packages.length +
    target_link_libraries.length;
  const headerLibPercent =
    (identified_header_libraries.length / totalLibraries) * 100;
  const reqPkgPercent = (required_packages.length / totalLibraries) * 100;
  const tgtLinkLibPercent =
    (target_link_libraries.length / totalLibraries) * 100;

  console.log(
    totalLibraries,
    headerLibPercent,
    reqPkgPercent,
    tgtLinkLibPercent
  );

  const packages_data = [
    {
      id: "io2d",
      data: "https://github.com/cpp-io2d/P0267_RefImpl/blob/master/BUILDING.md",
    },
    {
      id: "GraphicsMagick",
      data: "sudo apt install libgraphicsmagick1-dev",
    },
    {
      id: "Cairo",
      data: "sudo apt install libcairo2-dev",
    },
    {
      id: "Threads",
      data: "Default for > c++11 version ",
    },
    {
      id: "elfio",
      data: "Download from https://sourceforge.net/projects/elfio/files/ then type the following command : g++ -o myapp myapp.cpp -I/usr/local/include/elfio -lelfio  ",
    },
  ];

  // Define data for pie chart
  const data = {
    labels: [
      "Identified Header Libraries",
      "Required Packages",
      "Target Link Libraries",
    ],
    datasets: [
      {
        data: [headerLibPercent, reqPkgPercent, tgtLinkLibPercent],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return " " + context.label + ": " + context.raw;
          },
        },
      },
    },
  };

  const download = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(props.data)], {
      type: "application/json",
    });
    element.href = URL.createObjectURL(file);
    element.download = "observations.json";
    document.body.appendChild(element);
    element.click();
  };

  function getPackageData(packageName) {
    console.log(packageName)
    const pkg = packages_data.find((pkg) => pkg.id === packageName);
    console.log(pkg)
    return pkg ? pkg.data : null;
  }

  return (
    <>
      {/* Render pie chart */}
      {/* <div className="box">
          <div className="subbox"> */}
      {/* </div> */}
      <div
        style={{
          width: "500px",
          height: "500px",
          margin: "0 auto",
          // display: "flex",
          // justifyContent: "center",
          // alignItems: "center",
        }}
      >
        <h2>Libraries Distribution</h2>
        <Pie data={data} options={options} />
      </div>

      {/* </div> */}

      <button onClick={download}>Download Data</button>

      {/* Render other data */}
      <div className="div-container">
        <div className="box">
          <div className="subbox">
            <h2>Identified Header Libraries</h2>
          </div>
          <ul>
            {identified_header_libraries.map((library, index) => (
              <li key={index} className="list">
                {library}
              </li>
            ))}
          </ul>
        </div>

        <div className="box">
          <div className="subbox">
            <h2>Required Packages</h2>
          </div>
          <ul>
            {required_packages.map((pkg, index) => (
              <li key={index} className="list">
                {pkg}
                {(
                  <span className="package-data">
                    : {getPackageData(pkg)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="box">
          <div className="subbox">
            <h2>Target Link Libraries</h2>
          </div>
          <ul>
            {target_link_libraries.map((library, index) => (
              <li key={index} className="list">
                {library}
              </li>
            ))}
          </ul>
        </div>

        <div className="box">
          <div className="subbox">
            <h2>Versions</h2>
          </div>
          <ul>
            <li className="list">
              CMake version: {cmake_minimum_required_version}
            </li>
            <li className="list">C++ standard: {cpp_standard}</li>
            {identified_stl_libraries.map((library, index) => (
              <li key={index} className="list">
                {library} : 8.1.0
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
