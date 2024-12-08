import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from 'antd';

const AppBar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', avatar: '' });

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);

    if (loggedInStatus) {
      const name = localStorage.getItem('username');
      const avatar = localStorage.getItem('avatar');
      setUserInfo({ name, avatar });
    }
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
        navigate('/places'); // Gezilecek Yerler butonu için yeni yol
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('avatar');
    setIsLoggedIn(false);
    navigate('/');
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
        {/* Yeni Gezilecek Yerler butonu */}
        <button onClick={() => handleButtonClick(5)} style={{ marginLeft: '8px', marginRight:'10px', padding: '10px', borderRadius: '5px', backgroundColor: '#997c70', color: 'white' }}>Gezilecek Yerler</button>
        
        {isLoggedIn ? (
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
            <button onClick={handleLogout} style={{ marginLeft: '10px', padding: '5px 10px', borderRadius: '5px', backgroundColor: '#714a38', color: 'white' }}>Çıkış Yap</button>
            <Avatar src={userInfo.avatar} alt="Avatar" style={{ marginLeft: '15px' }} />
            <button 
              onClick={handleAdminClick} 
              style={{ 
                marginLeft: '2px', 
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
    </div>
  );
};

export default AppBar;
