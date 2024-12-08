import React, { useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Select, 
  Checkbox, 
  Typography, 
  Radio, 
  Avatar 
} from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons'; // Geri ok ikonu
import { useNavigate } from 'react-router-dom'; // React Router'ı import et

const { Title, Text } = Typography;

const NewRoutes = () => {
  const navigate = useNavigate(); // useNavigate hook'u ile yönlendirme yapılacak
  const [selectionType, setSelectionType] = useState(null);
  const [routeType, setRouteType] = useState(null);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [createdRoutes, setCreatedRoutes] = useState([]);

  // Kullanıcı bilgileri
  const [user, setUser] = useState({
    username: 'Hatice Kartal',
    avatarUrl: './avatar.png', 
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

  const createRoute = () => {
    if (!routeType || selectedPlaces.length === 0) return;

    const newRoute = {
      id: Date.now(),
      type: routeType,
      places: selectedPlaces,
      user: user,
    };

    setCreatedRoutes([...createdRoutes, newRoute]);
  };

  // Geri tuşuna tıklandığında yönlendirme
  const handleBackClick = () => {
    navigate('/our-routes'); // Geri butonuna basıldığında /our-routes sayfasına yönlendir
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Video ve geri butonu kapsayıcısı */}
      <div style={{ position: 'relative', textAlign: 'center', marginBottom: '24px' }}>
        {/* Geri butonu */}
        <Button 
  icon={<ArrowLeftOutlined />} 
  onClick={handleBackClick} 
  style={{ 
    position: 'absolute', 
    top: '10px', 
    left: '10px', 
    zIndex: 10, 
    backgroundColor: '#3C2A21', // Arka plan rengi
    color: 'white', // Metin rengi
    border: 'none', // Kenarlık kaldırıldı
  }} 
  type="default"
>
  Geri
</Button>

        
        {/* Video */}
        <video 
          src="/yenirota.mp4" 
          autoPlay 
          loop 
          muted 
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>

      <Title 
        level={2} 
        style={{ 
          textAlign: 'center', 
          color: '#3C2A21', 
          fontFamily: 'Lobster, sans-serif' 
        }}
      >
        Yeni Rota Oluştur
      </Title>

      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title level={4}>Yer Seçim Türünü Belirleyin</Title>
            <Radio.Group 
              onChange={handleSelectionTypeChange} 
              value={selectionType}
            >
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
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={createRoute}
                  block
                  disabled={!routeType}
                  style={{ backgroundColor: '#3C2A21', borderColor: '#3C2A21', color: 'white' }}
                >
                  Rotayı Oluştur
                </Button>
              </Col>
            </>
          )}
        </Row>
      </Card>

      {createdRoutes.map(route => (
        <Card key={route.id} style={{ marginBottom: '16px' }}>
          <Title level={4}>Rota Detayları</Title>
          <Text strong>Rota Türü: </Text>
          <Text>{routeCategories.find(c => c.value === route.type)?.label}</Text>
          <br />
          <Text strong>Seçilen Yerler:</Text>
          <ul>
            {route.places.map(place => (
              <li key={place.id}>{place.name}</li>
            ))}
          </ul>
          <br />
          <Text strong>Kullanıcı: </Text>
          <Row align="middle">
            <Col>
              <Avatar src={route.user.avatarUrl} />
            </Col>
            <Col>
              <Text>{route.user.username}</Text>
            </Col>
          </Row>
        </Card>
      ))}
    </div>
  );
};

export default NewRoutes;
