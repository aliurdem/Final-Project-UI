import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Typography, Input, InputNumber, Upload, message, Modal, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '/edirnelogorenkli.png'; 

const { Title } = Typography;

const NewPlace = () => {
  const navigate = useNavigate();
  const [placeName, setPlaceName] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [visitableHours, setVisitableHours] = useState('');
  const [entranceFee, setEntranceFee] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  axios.defaults.withCredentials = true;

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => setUploadedImage(reader.result);
    reader.onerror = () => message.error('Fotoğraf yüklenirken bir hata oluştu.');
    reader.readAsDataURL(file);
    return false;
  };

  const handleCreatePlace = async () => {
    if (!placeName || !description || !latitude || !longitude || !visitableHours || !uploadedImage) {
      message.warning('Tüm alanları doldurmanız gerekiyor.');
      return;
    }

    const payload = {
      id: 0,
      name: placeName,
      description,
      latitude,
      longitude,
      visitableHours,
      entranceFee,
      imageData: uploadedImage.split(',')[1],
    };

    try {
      setLoading(true);
      const response = await axios.post('https://localhost:7263/Place', payload, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200 || response.data.success) {
        message.success('Yer başarıyla oluşturuldu!');
        navigate('/places');
      } else {
        message.error('Yer oluşturulurken hata oluştu.');
      }
    } catch (error) {
      console.error('Yer oluşturulurken hata:', error.response?.data || error.message);
      message.error('Yer oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ padding: '24px' }}>
        <Title level={2} style={{ textAlign: 'center', color: '#3C2A21', fontFamily: 'Lobster, sans-serif' }}>
          Yeni Yer Oluştur
        </Title>
        <Row gutter={[16, 16]} align="stretch">
          <Col span={12}>
            <Card style={{ height: '100%' }}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Title level={4}>Yer İsmi</Title>
                  <Input
                    value={placeName}
                    onChange={(e) => setPlaceName(e.target.value)}
                    placeholder="Yer ismini girin"
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col span={24}>
                  <Title level={4}>Açıklama</Title>
                  <Input.TextArea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Açıklama girin"
                    rows={4}
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col span={24}>
                  <Title level={4}>Koordinatlar</Title>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <InputNumber
                        value={latitude}
                        onChange={(value) => setLatitude(value || 0)}
                        placeholder="Enlem (Latitude)"
                        style={{ width: '100%' }}
                      />
                    </Col>
                    <Col span={12}>
                      <InputNumber
                        value={longitude}
                        onChange={(value) => setLongitude(value || 0)}
                        placeholder="Boylam (Longitude)"
                        style={{ width: '100%' }}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Title level={4}>Ziyaret Saatleri</Title>
                  <Input
                    value={visitableHours}
                    onChange={(e) => setVisitableHours(e.target.value)}
                    placeholder="Ziyaret saatlerini girin (örn: 09:00 - 17:00)"
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col span={24}>
                  <Title level={4}>Giriş Ücreti</Title>
                  <InputNumber
                    min={0}
                    value={entranceFee}
                    onChange={(value) => setEntranceFee(value || 0)}
                    placeholder="Giriş ücretini girin"
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col span={24}>
                  <Title level={4}>Fotoğraf Yükleyin</Title>
                  <Upload beforeUpload={handleImageUpload} accept="image/*" showUploadList={false}>
                    <Button icon={<UploadOutlined />}>Fotoğraf Yükle</Button>
                  </Upload>
                  <div
                    style={{
                      width: '200px',
                      height: '200px',
                      marginTop: '16px',
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #d9d9d9',
                      borderRadius: '8px',
                    }}
                  >
                    {uploadedImage ? (
                      <img
                        src={uploadedImage}
                        alt="Yüklenen Fotoğraf"
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    ) : (
                      <span style={{ color: '#999' }}>Fotoğraf Yüklenmedi</span>
                    )}
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={12}>
            <Button
              type="primary"
              block
              style={{ backgroundColor: '#3C2A21', color: 'white', height: '100%' }}
              onClick={handleCreatePlace}
              disabled={loading}
            >
              {loading ? <Spin /> : 'Yeni Yer Oluştur'}
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default NewPlace;
