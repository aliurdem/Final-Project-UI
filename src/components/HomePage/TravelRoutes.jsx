import React from 'react';
import { Link } from 'react-router-dom'; // Link bileşenini import edin
import './TravelRoutes.css';

const TravelRoutes = () => {
  return (
    <section className="travel-routes">
      <div className="route-left">
        {/* Video öğesi */}
        <video
          src="rota1.mp4" // Videonuzun yolu
          autoPlay
          loop
          muted
          playsInline
          className="main-video" // Videonun stilini tanımlamak için class ekledik
        ></video>
      </div>
      <div className="route-right">
        {/* Link bileşenini h2 etrafına ekleyin */}
        <Link 
  to="/our-routes" 
  style={{ 
    textDecoration: 'none', 
    color: '#493628', 
    fontFamily: 'Charmonman, serif', // Yazı tipi eklendi
    marginLeft: '30px' // Yazıyı sola kaydır
  }}
>
  <h2>Edirne İçin Gezi Rotaları</h2>
</Link>

        <div className="route-images">
          {/* Rotanın altındaki içerikler */}
          <div className="route-card">
            <p className="route-title">Yemek Rotası</p>
            <img src="rota2.png" alt="Yemek Rotası" className="route-image" />
          </div>
          <div className="route-card">
            <p className="route-title">Tarih Rotası</p>
            <img src="rota3.png" alt="Tarih Rotası" className="route-image" />
          </div>
          <div className="route-card">
            <p className="route-title">Alışveriş Rotası</p>
            <img src="rota4.png" alt="Alışveriş Rotası" className="route-image" />
          </div>
          <div className="route-card">
            <p className="route-title">Doğa Rotası</p>
            <img src="rota5.png" alt="Doğa Rotası" className="route-image" />
          </div>
          <div className="route-card">
            <p className="route-title">Etkinlik Rotası</p>
            <img src="rota6.png" alt="Festival ve Etkinlik Rotası" className="route-image" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelRoutes;
