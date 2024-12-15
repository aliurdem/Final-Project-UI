import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Giriş isteği
      const loginResponse = await fetch('https://localhost:7263/login?useCookies=true&useSessionCookies=true', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password: password }),
        credentials: 'include', // Kimlik doğrulama çerezlerini backend'den almak için
      });

      if (loginResponse.ok) {
        // Eğer giriş başarılıysa, kullanıcı bilgilerini çekmek için /me endpointine istek yap
        const meResponse = await fetch('https://localhost:7263/me', {
          method: 'GET',
          credentials: 'include', // Çerezleri göndermek için
        });

        if (meResponse.ok) {
          console.log("Başarılı Me")
          const userData = await meResponse.json();
          // Kullanıcı bilgilerini localStorage'a kaydet
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('email', userData.email || 'Belirtilmemiş');
          localStorage.setItem('userId', userData.userId || 'Bilinmiyor');

          navigate('/'); // Ana sayfaya yönlendir
        } else {
          console.log("Başarısız Me")

          // Kullanıcı bilgileri alınamazsa hata mesajı göster
          const errorData = await meResponse.json();
          setErrorMessage(errorData.message || 'Kullanıcı bilgileri alınamadı.');
        }
      } else {
        // Giriş başarısızsa hata mesajı göster
        const errorData = await loginResponse.json();
        setErrorMessage(errorData.message || 'Giriş başarısız.');
      }
    } catch (error) {
      console.error('Giriş işlemi sırasında hata oluştu:', error);
      setErrorMessage('Bir hata meydana geldi.');
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
    </div>
  );
};

export default Login;
