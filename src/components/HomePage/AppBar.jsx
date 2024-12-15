import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from 'antd';

const AppBar = () => {
  const navigate = useNavigate();
  // Uygulama ilk açıldığında localStorage üzerinden login durumunu kontrol et
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [userInfo, setUserInfo] = useState({ 
    name: localStorage.getItem('username') || '' 
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Artık pingAuth yapmıyoruz, sadece localStorage’a göre kullanıcının login durumunu koruyoruz.
    // Eğer güvenli tarafta olmak istersek burada pingAuth yapabiliriz, 
    // ama istek üzerine bu mantığı kaldırıyoruz.
  }, []);

  const handleButtonClick = (index) => {
    switch (index) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/our-routes');
        break;
      case 2:
        navigate('/about');
        break;
      case 3:
        navigate('/login');
        break;
      case 4:
        navigate('/signup');
        break;
      case 5:
        navigate('/places');
        break;
      default:
        break;
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('https://localhost:7263/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // LocalStorage temizle
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        
        setIsLoggedIn(false);
        setUserInfo({ name: '' });
        navigate('/');
      } else {
        console.error('Logout failed');
        setError('Çıkış yapılamadı, lütfen tekrar deneyin.');
      }
    } catch (err) {
      console.error('Logout error:', err);
      setError('Sunucuya bağlanırken bir hata oluştu.');
    }
  };

  const handleAdminClick = () => {
    navigate('/admin-panel');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
      <div>
        <img src="/logo1.png" alt="Logo" style={{ height: '90px', marginLeft: '10px' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'flex-end' }}>
        <button onClick={() => handleButtonClick(0)} style={{ marginLeft: '8px', marginRight:'10px', padding: '10px', borderRadius: '5px', backgroundColor: '#997c70', color: 'white' }}>Anasayfa</button>
        <button onClick={() => handleButtonClick(1)} style={{ marginLeft: '8px', marginRight:'10px', padding: '10px', borderRadius: '5px', backgroundColor: '#997c70', color: 'white' }}>Gezi Rotalarımız</button>
        <button onClick={() => handleButtonClick(2)} style={{ marginLeft: '8px', marginRight:'10px', padding: '10px', borderRadius: '5px', backgroundColor: '#997c70', color: 'white' }}>Biz Kimiz?</button>
        <button onClick={() => handleButtonClick(5)} style={{ marginLeft: '8px', marginRight:'10px', padding: '10px', borderRadius: '5px', backgroundColor: '#997c70', color: 'white' }}>Gezilecek Yerler</button>
        
        {isLoggedIn ? (
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
            <button onClick={handleLogout} style={{ marginLeft: '10px', padding: '5px 10px', borderRadius: '5px', backgroundColor: '#714a38', color: 'white' }}>Çıkış Yap</button>
            {/* Avatar kullanmıyoruz, boş veya varsayılan bir şey istenmiyordu */}
            {/* <Avatar src={''} alt="Avatar" style={{ marginLeft: '15px' }} /> */}
            <button 
              onClick={handleAdminClick} 
              style={{ 
                marginLeft: '15px', 
                background: 'none', 
                border: 'none', 
                color: '#000', 
                textDecoration: 'underline', 
                cursor: 'pointer', 
                marginRight: '9px'
              }}>
              {userInfo.name}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button 
              onClick={() => handleButtonClick(3)} 
              style={{ 
                marginRight: '5px', 
                padding: '10px', 
                borderRadius: '5px', 
                backgroundColor: '#493628', 
                color: 'white' 
              }}
            >
              Giriş Yap
            </button>
            <button 
              onClick={() => handleButtonClick(4)} 
              style={{ 
                marginLeft: '5px', 
                padding: '10px', 
                borderRadius: '5px', 
                backgroundColor: '#493628', 
                color: 'white' 
              }}
            >
              Kayıt Ol
            </button>
          </div>
        )}
      </div>
      {error && <div style={{ color: 'red', position: 'absolute', top: '10px', right: '10px' }}>{error}</div>}
    </div>
  );
};

export default AppBar;
