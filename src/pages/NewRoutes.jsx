import React, { useState } from 'react';
import { Row, Col, Card, Button, Select, Checkbox, Typography, Radio, InputNumber, message } from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons'; // Geri ok ikonu
import { useNavigate } from 'react-router-dom'; // React Router'ı import et

const { Title, Text } = Typography;

const NewRoutes = () => {
  const navigate = useNavigate(); // useNavigate hook'u ile yönlendirme yapılacak
  const [selectionType, setSelectionType] = useState(null);
  const [routeType, setRouteType] = useState(null);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [duration, setDuration] = useState(null); // Yeni saat bilgisi state'i

  // Kullanıcı bilgileri
  const [user, setUser] = useState({
    username: 'Hatice Kartal',
    avatarUrl: './avatar.png', // Base64 formatına dönüştürülmesi gerekiyor
  });

  const popularPlaces = [
    { id: 1, name: 'Selimiye Camii', category: 'tarihi', favorite: true },
    { id: 2, name: 'Meriç Köprüsü', category: 'doğa', favorite: false },
    { id: 3, name: 'Karaağaç', category: 'kültürel', favorite: true },
    { id: 4, name: 'Edirne Müzesi', category: 'tarihi', favorite: true },
    { id: 5, name: 'Saray Mutfağı Restoran', category: 'yemek', favorite: false }
  ];

  const routeCategories = [
    { value: 'tarihi', label: 'Tarih Rotası' },
    { value: 'yemek', label: 'Yemek Rotası' },
    { value: 'doğa', label: 'Doğa Rotası' },
    { value: 'etkinlik', label: 'Etkinlik Rotası' },
    { value: 'karışık', label: 'Karışık Rota' }
  ];

  const handleSelectionTypeChange = (e) => {
    const value = e.target.value;
    setSelectionType(value);

    if (value === 'favorite') {
      const favoritePlaces = popularPlaces.filter(place => place.favorite);
      setSelectedPlaces(favoritePlaces);
    } else {
      setSelectedPlaces([]);
    }
  };

  const handleRouteTypeChange = (value) => {
    setRouteType(value);
    if (value !== 'karışık' && selectionType === 'favorite') {
      const filteredPlaces = popularPlaces.filter(place =>
        place.category === value && place.favorite
      );
      setSelectedPlaces(filteredPlaces);
    }
  };

  const togglePlaceSelection = (place) => {
    setSelectedPlaces(current =>
      current.includes(place)
        ? current.filter(p => p.id !== place.id)
        : [...current, place]
    );
  };

  // API'ye rota oluşturma isteği gönderme
  const createRoute = async () => {
    if (!routeType || selectedPlaces.length === 0 || !duration) return;

    // Kullanıcı profil fotoğrafını base64 formatına dönüştürme (örnek)
    const imageData = await toBase64(user.avatarUrl);

    const newRoute = {
      name: `${routeType} Rota`, // Rota ismi
      userId: user.username, // Kullanıcı ID'si
      averageDuration: `${duration} saat`, // Ortalama süre
      imageData: imageData, // Kullanıcı profil fotoğrafı (base64 formatında)
      categoryId: routeCategories.find(category => category.value === routeType).label, // Rota kategorisi
      places: selectedPlaces.map(place => ({
        id: place.id,
        sequence: selectedPlaces.indexOf(place),
        name: place.name,
        description: `${place.category} kategorisinde bir yer` // Açıklama
      }))
    };

    try {
      // API'ye POST isteği gönderme
      const response = await fetch('https://localhost:7263/TravelRoute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRoute),
      });

      if (response.ok) {
        const data = await response.json();
        message.success('Rota başarıyla oluşturuldu!');
        // Yeni oluşturulan rotayı ekleme
      } else {
        message.error('Rota oluşturulurken bir hata oluştu.');
      }
    } catch (error) {
      message.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  // Profil fotoğrafını base64 formatına dönüştüren fonksiyon
  const toBase64 = (url) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result.split(',')[1]); // Base64 string
        };
        reader.onerror = reject;
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = reject;
      xhr.send();
    });
  };

  // Geri tuşuna tıklandığında yönlendirme
  const handleBackClick = () => {
    navigate('/our-routes'); // Geri butonuna basıldığında /our-routes sayfasına yönlendir
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ position: 'relative', textAlign: 'center', marginBottom: '24px' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBackClick}
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 10,
            backgroundColor: '#3C2A21',
            color: 'white',
            border: 'none',
          }}
          type="default"
        >
          Geri
        </Button>
        <video
          src="/yenirota.mp4"
          autoPlay
          loop
          muted
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>

      <Title level={2} style={{ textAlign: 'center', color: '#3C2A21', fontFamily: 'Lobster, sans-serif' }}>
        Yeni Rota Oluştur
      </Title>

      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title level={4}>Yer Seçim Türünü Belirleyin</Title>
            <Radio.Group onChange={handleSelectionTypeChange} value={selectionType}>
              <Radio value="favorite">Favorilenen Yerler</Radio>
              <Radio value="all">Tüm Yerler</Radio>
            </Radio.Group>
          </Col>

          {selectionType && (
            <>
              <Col span={24}>
                <Title level={4}>Rota Türünü Seçin</Title>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Rota Kategorisi Seçin"
                  onChange={handleRouteTypeChange}
                  options={routeCategories}
                />
              </Col>

              <Col span={24}>
                <Title level={4}>Yerler</Title>
                <Row gutter={[8, 8]}>
                  {popularPlaces
                    .filter(place =>
                      selectionType === 'all' ||
                      (selectionType === 'favorite' && place.favorite)
                    )
                    .map(place => (
                      <Col key={place.id} span={8}>
                        <Checkbox
                          checked={selectedPlaces.some(p => p.id === place.id)}
                          onChange={() => togglePlaceSelection(place)}
                        >
                          {place.name}
                        </Checkbox>
                      </Col>
                    ))}
                </Row>
              </Col>

              <Col span={24}>
                <Title level={4}>Geziniz Kaç Saat Sürdü?</Title>
                <InputNumber min={1} max={24} value={duration} onChange={setDuration} style={{ width: '100%' }} />
              </Col>

              <Col span={24}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={createRoute}
                  block
                  disabled={!routeType || !duration}
                  style={{ backgroundColor: '#3C2A21', borderColor: '#3C2A21', color: 'white' }}
                >
                  Rotayı Oluştur
                </Button>
              </Col>
            </>
          )}
        </Row>
      </Card>
    </div>
  );
};

export default NewRoutes;
