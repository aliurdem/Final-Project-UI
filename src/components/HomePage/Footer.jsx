import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <p>Edirne’nin güzelliklerini herkes tarafından ulaşılabilir kılmak için yola çıktık.</p>
      </div>
      
      <div className="footer-center">
        <ul>
          <li>Anasayfa</li>
          <li>Gezi Rotalarımız</li>
          <li>Biz Kimiz?</li>
        </ul>
      </div>
      
      <div className="footer-right">
        <h3>Sosyal Medya</h3>
        <div className="social-icons">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <img src="facebook.png" alt="Facebook" className="icon" />
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <img src="twitter.png" alt="Twitter" className="icon" />
          </a>
          <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer">
            <img src="whatsapp.png" alt="WhatsApp" className="icon" />
          </a>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
            <img src="youtube.png" alt="YouTube" className="icon" />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <img src="instagram.png" alt="Instagram" className="icon" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
