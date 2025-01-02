import React from 'react';
import { Modal } from 'antd';
import { GoogleMap, MarkerF } from '@react-google-maps/api';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';

const CommonModal = ({
  isVisible,
  onClose,
  title,
  item,
  isFav,
  toggleFav,
  isLoggedIn,
  width = '50%',
  bodyStyle = {},
}) => {
  return (
    <Modal
      open={isVisible}
      footer={null}
      width={width}
      onCancel={onClose}
      centered 
      bodyStyle={{
        backgroundColor: '#F6EFE9',
        borderRadius: '15px',
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxSizing: 'border-box',
        ...bodyStyle,
      }}
    >
      {item && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', gap: '15px', width: '100%', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 250px' }}>
              <img
                alt={item.name}
                src={item.imageData ? `data:image/jpeg;base64,${item.imageData}` : './erikli.png'}
                style={{
                  width: '200px',
                  height: '250px',
                  borderRadius: '10px',
                  objectFit: 'cover',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                }}
              />
              {isLoggedIn && (
                <div
                  onClick={toggleFav}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '8px',
                    cursor: 'pointer',
                    color: isFav ? '#ff4d4f' : '#493628',
                    fontWeight: '500',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{isFav ? <HeartFilled /> : <HeartOutlined />}</span>
                  <span>{isFav ? 'Favorilerden Kaldır' : 'Favorilere Ekle'}</span>
                </div>
              )}
            </div>

            {/* Detaylar */}
            <div
              style={{
                flex: '2 1 300px',
                backgroundColor: '#FDF8F4',
                borderRadius: '8px',
                padding: '10px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h2 style={{ color: '#493628', marginBottom: '8px', fontSize: '20px', textAlign: 'left' }}>{item.name}</h2>
              <ul style={{ color: '#493628', fontSize: '12px', listStyle: 'none', padding: 0, marginTop: '12px' }}>
                <li>
                  <span style={{ marginRight: '6px', fontWeight: 'bold' }}>⏰</span>
                  Ziyaret Saatleri: {item.visitableHours}
                </li>
                <li>
                  <span style={{ marginRight: '6px', fontWeight: 'bold' }}>💰</span>
                  Giriş Ücreti: {item.entranceFee}
                </li>
              </ul>
              <p style={{ color: '#493628', fontSize: '13px', lineHeight: '1.5', textAlign: 'left' }}>{item.description}</p>
            </div>
          </div>

          {/* Harita */}
          <div
            style={{
              width: '100%',
              height: '250px',
              marginTop: '15px',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <GoogleMap
              mapContainerStyle={{
                width: '100%',
                height: '100%',
              }}
              center={{
                lat: item.latitude,
                lng: item.longitude,
              }}
              zoom={14}
            >
              <MarkerF
                position={{
                  lat: item.latitude,
                  lng: item.longitude,
                }}
              />
            </GoogleMap>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CommonModal;
