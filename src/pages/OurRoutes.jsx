import React, { useEffect, useState } from 'react';
import { Layout, Select, Button, Card, Col, Row, Modal, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Option } = Select;

const OurRoutes = () => {
  const [categories, setCategories] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null); // Seçilen rota
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal görünürlüğü
  const [loading, setLoading] = useState(false); // Modal veri yükleme durumu
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
      setSelectedRoute(result); // Gelen rotayı state'e ata
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
    fetchRouteDetails(routeId); // Rota detaylarını getir
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRoute(null);
  };

  return (
    <Layout style={{ minHeight: '100vh', width: '100vw' }}>
      <Header
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#AB886D',
          width: '100%',
          padding: 0,
          margin: 0,
        }}
      >
        <div style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>
          Gezi Rotalarımız
        </div>
      </Header>

      <div
        style={{
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Select
          defaultValue="all"
          style={{ width: 200 }}
          onChange={handleCategoryChange}
        >
          <Option value="all">Tüm Kategoriler</Option>
          {categories.length > 0 ? (
            categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))
          ) : (
            <Option disabled>Yükleniyor...</Option>
          )}
        </Select>

        <Button
          type="primary"
          onClick={handleNewRouteClick}
          style={{ marginLeft: 'auto' }}
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
                  onClick={() => handleCardClick(route.id)} // Tıklama olayını ata
                  cover={
                    route.imageData ? (
                      <img
                        alt={route.name}
                        src={`data:image/jpeg;base64,${route.imageData}`}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          height: '200px',
                          backgroundColor: '#f0f0f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#888',
                        }}
                      >
                        Görsel Yok
                      </div>
                    )
                  }
                  style={{ width: '100%' }}
                >
                  <p>
                    <strong>Süre:</strong> {route.averageDuration || 'Bilgi Yok'}
                  </p>
                </Card>
              </Col>
            ))
          ) : (
            <p>Filtreleme sonucunda rota bulunamadı.</p>
          )}
        </Row>
      </div>

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        title={selectedRoute?.name || 'Rota Detayı'}
        onCancel={handleModalClose}
        footer={null}
      >
        {loading ? (
          <Spin />
        ) : selectedRoute ? (
          <div>
            <p>
              <strong>Ad:</strong> {selectedRoute.name}
            </p>
            <p>
              <strong>Kullanıcı ID:</strong> {selectedRoute.userId}
            </p>
            <p>
              <strong>Kategori ID:</strong> {selectedRoute.categoryId}
            </p>
            <p>
              <strong>Yerler:</strong>
            </p>
            <ul>
              {selectedRoute.places.map((place) => (
                <li key={place.id}>
                  <strong>{place.sequence}. {place.name}</strong> - {place.description}
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
