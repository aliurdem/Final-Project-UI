import React, { useState, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import { Modal } from 'antd';
import axios from 'axios';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import logo from '/edirnelogorenkli.png'; // Placeholder image

const CustomSlider = () => {
  const sliderRef = useRef(null);

  const [sliderData, setSliderData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // API'den veri çek
  useEffect(() => {
    axios.get('https://localhost:7263/Place/GetAll')
      .then(response => {
        // response.data.data yapısında beklenen alanlar:
        // id, name, description, imageData, categoryId, categoryName, locationInfo, visitHours, entranceFee
        setSliderData(response.data.data);
      })
      .catch(error => {
        console.error("Veri çekme hatası:", error);
      });
  }, []);

  const showModal = (item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000, 
    slidesToShow: 5,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '0px',
    arrows: false,
    responsive: [
      {
        breakpoint: 1440,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div style={{ position: 'relative', width: '100vw', backgroundColor: '#FFFFFF', padding: '20px' }}>
      <Slider ref={sliderRef} {...settings}>
        {sliderData.map((item) => {
          const imageSrc = item.imageData 
            ? `data:image/jpeg;base64,${item.imageData}` 
            : logo; // imageData boşsa logo kullan

          return (
            <div key={item.id} onClick={() => showModal(item)} style={{ cursor: 'pointer', margin: '10px 5px' }}>
              <img 
                alt={`Slider ${item.id}`} 
                src={imageSrc} 
                style={{ 
                  height: '350px', 
                  width: '280px', 
                  objectFit: 'contain', 
                  borderRadius: '8px' 
                }} 
              />
            </div>
          );
        })}
      </Slider>

      <Modal
        open={isModalVisible}
        footer={null}
        width={'60%'}
        onCancel={handleCancel}
        closeIcon={null}
        bodyStyle={{
          backgroundColor: '#F6EFE9',
          borderRadius: '20px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <button 
          onClick={handleCancel} 
          style={{ 
            position: 'absolute', 
            top: '20px', 
            right: '20px', 
            backgroundColor: 'transparent', 
            border: 'none', 
            fontSize: '18px', 
            cursor: 'pointer', 
            color: '#493628' 
          }}
        >
          ✕
        </button>

        {selectedItem && (
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', width: '100%' }}>
            {/* Görsel alanı */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                alt={selectedItem.name}
                src={selectedItem.imageData 
                  ? `data:image/jpeg;base64,${selectedItem.imageData}`
                  : logo
                }
                style={{
                  width: '280px',
                  height: '380px',
                  borderRadius: '12px',
                  objectFit: 'cover',
                }}
              />
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  marginTop: '10px', 
                  cursor: 'pointer',
                  transition: 'color 0.3s ease',
                }}
              >
                <span 
                  style={{ 
                    fontSize: '24px', 
                    color: '#685752',
                  }}
                >
                  &#9829;
                </span>
                <span 
                  style={{ 
                    fontSize: '16px', 
                    fontWeight: '500', 
                    color: '#997C70' 
                  }}
                >
                  Favorilere Ekle
                </span>
              </div>
            </div>

            {/* Metin alanı */}
            <div
              style={{
                flex: 1,
                backgroundColor: '#FDF8F4',
                borderRadius: '10px',
                padding: '15px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h2 style={{ color: '#493628', marginBottom: '10px' }}>{selectedItem.name}</h2>
              <p style={{ color: '#493628', fontSize: '16px', lineHeight: '1.5' }}>{selectedItem.description}</p>
              <ul style={{ color: '#493628', fontSize: '14px', listStyle: 'none', padding: 0, marginTop: '20px' }}>
                <li>
                  <span style={{ marginRight: '8px', fontWeight: 'bold' }}>📍</span>
                  Konum: {selectedItem.locationInfo}
                </li>
                <li>
                  <span style={{ marginRight: '8px', fontWeight: 'bold' }}>⏰</span>
                  Ziyaret Saatleri: {selectedItem.visitableHours}
                </li>
                <li>
                  <span style={{ marginRight: '8px', fontWeight: 'bold' }}>💰</span>
                  Giriş Ücreti: {selectedItem.entranceFee}
                </li>
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CustomSlider;
