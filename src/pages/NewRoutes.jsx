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
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [duration, setDuration] = useState(null);
  const [userId, setUserId] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);

  useEffect(() => {
    fetch('https://localhost:7263/Category/GetAll')
      .then((res) => res.json())
      .then((data) => setCategories(data.success ? data.data : []))
      .catch(() => message.error('Kategorileri yükleme sırasında bir hata oluştu.'));

    fetch('https://localhost:7263/Place/GetAll')
      .then((res) => res.json())
      .then((data) => setPlaces(data.success ? data.data : []))
      .catch(() => message.error('Yerleri yükleme sırasında bir hata oluştu.'));
  }, []);

  const handleBackClick = () => navigate('/our-routes');

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => setUploadedImage(reader.result);
    reader.onerror = () => message.error('Fotoğraf yüklenirken bir hata oluştu.');
    reader.readAsDataURL(file);
    return false;
  };

  return (
    <div>
      {/* Video ve Geri Butonu */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <video
          autoPlay
          muted
          loop
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            objectFit: 'cover',
          }}
        >
          <source src="/yenirota.mp4" type="video/mp4" />
          Tarayıcınız video etiketini desteklemiyor.
        </video>

        {/* Geri Butonu */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBackClick}
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            zIndex: 10,
            backgroundColor: '#3C2A21',
            color: 'white',
            border: 'none',
          }}
        >
          Geri
        </Button>
      </div>

      {/* İçerik Bölümü */}
      <div style={{ padding: '24px' }}>
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
              <Upload beforeUpload={handleImageUpload} accept="image/*" showUploadList={false}>
                <Button icon={<UploadOutlined />}>Fotoğraf Yükle</Button>
              </Upload>
              {uploadedImage && (
                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                  <img
                    src={uploadedImage}
                    alt="Yüklenen Fotoğraf"
                    style={{ maxWidth: '200px', borderRadius: '8px', border: '1px solid #ccc' }}
                  />
                </div>
              )}
            </Col>

            <Col span={24}>
              <Title level={4}>Yer Seçim Türünü Belirleyin</Title>
              <Radio.Group onChange={(e) => setSelectionType(e.target.value)} value={selectionType}>
                <Radio value="favorite">Favorilenen Yerler</Radio>
                <Radio value="all">Tüm Yerler</Radio>
              </Radio.Group>
            </Col>

            <Col span={24}>
              <Title level={4}>Rota Türünü Seçin</Title>
              <Select
                style={{ width: '100%' }}
                placeholder="Rota Kategorisi Seçin"
                onChange={(value) => setRouteType(value)}
                options={categories.map((category) => ({
                  value: category.id,
                  label: category.name,
                }))}
              />
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
                block
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
    </div>
  );
};

export default NewRoutes;
