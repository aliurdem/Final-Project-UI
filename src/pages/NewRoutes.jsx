import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Select, Checkbox, Typography, Radio, InputNumber, Input, Upload, message } from 'antd';
import { PlusOutlined, ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const NewRoutes = () => {
  const navigate = useNavigate();
  const [selectionType, setSelectionType] = useState(null);
  const [routeType, setRouteType] = useState(null);
  const [categories, setCategories] = useState([]);
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [duration, setDuration] = useState(null);
  const [userId, setUserId] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);

  useEffect(() => {
    // Kategorileri yükleme
    fetch('https://localhost:7263/Category/GetAll')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.data);
        } else {
          message.error('Kategoriler yüklenirken bir hata oluştu.');
        }
      })
      .catch(() => {
        message.error('Kategorileri yükleme sırasında bir hata oluştu.');
      });

    // Yerleri yükleme
    fetch('https://localhost:7263/Place/GetAll')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPlaces(data.data);
        } else {
          message.error('Yerler yüklenirken bir hata oluştu.');
        }
      })
      .catch(() => {
        message.error('Yerleri yükleme sırasında bir hata oluştu.');
      });
  }, []);

  useEffect(() => {
    // Filtreleme, seçilen kategoriye göre yerleri gösterir
    if (routeType) {
      setFilteredPlaces(
        places.filter((place) =>
          selectionType === 'all'
            ? true
            : selectionType === 'favorite'
            ? place.favorite // Eğer favoriler özelliği varsa burada kontrol edilir
            : true
        )
      );
    } else {
      setFilteredPlaces(places);
    }
  }, [routeType, places, selectionType]);

  const handleSelectionTypeChange = (e) => {
    const value = e.target.value;
    setSelectionType(value);
    setSelectedPlaces([]);
  };

  const handleRouteTypeChange = (value) => {
    setRouteType(value);
    setSelectedPlaces([]);
  };

  const togglePlaceSelection = (place) => {
    setSelectedPlaces((current) =>
      current.includes(place)
        ? current.filter((p) => p.id !== place.id)
        : [...current, place]
    );
  };

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result); // Base64 formatını doğrudan sakla
    };
    reader.onerror = () => {
      message.error('Fotoğraf yüklenirken bir hata oluştu.');
    };
    reader.readAsDataURL(file);
    return false;
  };

  const createRoute = async () => {
    if (!routeType || selectedPlaces.length === 0 || !duration || !userId || !uploadedImage) {
      message.error('Lütfen tüm alanları doldurunuz.');
      return;
    }

    const newRoute = {
      name: `${categories.find((cat) => cat.id === routeType)?.name} Rota`,
      userId,
      averageDuration: `${duration} saat`,
      imageData: uploadedImage.split(',')[1],
      categoryId: routeType,
      places: selectedPlaces.map((place, index) => ({
        id: place.id,
        sequence: index + 1,
        name: place.name,
        description: place.description,
      })),
    };

    try {
      const response = await fetch('https://localhost:7263/TravelRoute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRoute),
      });

      if (response.ok) {
        message.success('Rota başarıyla oluşturuldu!');
      } else {
        message.error('Rota oluşturulurken bir hata oluştu.');
      }
    } catch (error) {
      message.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleBackClick = () => {
    navigate('/our-routes');
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
      </div>

      <Title level={2} style={{ textAlign: 'center', color: '#3C2A21', fontFamily: 'Lobster, sans-serif' }}>
        Yeni Rota Oluştur
      </Title>

      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title level={4}>Kullanıcı ID</Title>
            <Input
              placeholder="Kullanıcı ID'si Girin"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </Col>

          <Col span={24}>
            <Title level={4}>Fotoğraf Yükleyin</Title>
            <Upload
              beforeUpload={handleImageUpload}
              accept="image/*"
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Fotoğraf Yükle</Button>
            </Upload>
            {uploadedImage && (
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <img
                  src={uploadedImage}
                  alt="Yüklenen Fotoğraf"
                  style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', border: '1px solid #ccc' }}
                />
              </div>
            )}
          </Col>

          <Col span={24}>
            <Title level={4}>Yer Seçim Türünü Belirleyin</Title>
            <Radio.Group onChange={handleSelectionTypeChange} value={selectionType}>
              <Radio value="favorite">Favorilenen Yerler</Radio>
              <Radio value="all">Tüm Yerler</Radio>
            </Radio.Group>
          </Col>

          <Col span={24}>
            <Title level={4}>Rota Türünü Seçin</Title>
            <Select
              style={{ width: '100%' }}
              placeholder="Rota Kategorisi Seçin"
              onChange={handleRouteTypeChange}
              options={categories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
            />
          </Col>

          <Col span={24}>
            <Title level={4}>Yerler</Title>
            <Row gutter={[8, 8]}>
              {filteredPlaces.map((place) => (
                <Col key={place.id} span={8}>
                  <Checkbox
                    checked={selectedPlaces.some((p) => p.id === place.id)}
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
            <InputNumber
              min={1}
              max={24}
              value={duration}
              onChange={setDuration}
              style={{ width: '100%' }}
            />
          </Col>

          <Col span={24}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={createRoute}
              block
              disabled={!routeType || !duration || !userId || !uploadedImage || selectedPlaces.length === 0}
              style={{
                backgroundColor: '#3C2A21',
                borderColor: '#3C2A21',
                color: 'white',
              }}
            >
              Rotayı Oluştur
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default NewRoutes;
