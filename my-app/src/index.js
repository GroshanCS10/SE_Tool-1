import React from "react";
import ReactDOM from "react-dom/client";
import Footer from "./footer.js";
import Upload from "./upload";

export default function App() {
  return (
    <div>
      {/* <h1 className='heading'>DEPENDALYTICS</h1> */}
      <div classname="main">
        <Upload />
        <Footer />
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
