import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { message, Modal } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { UserContext } from '../components/HomePage/UserContext';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';



const Places = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [places, setPlaces] = useState([]);
  const [favList, setFavList] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null); // Seçilen yer için state
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal görünürlüğü için state
  const { isLoggedIn } = useContext(UserContext);

  const GOOGLE_MAPS_API_KEY = 'AIzaSyADKPpfCt1tyPc9N9UN3sWZOMKQKYCclbU';

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });


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
      width={'70%'}
      onCancel={closeModal}
      bodyStyle={{
        backgroundColor: '#fff',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxHeight: '80vh',
        overflowY: 'auto',
      }}
    >
      <h2 style={{ color: '#333', marginBottom: '10px', fontSize: '24px', fontWeight: 'bold' }}>{selectedPlace.name}</h2>
      <p style={{ color: '#555', fontSize: '16px', lineHeight: '1.6', textAlign: 'center' }}>{selectedPlace.description}</p>
      <ul
        style={{
          color: '#555',
          fontSize: '14px',
          listStyle: 'none',
          padding: 0,
          marginTop: '15px',
          marginBottom: '20px',
          width: '100%',
          textAlign: 'left',
        }}
      >
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '10px',
        }}
      >
        {isLoggedIn && (
          <div
            onClick={() => toggleFavorite(selectedPlace.id)}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '16px',
              color: isFavorite(selectedPlace.id) ? '#ff4d4f' : '#555',
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
          width: '100%',
          height: '400px',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          marginTop: '20px',
        }}
      >
          <GoogleMap
            mapContainerStyle={{
              width: '100%',
              height: '100%',
            }}
            
            center={{
              lat: 41.6647069,
              lng: 26.5796547,
            }}
            zoom={15}
          >
            
            <Marker
              position={{
                lat: 41.6647069,
                lng: 26.5796547,
              }}
            />
          </GoogleMap>
      </div>
    </Modal>
      )}
    </div>
  );
};

export default Places;