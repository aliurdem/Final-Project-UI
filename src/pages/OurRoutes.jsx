import React, { useEffect, useState, useContext } from 'react';
import { Layout, Select, Button, Card, Col, Row, Modal, Spin } from 'antd';
import { ClockCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { GoogleMap, DirectionsRenderer,MarkerF } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../components/HomePage/UserContext';
import './ourRoutes.css';
import { Pagination } from 'antd';

const { Header } = Layout;

const OurRoutes = () => {
  const [categories, setCategories] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Sayfa başına gösterilecek rota sayısı
  const [filters, setFilters] = useState([]);
  const [totalPages, setTotalPages] = useState(0); // Toplam sayfa sayısı
  const [totalRecords, setTotalRecords] = useState(0); // Toplam kayıt sayısı



useEffect(() => {
  console.log('Current Page Changed:', currentPage);
  fetchAllRoutes();
}, [currentPage, pageSize, filters]);

useEffect(() => {
  fetchAllRoutes(); // Pagination veya filtre değiştiğinde çalışır.
}, [currentPage, pageSize, filters]);

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

const fetchAllRoutes = async () => {
  setLoading(true);

  try {
    // Query parametrelerini oluştur
    const queryParams = new URLSearchParams({
      PageNumber: currentPage,
      PageSize: pageSize,
    });

    // Filtre verilerini uygun formata dönüştür
    const formattedFilters = filters.map((filter) => ({
      ...filter,
      value: filter.value.toString(),
    }));

    // API'ye istek yap
    const response = await fetch(`https://localhost:7263/TravelRoute/GetList?${queryParams}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filters: formattedFilters }),
    });

    // Yanıt kontrolü
    if (!response.ok) {
      console.error("API Hatası:", response.status);
      setRoutes([]);
      return;
    }

    // Pagination bilgilerini oku
    const paginationHeader = response.headers.get('X-Pagination');
    if (paginationHeader) {
      try {
        const paginationData = JSON.parse(paginationHeader);
        console.log('Pagination Header:', paginationData);

        // Pagination bilgilerini state'e ata
        setTotalPages(paginationData.TotalPages || 1);
        setTotalRecords(paginationData.TotalCount || 0);
      } catch (err) {
        console.error("Pagination Header JSON parse hatası:", err);
      }
    } else {
      console.warn("X-Pagination başlığı bulunamadı.");
    }

    // Gövde verisini işle
    const data = await response.json();
    setRoutes(data);
  } catch (error) {
    console.error("API çağrısı sırasında hata:", error);
    setRoutes([]);
  } finally {
    setLoading(false);
  }
};

  const fetchRouteDetails = async (routeId) => {
    setLoading(true);
    try {
      const response = await fetch(`https://localhost:7263/TravelRoute/${routeId}`);
      const result = await response.json();
      setSelectedRoute(result);

      if (result.places && result.places.length > 1) {
        await calculateRoute(result.places);
      }
    } catch (error) {
      console.error('Rota detayları alınırken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRoute = async (places) => {
    const directionsService = new google.maps.DirectionsService();
    const sortedPlaces = [...places].sort((a, b) => a.sequence - b.sequence);

    const origin = {
      lat: sortedPlaces[0].latitude,
      lng: sortedPlaces[0].longitude,
    };

    const destination = {
      lat: sortedPlaces[sortedPlaces.length - 1].latitude,
      lng: sortedPlaces[sortedPlaces.length - 1].longitude,
    };

    const waypoints = sortedPlaces.slice(1, -1).map((place) => ({
      location: { lat: place.latitude, lng: place.longitude },
      stopover: true,
        
    }));

    directionsService.route(
      {
        origin,
        destination,
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirectionsResponse(result);
        } else {
          console.error('Directions API hatası:', status);
        }
      }
    );
  };



  const handleCardClick = (routeId) => {
    setIsModalVisible(true);
    fetchRouteDetails(routeId);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRoute(null);
    setDirectionsResponse(null);
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f4f4f4' }}>
      <Header
  style={{
    background: '#493628',
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }}
>
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <h1
      style={{
        color: '#fff',
        fontSize: '28px',
        margin: 0,
        fontFamily: 'Lobster, sans-serif',
      }}
    >
      Gezi Rotaları
    </h1>
    <Select
      placeholder="Kategori Seç"
      onChange={(value) =>
        setFilters(
          value
            ? [{ property: 'CategoryId', operator: '==', value }]
            : [] // Boş değer seçilirse filtreyi temizle
        )
      }
      style={{ width: 200 }}
    >
      <Select.Option value={null}>Tüm Kategoriler</Select.Option>
      {categories.map((category) => (
        <Select.Option key={category.id} value={category.id}>
          {category.name}
        </Select.Option>
      ))}
    </Select>
  </div>
  {isLoggedIn && (
    <Button
      onClick={() => navigate('/new-routes')}
      style={{ color: '#fff', backgroundColor: '#4CAF50', border: 'none' }}
    >
      Yeni Rota Oluştur
    </Button>
  )}
</Header>
      <div style={{ padding: '20px' }}>
        <Row gutter={[16, 16]}>
          {routes.map((route) => (
            <Col span={4} key={route.id}>
              <Card
                title={route.name}
                onClick={() => handleCardClick(route.id)}
                cover={
                  route.imageData ? (
                    <img
                      alt={route.name}
                      src={`data:image/jpeg;base64,${route.imageData}`}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ height: '200px', backgroundColor: '#e0e0e0' }}>Görsel Yok</div>
                  )
                }
              >
                <p>
                  <ClockCircleOutlined /> {route.averageDuration || 'Bilgi Yok'}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Modal
  visible={isModalVisible}
  onCancel={handleModalClose}
  footer={null}
  width="80%"
  centered // Modalı ekranda ortalar
  bodyStyle={{
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  }}
>
  {loading ? (
    <Spin size="large" style={{ display: 'block', margin: '0 auto' }} />
  ) : (
    selectedRoute && (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Modal Başlığı */}
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#493628',
              marginBottom: '5px',
            }}
          >
            {selectedRoute.name}
          </h2>
          <p style={{ fontSize: '16px', color: '#777' }}>
            {selectedRoute.places.length} ziyaret noktası
          </p>
        </div>

        {/* Ziyaret Noktaları Listesi */}
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            overflowY: 'auto',
            maxHeight: '150px',
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#493628',
              marginBottom: '10px',
            }}
          >
            Ziyaret Noktaları:
          </h3>
          <ul
            style={{
              listStyleType: 'none',
              padding: 0,
              margin: 0,
            }}
          >
            {selectedRoute.places.map((place, index) => (
              <li
                key={place.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom:
                    index !== selectedRoute.places.length - 1
                      ? '1px solid #eee'
                      : 'none',
                }}
              >
                <span style={{ fontSize: '16px', color: '#333' }}>
                  {index + 1}. {place.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Harita */}
        <div
          style={{
            width: '100%',
            height: '400px',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={{
              lat: selectedRoute.places[0]?.latitude || 0,
              lng: selectedRoute.places[0]?.longitude || 0,
            }}
            zoom={12}
          >
            {/* Rota Çizimi */}
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}

            {/* Marker ve Bilgi Pencereleri */}
            {directionsResponse &&
              directionsResponse.routes[0].legs.map((leg, index) => (
                <MarkerF
                  key={index}
                  position={{
                    lat: leg.start_location.lat(),
                    lng: leg.start_location.lng(),
                  }}
                />
              ))}
          </GoogleMap>
        </div>
      </div>
    )
  )}
</Modal>
{totalRecords > 0 && (
  <Pagination
    current={currentPage}
    pageSize={pageSize}
    total={totalRecords}
    onChange={(page) => setCurrentPage(page)}
    showSizeChanger={false}
    style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000,
      backgroundColor: '#fff',
      padding: '10px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    }}
  />
)}

    </Layout>
  );
};

export default OurRoutes;
