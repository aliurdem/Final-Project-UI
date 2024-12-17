import React, { useEffect, useState, useContext } from 'react';
import { Layout, Select, Button, Card, Col, Row, Modal, Spin } from 'antd';
import { ClockCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../components/HomePage/UserContext'; 
import './ourRoutes.css';


const { Header } = Layout;
const { Option } = Select;

const OurRoutes = () => {
  const [categories, setCategories] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(UserContext); // Kullanıcının giriş durumu

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
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBackClick}
          style={{
            color: '#fff',
            backgroundColor: '#AB886D',
            border: 'none',
            fontSize: '16px',
            fontWeight: 'bold',
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          Geri
        </Button>

        <div
          style={{
            color: '#fff',
            fontSize: '24px',
            fontWeight: 'bold',
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          Gezi Rotalarımız
        </div>

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
            fontFamily: 'Roboto, sans-serif',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
          dropdownStyle={{ fontFamily: 'Roboto, sans-serif'}}
          onChange={handleCategoryChange}
        >
          <Option value="all" style={{ fontFamily: 'Roboto, sans-serif', }}>
            Tüm Kategoriler
          </Option>
          {categories.length > 0 ? (
            categories.map((category) => (
              <Option key={category.id} value={category.id} style={{ fontFamily: 'Roboto, sans-serif'}}>
                {category.name}
              </Option>
            ))
          ) : (
            <Option disabled style={{ fontFamily: 'Roboto, sans-serif'}}>
              Yükleniyor...
            </Option>
          )}
        </Select>

        {isLoggedIn && ( // Kullanıcı giriş yaptıysa göster
          <Button
            type="primary"
            onClick={handleNewRouteClick}
            style={{
              marginLeft: 'auto',
              backgroundColor: '#493628',
              fontFamily: 'Roboto, sans-serif',
              fontSize: '16px',
              padding: '10px 20px',
              fontWeight: 'bold',
              borderRadius: '6px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            Yeni Rota Oluştur
          </Button>
        )}
      </div>

      <div style={{ padding: '20px' }}>
        <Row gutter={[16, 16]}>
          {routes.length > 0 ? (
            routes.map((route) => (
              <Col span={4} key={route.id}>
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
        fontFamily: 'Roboto, sans-serif',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#AB886D',
        textAlign: 'center',
      }}
    >
      {selectedRoute?.name || 'Rota Detayı'}
    </div>
  }
  onCancel={handleModalClose}
  footer={null}
  centered
  bodyStyle={{
    padding: '20px',
    fontFamily: 'Roboto, sans-serif',
    backgroundColor: '#FDF9F6',
    borderRadius: '12px',
  }}
>
  {loading ? (
    <div style={{ textAlign: 'center' }}>
      <Spin size="large" />
    </div>
  ) : selectedRoute ? (
    <div>
      {selectedRoute.imageData && (
        <img
          alt={selectedRoute.name}
          src={`data:image/jpeg;base64,${selectedRoute.imageData}`}
          style={{
            width: '100%',
            maxHeight: '250px',
            objectFit: 'cover',
            borderRadius: '12px',
            marginBottom: '20px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        />
      )}
      <p style={{ fontSize: '18px', color: '#493628', marginBottom: '12px' }}>
        <strong>Ad:</strong> {selectedRoute.name}
      </p>
      <p style={{ fontSize: '16px', color: '#7A5A4A' }}>
        <strong>Kullanıcı ID:</strong> {selectedRoute.userId}
      </p>
      <h3 style={{ fontSize: '20px', color: '#AB886D', marginTop: '20px' }}>Ziyaret Noktaları:</h3>
      <ul
        style={{
          padding: 0,
          listStyle: 'none',
          marginTop: '10px',
        }}
      >
        {selectedRoute.places.map((place) => (
          <li
            key={place.id}
            style={{
              marginBottom: '12px',
              padding: '10px',
              backgroundColor: '#EADDD6',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <span style={{ fontWeight: 'bold', color: '#493628' }}>
              {place.sequence}. {place.name}
            </span>
            <p style={{ margin: 0, color: '#7A5A4A' }}>{place.description}</p>
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <p style={{ textAlign: 'center', color: '#AB886D', fontSize: '18px' }}>
      Veri bulunamadı.
    </p>
  )}
</Modal>
    </Layout>
  );
};

export default OurRoutes;
