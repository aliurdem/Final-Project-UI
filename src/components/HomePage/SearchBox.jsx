import React from 'react';
import { Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './SearchBox.css';

const SearchBox = () => {
  const onSearch = (value) => {
    console.log('Arama yapılan değer:', value);
  };

  return (
    <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', backgroundColor: '#F1F1F1' }}>
      <Input.Search
        placeholder="Gezilecek yer ara..."
        size="large"
        onSearch={onSearch}
        enterButton={
          <Button
            style={{
              background: 'linear-gradient(45deg, #493628, #6f4f32)', // Gradient buton arka planı
              color: 'white',
              borderColor: '#493628',
              borderRadius: '20px', // Yuvarlak buton
              fontWeight: 'bold',
              transition: 'transform 0.3s ease',
              marginLeft: '10px',
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'} // Hover etkisi
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            ARA
          </Button>
        }
        style={{
          width: '80%',
          maxWidth: '800px',
          backgroundColor: '#493628',
          borderRadius: '50px', // Yuvarlak köşeler
          padding: '10px 20px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Yumuşak gölge efekti
        }}
        prefix={<SearchOutlined style={{ color: '#493628', fontSize: '20px' }} />} // Büyüteç ikonu ekleniyor
        className="custom-input"
      />
    </div>
  );
};

export default SearchBox;
