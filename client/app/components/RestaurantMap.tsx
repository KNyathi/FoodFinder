'use client';

import { useEffect, useRef } from 'react';

interface Restaurant {
  id: string | number;
  name: string;
  coordinates: { lat: number; lon: number };
  address: string;
  rating: number;
  price_range: string;
}

interface RestaurantMapProps {
  restaurants: Restaurant[];
  userLocation?: { lat: number; lon: number };
  height?: string;
}

const RestaurantMap = ({ restaurants, userLocation, height = "400px" }: RestaurantMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || restaurants.length === 0) return;

    // Initialize Yandex Map
    const initMap = () => {
      // @ts-ignore
      if (typeof ymaps === 'undefined') {
        console.error('Yandex Maps not loaded');
        return;
      }

      // @ts-ignore
      ymaps.ready(() => {
        // @ts-ignore
        const map = new ymaps.Map(mapRef.current, {
          center: userLocation ? [userLocation.lat, userLocation.lon] : [restaurants[0].coordinates.lat, restaurants[0].coordinates.lon],
          zoom: 13,
          controls: ['zoomControl', 'fullscreenControl']
        });

        // Add user location marker
        if (userLocation) {
          // @ts-ignore
          const userMarker = new ymaps.Placemark(
            [userLocation.lat, userLocation.lon],
            {
              hintContent: 'Your location',
              balloonContent: 'You are here'
            },
            {
              preset: 'islands#blueCircleIcon',
              iconColor: '#1e40af'
            }
          );
          map.geoObjects.add(userMarker);
        }

        // Add restaurant markers
        restaurants.forEach(restaurant => {
          // @ts-ignore
          const restaurantMarker = new ymaps.Placemark(
            [restaurant.coordinates.lat, restaurant.coordinates.lon],
            {
              hintContent: restaurant.name,
              balloonContent: `
                <div class="p-2 min-w-[200px]">
                  <h3 class="font-bold text-lg mb-1">${restaurant.name}</h3>
                  <p class="text-sm text-gray-600 mb-2">${restaurant.address}</p>
                  <div class="flex justify-between items-center">
                    <span class="text-yellow-500 font-semibold">${restaurant.rating} ★</span>
                    <span class="text-green-600">${restaurant.price_range}</span>
                  </div>
                  <button 
                    onclick="window.open('https://yandex.com/maps/?pt=${restaurant.coordinates.lon},${restaurant.coordinates.lat}&z=15&l=map', '_blank')"
                    class="mt-2 w-full bg-orange-500 text-white py-1 px-3 rounded text-sm hover:bg-orange-600 transition-colors"
                  >
                    Get Directions
                  </button>
                </div>
              `
            },
            {
              preset: 'islands#redFoodIcon',
              iconColor: '#ea580c'  // Orange color to match your theme
            }
          );
          map.geoObjects.add(restaurantMarker);
        });

        // Fit map to show all markers
        if (restaurants.length > 1 || userLocation) {
          map.setBounds(map.geoObjects.getBounds(), {
            checkZoomRange: true,
            zoomMargin: 20
          });
        }
      });
    };

    // Load Yandex Maps API with YOUR JS_GEOCODER_API key
    if (!document.querySelector('script[src*="api-maps.yandex.ru"]')) {
      const script = document.createElement('script');
      script.src = `https://api-maps.yandex.ru/2.1/?lang=en_RU&apikey=7e6e4ea1-bdb2-44d5-82ab-72178d9fd43c`;
      script.async = true;
      script.onload = initMap;
      script.onerror = () => console.error('Failed to load Yandex Maps');
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, [restaurants, userLocation]);

  return (
    <div className="rounded-2xl overflow-hidden border border-white/20 bg-white/5">
      <div 
        ref={mapRef} 
        style={{ height }} 
        className="w-full"
      />
      <div className="p-4 border-t border-white/20">
        <div className="flex items-center justify-between text-white text-sm">
          <span>Found {restaurants.length} restaurants</span>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Your location</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Restaurants</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantMap;