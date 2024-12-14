import React, { useEffect, useState } from 'react';
import { Layout, Select, Button, Card, Col, Row, Modal, Spin } from 'antd';
import { ClockCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Option } = Select;

const OurRoutes = () => {
  const [categories, setCategories] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchAllRoutes = async () => {
    try {
      const response = await fetch('https://localhost:7263/TravelRoute/GetAll');
      const result = await response.json();
      if (result.success) {
        setRoutes(result.data);
      } else {
        console.error('Rotalar alınırken hata oluştu:', result.message);
        setRoutes([]);
      }
    } catch (error) {
      console.error('Rotalar alınırken hata oluştu:', error);
      setRoutes([]);
    }
  };

  const fetchFilteredRoutes = async (categoryId) => {
    try {
      const response = await fetch(
        'https://localhost:7263/TravelRoute/GetList?PageNumber=0&PageSize=10',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
          },
          body: JSON.stringify({
            filters: [
              {
                property: 'CategoryId',
                operator: '==',
                value: String(categoryId),
              },
            ],
          }),
        }
      );

      const result = await response.json();
      if (result && Array.isArray(result)) {
        setRoutes(result);
      } else if (result && result.data) {
        setRoutes(result.data);
      } else {
        setRoutes([]);
        console.warn('Filtrelenmiş sonuç bulunamadı.');
      }
    } catch (error) {
      console.error('Filtrelenmiş rotalar alınırken hata oluştu:', error);
    }
  };

  const fetchRouteDetails = async (routeId) => {
    setLoading(true);
    try {
      const response = await fetch(`https://localhost:7263/TravelRoute/${routeId}`);
      const result = await response.json();
      setSelectedRoute(result);
    } catch (error) {
      console.error('Rota detayları alınırken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://localhost:7263/Category/GetAll');
        const result = await response.json();
        if (result.success) {
          setCategories(result.data);
        } else {
          console.error('Kategoriler alınırken hata oluştu:', result.message);
        }
      } catch (error) {
        console.error('Kategoriler alınırken hata oluştu:', error);
      }
    };

    fetchCategories();
    fetchAllRoutes();
  }, []);

  const handleCategoryChange = (value) => {
    if (value === 'all') {
      fetchAllRoutes();
    } else {
      fetchFilteredRoutes(value);
    }
  };

  const handleNewRouteClick = () => {
    navigate('/new-routes');
  };

  const handleCardClick = (routeId) => {
    setIsModalVisible(true);
    fetchRouteDetails(routeId);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRoute(null);
  };

  // Geri butonuna tıklayınca ana sayfaya yönlendirme
  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <Layout style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#f4f4f4' }}>
      <Header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#493628',
          width: '100%',
          padding: '0 16px',
          margin: 0,
        }}
      >
        {/* Geri Butonu */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBackClick}
          style={{
            color: '#fff',
            backgroundColor: '#AB886D',
            border: 'none',
            fontSize: '16px',
            fontWeight: 'bold',
            fontFamily: 'Lobster, sans-serif',
          }}
        >
          Geri
        </Button>

        {/* Başlık */}
        <div
          style={{
            color: '#fff',
            fontSize: '24px',
            fontWeight: 'bold',
            fontFamily: 'Lobster, sans-serif',
          }}
        >
          Gezi Rotalarımız
        </div>

        {/* Boş bir alan, sağda başka bir içerik olmadığından şimdilik yer tutucu */}
        <div style={{ width: 48 }}></div>
      </Header>

      <div
        style={{
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fff',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Select
  defaultValue="all"
  style={{
    width: 250,
    borderRadius: '8px',
    fontSize: '16px',
    fontFamily: 'Lobster, sans-serif', // Yazı tipi burada doğru şekilde kalacak
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  }}
  dropdownStyle={{ fontFamily: 'Lobster, sans-serif' }} // Dropdown kısmına font ekleme
  onChange={handleCategoryChange}
>
  <Option value="all" style={{ fontFamily: 'Lobster, sans-serif' }}>Tüm Kategoriler</Option>
  {categories.length > 0 ? (
    categories.map((category) => (
      <Option key={category.id} value={category.id} style={{ fontFamily: 'Lobster, sans-serif' }}>
        {category.name}
      </Option>
    ))
  ) : (
    <Option disabled style={{ fontFamily: 'Lobster, sans-serif' }}>Yükleniyor...</Option>
  )}
</Select>



        <Button
          type="primary"
          onClick={handleNewRouteClick}
          style={{
            marginLeft: 'auto',
            backgroundColor: '#493628',
            fontFamily: 'Lobster, sans-serif',
            fontSize: '16px',
            padding: '10px 20px',
            fontWeight: 'bold',
            borderRadius: '6px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          Yeni Rota Oluştur
        </Button>
      </div>

      <div style={{ padding: '20px' }}>
        <Row gutter={[16, 16]}>
          {routes.length > 0 ? (
            routes.map((route) => (
              <Col span={8} key={route.id}>
                <Card
                  title={route.name}
                  bordered={false}
                  onClick={() => handleCardClick(route.id)}
                  cover={
                    route.imageData ? (
                      <img
                        alt={route.name}
                        src={`data:image/jpeg;base64,${route.imageData}`}
                        style={{
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: '200px',
                          backgroundColor: '#e0e0e0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#888',
                          borderRadius: '8px',
                        }}
                      >
                        Görsel Yok
                      </div>
                    )
                  }
                  style={{
                    width: '100%',
                    borderRadius: '8px',
                    backgroundColor: '#D0B8A8',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <p>
                    <strong>Süre:</strong>{' '}
                    <ClockCircleOutlined style={{ marginRight: '8px', color: '#493628' }} />
                    {route.averageDuration || 'Bilgi Yok'}
                  </p>
                </Card>
              </Col>
            ))
          ) : (
            <p>Filtreleme sonucunda rota bulunamadı.</p>
          )}
        </Row>
      </div>

      <Modal
        visible={isModalVisible}
        title={
          <div
            style={{
              fontFamily: 'Lobster, sans-serif',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#AB886D',
            }}
          >
            {selectedRoute?.name || 'Rota Detayı'}
          </div>
        }
        onCancel={handleModalClose}
        footer={null}
      >
        {loading ? (
          <Spin size="large" />
        ) : selectedRoute ? (
          <div>
            <p>
              <strong>Ad:</strong> {selectedRoute.name}
            </p>
            <p>
              <strong>Kullanıcı ID:</strong> {selectedRoute.userId}
            </p>
            <ul>
              {selectedRoute.places.map((place) => (
                <li key={place.id}>
                  {place.sequence}. {place.name} - {place.description}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Veri bulunamadı.</p>
        )}
      </Modal>
    </Layout>
  );
};

export default OurRoutes;
