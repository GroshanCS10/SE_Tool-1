import React from 'react';
import pdfFile from './SE_Report.pdf';
import './footer.css';

function Footer() {
  const names = ['Team 10 :','Hiranmai', 'BharatSai', 'Roshan', 'Akshara', 'Vinay', 'Sidardha'];

  return (
    <footer id="main-footer">
      <div className="footer-content">
        <ul className="names-list">
          {names.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
        <a href={pdfFile} download="Dependalytics.pdf" className="download-link">
          Download Manual
        </a>
      </div>
    </footer>
  );
}

export default Footer;
