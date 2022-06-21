
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Cinema, useCinema } from '../service';

export const CinemaOverview = () => {
  const locationPath = useLocation();
  const params = useParams();
  const [cinema, setCinema] = useState<Cinema>();
  const cinemaService = useCinema();

  useEffect(() => {
    load();
  }, []); 

  const load = async () => {
    const { id } = params;
    const currentCinema = await cinemaService.load(id || '');
    if (currentCinema) {
      setCinema(currentCinema);
    }
  };

  console.log(locationPath);
  
  if (locationPath.pathname.split('/').length === 3) {
    return (
      <div>
        <p>Overview</p>
        {/* <form className='list-result'>
          <div style={{ height: '600px', width: '800px' }}>
            <MapContainer
              center={{ lat: 10.854886268472459, lng: 106.63051128387453 }}
              zoom={16}
              maxZoom={100}
              attributionControl={true}
              zoomControl={true}
              scrollWheelZoom={true}
              dragging={true}
              easeLinearity={0.35}
              style={{ height: '100%' }}
            >
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />
              {cinema && cinema.id &&
                <Marker
                  position={[cinema.longitude, cinema.latitude]}
                >
                  <Popup>
                    <span>{cinema.name}</span>
                  </Popup>
                </Marker>
              }
            </MapContainer>
          </div>
        </form> */}
      </div>
    );
  }
  return null;
};
