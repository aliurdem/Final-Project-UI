import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Select, Checkbox, Typography, Radio, Upload, message, Input, InputNumber,Modal } from 'antd';
import { PlusOutlined, ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DeleteOutlined } from '@ant-design/icons';
import { LeftOutlined } from '@ant-design/icons';
import { RightOutlined  } from '@ant-design/icons';
import logo from '/edirnelogorenkli.png'; // Placeholder image
import { GoogleMap, DirectionsRenderer,MarkerF } from '@react-google-maps/api';


const { Title } = Typography;


const NewRoutes = () => {
  const navigate = useNavigate();
  const [routeName, setRouteName] = useState('');
  const [selectionType, setSelectionType] = useState(null);
  const [routeType, setRouteType] = useState(null);
  const [categories, setCategories] = useState([]);
  const [places, setPlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  

  // Axios yapılandırması
  axios.defaults.withCredentials = true;

  const type = 'PLACE_ITEM';

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleMapButtonClick = () => {
    calculateRoute(selectedPlaces)
    setIsModalVisible(true);
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

const DraggableListItem = ({ place, index, movePlace, removePlace }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: type,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        movePlace(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  
  return (
    <div
      ref={(node) => dragRef(dropRef(node))}
      style={{
        padding: '8px',
        border: '1px solid #d9d9d9',
        marginBottom: '8px',
        borderRadius: '4px',
        backgroundColor: '#fafafa',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      <span>{place?.name || 'Bilinmeyen Yer'}</span>
      <Button
        type="text"
        danger
        icon={<DeleteOutlined />}
        onClick={() => removePlace(place.id)}
      />
    </div>
  );
};

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('https://localhost:7263/Category/GetAll');
        if (data.success) setCategories(data.data);
        else message.error('Kategoriler yüklenirken hata oluştu.');
      } catch (error) {
        console.error('Kategori verisi alınırken hata:', error);
        message.error('Kategoriler yüklenirken bir hata oluştu.');
      }
    };

    const fetchPlaces = async () => {
      try {
        const { data } = await axios.get('https://localhost:7263/Place/GetAll');
        if (data.success) setPlaces(data.data);
        else message.error('Yerler yüklenirken hata oluştu.');
      } catch (error) {
        console.error('Yer verisi alınırken hata:', error);
        message.error('Yerler yüklenirken bir hata oluştu.');
      }
    };

    fetchCategories();
    fetchPlaces();
  }, []);

  const movePlace = (fromIndex, toIndex) => {
    const updatedList = [...selectedPlaces];
    const [movedItem] = updatedList.splice(fromIndex, 1);
    updatedList.splice(toIndex, 0, movedItem);
    setSelectedPlaces(updatedList);
  };

  const handleRemovePlace = (placeId) => {
    setSelectedPlaces((prev) => {
      const updatedPlaces = prev.filter((id) => id !== placeId);
      return updatedPlaces;
    });
  };
  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => setUploadedImage(reader.result);
    reader.onerror = () => message.error('Fotoğraf yüklenirken bir hata oluştu.');
    reader.readAsDataURL(file);
    return false;
  };

  const handleCreateRoute = async () => {
    if (!routeName || !routeType || !selectedPlaces.length || (!hours && !minutes) || !uploadedImage) {
      message.warning('Tüm alanları doldurmanız gerekiyor.');
      return;
    }

    const averageDuration = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    const formattedPlaces = selectedPlaces.map((placeId, index) => ({
      id: placeId,
      sequence: index + 1,
      name: '',
      description: '',
    }));

    const payload = {
      id: 0,
      name: routeName,
      userId: null,
      averageDuration: averageDuration,
      imageData: uploadedImage.split(',')[1],
      categoryId: routeType,
      places: formattedPlaces,
    };

    try {
      const response = await axios.post('https://localhost:7263/TravelRoute', payload, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200 || response.data.success) {
        message.success('Rota başarıyla oluşturuldu!');
        navigate('/our-routes');
      } else {
        message.error('Rota oluşturulurken hata oluştu.');
      }
    } catch (error) {
      console.error('Rota oluşturulurken hata:', error.response?.data || error.message);
      message.error('Rota oluşturulurken bir hata oluştu.');
    }
  };

  return (
    <div>
      {/* <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <video autoPlay muted loop style={{ width: '100%', objectFit: 'cover' }}>
          <source src="/yenirota.mp4" type="video/mp4" />
          Tarayıcınız video etiketini desteklemiyor.
        </video>

        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/our-routes')}
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
      </div> */}

      <div style={{ padding: '24px' }}>
        <Title level={2} style={{ textAlign: 'center', color: '#3C2A21', fontFamily: 'Lobster, sans-serif' }}>
          Yeni Rota Oluştur
        </Title>
        <Row gutter={[16, 16]} align="stretch">
  <Col span={12}>
    <Card style={{ height: '100%' }}> {/* Kart yüksekliği tüm Col'ü kaplar */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={4}>Rota İsmi</Title>
          <Input
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            placeholder="Rota ismini girin"
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
          backgroundColor: '#f5f5f5', // Açık beyaz arka plan
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
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <InputNumber
                    min={0}
                    max={24}
                    value={hours}
                    onChange={(value) => setHours(value || 0)}
                    placeholder="Saat"
                    style={{ width: '100%' }}
                  />
                  <div style={{ textAlign: 'center', marginTop: '4px' }}>Saat</div>
                </Col>

                <Col span={12}>
                  <InputNumber
                    min={0}
                    max={59}
                    step={15}
                    value={minutes}
                    onChange={(value) => setMinutes(value || 0)}
                    placeholder="Dakika"
                    style={{ width: '100%' }}
                  />
                  <div style={{ textAlign: 'center', marginTop: '4px' }}>Dakika</div>
                </Col>
              </Row>
            </Col>
      </Row>
    </Card>
  </Col>

  <Col span={12}>
  <Card style={{ height: '100%', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '12px' }}>
    <Row gutter={[16, 16]} align="stretch">
      <Col span={24}>
        <Card style={{ background: '#f8f9fa', border: 'none', borderRadius: '12px' }}>
          <Title level={4} style={{ color: '#3C2A21', fontWeight: 'bold' }}>Yerleri Seçin</Title>
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <Button
              icon={<LeftOutlined />}
              style={{
                position: 'absolute',
                top: '50%',
                left: '0px',
                zIndex: 1,
                transform: 'translateY(-50%)',
                backgroundColor: '#3C2A21',
                color: 'white',
                border: 'none',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
              }}
              onClick={() => {
                const container = document.getElementById('places-scroll-container');
                if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
              }}
            />
            <div
              id="places-scroll-container"
              style={{
                display: 'flex',
                overflowX: 'hidden',
                gap: '16px',
                paddingBottom: '8px',
                scrollBehavior: 'smooth',
                borderBottom: '2px solid #ddd',
                whiteSpace: 'nowrap',
              }}
              onWheel={(e) => {
                e.preventDefault();
                const container = document.getElementById('places-scroll-container');
                if (container) container.scrollLeft += e.deltaY;
              }}
            >
              {places.map((place) => (
                <div
                  key={place.id}
                  style={{
                    display: 'inline-block',
                    width: '150px',
                  }}
                >
                  <Card
                    hoverable
                    onClick={() => {
                      if (selectedPlaces.includes(place.id)) {
                        setSelectedPlaces((prev) => prev.filter((id) => id !== place.id));
                      } else {
                        setSelectedPlaces((prev) => [...prev, place.id]);
                      }
                    }}
                    style={{
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: selectedPlaces.includes(place.id)
                        ? '3px solid #3C2A21'
                        : '1px solid #d9d9d9',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      borderRadius: '12px',
                      backgroundColor: '#ffffff',
                      transition: 'transform 0.2s ease-in-out',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <img
                      src={place.imageData
                                  ? `data:image/jpeg;base64,${place.imageData}`
                                  : logo}
                      alt={place.name}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        marginBottom: '8px',
                        borderRadius: '50%',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                      }}
                    />
                    <div style={{ fontWeight: 'bold', color: '#3C2A21', fontSize: '14px' }}>{place.name}</div>
                  </Card>
                </div>
              ))}
            </div>
            <Button
              icon={<RightOutlined />}
              style={{
                position: 'absolute',
                top: '50%',
                right: '0px',
                zIndex: 1,
                transform: 'translateY(-50%)',
                backgroundColor: '#3C2A21',
                color: 'white',
                border: 'none',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
              }}
              onClick={() => {
                const container = document.getElementById('places-scroll-container');
                if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
              }}
            />
          </div>
        </Card>
      </Col>

      <Col span={24} style={{ maxHeight: '300px', overflow: 'hidden' }}>
        <Card style={{ background: '#f8f9fa', border: 'none', borderRadius: '12px' }}>
          <Title level={4} style={{ color: '#3C2A21', fontWeight: 'bold' }}>Seçilen Yerler (Sıralama ve Silme)</Title>
          <DndProvider backend={HTML5Backend}>
            <div
              style={{ maxHeight: '250px', overflow: 'hidden' }}
              onWheel={(e) => {
                e.preventDefault();
                const container = e.currentTarget;
                container.scrollTop += e.deltaY;
              }}
            >
              {selectedPlaces.map((placeId, index) => {
                const place = places.find((p) => p.id === placeId);
                return (
                  <DraggableListItem
                    key={placeId}
                    place={place}
                    index={index}
                    movePlace={movePlace}
                    removePlace={handleRemovePlace}
                  />
                );
              })}
            </div>
          </DndProvider>
        </Card>
      </Col>
    </Row>
  </Card>
</Col>
  <Col span={4}>
    <Button
      type="primary"
      icon={<PlusOutlined />}
      block
      style={{ backgroundColor: '#3C2A21', color: 'white', height: '100%' }}
      onClick={handleCreateRoute}
    >
      Rotayı Oluştur
    </Button>
  </Col>

</Row>
<Modal
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width="80%"
        centered
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                  lat: selectedPlaces[0]?.latitude || 41.6624608,
                  lng: selectedPlaces[0]?.longitude || 26.265514,
                }}
                zoom={12}
              >
                {directionsResponse && (
                  <DirectionsRenderer directions={directionsResponse} />
                )}
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
        )}
      </Modal>
      </div>
    </div>
  );
};

export default NewRoutes;
