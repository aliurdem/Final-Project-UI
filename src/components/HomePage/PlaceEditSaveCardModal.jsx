import React from 'react';
import { Modal, Form, Input, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const ModernModal = ({
  isVisible,
  onClose,
  onSave,
  form,
  initialValues,
  isEditMode,
  setFile,
  file,
  selectedPlace,
}) => {
  return (
    <Modal
      title={
        <h2 style={{
          fontWeight: 'bold',
          textAlign: 'center',
          margin: 0,
          color: '#333',
        }}>
          {isEditMode ? 'Yer Bilgilerini Düzenle' : 'Yeni Yer Ekle'}
        </h2>
      }
      open={isVisible}
      onCancel={onClose}
      footer={null}
      centered
      width="600px"
      bodyStyle={{
        backgroundColor: '#f4f4f4',
        borderRadius: '12px',
        padding: '30px 20px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
      >
        <Form.Item name="id" hidden={true}>
          <Input />
        </Form.Item>

        <Form.Item
          name="name"
          label={<strong>Yer Adı</strong>}
          rules={[{ required: true, message: 'Bu alan zorunludur.' }]}
        >
          <Input placeholder="Yer adı giriniz" />
        </Form.Item>

        <Form.Item
          name="description"
          label={<strong>Açıklama</strong>}
          rules={[{ required: true, message: 'Bu alan zorunludur.' }]}
        >
          <Input.TextArea rows={2} placeholder="Açıklama giriniz" />
        </Form.Item>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Form.Item
            name="latitude"
            label={<strong>Enlem</strong>}
            rules={[{ required: true, message: 'Bu alan zorunludur.' }]}
            style={{ flex: 1 }}
          >
            <Input type="number" placeholder="Enlem" />
          </Form.Item>

          <Form.Item
            name="longitude"
            label={<strong>Boylam</strong>}
            rules={[{ required: true, message: 'Bu alan zorunludur.' }]}
            style={{ flex: 1 }}
          >
            <Input type="number" placeholder="Boylam" />
          </Form.Item>
        </div>

        <Form.Item
          name="visitableHours"
          label={<strong>Ziyaret Saatleri</strong>}
        >
          <Input placeholder="Ziyaret saatlerini giriniz" />
        </Form.Item>

        <Form.Item
          name="entranceFee"
          label={<strong>Giriş Ücreti</strong>}
        >
          <Input type="number" placeholder="Giriş ücreti" />
        </Form.Item>

        <Form.Item
          label={<strong>Yüklü Resim</strong>}
          style={{ textAlign: 'center' }}
        >
          {file ? (
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              style={{
                width: '100%',
                maxHeight: '200px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '10px',
              }}
            />
          ) : selectedPlace?.image ? (
            <img
              src={selectedPlace.image}
              alt="Current"
              style={{
                width: '100%',
                maxHeight: '200px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '10px',
              }}
            />
          ) : (
            <div style={{ color: '#aaa' }}>Henüz bir resim yüklenmedi</div>
          )}

          <Upload
            beforeUpload={(file) => {
              setFile(file);
              return false;
            }}
            accept="image/*"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Yeni Resim Yükle</Button>
          </Upload>
        </Form.Item>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '20px',
          }}
        >
          <Button onClick={onClose} style={{ background: '#aaa', color: '#fff' }}>
            İptal
          </Button>
          <Button type="primary" onClick={onSave}>
            {isEditMode ? 'Güncelle' : 'Ekle'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ModernModal;
