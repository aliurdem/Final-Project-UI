import React from 'react';
import { Button } from 'antd'; 
import { useNavigate } from 'react-router-dom'; 
import './AboutUs.css';

const AboutUs = () => {
  const navigate = useNavigate(); 

  const goHome = () => {
    navigate('/'); 
  };

  return (
    <div className="about-us-container">
      <div className="about-us-left">
        <Button 
          type="primary" 
          onClick={goHome} 
          className="back-button">
          Geri
        </Button>

        <h1>HAKKIMIZDA</h1>

        <div className="profile">
          <img src="./about1.png" alt="Profil 1" className="profile-image" />
          <div className="profile-info">
            <p>Hatice Kartal</p>
            <div className="profile-links">
              <a href="https://www.linkedin.com/in/hatice-kartal/">LinkedIn Profili</a>
              <a href="https://github.com/haticekartal">GitHub Profili</a>
              <a href="https://medium.com/@kartal_hatice">Medium Profili</a>
            </div>
          </div>
          <div className="profile-description">
            Trakya Üniversitesi Bilgisayar Mühendisliği 4. sınıf öğrencisiyim. Bu projede frontend tarafını geliştirmekten sorumluyum. Web tasarımı, kullanıcı deneyimi ve site işlevselliğini geliştirmek için React, Ant Design gibi teknolojilerle çalışıyorum. Amacım, Edirne'nin tarihi ve kültürel zenginliklerini tanıtan, kullanıcı dostu ve görsel olarak çekici bir web sitesi oluşturmak.
          </div>
        </div>

        <div className="profile">
          <img src="./about2.png" alt="Profil 2" className="profile-image" />
          <div className="profile-info">
            <p>Ali Eren Ürdem</p>
            <div className="profile-links">
              <a href="https://www.linkedin.com/in/ali-eren-%C3%BCrdem-9b0432234/">LinkedIn Profili</a>
              <a href="https://github.com/aliurdem?">GitHub Profili</a>
              <a href="https://medium.com/@kartal_hatice">Medium Profili</a>
            </div>
          </div>
          <div className="profile-description">
            Trakya Üniversitesi Bilgisayar Mühendisliği 4. sınıf öğrencisiyim. Bu projede backend tarafını geliştirmekle sorumluyum. Proje, Edirne'deki gezilecek yerleri tanıtan bir web sitesi olmayı amaçlıyor. Benim görevim, kullanıcıların seçimlerine göre dinamik olarak rota oluşturulmasını sağlayan sistemin altyapısını kurmak ve veritabanı entegrasyonunu sağlamak.
          </div>
        </div>
      </div>

      <div className="about-us-right">
        <img src="./about.png" alt="Hakkımızda Görseli" className="about-image" />
      </div>
    </div>
  );
};

export default AboutUs;
