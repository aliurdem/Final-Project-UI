import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import icon1 from '/icon1.png';
import icon2 from '/icon2.png';
import icon3 from '/icon3.png';
import icon4 from '/icon4.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Sabit kullanıcı adı ve şifreyi kontrol et
    const correctUsername = 'admin';
    const correctPassword = 'admin123';

    if (username === correctUsername && password === correctPassword) {
      // Başarılı giriş
      localStorage.setItem('isLoggedIn', 'true'); // Giriş durumunu kaydet
      localStorage.setItem('username', 'Admin Kullanıcı');
      localStorage.setItem('avatar', '/avatar.png');
      
      navigate('/'); // Ana sayfaya yönlendir
    } else {
      // Hatalı giriş
      setErrorMessage('Kullanıcı adı veya şifre yanlış.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2 className="title">Hoşgeldiniz! Giriş İçin Bilgilerinizi Girin</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Kullanıcı Adı" 
            className="input-field" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Şifre" 
            className="input-field" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="submit-button">Giriş Yap</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
        <p className="signup-text">
          Henüz hesabınız yok mu? <a href="/signup" className="signup-link">Kaydol</a>
        </p>
      </div>
      <div className="image-container">
        <img src="/login.png" alt="Kayıt İllustrasyonu" className="login-image" />
        <img src={icon1} alt="İkon 1" className="icon icon-top-left" />
        <img src={icon2} alt="İkon 2" className="icon icon-top-right" />
        <img src={icon3} alt="İkon 3" className="icon icon-bottom-left" />
        <img src={icon4} alt="İkon 4" className="icon icon-bottom-right" />
      </div>
    </div>
  );
};

export default Login;
