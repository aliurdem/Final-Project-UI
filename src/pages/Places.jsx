import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { message, Modal, Button, Form, Input, Upload,Switch } from 'antd';
import { UploadOutlined, HeartOutlined, HeartFilled, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { UserContext } from '../components/HomePage/UserContext';
import PlaceCardModal from '../components/HomePage/PlaceCardModel';
import PlaceEditSaveCardModal from '../components/HomePage/PlaceEditSaveCardModal';
import { Tooltip } from 'antd';

const Places = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [places, setPlaces] = useState([]);
  const [favList, setFavList] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [file, setFile] = useState(null);
  const [modalForm] = Form.useForm();
  const { isLoggedIn, roles } = useContext(UserContext);
  const [showFavorites, setShowFavorites] = useState(false);
  useEffect(() => {
    fetchPlaces();

    const storedFavList = JSON.parse(localStorage.getItem('userFavList')) || [];
    setFavList(storedFavList);
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await axios.get('https://localhost:7263/Place/GetAll');
      const apiData = response.data.data || [];
      const transformedData = apiData.map(item => ({
        ...item,
        image: item.imageData
          ? `data:image/jpeg;base64,${item.imageData}`
          : './erikli.png'
      }));
      setPlaces(transformedData);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    }
  };

  const isFavorite = (placeId) => favList.some((fav) => fav.placeId === placeId);

  const toggleFavorite = async (placeId) => {
    if (!isLoggedIn) return;
    if (isFavorite(placeId)) {
      await removeFromFavorites(placeId);
    } else {
      await addToFavorites(placeId);
    }
  };

  const addToFavorites = async (placeId) => {
    try {
      const response = await axios.post(
        'https://localhost:7263/UserFav',
        { placeId },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const updatedFavList = [...favList, { placeId }];
        setFavList(updatedFavList);
        localStorage.setItem('userFavList', JSON.stringify(updatedFavList));
        message.success('Favorilere eklendi!');
      }
    } catch (error) {
      console.error("Favorilere ekleme hatası:", error);
      message.error('Favorilere eklenirken bir hata oluştu.');
    }
  };

  const removeFromFavorites = async (placeId) => {
    try {
      const response = await axios.post(
        'https://localhost:7263/RemoveUserFav',
        { placeId },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const updatedFavList = favList.filter((fav) => fav.placeId !== placeId);
        setFavList(updatedFavList);
        localStorage.setItem('userFavList', JSON.stringify(updatedFavList));
        message.success('Favorilerden kaldırıldı!');
      }
    } catch (error) {
      console.error("Favorilerden kaldırma hatası:", error);
      message.error('Favorilerden kaldırılırken bir hata oluştu.');
    }
  };

  const handleDelete = (placeId) => {
    Modal.confirm({
      title: 'Silme Onayı',
      content: 'Bu yeri silmek istediğinize emin misiniz?',
      okText: 'Evet',
      cancelText: 'Hayır',
      onOk: async () => {
        try {
          const response = await axios.delete(`https://localhost:7263/Place/${placeId}`, {
            withCredentials: true
          });

          if (response.status === 200) {
            const updatedPlaces = places.filter(place => place.id !== placeId);
            setPlaces(updatedPlaces);
            message.success('Yer başarıyla silindi!');
          }
        } catch (error) {
          console.error("Silme hatası:", error);
          message.error('Silme işlemi sırasında bir hata oluştu.');
        }
      }
    });
  };

  const openModal = (place = null) => {
    setSelectedPlace(place);
    setIsEditMode(!!place);
    setFile(null);
    if (place) {
      modalForm.setFieldsValue(place);
    } else {
      modalForm.resetFields();
    }
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setSelectedPlace(null);
    setFile(null);
    modalForm.resetFields(); 
    setIsModalVisible(false);
  };

  const openDetailModal = (place = null) => {
    setSelectedPlace(place);
    setIsDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalVisible(false);
  };

  const handleEdit = (place) => {
    openModal(place);
  };

  const handleSave = async (values) => {
    const endpoint = isEditMode
      ? `https://localhost:7263/Place`
      : 'https://localhost:7263/Place';
    const method = isEditMode ? 'patch' : 'post';
  
    let imageData = selectedPlace?.imageData || ''; // Mevcut imageData'yı kullan
  
    if (file) {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        imageData = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = (error) => reject(error);
        });
      } catch (error) {
        console.error("Resim işleme hatası:", error);
        message.error("Resim işlenirken bir hata oluştu.");
        return;
      }
    }
  
    try {
      const response = await axios[method](
        endpoint,
        {
          ...values,
          id: selectedPlace?.id || 0,
          imageData, // Güncel veya mevcut imageData
        },
        { withCredentials: true }
      );
  
      if (response.status === 200 || response.status === 201) {
        message.success(`Yer başarıyla ${isEditMode ? 'güncellendi' : 'oluşturuldu'}!`);
        await fetchPlaces(); // Listeyi yeniden çek
        closeModal();
      }
    } catch (error) {
      console.error(`${isEditMode ? 'Güncelleme' : 'Ekleme'} hatası:`, error);
      message.error(`Yer ${isEditMode ? 'güncellenirken' : 'oluşturulurken'} bir hata oluştu.`);
    }
  };
  
  
  

  const isAdmin = () => roles.includes('Admin');

  const filteredPlaces = places.filter((place) => {
    const isMatch = place.name?.toLowerCase().includes(searchTerm?.toLowerCase() || '');
    if (showFavorites) {
      return isMatch && favList.some((fav) => fav.placeId === place.id);
    }
    return isMatch;
  });

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#F6EFE9',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <div
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '10px 20px',
    backgroundColor: '#493628',
  }}
