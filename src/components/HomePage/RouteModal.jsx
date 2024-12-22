import React, { useEffect, useRef } from 'react';

const RouteModal = ({ places }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (places && places.length > 0) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: {
          lat: places[0].latitude,
          lng: places[0].longitude,
        },
        zoom: 12,
      });

      places.forEach((place) => {
        new window.google.maps.Marker({
          position: { lat: place.latitude, lng: place.longitude },
          map,
          title: place.name,
        });
      });
    }
  }, [places]);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '400px', borderRadius: '12px' }}
    />
  );
};

export default RouteModal;
