import React from 'react';
import {Image} from 'antd';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import Leaflet from 'leaflet';
import {MapImage} from 'assets';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import {useTranslation} from 'react-i18next';

export interface props {
  latitude?: number;
  longitude?: number;
}

const AddressCard = ({latitude, longitude}: props) => {
  const {t}: {t: any} = useTranslation('general');
  return (
    <>
      {longitude && latitude ? (
        <div style={{width: 400}}>
          <MapContainer
            center={[latitude, longitude]}
            zoom={15}
            scrollWheelZoom={false}
            dragging={false}
            boxZoom
            zoomControl
            className="w-full "
            style={{height: '300px', width: '400px'}}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              icon={Leaflet.icon({
                iconUrl: icon,
                shadowUrl: iconShadow
              })}
              position={[latitude, longitude]}>
              <Popup>{t('select_location')}</Popup>
            </Marker>
          </MapContainer>
        </div>
      ) : (
        <Image height={200} src={MapImage} preview={false} className="p-10 bg-grayLight" />
      )}
    </>
  );
};

export default AddressCard;