>
  {/* Sol Kısım: Başlık ve Arama Çubuğu */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
    <h1
      style={{
        color: '#fff',
        fontSize: '28px',
        margin: 0,
        fontFamily: 'Lobster, sans-serif',
      }}
    >
      Gezi Lokasyonları
    </h1>

    {/* Arama Alanı */}
    <div style={{ position: 'relative', width: '300px' }}>
      <input
        type="text"
        placeholder="Gezilecek yer ara..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 40px 10px 15px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          outline: 'none',
          fontSize: '14px',
          backgroundColor: 'transparent',
        }}
      />
      <span
        style={{
          position: 'absolute',
          right: '15px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#493628',
        }}
      >
        🔍
      </span>
    </div>
  </div>

  {/* Sağ Kısım: Yeni Yer Ekle ve Switch */}
<div style={{ display: 'flex', alignItems: 'center', gap: '20px',padding:"5px" }}>
 
{isLoggedIn && (
  <Tooltip title={showFavorites ? 'Favorileri Gizle' : 'Favorileri Göster'}>
    <Switch
      checked={showFavorites}
      onChange={(checked) => setShowFavorites(checked)}
      checkedChildren={<HeartFilled style={{ color: 'red' }} />}
      unCheckedChildren={<HeartOutlined style={{ color: 'red' }} />}
      style={{
        backgroundColor: showFavorites ? '#ffe6f0' : '#f6efe9',
        border: '1px solid #d9d9d9',
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    />
  </Tooltip>
)}
  {isAdmin() && (
    <Button
      type="primary"
      icon={<PlusOutlined />}
      onClick={() => openModal()}
    >
      Yeni Yer Ekle
    </Button>
  )}
</div>
</div>


      {/* Kartlar Grid */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '10px',
          margin: '10px',
          padding: '10px',
          overflowY: 'auto'
        }}
      >
        {filteredPlaces.map(place => (
          <div
            key={place.id}
            style={{
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'relative',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              height: '250px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end'
            }}
            onClick={() => openDetailModal(place)}
          >
            <img
              src={place.image}
              alt={place.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                position: 'absolute',
                top: 0,
                left: 0
              }}
            />
            <div
              style={{
                position: 'relative',
                background: 'rgba(0,0,0,0.4)',
                color: '#fff',
                padding: '5px',
                fontSize: '14px',
                textAlign: 'center'
              }}
            >
              {place.name}
            </div>

            {/* Admin İşlemleri */}
            {isAdmin() && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '40px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0 10px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  borderTopLeftRadius: '8px',
                  borderTopRightRadius: '8px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#52c41a',
                    borderRadius: '4px',
                    padding: '8px',
                    cursor: 'pointer',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(place);
                  }}
                >
                  <EditOutlined style={{ color: '#fff', fontSize: '16px' }} />
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#ff4d4f',
                    borderRadius: '4px',
                    padding: '8px',
                    cursor: 'pointer',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(place.id);
                  }}
                >
                  <DeleteOutlined style={{ color: '#fff', fontSize: '16px' }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      <PlaceEditSaveCardModal
        isVisible={isModalVisible}
        onClose={closeModal}
        onSave={() => {
          modalForm.validateFields().then(handleSave).catch((error) => {
            console.error('Doğrulama hatası:', error);
          });
        }}
        form={modalForm}
        initialValues={{
          id: selectedPlace?.id || 0,
          name: selectedPlace?.name || '',
          description: selectedPlace?.description || '',
          latitude: selectedPlace?.latitude || 0,
          longitude: selectedPlace?.longitude || 0,
          visitableHours: selectedPlace?.visitableHours || '',
          entranceFee: selectedPlace?.entranceFee || 0,
          imageData: selectedPlace?.imageData || '',
        }}
        isEditMode={isEditMode}
        setFile={setFile}
        file={file}
        selectedPlace={selectedPlace}
      />

      {selectedPlace && (
        <PlaceCardModal
          isVisible={isDetailModalVisible}
          onClose={closeDetailModal}
          item={selectedPlace}
          isFav={isFavorite(selectedPlace.id)}
          toggleFav={() => toggleFavorite(selectedPlace.id)}
          isLoggedIn={isLoggedIn}
        />
      )}
    </div>
  );
};

export default Places;
