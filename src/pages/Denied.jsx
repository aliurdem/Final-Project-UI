import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const AccessDenied = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/'); // Ana sayfaya yönlendirme
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 style={{ fontSize: '48px', color: '#ff4d4f' }}>403 - Yetkisiz Erişim</h1>
      <p style={{ fontSize: '18px', color: '#595959' }}>
        Bu sayfaya erişim izniniz yok. Yetkilendirilmiş bir kullanıcı olarak giriş yapmayı deneyin.
      </p>
      <Button type="primary" onClick={goHome} style={{ marginTop: '20px' }}>
        Ana Sayfaya Git
      </Button>
    </div>
  );
};

export default AccessDenied;
