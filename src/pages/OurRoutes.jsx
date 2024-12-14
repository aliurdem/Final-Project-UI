import React, { useEffect, useState } from 'react';
import { Layout, Select, Button, Card, Col, Row } from 'antd';
import { useNavigate } from 'react-router-dom'; // react-router-dom ile yönlendirme

const { Header } = Layout;
const { Option } = Select;

const OurRoutes = () => {
  const [categories, setCategories] = useState([]); // Kategoriler için state
  const [routes, setRoutes] = useState([]); // Rotalar için state
  const navigate = useNavigate(); // Yönlendirme için useNavigate hook'u

  // Kategorileri almak için API çağrısı
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://localhost:7263/Category/GetAll');
        const result = await response.json();
        if (result.success) {
          setCategories(result.data); // Kategorileri state'e ata
        } else {
          console.error('Kategoriler alınırken hata oluştu:', result.message);
        }
      } catch (error) {
        console.error('Kategoriler alınırken hata oluştu:', error);
      }
    };

    fetchCategories(); // API çağrısını yap
  }, []); // Sayfa ilk yüklendiğinde çalışacak

  // Rotaları almak için API çağrısı
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch('https://localhost:7263/TravelRoute/GetAll');
        const result = await response.json();
        if (result.success) {
          setRoutes(result.data); // Rotaları state'e ata
        } else {
          console.error('Rotalar alınırken hata oluştu:', result.message);
        }
      } catch (error) {
        console.error('Rotalar alınırken hata oluştu:', error);
      }
    };

    fetchRoutes(); // API çağrısını yap
  }, []); // Sayfa ilk yüklendiğinde çalışacak

  const handleNewRouteClick = () => {
    navigate('/new-routes'); // 'NewRoutes' sayfasına yönlendir
  };

  return (
    <Layout style={{ minHeight: '100vh', width: '100vw' }}> {/* Tüm ekranı kaplaması için */}
      <Header 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          background: '#AB886D', 
          width: '100%', 
          padding: 0,  // Padding'i sıfırla
          margin: 0     // Margin'i sıfırla
        }}
      >
        <div style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>
          Gezi Rotalarımız
        </div>
      </Header>

      {/* Kategori Seçimi ve Yeni Rota Oluştur Butonu */}
      <div style={{ 
        padding: '20px', 
        display: 'flex', 
        justifyContent: 'space-between', // Butonları iki kenara yerleştir
        alignItems: 'center' 
      }}>
        <Select 
          defaultValue="kategori" 
          style={{ width: 200 }} 
          onChange={(value) => console.log(value)} 
        >
          {/* Kategorilerdin verileri dinamik olarak render et */}
          {categories.length > 0 ? (
            categories.map((category) => (
              <Option key={category.id} value={category.id}>{category.name}</Option>
            ))
          ) : (
            <Option disabled>Yükleniyor...</Option> // Veriler gelene kadar "Yükleniyor..." yazısı
          )}
        </Select>

        {/* Yeni Rota Oluştur Butonunu sağa sabitle */}
        <Button 
          type="primary" 
          onClick={handleNewRouteClick}
          style={{ marginLeft: 'auto' }} // Sağ tarafa sabitle
        >
          Yeni Rota Oluştur
        </Button>
      </div>

      {/* Rotaları Kartlar Şeklinde Göster */}
      <div style={{ padding: '20px' }}>
        <Row gutter={[16, 16]}>
          {routes.length > 0 ? (
            routes.map((route) => (
              <Col span={8} key={route.id}>
                <Card 
                  title={route.name} 
                  bordered={false} 
                  style={{ width: '100%' }}
                >
                  <p><strong>Kategori ID:</strong> {route.categoryId}</p>
                  <p><strong>User ID:</strong> {route.userId}</p>
                  <p><strong>Places:</strong> {route.places ? route.places : 'Yerler mevcut değil'}</p>
                </Card>
              </Col>
            ))
          ) : (
            <p>Rotalar yükleniyor...</p> // Rotalar gelene kadar "Yükleniyor..." yazısı
          )}
        </Row>
      </div>
    </Layout>
  );
};

export default OurRoutes;
