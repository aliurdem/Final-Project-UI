import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { UserContext } from '../components/HomePage/UserContext'; // UserContext dosyanızı doğru path ile import edin

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Context'ten setIsLoggedIn ve setEmail fonksiyonlarını alıyoruz
  const { setIsLoggedIn, setEmail } = useContext(UserContext);

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
          const userData = await meResponse.json();
          const userId = userData.userId;

          // Kullanıcı bilgilerini localStorage'a kaydet
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('email', userData.email || 'Belirtilmemiş');
          localStorage.setItem('userId', userId || 'Bilinmiyor');

          // Context de güncelle
          setIsLoggedIn(true);
          setEmail(userData.email || 'Belirtilmemiş');

          // Kullanıcının favorilerini almak için istek at
          const favListResponse = await fetch('https://localhost:7263/UserFav/GetList', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'accept': '*/*',
            },
            credentials: 'include', // Çerezler dahil
            body: JSON.stringify({
              filters: [
                {
                  property: 'UserId',
                  operator: '==',
                  value: userId,
                },
              ],
            }),
          });

          if (favListResponse.ok) {
            const favList = await favListResponse.json();
            // Favoriler localStorage'a kaydedilir
            localStorage.setItem('userFavList', JSON.stringify(favList));
          } else {
            console.error('Favoriler alınamadı.');
          }

          navigate('/'); // Ana sayfaya yönlendir
        } else {
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

  const handleTestLogin = () => {
    // Test bilgilerini doldur ve formu gönder
    setUsername('Test54@gmail.com');
    setPassword('Test54@gmail.com');
    // Formu otomatik gönder
    setTimeout(() => {
      document.getElementById('login-form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 100);
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2 className="title">Hoşgeldiniz! Giriş İçin Bilgilerinizi Girin</h2>
        <form className="login-form" id="login-form" onSubmit={handleSubmit}>
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

        {/* Test Giriş Butonu */}
        <button
          className="test-button"
          onClick={handleTestLogin}
          style={{ marginTop: '10px', color: '#fff', backgroundColor: '#007bff', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}
        >
          Test Girişi
        </button>

        <p className="signup-text">
          Henüz hesabınız yok mu? <a href="/signup" className="signup-link">Kaydol</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
