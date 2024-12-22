import React, { useState, useRef, useEffect, useContext } from 'react';
import Slider from 'react-slick';
import { Modal, message } from 'antd';
import axios from 'axios';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import logo from '/edirnelogorenkli.png';
import { UserContext } from './UserContext'; 
import PlaceCardModal from './PlaceCardModel';

const CustomSlider = () => {
  const sliderRef = useRef(null);
  const { isLoggedIn } = useContext(UserContext);

  const [sliderData, setSliderData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    axios.get('https://localhost:7263/Place/GetAll')
      .then(response => {
        setSliderData(response.data.data);
      })
      .catch(error => {
        console.error("Veri çekme hatası:", error);
      });
  }, []);

  const showModal = (item) => {
    setSelectedItem(item);
    setIsFav(checkIfFav(item.id));
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
  };

  const checkIfFav = (placeId) => {
    const favList = JSON.parse(localStorage.getItem('userFavList')) || [];
    return favList.some((fav) => fav.placeId === placeId);
  };

  const toggleFav = async () => {
    if (isFav) {
      await removeFromFav(selectedItem.id);
    } else {
      await addToFav(selectedItem.id);
    }
    setIsFav(!isFav);
  };

  const addToFav = async (placeId) => {
    try {
      const response = await axios.post(
        'https://localhost:7263/UserFav',
        { placeId },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const favList = JSON.parse(localStorage.getItem('userFavList')) || [];
        favList.push({ placeId });
        localStorage.setItem('userFavList', JSON.stringify(favList));
        message.success("Favorilere eklendi!");
      }
    } catch (error) {
      console.error("Favorilere ekleme hatası:", error);
      message.error("Favorilere eklenirken bir hata oluştu.");
    }
  };

  const removeFromFav = async (placeId) => {
    try {
      const response = await axios.post(
        'https://localhost:7263/RemoveUserFav',
        { placeId },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const favList = JSON.parse(localStorage.getItem('userFavList')) || [];
        const updatedList = favList.filter((fav) => fav.placeId !== placeId);
        localStorage.setItem('userFavList', JSON.stringify(updatedList));
        message.success("Favorilerden kaldırıldı!");
      }
    } catch (error) {
      console.error("Favorilerden kaldırma hatası:", error);
      message.error("Favorilerden kaldırılırken bir hata oluştu.");
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 4,
    slidesToScroll: 1,
    centerMode: false,
    arrows: true,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 3,
          arrows: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          dots: false,
          arrows: false,
        },
      },
    ],
  };

  return (
    <div style={{ position: 'relative', width: '100%', backgroundColor: '#f3f4f6', padding: '40px 20px', borderRadius: '10px' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '30px', fontWeight: 'bold', fontSize: '1.8rem' }}>Keşfedilecek Yerler</h2>
      <Slider ref={sliderRef} {...settings}>
        {sliderData.map((item) => {
          const imageSrc = item.imageData
            ? `data:image/jpeg;base64,${item.imageData}`
            : logo;

          return (
            <div
              key={item.id}
              onClick={() => showModal(item)}
              style={{
                cursor: 'pointer',
                borderRadius: '15px',
                overflow: 'hidden',
                padding: '10px',
                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                backgroundColor: '#fff',
                maxWidth: '280px',
                margin: '0 auto',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 16px 32px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
              }}
            >
              <img
                alt={`Slider ${item.id}`}
                src={imageSrc}
                style={{
                  width: '100%',
                  height: '180px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  border: '2px solid #e1e4e8',
                }}
              />
            </div>
          );
        })}
      </Slider>
      <PlaceCardModal
        isVisible={isModalVisible}
        onClose={handleCancel}
        item={selectedItem}
        isFav={isFav}
        toggleFav={toggleFav}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
};

export default CustomSlider;
