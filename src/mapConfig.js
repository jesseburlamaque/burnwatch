import L from 'leaflet';

import modisIcon from './modis.png';
import snppIcon from './viirs_snpp.png';
import noaa20Icon from './viirs_noaa20.png';
import noaa21Icon from './viirs_noaa21.png';

export const sensorIcons = {
  'MODIS': new L.Icon({ iconUrl: modisIcon, iconSize: [32, 32], iconAnchor: [16, 16], popupAnchor: [0, -18] }),
  'VIIRS S-NPP': new L.Icon({ iconUrl: snppIcon, iconSize: [32, 32], iconAnchor: [16, 16], popupAnchor: [0, -18] }),
  'VIIRS NOAA-20': new L.Icon({ iconUrl: noaa20Icon, iconSize: [32, 32], iconAnchor: [16, 16], popupAnchor: [0, -18] }),
  'VIIRS NOAA-21': new L.Icon({ iconUrl: noaa21Icon, iconSize: [32, 32], iconAnchor: [16, 16], popupAnchor: [0, -18] }),
};

export const fallbackIcon = new L.Icon.Default();

export const DefaultIcon = new L.Icon({
  iconUrl: modisIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -18],
});

export const SENSOR_TYPES = ['MODIS', 'VIIRS S-NPP', 'VIIRS NOAA-20', 'VIIRS NOAA-21'];

export const sensorIconUrls = {
  'MODIS': modisIcon,
  'VIIRS S-NPP': snppIcon,
  'VIIRS NOAA-20': noaa20Icon,
  'VIIRS NOAA-21': noaa21Icon,
};

export const FIRMS_SENSORS = [
  { name: 'MODIS_NRT', label: 'MODIS' },
  { name: 'VIIRS_SNPP_NRT', label: 'VIIRS S-NPP' },
  { name: 'VIIRS_NOAA20_NRT', label: 'VIIRS NOAA-20' },
  { name: 'VIIRS_NOAA21_NRT', label: 'VIIRS NOAA-21' },
];
