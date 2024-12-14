import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Places = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    // API'yi kendi adresinize göre güncelleyin
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
  }, []);

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
          padding: '5px 0', // Header'ın dikey boyutunu artırdık
          backgroundColor: '#493628', // Header arka plan rengi
        }}
      >
        <h1 style={{ 
          color: '#fff', // Başlık rengi beyaz
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
                backgroundColor: 'transparent', // Arama kutusunun arka planını renksiz yap
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

      {/* Kartlar Grid: Her satırda 4 tane, daha küçük görseller için sabit yükseklik */}
      <div 
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '5px',
          margin: 0,
          padding: 0,
          // Eğer sayfanın tamamını kapsıyorsa ve scroll isterseniz:
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
              height: '250px', // Sabit yükseklik ayarı
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end'
            }}
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
    </div>
  );
};

export default Places;
