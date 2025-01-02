import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { UserContext } from '../components/HomePage/UserContext'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const { setIsLoggedIn, setEmail,setRoles } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loginResponse = await fetch('https://localhost:7263/login?useCookies=true&useSessionCookies=true', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password: password }),
        credentials: 'include', 
      });

      if (loginResponse.ok) {
        
        const meResponse = await fetch('https://localhost:7263/me', {
          method: 'GET',
          credentials: 'include', 
        });

        if (meResponse.ok) {
          const userData = await meResponse.json();
          const userId = userData.userId;

          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('email', userData.email || 'Belirtilmemiş');
          localStorage.setItem('userId', userId || 'Bilinmiyor');
          localStorage.setItem('roles', JSON.stringify(userData.roles)); 

          setIsLoggedIn(true);
          setEmail(userData.email || 'Belirtilmemiş');
          setRoles(userData.roles); 


          const favListResponse = await fetch('https://localhost:7263/UserFav/GetList', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'accept': '*/*',
            },
            credentials: 'include', 
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
           
            localStorage.setItem('userFavList', JSON.stringify(favList));
          } else {
            console.error('Favoriler alınamadı.');
          }

          navigate('/'); 
        } else {
          const errorData = await meResponse.json();
          setErrorMessage(errorData.message || 'Kullanıcı bilgileri alınamadı.');
        }
      } else {
        const errorData = await loginResponse.json();
        setErrorMessage(errorData.message || 'Giriş başarısız.');
      }
    } catch (error) {
      console.error('Giriş işlemi sırasında hata oluştu:', error);
      setErrorMessage('Bir hata meydana geldi.');
    }
  };

  const handleTestLogin = () => {
    setUsername('Test54@gmail.com');
    setPassword('Test54@gmail.com');
    setTimeout(() => {
      document.getElementById('login-form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 100);
  };

  const handleAdminLogin = () => {
    setUsername('Admin1@example.com');
    setPassword('Admin1@example.com');
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

        <button
          className="test-button"
          onClick={handleTestLogin}
          style={{ marginTop: '10px', color: '#fff', backgroundColor: '#007bff', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}
        >
          Test Girişi
        </button>
        <br>
        </br>
        <button
          className="admin-button"
          onClick={handleAdminLogin}
          style={{ marginTop: '10px', color: '#fff', backgroundColor: '#007bff', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}
        >
          Admin Girişi
        </button>

        <p className="signup-text">
          Henüz hesabınız yok mu? <a href="/signup" className="signup-link">Kaydol</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
