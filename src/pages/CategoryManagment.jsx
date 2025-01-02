import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Pagination } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 5,
    totalCount: 0,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  const userRoles = JSON.parse(localStorage.getItem('roles') || '[]');
  const isAdmin = userRoles.includes('Admin');

  useEffect(() => {
    if (!isAdmin) {
      message.error('Bu sayfaya erişim yetkiniz yok.');
      window.location.href = '/';
    }
  }, [isAdmin]);

  const fetchCategories = async (pageNumber = 1, pageSize = 5) => {
    try {
      const response = await axios.post(
        `https://localhost:7263/Category/GetList?PageNumber=${pageNumber}&PageSize=${pageSize}`,
        {},
        { withCredentials: true }
      );
      setCategories(response.data || []);

      const paginationData = JSON.parse(response.headers['x-pagination']);
      setPagination({
        currentPage: paginationData.CurrentPage,
        totalPages: paginationData.TotalPages,
        pageSize: paginationData.PageSize,
        totalCount: paginationData.TotalCount,
      });
    } catch (error) {
      console.error('Kategoriler alınırken hata oluştu:', error);
      message.error('Kategoriler alınırken bir hata oluştu.');
    }
  };

  const handlePageChange = (page) => {
    fetchCategories(page, pagination.pageSize);
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Silme Onayı',
      content: 'Bu kategoriyi silmek istediğinize emin misiniz?',
      okText: 'Evet',
      cancelText: 'Hayır',
      onOk: async () => {
        try {
          const response = await axios.delete(`https://localhost:7263/Category/${id}`, {
            withCredentials: true,
          });
          if (response.data.success) {
            message.success('Kategori başarıyla silindi.');
            fetchCategories(pagination.currentPage, pagination.pageSize);
          } else {
            message.error(`Silme başarısız: ${response.data.message}`);
          }
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || 'Kategori silinirken bir hata oluştu.';
          console.error('Silme hatası:', error);
          message.error(`Silme başarısız: ${errorMessage}`);
        }
      },
    });
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsEditing(true);
    setIsModalVisible(true);
    form.setFieldsValue(category);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setIsEditing(false);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      if (isEditing) {
        await axios.patch(
          `https://localhost:7263/Category`,
          {
            id: editingCategory.id, 
            name: values.name,
          },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        message.success('Kategori başarıyla güncellendi.');
      } else {
        await axios.post(
          `https://localhost:7263/Category`,
          {
            id: 0, 
            name: values.name,
          },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        message.success('Kategori başarıyla eklendi.');
      }
      setIsModalVisible(false);
      fetchCategories(pagination.currentPage, pagination.pageSize); 
    } catch (error) {
      console.error('İşlem hatası:', error);
      message.error('İşlem sırasında bir hata oluştu.');
    }
  };
  

  useEffect(() => {
    fetchCategories();
  }, []);

  const columns = [
    {
      title: 'Kategori Adı',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Aksiyonlar',
      key: 'actions',
      render: (text, record) => (
        <div className="action-buttons">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: '8px',  backgroundColor: '#4CAF50', }}
          >
            Düzenle
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Sil
          </Button>
        </div>
      ),
    },
  ];

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
        <h1
      style={{
        color: '#fff',
        fontSize: '28px',
        margin: 0,
        fontFamily: 'Lobster, sans-serif',
      }}
    >
      Kategori Yönetimi
    </h1>
    <Button
  type="primary"
  onClick={handleAdd}
  style={{
    color: '#fff',
    border: 'none',
    marginLeft: 'auto',
  }}
>
  Yeni Kategori Ekle
</Button>

      </div>

      {/* Tablo ve Pagination */}
      <div
        style={{
          width: '100%',
          maxWidth: '',
          height: '600px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#fff',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          padding: '20px',
        }}
      >
        <Table
          dataSource={categories}
          columns={columns}
          rowKey={(record) => record.id}
          bordered
          pagination={false}
          style={{
            flexGrow: 1,
          }}
        />
        <Pagination
          current={pagination.currentPage}
          total={pagination.totalCount}
          pageSize={pagination.pageSize}
          onChange={handlePageChange}
          style={{
            alignSelf: 'flex-end',
            marginTop: '10px',
          }}
        />
      </div>

      {/* Modal */}
      <Modal
        title={isEditing ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Kategori Adı"
            rules={[{ required: true, message: 'Lütfen kategori adını girin.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button  htmlType="submit" style={{
            color: '#fff',
            backgroundColor: '#4CAF50',
            border: 'none',
            marginLeft: 'auto',
          }}>
              {isEditing ? 'Güncelle' : 'Ekle'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
