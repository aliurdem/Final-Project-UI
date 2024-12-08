import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Card, Space, Tag, Row, Col, Typography, Timeline, Divider, Button } from 'antd';
import { PlusOutlined, UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Text } = Typography;

const RoutesPage = () => {
  const navigate = useNavigate();

  // Kategorileri ID'leriyle tanımlıyoruz ki backend filtrelemesinde kullanalım
  const categories = [
    { key: 'historical', label: 'Tarih Rotası', color: '#B99470', categoryId: 2 },
    { key: 'food', label: 'Yemek Rotası', color: '#825B32', categoryId: 2 },
    { key: 'shopping', label: 'Alışveriş Rotası', color: '#6C4E31', categoryId: 1 },
    { key: 'nature', label: 'Doğa Rotası', color: '#603F26', categoryId: 4 },
    { key: 'activities', label: 'Etkinlik Rotası', color: '#321E1E', categoryId: 5 }
  ];

  const [activeKey, setActiveKey] = useState('historical');
  const [routes, setRoutes] = useState([]);

  // Aktif kategoriye göre veri çekme
  useEffect(() => {
    const activeCategory = categories.find(c => c.key === activeKey);
    if (!activeCategory) return;

    const fetchData = async () => {
      const postData = {
        filters: [
          {
            property: "CategoryId",
            operator: "==",
            value: activeCategory.categoryId.toString()
          }
        ],
        orderProp: "Name",
        orderType: 0
      };

      // Burada gerçek endpoint URL'nizi, PageNumber ve PageSize değerlerini düzenleyin
      const response = await fetch(`https://localhost:7263/TravelRoute/GetList?PageNumber=0&PageSize=12`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });

      if (response.ok) {
        const data = await response.json();
        // data örneği: [{ "name": "AlışVeriş", "userId": "...", "places": null, "id": 12 }]
        // UI için gereken format: title, author, category, description, places
        // Backend'ten "description" ya da "author" dönmüyorsa varsayılanlar koyabiliriz.
        const mappedRoutes = data.map(item => ({
          title: item.name,
          author: "Sizin İçin Önerimiz", // Backend döndürüyorsa burada güncelleyebilirsiniz
          category: activeKey,
          description: item.name + " turu",
          places: item.places ? item.places.map(p => ({
            name: p.name,
            description: p.description || ''
          })) : []
        }));

        setRoutes(mappedRoutes);
      } else {
        // Hata handling
        console.error("Veri çekilemedi");
        setRoutes([]);
      }
    };

    fetchData();
  }, [activeKey, categories]);

  const items = categories.map((category) => {
    const filteredRoutes = routes.filter(route => route.category === category.key);
    return {
      key: category.key,
      label: (
        <div style={{ marginRight: '100px' }}>
          <Tag color={category.color}>{category.label}</Tag>
        </div>
      ),
      children: (
        <Row gutter={[16, 16]}>
          {filteredRoutes.map((route, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <Card hoverable style={{ height: '100%' }}>
                <Card.Meta
                  title={route.title}
                  description={
                    <Space direction="vertical" size="small">
                      <Space>
                        <UserOutlined />
                        <Text type="secondary">{route.author}</Text>
                      </Space>
                      <Divider style={{ margin: '8px 0' }} />
                      <Timeline>
                        {route.places && route.places.length > 0 ? (
                          route.places.map((place, idx) => (
                            <Timeline.Item key={idx}>
                              <Text strong>{place.name}</Text>
                              <br />
                              <Text type="secondary">{place.description}</Text>
                            </Timeline.Item>
                          ))
                        ) : (
                          <Timeline.Item>
                            <Text strong>Henüz rota detayları bulunmuyor.</Text>
                          </Timeline.Item>
                        )}
                      </Timeline>
                    </Space>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )
    };
  });

  return (
    <div style={{ display: 'flex', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 20, left: 20 }}>
        <Button
          type="default"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          style={{
            backgroundColor: '#3C2A21', 
            color: 'white', 
            fontSize: '16px',
            padding: '8px 16px',
            marginBottom: '16px',
            borderColor: '#3C2A21',
          }}
        >
          Geri
        </Button>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/new-routes')}
          style={{
            backgroundColor: '#AB886D',
            borderColor: '#AB886D',
            color: 'white',
            fontSize: '16px',
            padding: '8px 16px',
            marginTop: '10px',
            marginLeft: '50px'
          }}
        >
          Yeni Rota Oluştur
        </Button>
        <div style={{ marginTop: 25, position: 'relative', width: '325px', height: '285px' }}>
          <video
            loop
            autoPlay
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            <source src="./newroutes.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      <div style={{ marginLeft: 380, marginTop: 15, width: '100%' }}>
        <Tabs
          defaultActiveKey="historical"
          activeKey={activeKey}
          onChange={setActiveKey}
          items={items}
          type="card"
          size="large"
          style={{ marginBottom: 254 }}
          tabBarStyle={{
            paddingLeft: '10px',
          }}
        />
      </div>
    </div>
  );
};

export default RoutesPage;
