import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { message, Modal } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { UserContext } from '../components/HomePage/UserContext';

const Places = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [places, setPlaces] = useState([]);
  const [favList, setFavList] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null); // Seçilen yer için state
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal görünürlüğü için state
  const { isLoggedIn } = useContext(UserContext);

  useEffect(() => {
    // Yerleri API'den çek
    axios.get('https://localhost:7263/Place/GetAll')
      .then(response => {
        const apiData = response.data.data || [];
        const transformedData = apiData.map(item => ({
          ...item,
          image: item.imageData 
            ? `data:image/jpeg;base64,${item.imageData}` 
            : './erikli.png'
        }));
        setPlaces(transformedData);
      })
      .catch(error => {
        console.error("Veri çekme hatası:", error);
      });

    // Favori listesini localStorage'dan yükle
    const storedFavList = JSON.parse(localStorage.getItem('userFavList')) || [];
    setFavList(storedFavList);
  }, []);

  // Favori kontrol fonksiyonu
  const isFavorite = (placeId) => {
    return favList.some((fav) => fav.placeId === placeId);
  };

  // Favori ekleme/kaldırma
  const toggleFavorite = async (placeId) => {
    if (!isLoggedIn) return;
    if (isFavorite(placeId)) {
      await removeFromFavorites(placeId);
    } else {
      await addToFavorites(placeId);
    }
  };

  const addToFavorites = async (placeId) => {
    try {
      const response = await axios.post(
        'https://localhost:7263/UserFav',
        { placeId },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const updatedFavList = [...favList, { placeId }];
        setFavList(updatedFavList);
        localStorage.setItem('userFavList', JSON.stringify(updatedFavList));
        message.success('Favorilere eklendi!');
      }
    } catch (error) {
      console.error("Favorilere ekleme hatası:", error);
      message.error('Favorilere eklenirken bir hata oluştu.');
    }
  };

  const removeFromFavorites = async (placeId) => {
    try {
      const response = await axios.post(
        'https://localhost:7263/RemoveUserFav',
        { placeId },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const updatedFavList = favList.filter((fav) => fav.placeId !== placeId);
        setFavList(updatedFavList);
        localStorage.setItem('userFavList', JSON.stringify(updatedFavList));
        message.success('Favorilerden kaldırıldı!');
      }
    } catch (error) {
      console.error("Favorilerden kaldırma hatası:", error);
      message.error('Favorilerden kaldırılırken bir hata oluştu.');
    }
  };

  // Modal kontrol
  const openModal = (place) => {
    setSelectedPlace(place);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setSelectedPlace(null);
    setIsModalVisible(false);
  };

  const filteredPlaces = places.filter(place =>
    place.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div 
      style={{
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#F6EFE9',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: '5px 0',
          backgroundColor: '#493628',
        }}
      >
        <h1 style={{ 
          color: '#fff',
          fontSize: '28px', 
          margin: 0,
          fontFamily: 'Lobster, sans-serif'
        }}>
          Gezi Lokasyonları
        </h1>

        {/* Arama Alanı */}
        <div 
          style={{
            marginTop: '10px',
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            padding: '0 20px'
          }}
        >
          <div style={{ position: 'relative', width: '300px' }}>
            <input 
              type="text"
              placeholder="Gezilecek yer ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 40px 10px 15px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                outline: 'none',
                fontSize: '14px',
                backgroundColor: 'transparent',
              }}
            />
            <span style={{
              position: 'absolute',
              right: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#493628'
            }}>🔍</span>
          </div>
        </div>
      </div>

      {/* Kartlar Grid */}
      <div 
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '10px',
          margin: '10px',
          padding: '10px',
          overflowY: 'auto'
        }}
      >
        {filteredPlaces.map(place => (
          <div 
            key={place.id} 
            style={{
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'relative',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              height: '250px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end'
            }}
            onClick={() => openModal(place)}
          >
            <img 
              src={place.image} 
              alt={place.name} 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover', 
                display: 'block',
                position: 'absolute',
                top: 0,
                left: 0
              }}
            />
            <div 
              style={{
                position: 'relative',
                background: 'rgba(0,0,0,0.4)',
                color: '#fff',
                padding: '5px',
                fontSize: '14px',
                textAlign: 'center'
              }}
            >
              {place.name}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedPlace && (
        <Modal
          open={isModalVisible}
          footer={null}
          width={'60%'}
          onCancel={closeModal}
          bodyStyle={{
            backgroundColor: '#F6EFE9',
            borderRadius: '20px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                alt={selectedPlace.name}
                src={selectedPlace.image}
                style={{
                  width: '280px',
                  height: '380px',
                  borderRadius: '12px',
                  objectFit: 'cover',
                }}
              />
              {isLoggedIn && (
                <div
                  onClick={() => toggleFavorite(selectedPlace.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '10px',
                    cursor: 'pointer',
                    color: isFavorite(selectedPlace.id) ? '#ff4d4f' : '#493628',
                    fontWeight: '500',
                  }}
                >
                  {isFavorite(selectedPlace.id) ? <HeartFilled /> : <HeartOutlined />}
                  <span>
                    {isFavorite(selectedPlace.id) ? 'Favorilerden Kaldır' : 'Favorilere Ekle'}
                  </span>
                </div>
              )}
            </div>

            <div
              style={{
                flex: 1,
                backgroundColor: '#FDF8F4',
                borderRadius: '10px',
                padding: '15px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h2 style={{ color: '#493628', marginBottom: '10px' }}>{selectedPlace.name}</h2>
              <p style={{ color: '#493628', fontSize: '16px', lineHeight: '1.5' }}>
                {selectedPlace.description}
              </p>
              <ul style={{ color: '#493628', fontSize: '14px', listStyle: 'none', padding: 0, marginTop: '20px' }}>
                <li>
                  <span style={{ marginRight: '8px', fontWeight: 'bold' }}>📍</span>
                  Konum: {selectedPlace.locationInfo}
                </li>
                <li>
                  <span style={{ marginRight: '8px', fontWeight: 'bold' }}>⏰</span>
                  Ziyaret Saatleri: {selectedPlace.visitableHours}
                </li>
                <li>
                  <span style={{ marginRight: '8px', fontWeight: 'bold' }}>💰</span>
                  Giriş Ücreti: {selectedPlace.entranceFee}
                </li>
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Places;
