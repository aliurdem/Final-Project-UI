import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import { Dropdown, Menu, message } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';

const AppBar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, roles, logout } = useContext(UserContext); // Roller eklendi
  const [error, setError] = useState('');

  const handleButtonClick = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('https://localhost:7263/logout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        logout();
        navigate('/');
        message.success('Çıkış yapıldı!');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Çıkış yapılamadı, lütfen tekrar deneyin.');
      }
    } catch (err) {
      setError('Sunucuya bağlanırken bir hata oluştu.');
    }
  };

  // Dropdown Menü Elemanları
  const menu = (
    <Menu>
      <Menu.Item key="2" onClick={() => handleButtonClick('/my-routes')}>
        Rotalarım
      </Menu.Item>
      {/* Kullanıcı Admin rolüne sahipse "Kategoriler" menü öğesini göster */}
      {roles.includes('Admin') && (
        <Menu.Item key="3" onClick={() => handleButtonClick('/category-managment')}>
          Kategoriler
        </Menu.Item>
      )}
      <Menu.Divider />
      <Menu.Item key="4" danger onClick={handleLogout}>
        Çıkış Yap
      </Menu.Item>
    </Menu>
  );

  return (
    <div style={appBarStyle}>
      <div>
        <img src="/logo1.png" alt="Logo" style={{ height: '90px', marginLeft: '10px' }} />
      </div>

      <div style={navContainerStyle}>
        <button onClick={() => handleButtonClick('/')} style={buttonStyle}>Anasayfa</button>
        <button onClick={() => handleButtonClick('/our-routes')} style={buttonStyle}>Gezi Rotalarımız</button>
        <button onClick={() => handleButtonClick('/places')} style={buttonStyle}>Gezilecek Yerler</button>
        <button onClick={() => handleButtonClick('/about')} style={buttonStyle}>Biz Kimiz?</button>

        {isLoggedIn ? (
          <Dropdown overlay={menu} trigger={['click']}>
            <button style={userMenuStyle}>
              <UserOutlined style={{ fontSize: '16px', marginRight: '4px' }} />
              <DownOutlined />
            </button>
          </Dropdown>
        ) : (
          <div>
            <button onClick={() => handleButtonClick('/login')} style={authButtonStyle}>Giriş Yap</button>
            <button onClick={() => handleButtonClick('/signup')} style={authButtonStyle}>Kayıt Ol</button>
          </div>
        )}
      </div>

      {error && <div style={errorStyle}>{error}</div>}
    </div>
  );
};

// Stiller
const appBarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  padding: '10px',
};

const navContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  flexGrow: 1,
  justifyContent: 'flex-end',
};

const buttonStyle = {
  marginLeft: '8px',
  marginRight: '10px',
  padding: '10px',
  borderRadius: '5px',
  backgroundColor: '#997c70',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
};

const authButtonStyle = {
  marginLeft: '5px',
  marginRight: '5px',
  padding: '10px',
  borderRadius: '5px',
  backgroundColor: '#493628',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
};

const userMenuStyle = {
  marginLeft: '15px',
  padding: '10px',
  borderRadius: '5px',
  backgroundColor: '#493628',
  border: '1px solid #ccc',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
};

const errorStyle = {
  color: 'red',
  position: 'absolute',
  top: '10px',
  right: '10px',
};

export default AppBar;
