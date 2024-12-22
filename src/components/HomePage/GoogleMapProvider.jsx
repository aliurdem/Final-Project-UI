import React from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDhyo3o0SbdeFNRvdYfQ5o4pdqpupoqXPw';

export const GoogleMapsProvider = ({ children }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places'], // İhtiyacınıza göre ekleyebilirsiniz
  });

  if (!isLoaded) return <div>Harita Yükleniyor...</div>;
  if (loadError) return <div>Harita Yüklenirken Hata: {loadError.message}</div>;

  return <>{children}</>;
};
