import React, { useState } from 'react';
import { Modal, message } from 'antd';
import axios from 'axios';
import logo from '/edirnelogorenkli.png'; // Placeholder image
import { HeartOutlined, HeartFilled } from '@ant-design/icons'; // Ant Design simgeleri

const SliderCard = ({
  placeId,
  placeName,
  description,
  locationInfo,
  visitableHours,
  entranceFee,
  imageData,
  isLoggedIn,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFav, setIsFav] = useState(checkIfFav(placeId));

  // Favori kontrol fonksiyonu
  function checkIfFav(placeId) {
    const favList = JSON.parse(localStorage.getItem('userFavList')) || [];
    return favList.some((fav) => fav.placeId === placeId);
  }

  const updateFavList = async () => {
    try {
      const response = await axios.post(
        'https://localhost:7263/UserFav/GetList',
        {
          filters: [{ property: 'UserId', operator: '==', value: localStorage.getItem('userId') }],
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        localStorage.setItem('userFavList', JSON.stringify(response.data));
      } else {
        console.error("Favori listesi güncellenemedi.");
      }
    } catch (error) {
      console.error("Favori listesi güncelleme hatası:", error);
    }
  };

  const toggleFav = async () => {
    if (isFav) {
      await removeFromFav();
    } else {
      await addToFav();
    }

    setIsFav(!isFav);

    // API'den favori listesini çekip localStorage'ı güncelle
    await updateFavList();
  };

  const addToFav = async () => {
    try {
      const response = await axios.post(
        'https://localhost:7263/UserFav',
        { placeId },
        { withCredentials: true }
      );

      if (response.status === 200) {
        message.success("Favorilere eklendi!");
      } else {
        message.error("Favorilere eklenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Favorilere ekleme hatası:", error);
      message.error("Favorilere eklenirken bir hata oluştu.");
    }
  };

  const removeFromFav = async () => {
    try {
      const response = await axios.post(
        'https://localhost:7263/RemoveUserFav',
        { placeId },
        { withCredentials: true }
      );

      if (response.status === 200) {
        message.success("Favorilerden kaldırıldı!");
      } else {
        message.error("Favorilerden kaldırılırken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Favorilerden kaldırma hatası:", error);
      message.error("Favorilerden kaldırılırken bir hata oluştu.");
    }
  };

  return (
    <div style={cardStyle}>
      {/* Görsel */}
      <div style={{ position: 'relative' }}>
        <img
          alt={`Slider ${placeId}`}
          src={imageData ? `data:image/jpeg;base64,${imageData}` : logo}
          style={imageStyle}
        />
        {isLoggedIn && (
          <div onClick={toggleFav} style={favIconStyle}>
            {isFav ? (
              <HeartFilled style={{ fontSize: '24px', color: '#ff4d4f' }} />
            ) : (
              <HeartOutlined style={{ fontSize: '24px', color: '#fff' }} />
            )}
          </div>
        )}
      </div>

      {/* İçerik */}
      <div style={contentStyle}>
        <h3 style={titleStyle}>{placeName}</h3>
        <p style={descriptionStyle}>{description}</p>
        <div style={infoStyle}>
          <p>📍 {locationInfo}</p>
          <p>⏰ {visitableHours}</p>
          <p>💰 {entranceFee}</p>
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={isModalVisible}
        footer={null}
        width={'60%'}
        onCancel={() => setIsModalVisible(false)}
        bodyStyle={{
          backgroundColor: '#F6EFE9',
          borderRadius: '20px',
          padding: '20px',
        }}
      >
        <h2>{placeName}</h2>
        <p>{description}</p>
        <p>📍 {locationInfo}</p>
        <p>⏰ {visitableHours}</p>
        <p>💰 {entranceFee}</p>
      </Modal>
    </div>
  );
};

// CSS stilleri
const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  margin: '10px',
  backgroundColor: '#fff',
  cursor: 'pointer',
};

const imageStyle = {
  width: '100%',
  height: '200px',
  objectFit: 'cover',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
};

const favIconStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  borderRadius: '50%',
  padding: '8px',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const contentStyle = {
  padding: '15px',
  textAlign: 'center',
};

const titleStyle = {
  fontSize: '18px',
  fontWeight: '600',
  margin: '10px 0',
  color: '#493628',
};

const descriptionStyle = {
  fontSize: '14px',
  color: '#666',
  marginBottom: '10px',
};

const infoStyle = {
  fontSize: '14px',
  color: '#333',
  textAlign: 'left',
  lineHeight: '1.5',
};

export default SliderCard;
