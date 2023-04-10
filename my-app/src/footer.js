import React from 'react';
import pdfFile from './SE_Report.pdf';
import './footer.css';


function Footer() {
  const names = [
    { name: 'Hiranmai', gitLink: 'https://github.com/hiranmai19' },
    { name: 'BharatSai', gitLink: 'https://github.com/Bharathsai2901' },
    { name: 'Roshan', gitLink: 'https://github.com/GroshanCS10' },
    { name: 'Akshara', gitLink: 'https://github.com/Akshara-333' },
    { name: 'Vinay', gitLink: 'https://github.com/Vinaykumar4007' },
    { name: 'Sidardha', gitLink: '' },
  ];

  return (
    <footer id="main-footer">
      <div className="footer-content">
        <ul className="names-list">
          {names.map((item, index) => (
            <li key={index}>
              <a href={item.gitLink}>{item.name}</a>
            </li>
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
