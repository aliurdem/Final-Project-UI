// SignUp.jsx
import React from 'react';
import './SignUp.css';
import icon1 from '/icon1.png';
import icon2 from '/icon2.png';
import icon3 from '/icon3.png';
import icon4 from '/icon4.png';


const SignUp = () => {
  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <h2 className="title">Bize Katılın!</h2>
        <form className="signup-form">
          <input type="text" placeholder="Ad" className="input-field" />
          <input type="text" placeholder="Soyad" className="input-field" />
          <input type="email" placeholder="E-Mail" className="input-field" />
          <input type="password" placeholder="Şifre" className="input-field" />
          <button type="submit" className="submit-button">Kaydol</button>
        </form>
        <p className="login-text">
          Hesabınız var mı? <a href="/login" className="login-link">Giriş Yap</a>
        </p>
      </div>
      <div className="image-container">
        <img src="/signup.png" alt="Kayıt İllustrasyonu" className="signup-image" />
        <img src={icon1} alt="İkon 1" className="icon icon-top-left" />
        <img src={icon2} alt="İkon 2" className="icon icon-top-right" />
        <img src={icon3} alt="İkon 3" className="icon icon-bottom-left" />
        <img src={icon4} alt="İkon 4" className="icon icon-bottom-right" />


      </div>
    </div>
  );
};

export default SignUp;

