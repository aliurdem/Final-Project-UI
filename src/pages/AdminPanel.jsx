import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './AdminPanel.css';

const AdminPanel = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate(); 

  const handlePasswordChange = () => {
    console.log('Changing password to:', newPassword);
    setShowPasswordModal(false);
  };

  return (
    <div className="admin-panel" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif',
    }}>
      <header className="header" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}>
        <div className="user-info" style={{
          display: 'flex',
          alignItems: 'center',
        }}>
          <button onClick={() => navigate(-1)} style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '20px',
            color: 'black', 
          }}>←</button>
          <span className="username" style={{
            fontWeight: 'bold',
            marginLeft: '8px',
          }}>Hatice Kartal</span>
        </div>
        
        <div className="settings-icon" onClick={() => setShowPasswordModal(true)} style={{
          cursor: 'pointer',
          fontWeight: 'bold',
        }}>⚙️ Ayarlar</div>
      </header>

      <main className="content" style={{
        flex: 1,
        padding: '16px',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridGap: '16px',
      }}>
        <div
          className="box"
          onClick={() => navigate('/favorites')} 
          style={{
            backgroundImage: 'url("/foto1.png")',
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            padding: '16px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer', 
            color: '#fff',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)', 
          }}
        >
          ❤️ Favori Yerler
        </div>

        <div
          className="box"
          onClick={() => navigate('/saved-routes')}
          style={{
            backgroundImage: 'url("/foto2.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '16px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            color: '#fff',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
          }}
        >
          🔖 Kaydedilen Rotalar
        </div>

        <div
          className="box"
          onClick={() => navigate('/profile-settings')}
          style={{
            backgroundImage: 'url("/foto3.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '16px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            color: '#fff',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
          }}
        >
          ⚙️ Profil Ayarları
        </div>

        <div
          className="box"
          onClick={() => navigate('/help')}
          style={{
            backgroundImage: 'url("/foto4.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '16px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            color: '#fff',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
          }}
        >
          ❓ Yardım
        </div>

      </main>

      {showPasswordModal && (
        <div className="modal" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div className="modal-content" style={{
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '4px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}>
            <h2 style={{
              marginTop: 0,
              marginBottom: '16px',
            }}>Şifre Değiştir</h2>
            <input
              type="password"
              placeholder="Yeni Şifre"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
                marginBottom: '16px',
              }}
            />
            <div className="buttons" style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}>
              <button onClick={handlePasswordChange} style={{
                marginRight: '8px',
                padding: '8px 12px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}>Değiştir</button>
              <button onClick={() => setShowPasswordModal(false)} style={{
                padding: '8px 12px',
                backgroundColor: '#ccc',
                color: '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}>İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
