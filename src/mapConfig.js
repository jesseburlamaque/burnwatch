import L from 'leaflet';

import modisIcon from './modis.png';
import snppIcon from './viirs_snpp.png';
import noaa20Icon from './viirs_noaa20.png';
import noaa21Icon from './viirs_noaa21.png';

export const sensorIcons = {
  'MODIS': new L.Icon({ iconUrl: modisIcon, iconSize: [25, 25], iconAnchor: [12, 12], popupAnchor: [0, -10] }),
  'VIIRS S-NPP': new L.Icon({ iconUrl: snppIcon, iconSize: [25, 25], iconAnchor: [12, 12], popupAnchor: [0, -10] }),
  'VIIRS NOAA-20': new L.Icon({ iconUrl: noaa20Icon, iconSize: [25, 25], iconAnchor: [12, 12], popupAnchor: [0, -10] }),
  'VIIRS NOAA-21': new L.Icon({ iconUrl: noaa21Icon, iconSize: [25, 25], iconAnchor: [12, 12], popupAnchor: [0, -10] }),
};

export const fallbackIcon = new L.Icon.Default();

export const DefaultIcon = new L.Icon({
  iconUrl: modisIcon,
  iconSize: [25, 25],
  iconAnchor: [12, 12],
  popupAnchor: [0, -10],
});

export const SENSOR_TYPES = ['MODIS', 'VIIRS S-NPP', 'VIIRS NOAA-20', 'VIIRS NOAA-21'];

export const FIRMS_SENSORS = [
  { name: 'MODIS_NRT', label: 'MODIS' },
  { name: 'VIIRS_SNPP_NRT', label: 'VIIRS S-NPP' },
  { name: 'VIIRS_NOAA20_NRT', label: 'VIIRS NOAA-20' },
  { name: 'VIIRS_NOAA21_NRT', label: 'VIIRS NOAA-21' },
];
